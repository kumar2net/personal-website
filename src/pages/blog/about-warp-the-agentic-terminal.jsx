import React, { useRef } from "react";

export default function AboutWarpAgenticTerminal() {
  const articleRef = useRef(null);
  return (
    <article ref={articleRef} className="prose max-w-none px-4 md:px-8 py-6">
      <h1>About Warp — the agentic terminal</h1>
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
        <li>Open <code>/blog/about-warp-the-agentic-terminal</code>.</li>
        <li>Use the bell icon in the header to view unread posts and mark as read.</li>
      </ol>

      <p className="text-sm text-gray-500">
        Tip: The unread badge is feature-gated; ensure <code>VITE_FEATURE_UNREAD=on</code> and the local
        flag is ON via <code>/status</code>.
      </p>
    </article>
  );
}
