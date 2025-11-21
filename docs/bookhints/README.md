---
title: "Bookhints Agent Workflow"
---

# Bookhints Agent Workflow

Dropping any `.md`/`.txt` file inside `docs/bookhints` now triggers an Agentic workflow that turns the note into a polished `/books` entry. The workflow is powered by OpenAI's Agentic Toolkit (Responses API + JSON schema) and lives in `apps/personal-website/scripts/bookhint-agentic.mjs`.

## Prerequisites

- Install dependencies: `npm install`
- Export `OPENAI_API_KEY` locally (the script uses it directly; falls back to a heuristic template if missing)
- Optional: override the model with `BLOGHINT_AGENT_MODEL` (defaults to `gpt-4.1-mini`)

## One-shot conversion

```
npm run bookhints:process
```

- Scans `docs/bookhints` for any new files that have not been published yet.
- Uses Google Books/OpenLibrary lookups to fetch an appropriate cover image and stores the URL in `autoBooks.json` so cards + hero blocks show the actual cover art.
- Generates a slugged markdown page in `apps/personal-website/src/pages/books`.
- Prepends the entry to `apps/personal-website/src/data/autoBooks.json` so it renders first in the `/books` grid and powers the hero block inside `BookDynamic`.
- Pass `--force` to rebuild every tracked file: `npm run bookhints:process -- --force`
- Target a single file or directory: `npm run bookhints:process -- docs/bookhints/Life_in_3_dimensions.md`

## Always-on watch mode

```
npm run bookhints:watch
```

- Uses Node's `fs.watch` to monitor the folder.
- Any add/change event re-runs the agent, updates the markdown + metadata, and keeps the latest edit at the top of the book list.
- Safe to leave running while editing—writes are debounced.

## What gets generated

1. **Markdown page** with normalized front matter + sectioned prose matching the `/books` template.
2. **autoBooks entry** storing title, author, tags, display dates, reading time, hero gradient, and `sourceFile`.
3. **Book detail hero** (inside `BookDynamic.jsx`) automatically pulls from `autoBooks`, so your drop-in file immediately has a cover, metadata chips, and intro above the markdown body.

All updates are idempotent per source file. Delete the file from `docs/bookhints` (and rerun the script) if you no longer want it in the carousel.

## PDF drops (verbatim)

Need your Kindle/PDF notes to render exactly as-is? Drop the PDF into `docs/bookhints` and run:

```
VERBATIM=1 node apps/personal-website/scripts/convert-pdf-to-md.mjs docs/bookhints/YourFile.pdf
```

- Writes a matching markdown file into `apps/personal-website/src/pages/books` so `/books/:slug` resolves.
- Keeps every line from the PDF verbatim; you can still tweak the frontmatter afterwards if needed.
- The bookhints agent will pick up the slug + metadata from `autoBooks.json`, so add/update the entry there for cover art and tags.
