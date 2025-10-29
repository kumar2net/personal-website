# Personal Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/bfc9b371-d915-45d3-a051-c92d45dd1206/deploy-status)](https://app.netlify.com/projects/kumarweb/deploys)

Personal site for Kumar A. built with React and Vite. The project bundles together long‑form writing, project dossiers, utilities dashboards, book notes, and AI‑assisted experiments that run off Netlify Functions and a lightweight Python backend.

## Live Site

- **Production**: https://kumar2net.com  
- **Primary branch**: `master`

## Latest Highlights · October 29, 2025

- Added the long-form post **“Digital Swadeshi Age”**, including inline data tables and three supporting illustrations.
- Retired the older **“India Key Stats vs USA”** article to keep the blog index focused on current analysis.
- Updated documentation (README, deployment guide, architecture notes, changelog) to match the present stack and workflows.
- Normalized Framer Motion usage inside blog pages to keep linting and animations consistent.

See `docs/CHANGELOG.md` for a detailed history.

## Feature Snapshot

- **Blog & Knowledge Library** – Rich MD/JSX posts with badges, tables, embeds, and a semantic-search powered landing page.
- **Projects Hub** – Narrative write-ups paired with motion-enhanced visuals, plus deep dives like the AI recommender code viewer.
- **AI & Analytics Utilities** – Netlify Functions for topic recommendations, semantic search, tech-trend aggregation, and CMS helpers.
- **Dashboards** – Utilities spending dashboard, status page, dossier timelines, and other data-first explorations.
- **Books & Notes** – Mixed media content (Markdown, PDF excerpts, DOCX conversions) routed through lazily loaded page bundles.
- **Backend Support** – Optional Node/Python services that feed GA4 + BigQuery powered recommendations.

## Tech Stack Overview

| Layer | Details |
|-------|---------|
| **Frontend** | React 18, Vite 5, React Router 6, Tailwind CSS, Framer Motion |
| **Content** | Markdown + MDX-style JSX pages, `react-markdown`, `gray-matter`, custom SVG assets |
| **Serverless** | Netlify Functions (ES modules) for recommendations, semantic search, image proxying, CMS automation |
| **Backend (optional)** | Python scripts + services in `backend/` for BigQuery and Vertex AI integrations |
| **Tooling** | ESLint 9, Biome, Codemon CLI, Netlify CLI, Node 18 |

## Repository Layout

```
personal-website/
├── src/                  # React source (components, pages, data helpers)
├── netlify/functions/    # Serverless endpoints
├── backend/              # Python + node service scripts for GA4/BQ workflows
├── docs/                 # Architecture, deployment, changelog, research notes
├── public/               # Static assets served by Netlify
└── scripts/              # Utility and test runners
```

## Local Development

### Prerequisites

- Node.js 18+
- npm (ships with Node 18)

### Setup

```bash
git clone https://github.com/kumar2net/personal-website.git
cd personal-website
npm install
```

### Start a Dev Server

```bash
# Default Vite dev server (fast iteration)
npm run dev

# Netlify-style environment with serverless functions
npm run dev:netlify
```

### Quality & Tooling

```bash
# Lint entire project
npm run lint

# Biome static analysis
npm run biome:check

# Test scripts (unit + e2e wrappers)
npm run test:all
```

### Build Output

```bash
npm run build
# Outputs to dist/
```

## Deployment Notes

- Production hosting runs on Netlify with automated deploys from `master`.
- Build command: `npm run build`
- Publish directory: `dist/`
- Review `docs/DEPLOYMENT_STATUS.md` for pre-flight checks, quality gates, and manual deploy instructions.

## Additional Documentation

- `docs/ARCHITECTURE_AND_TECH_STACK.md` – System architecture, data flows, and service inventory.
- `docs/DEPLOYMENT_STATUS.md` – Deployment health, QA checklist, and monitoring pointers.
- `docs/CHANGELOG.md` – Time-stamped record of code/content updates.

For questions or follow-ups, open an issue or contact Kumar directly. Happy shipping!
