# Session Summary (Semantic Search)

Last Updated: 13 Aug 2025

## Completed Today

- Backend function `netlify/functions/semantic-search.js` implemented. Vertex REST + automatic local fallback when Vertex is unavailable.
- Indexer `scripts/index-semantic.mjs` to embed posts and upsert vectors.
- Frontend UI `src/components/SemanticSearch.jsx` integrated into `Blog` page.
- GCP: Created Vertex AI Vector Search Index (brute force) in `us-central1`.

## Current Cloud Status

- Project: `my-project-74001686249`
- Region: `us-central1`
- Index Endpoint ID: `3577513968643604480`
- Index ID: `3326139222254944256` (brute force, 768 dims, cosine)
- Deployed Index ID: `blog_post_index_deployed` (deployment in progress/needs confirmation)
- Service Account: `kumarsemantic@my-project-74001686249.iam.gserviceaccount.com` (Vertex AI Admin)

## Local Dev Status

- Netlify Dev running on `http://localhost:8890` (when started).
- Function endpoint: `POST /.netlify/functions/semantic-search`.
- Semantic search works locally using precomputed embeddings (local fallback). Vertex path pending deployed index readiness and stream/batch upsert.

## Next Steps (Tomorrow)

1) Confirm deployment
- Console → Vertex AI → Vector Search → Index endpoints → open `3577513968643604480` and ensure a deployed index is listed (ID `blog_post_index_deployed`).

2) Upsert blog vectors
- Env:
  - `GCP_PROJECT_ID=my-project-74001686249`
  - `GCP_LOCATION=us-central1`
  - `VERTEX_INDEX_ID=3326139222254944256`
  - `VERTEX_EMBED_DIM=768`
  - `GEMINI_API_KEY=***`
  - `GCP_SERVICE_ACCOUNT_JSON=<full JSON>`
- Run: `node scripts/index-semantic.mjs`

3) Start dev and verify
- Env:
  - `VERTEX_INDEX_ENDPOINT_ID=3577513968643604480`
  - `VERTEX_DEPLOYED_INDEX_ID=blog_post_index_deployed`
- Start: `npx netlify-cli@17.33.0 dev --port 8890 --offline`
- Test: `curl -s -X POST -H 'Content-Type: application/json' -d '{"q":"india usa trade gap","topK":5}' http://localhost:8890/.netlify/functions/semantic-search`

## Notes

- Use numeric IDs for both Index and Index Endpoint (do not use the endpoint hostname).
- IAM is configured; allow a few minutes for role propagation.
- Image proxy 503s are unrelated to search.
