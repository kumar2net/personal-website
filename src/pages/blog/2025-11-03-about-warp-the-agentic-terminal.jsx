import React, { useRef } from "react";

export default function AboutWarpAgenticTerminal() {
  const articleRef = useRef(null);
  return (
    <article ref={articleRef} className="prose max-w-none px-4 md:px-8 py-6">
      <h1>About Warp — the agentic terminal</h1>

      {/* Topic badges (standard pills) */}
      <div className="flex flex-wrap gap-2 mb-6 not-prose">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Warp</span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Agents</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Terminal</span>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Productivity</span>
      </div>

      {/* Technology badges (shields) */}
      <div className="flex flex-wrap gap-3 mb-8 not-prose">
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/Warp-Agentic_Terminal-111827?style=for-the-badge&logo=warp&logoColor=white"
          alt="Warp Agentic Terminal"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/zsh-Shell-0f4c81?style=for-the-badge&logo=gnu-bash&logoColor=white"
          alt="zsh Shell"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/Node.js-Scripts-43853D?style=for-the-badge&logo=node.js&logoColor=white"
          alt="Node.js Scripts"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white"
          alt="React Frontend"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white"
          alt="Vite Bundler"
        />
      </div>

      <p>
        Warp is a modern terminal that brings AI agents directly into your development workflow.
        Instead of copy–pasting between chat tools and your shell, you can prompt, review, and
        apply changes in-context. This site uses Warp-driven flows to speed up content edits,
        batch refactors, and documentation generation.
      </p>

      <h2>Why it matters for this codebase</h2>
      <ul>
        <li>Faster iteration: generate or edit React/Vite files inline and preview immediately.</li>
        <li>Repository-aware actions: agents read project files and keep changes consistent.</li>
        <li>Repeatable workflows: codify tasks (e.g., tests, sitemap, GA scripts) as prompts.</li>
      </ul>

      <h2>Typical agent tasks here</h2>
      <ul>
        <li>Create a new blog post as JSX or Markdown under <code>src/pages/blog/</code>.</li>
        <li>Update <code>src/data/blogIndex.js</code> for SEO title/description/tags.</li>
        <li>Run quality checks via npm scripts (lint, unit, e2e, PWA checks).</li>
      </ul>

      <h2>How to try it now</h2>
      <ol>
        <li>Start the dev server with <code>npm run dev</code>.</li>
        <li>Open <code>/blog/2025-11-03-about-warp-the-agentic-terminal</code>.</li>
        <li>Use the Catch up pill in the header to review new posts and mark them as seen.</li>
      </ol>

      <h2>Warp user guide: useful commands for developers</h2>
      <ul>
        <li>Run dev server: <code>npm run dev</code></li>
        <li>Run this post's tests: <code>npm run test:warp-blog</code></li>
        <li>Run unit tests: <code>npm run test:unit</code></li>
        <li>Run end-to-end tests: <code>npm run test:e2e</code></li>
        <li>Run the full test suite: <code>npm run test:all</code></li>
        <li>Static analysis & formatting (Biome): <code>npm run biome:check</code> or <code>npm run biome:fix</code></li>
        <li>Quality gate (lint + tests): <code>npm run quality:check</code></li>
        <li>Build for production: <code>npm run build</code> and preview with <code>npm run preview</code></li>
      </ul>

      <h2>Warp vs zsh: what’s different?</h2>
      <ul>
        <li>
          Scope: <code>zsh</code> is a shell (command interpreter). Warp is a modern terminal app that
          hosts your shell and adds IDE-like UX and agents on top.
        </li>
        <li>
          Compatibility: Warp runs your existing <code>zsh</code> config/plugins; the execution engine is still
          your shell. No breaking change to scripts or dotfiles.
        </li>
        <li>
          Blocks UI: Inputs and outputs are grouped into shareable, searchable blocks instead of a single scrollback.
        </li>
        <li>
          Editing: Rich text editor for the prompt (cursor navigation, multi-line, keybindings) vs raw TTY line editing.
        </li>
        <li>
          Agents: Type natural language to get commands/code, review diffs, and apply changes with context from the repo.
        </li>
        <li>
          Workflow speed: Command palette, history, and previews reduce copy–paste loops between tools.
        </li>
      </ul>

      <h2>Why Warp is “new‑age”</h2>
      <ul>
        <li>
          Agentic development: Built-in agents understand your codebase and tasks, helping author tests, docs, and refactors.
        </li>
        <li>
          Context awareness: Uses project files and prior actions to ground suggestions and avoid drift.
        </li>
        <li>
          Multi-agent orchestration: Run multiple tasks concurrently with notifications and a unified activity view.
        </li>
        <li>
          Performance & polish: A fast, modern terminal experience with predictable UI behavior and ergonomics.
        </li>
        <li>
          Cross-shell: Works with <code>zsh</code>, <code>bash</code>, <code>fish</code>, and others—keep your preferred shell.
        </li>
      </ul>

      <p className="text-sm text-gray-500">
        Tip: The header Catch up pill reads your local <code>user_last_catchup_v1</code> timestamp—reset it under
        <code>/status</code> if you want to preview the full experience again.
      </p>
    </article>
  );
}
