# Monorepo Structure & Index

This document provides a high-level overview of the `kumar2net` monorepo structure, its workspaces, and key components.

## Overview

This project is a **Turbo Repo** monorepo containing the personal website frontend, shared UI packages, and backend services for AI/ML features.

- **Package Manager**: `npm`
- **Build System**: `turbo`
- **Deployment**: Vercel (Frontend & Serverless Functions)

## Directory Structure

```
/
├── apps/
│   └── personal-website/       # Main Frontend Application (Vite + React)
├── packages/
│   └── ui-theme/              # Shared Design System (MUI v7 + Emotion)
├── api/                        # Vercel Serverless Function Entrypoints (Re-exports)
├── backend/                    # Standalone Backend (GNN, Analytics, Recommender)
├── ai-tools/                   # Utility scripts for AI debugging and automation
└── docs/                       # Project Documentation
```

## Workspaces

### 1. `apps/personal-website`
The core web application.
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Material UI (MUI) v7
- **Key Features**:
  - Blog with Markdown/MDX support
  - Semantic Search (Gemini Embeddings)
  - Text-to-Speech (OpenAI)
  - Dark Mode support
- **API**: Contains the actual implementation of serverless functions in `apps/personal-website/api/`.

### 2. `packages/ui-theme`
A shared library for UI components and theming.
- **Purpose**: Centralizes the design system tokens, theme configuration, and reusable components.
- **Tech**: TypeScript, Material UI.
- **Usage**: Imported by `apps/personal-website` to ensure consistent branding.

## Backend Services

### `backend/`
A separate service layer handling advanced data processing and ML tasks.
- **Components**:
  - `gnn_server.py`: Graph Neural Network server.
  - `analytics_integration.py`: GA4 and BigQuery integration.
  - `graph_recommender.py`: Content recommendation engine.
  - `server.js`: Node.js entry point/orchestrator.
- **Role**: Powers the "Semantic Search" and "Recommended Posts" features by analyzing content relationships.

### `api/` (Root)
Contains re-exports of serverless functions.
- **Example**: `api/blog-tts.js` exports from `apps/personal-website/api/blog-tts.js`.
- **Purpose**: Allows Vercel to pick up API routes from the root directory configuration.

## Key Commands

Run these from the root directory:

- **Development**:
  ```bash
  npm run dev
  # Runs: turbo dev --filter=personal-website
  ```

- **Build**:
  ```bash
  npm run build
  # Runs: turbo run build
  ```

- **Lint**:
  ```bash
  npm run lint
  ```

## Architecture Notes

1.  **Frontend-First**: The `personal-website` app is the primary entry point.
2.  **Serverless API**: Features like TTS (`blog-tts.js`) and Feed proxies (`wp-feed.js`) run as Vercel Serverless Functions.
3.  **Theme Bridge**: The `ui-theme` package acts as a bridge, ensuring that MUI components and Tailwind classes share the same design tokens (colors, typography).
4.  **AI Integration**:
    - **TTS**: Direct calls to OpenAI API via serverless functions.
    - **Search**: Uses embeddings (Gemini/OpenAI) stored and queried via the backend services.

## Recent Changes (Nov 2025)
- **TTS Optimization**: Pipelined streaming and model fallback fixes implemented in `blog-tts.js`.
- **Dark Mode**: Fixed visibility issues on `/about` page for Safari.
- **Monorepo Indexing**: Created this document to map the project structure.
