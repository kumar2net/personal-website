## Recommendation System Architecture

This document visualizes the end-to-end data flow for a hybrid blog recommendation system integrated with React (frontend), Express (proxy backend), a Python model server (FastAPI/Flask), and Google Analytics data.

### Mind map (Mermaid)

```mermaid
mindmap
  root((Blog Recommendation System))
    Content Sources
      Blog Posts
        Markdown/JSX
        Metadata (tags, date, author)
      Google Analytics
        Pageviews
        Session Duration
        Bounce Rate
        User Segments (device, geo)
        Events (clicks on recs)
    Feature Engineering (Python)
      NLP
        TF-IDF
        Transformer Embeddings
        Topic vectors
      Behavioral
        Popularity (views)
        Dwell time
        CTR on recs
        Segment-weighted scores
      Storage
        Vector store (Faiss/Annoy)
        Feature store (parquet/json)
    Model
      Content-based
        Cosine similarity on embeddings
      Hybrid
        Content sim + Behavioral weights
        Re-ranking (CTR, recency)
        Cold-start: tags/category boost
    Serving (Python API - FastAPI/Flask)
      Endpoints
        POST /recommendations
          input: post_id or user_context
          output: [post_id, score]
        POST /log_interaction
          input: user_id, post_id, event
      Infra
        Model + vectors in memory
        Cache hot results
        Auth key / rate limit
    Node/Express Proxy
      Routes
        GET /api/recommendations
          calls Python API
        POST /api/track
          forwards interaction
      Concerns
        Caching
        Timeouts/retries
        Observability
    React Frontend
      UI
        Recommended cards
        Skeleton loading
      Data
        Fetch from /api/recommendations
        Track clicks/impressions
        Context (current post, tags, user)
    Feedback Loop
      Interaction Logs
        Clicks, impressions, dwell
      GA Refresh
        Nightly import/aggregation
      Retraining
        Cron/CI job
        Recompute features
        Validate, version, deploy
```

### End-to-end flow (Mermaid flowchart)

```mermaid
flowchart LR
  A[User on Post Page] --> B[React fetch /api/recommendations?post_id=...]
  B --> C[Express Proxy]
  C --> D[Python API /recommendations]
  D --> E[Content + GA features]
  E --> F[Model: content sim + re-rank by behavior]
  F --> G[Top-N recommendations]
  G --> C
  C --> H[React renders cards]

  subgraph Tracking
    H --> I[User clicks recommendation]
    I --> J[React POST /api/track]
    J --> C
    C --> K[Python API /log_interaction]
    K --> L[(Interaction Store)]
  end

  subgraph Retraining Cycle
    M[GA nightly export] --> N[Feature Aggregation]
    L --> N
    N --> O[Recompute embeddings + features]
    O --> P[Train/Update model + vector index]
    P --> D
  end
```

### Sequence diagram (request → recommendations)

```mermaid
sequenceDiagram
  participant UI as React
  participant NX as Express
  participant PY as Python API
  participant FS as Feature/Vector Store

  UI->>NX: GET /api/recommendations?post_id=123&user_seg=mobile
  NX->>PY: POST /recommendations {post_id, user_seg}
  PY->>FS: Load vectors + GA aggregates
  FS-->>PY: Embeddings + behavior features
  PY->>PY: Compute similarity + re-rank
  PY-->>NX: [{post_id, score}...]
  NX-->>UI: Recommended posts

  UI->>NX: POST /api/track {user_id, post_id, event:click}
  NX->>PY: POST /log_interaction {...}
  PY-->>PY: Store/aggregate for retraining
```

### ASCII quick reference

```
[React UI]
  |  GET /api/recommendations?post_id=...
  v
[Express Proxy]
  |  POST /recommendations
  v
[Python API]
  |-> [Vector/Feature Store] -> embeddings + GA metrics
  |-> Model: content similarity + behavior re-rank
  v
[Top-N Recs] -> back to Express -> React renders

Clicks/Impressions:
React -> POST /api/track -> Express -> Python /log_interaction -> [Interaction Store]

Retraining (cron/CI):
[GA exports] + [Interaction Store] -> Feature recompute -> Train/Update model/index -> Hot-reload Python API
```

### Viewing tips

- GitHub renders Mermaid natively; open this file directly on GitHub to view diagrams.
- Locally, use a Markdown preview that supports Mermaid (e.g., VS Code with "Markdown Preview Mermaid Support").

### PlantUML equivalents

- Mind map: `docs/reco-architecture-mindmap.puml`
- Flow: `docs/reco-architecture-flow.puml`
- Sequence: `docs/reco-architecture-sequence.puml`

Render locally (Docker):

```bash
docker run --rm -v "$(pwd)":/workspace plantuml/plantuml docs/reco-architecture-*.puml
```

Or use a PlantUML extension in your editor (e.g., VS Code "PlantUML").

Using npm scripts:

```bash
npm run puml:render:svg
npm run puml:render:png
```

Using Makefile:

```bash
make puml-svg
make puml-png
```



Last updated: 2025-08-11
