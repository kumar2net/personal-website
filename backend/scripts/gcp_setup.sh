#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/gcp_setup.sh <PROJECT_ID> [LOCATION] [SERVICE_ACCOUNT_NAME] [GA4_DATASET] [GA4_TABLE]
# Or with env vars already exported: GCP_PROJECT_ID, GCP_LOCATION, etc.

PROJECT_ID="${1:-${GCP_PROJECT_ID:-}}"
LOCATION="${2:-${GCP_LOCATION:-us-central1}}"
SA_NAME="${3:-blog-recommender-sa}"
GA4_DATASET="${4:-${GA4_DATASET:-}}"
GA4_TABLE="${5:-${GA4_TABLE:-events_*}}"

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud not found. Install Google Cloud SDK and re-run." >&2
  exit 1
fi

if [[ -z "${PROJECT_ID}" ]]; then
  echo "GCP project ID is required. Provide as arg1 or GCP_PROJECT_ID env var." >&2
  exit 2
fi

echo "Configuring gcloud for project=${PROJECT_ID}, location=${LOCATION}..."
gcloud -q config set project "${PROJECT_ID}"
# Older/newer gcloud versions differ: ai/region vs ai/location. Try both, ignore failures.
gcloud -q config set ai/location "${LOCATION}" >/dev/null 2>&1 || \
  gcloud -q config set ai/region "${LOCATION}" >/dev/null 2>&1 || true

echo "Enabling required APIs..."
gcloud -q services enable \
  bigquery.googleapis.com \
  aiplatform.googleapis.com \
  iam.googleapis.com

SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
if ! gcloud iam service-accounts describe "${SA_EMAIL}" >/dev/null 2>&1; then
  echo "Creating service account ${SA_EMAIL}..."
  gcloud -q iam service-accounts create "${SA_NAME}" \
    --display-name "Blog Topic Recommender"
else
  echo "Service account ${SA_EMAIL} already exists"
fi

echo "Binding roles to ${SA_EMAIL}..."
gcloud -q projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/bigquery.dataViewer" >/dev/null
gcloud -q projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/bigquery.jobUser" >/dev/null
gcloud -q projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/aiplatform.user" >/dev/null

mkdir -p "$(dirname "$0")/../.gcp"
KEY_PATH="$(dirname "$0")/../.gcp/sa.json"
if [[ -f "${KEY_PATH}" ]]; then
  echo "Key already exists at ${KEY_PATH} (skipping key creation)"
else
  echo "Creating key at ${KEY_PATH}..."
  gcloud -q iam service-accounts keys create "${KEY_PATH}" \
    --iam-account "${SA_EMAIL}"
fi

ENV_PATH="$(dirname "$0")/../.env"
echo "Updating ${ENV_PATH}..."
touch "${ENV_PATH}"
awk 'BEGIN{FS=OFS="="} /^GCP_PROJECT_ID=/{next} /^GCP_LOCATION=/{next} /^GOOGLE_APPLICATION_CREDENTIALS=/{next} /^GA4_DATASET=/{next} /^GA4_TABLE=/{next} {print}' "${ENV_PATH}" > "${ENV_PATH}.tmp" || true
mv "${ENV_PATH}.tmp" "${ENV_PATH}"
{
  echo "GCP_PROJECT_ID=${PROJECT_ID}"
  echo "GCP_LOCATION=${LOCATION}"
  echo "GOOGLE_APPLICATION_CREDENTIALS=$(cd "$(dirname "$KEY_PATH")" && pwd)/$(basename "$KEY_PATH")"
  [[ -n "${GA4_DATASET}" ]] && echo "GA4_DATASET=${GA4_DATASET}" || true
  echo "GA4_TABLE=${GA4_TABLE}"
} >> "${ENV_PATH}"

echo "Done. Next steps:"
echo "- Verify GA4 dataset exists in project (Dataset: ${GA4_DATASET:-<set GA4_DATASET>})"
echo "- Run: npm run gcp:smoke"

