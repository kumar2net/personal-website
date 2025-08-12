## Semantic Search with Google Gemini and Vertex AI Vector Search

This document describes how to add semantic search to the blog using Google AI Gemini embeddings, Vertex AI Vector Search, and a Netlify Function backend.

### Architecture
- User submits a query → Netlify Function (`semantic-search`) generates a query embedding via Gemini `text-embedding-004` → calls Vertex AI Vector Search to find nearest neighbors → maps neighbor IDs to blog metadata → returns results.
- Content indexing is a one-time (and repeatable) script that embeds all posts and upserts datapoints into Vertex AI Vector Search.

### Requirements
- Netlify site deployed with Node.js 18+ runtime for functions
- Google Cloud project with billing enabled
- Service account credentials for Vertex AI

### Components
- Embedding model: Gemini `text-embedding-004` (dimension: 768)
- Vector database: Vertex AI Vector Search (Index + Index Endpoint)
- Backend: Netlify Functions

> Note: Ensure the index dimension exactly matches the embedding dimension returned by the model you use. For `text-embedding-004`, use 768.

---

### 1) Google Cloud setup
1. Create or select a Google Cloud project.
2. Enable APIs (APIs & Services → Enable APIs):
   - Vertex AI API
   - IAM Service Account Credentials API (recommended)
3. Create a service account (IAM & Admin → Service Accounts), e.g., `vertex-vectorsearch-sa`.
4. Assign roles to the service account:
   - For querying only: `roles/aiplatform.user`
   - For indexing (create/deploy index, upsert datapoints): `roles/aiplatform.admin`
5. Create a JSON key for the service account. Keep it private. If a key is ever exposed, delete and recreate it (rotate the key) and update your environment variable.

Region recommendation: `us-central1` for Vertex AI Vector Search.

---

### 2) Netlify environment variables
Configure these in Netlify (Site settings → Build & deploy → Environment):
- `GEMINI_API_KEY`: Gemini API key for `text-embedding-004`
- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_LOCATION`: e.g., `us-central1`
- `GCP_SERVICE_ACCOUNT_JSON`: Paste the full service account JSON content
- `VERTEX_INDEX_ID`: Vertex AI Vector Search Index ID (set after creation)
- `VERTEX_INDEX_ENDPOINT_ID`: Vertex AI Vector Search Index Endpoint ID (set after deploy)
- `VERTEX_EMBED_DIM`: `768`
 - `VERTEX_DEPLOYED_INDEX_ID` (optional): If your endpoint hosts multiple deployed indexes, set this to the deployed index ID to direct queries.

Optional (local dev): add these to an `.env` file used by `netlify dev` if desired. Do not commit secrets.

---

### 3) Vertex AI Vector Search: create and deploy index
You can create resources via the Cloud Console or the CLI.

CLI example (recommended one-time, run as a project Owner):

1. Ensure required services are enabled on the project:
   - `aiplatform.googleapis.com`
   - `iamcredentials.googleapis.com`
   - `cloudresourcemanager.googleapis.com`
   - `storage.googleapis.com`
   - `serviceusage.googleapis.com`

2. Prepare index metadata JSON (NearestNeighborSearch schema):

```json
{
  "config": {
    "dimensions": 768,
    "distanceMeasureType": "COSINE_DISTANCE",
    "algorithmConfig": {
      "treeAhConfig": {
        "leafNodeEmbeddingCount": 1000,
        "leafNodesToSearchPercent": 7
      }
    }
  }
}
```

3. Create index (us-central1):

```bash
gcloud config set ai/region us-central1
gcloud ai indexes create \
  --display-name=blog-semantic-index \
  --metadata-file=PATH/TO/index_metadata.json \
  --format='value(name)'
# Capture the printed full name and derive IDs as needed
```

4. Create index endpoint:

```bash
gcloud ai index-endpoints create \
  --display-name=blog-semantic-endpoint \
  --format='value(name)'
```

5. Deploy the index to the endpoint:

```bash
gcloud ai index-endpoints deploy-index \
  --index-endpoint=INDEX_ENDPOINT_ID \
  --deployed-index-display-name=blog-semantic-deployed \
  --index=INDEX_ID
```

6. Copy the IDs and set them in Netlify env vars:
   - `VERTEX_INDEX_ID`
   - `VERTEX_INDEX_ENDPOINT_ID`
   - `VERTEX_DEPLOYED_INDEX_ID` (if your endpoint has multiple deployed indexes)

> Alternative: programmatically create/deploy via SDK. This guide assumes you will create/deploy via Console and script will only upsert datapoints.

---

### 4) One-time (repeatable) indexing script
Goal: process all blog posts, generate embeddings using Gemini, and upsert datapoints into the Vertex AI Index.

Scope of content:
- Include blog posts under `src/pages/blog/` (`.jsx` with textual content) and any `.md` posts you want indexed (e.g., selected files under `src/pages/` or `docs/`).

Recommended approach:
1. Discover posts
   - Gather `{ id, title, url, text }` for each post.
   - For `.md` files: read plain text.
   - For `.jsx` files: extract human-readable text (strip tags and code blocks), derive a title from file or in-file header.
2. Normalize text
   - Collapse whitespace, remove very long code blocks.
   - If a post is extremely long, optionally chunk it (e.g., 1–2k tokens per chunk). Use chunk IDs like `post-slug#1`.
3. Generate embeddings (Gemini `text-embedding-004`)
   - Call the embeddings API; verify returned vector length is `768`.
