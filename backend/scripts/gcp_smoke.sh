#!/usr/bin/env bash
set -euo pipefail

KEY_PATH="${1:-$(dirname "$0")/../.gcp/sa.json}"
LOCATION="${2:-${GCP_LOCATION:-us-central1}}"

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud not found" >&2
  exit 1
fi

if [[ ! -f "${KEY_PATH}" ]]; then
  echo "Service account key not found at ${KEY_PATH}" >&2
  exit 2
fi

echo "Activating service account..."
gcloud -q auth activate-service-account --key-file "${KEY_PATH}"

echo "Smoke: BigQuery simple query"
bq query --nouse_legacy_sql 'SELECT 1 AS ok' >/dev/null

echo "Smoke: Vertex AI list models (subset)"
gcloud ai models list --region "${LOCATION}" --limit=5 --format="table(displayName,versionId)" | sed -n '1,6p' || true

echo "OK"