4. Upsert datapoints
   - Use Vertex AI Vector Search `IndexServiceClient.upsertDatapoints` with datapoints:
     - `datapointId`: unique ID (e.g., slug or `slug#chunk-N`)
     - `featureVector`: the embedding vector
5. Maintain a local mapping file (for lookup at query-time)
   - Write `src/data/semantic-mapping.json` containing `{ id, title, url, excerpt }` for each datapoint ID.

Output guarantees:
- Script should be idempotent: re-running updates existing datapoints with the same IDs.
- Log progress and totals; fail fast if any embedding length mismatch occurs.

---

### 5) Netlify Function: `semantic-search`
Endpoint behavior:
1. Accept `POST` with JSON body: `{ q: string, topK?: number }` (defaults: `topK=5`).
2. If `q` is empty, return `400`.
3. Generate query embedding with Gemini `text-embedding-004`.
4. Call Vertex AI Vector Search `MatchServiceClient.findNeighbors` on the deployed index endpoint with `neighbor_count = topK`.
5. Map returned `datapointId`s to blog metadata using `src/data/semantic-mapping.json`.
6. Respond with `{ results: [{ id, title, url, excerpt, score }], tookMs }`.

Notes:
- Timeouts: Keep the function under ~10s. Use short-circuit for empty inputs.
- Errors: Return 5xx with a brief message; never leak credentials.

---

### 6) Dependencies
Install in the project (server-side only usage):
- `@google/generative-ai` (Gemini embeddings)
- `@google-cloud/aiplatform` (Vertex AI Vector Search: IndexServiceClient, MatchServiceClient)
- `google-auth-library` (use service account JSON from env)

Optional helpers for indexing:
- Content parsing for `.jsx` and `.md`

---

### 7) Running locally
Indexing:
1. Ensure env vars are available to Node when running the script (e.g., export in shell).
2. Run the indexing script once; confirm `UpsertDatapoints` succeeds.
3. Verify `src/data/semantic-mapping.json` is generated or updated.

Function:
1. `netlify dev` to run the function locally.
2. Test with curl or a REST client:
   - `POST /.netlify/functions/semantic-search` with `{ "q": "your query" }`.

Example curl:

```bash
curl -s -X POST \
  -H 'Content-Type: application/json' \
  -d '{"q":"india usa trade gap","topK":5}' \
  http://localhost:8889/.netlify/functions/semantic-search | jq
```

---

### 8) Production
1. Set all required environment variables in Netlify.
2. Deploy site; Netlify builds and publishes functions.
3. From the UI, integrate a search box that calls the function and renders results.

---

### 9) Troubleshooting
- 400 from embeddings API: ensure the `GEMINI_API_KEY` is valid and model name is correct (`text-embedding-004`).
- Embedding dimension mismatch: confirm the index `Dimensions` equals the returned vector length (expected 768 for `text-embedding-004`). Recreate index if needed.
- 403/permission errors from Vertex AI: check service account roles; ensure the request uses the correct project/region.
- Timeouts from function: reduce `topK`, ensure index is deployed in the configured region, and keep payloads minimal.
- INVALID_ARGUMENT creating index: ensure the index metadata JSON matches the NearestNeighborSearch schema. Remove unsupported fields like `indexUpdateMethod`.
- AUTH_PERMISSION_DENIED enabling services: only a project Owner/Editor (or org policy that allows) can enable services. Enable in Console or grant appropriate roles.
- Missing `VERTEX_INDEX_ENDPOINT_ID`: create an index endpoint and deploy your index; set both IDs in env vars.

---

### 10) References
- Gemini Embeddings API (model `text-embedding-004`): [ai.google.dev → Embeddings](https://ai.google.dev/gemini-api/docs/embeddings)
- Vertex AI Vector Search quickstart: [cloud.google.com → Vector Search quickstart](https://cloud.google.com/vertex-ai/docs/vector-search/quickstart)
- Vertex AI Node.js SDK: [npm → @google-cloud/aiplatform](https://www.npmjs.com/package/@google-cloud/aiplatform)

---

### 11) Deliverables in this feature
- One-time indexing script (Node.js) to embed and upsert blog posts
- Netlify Function `semantic-search` to handle queries
- Mapping file `src/data/semantic-mapping.json` for ID→metadata lookup
- Minimal frontend integration (optional in first pass)

---

### 12) Security and cost notes
- Do not commit service account keys. Only store JSON in Netlify env vars.
- Control spend by limiting `topK` and only indexing public content.
- Re-run the indexer after adding or significantly editing posts.
 - If a service account key is exposed, delete and recreate the key immediately (rotate), then update `GCP_SERVICE_ACCOUNT_JSON`.


---

### 13) Current status (Aug 12, 2025)

- Code completed: indexer, Netlify function, basic UI.
- GCP resources:
  - Project: `my-project-74001686249`
  - Region: `us-central1`
  - Index Endpoint ID: `3577513968643604480`
  - Index ID: `3326139222254944256` (brute force, dims=768, cosine)
  - Deployed Index ID: `blog_post_index_deployed` (deployment in progress or needs confirmation in Console)
- IAM: service account `kumarsemantic@my-project-74001686249.iam.gserviceaccount.com` has Vertex AI Admin.
- Next actions to enable search end-to-end:
  1. Confirm the deployed index appears on the endpoint in Console.
  2. Run the indexer with `VERTEX_INDEX_ID=3326139222254944256` to upsert vectors.
  3. Start Netlify dev and test `/.netlify/functions/semantic-search`.
