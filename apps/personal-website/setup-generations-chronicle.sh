#!/bin/bash
set -e

echo "🪶 Setting up Generations 2.0 Chronicle publishing and viewing..."

# 1️⃣  Add merge API (builds AI chronicle)
mkdir -p api/generations
cat > api/generations/merge.ts <<'EOF'
import OpenAI from "openai";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { promptId } = req.body || {};
  const key = `gen:entries:${promptId}`;

  const raw = await kv.lrange(key, 0, -1);
  const entries = raw.map((e) => JSON.parse(e));

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const combined = entries.map((e) => `• ${e.text}`).join("\n");

  const mergePrompt = `Combine these reflections into a warm, poetic narrative for the family chronicle:\n${combined}`;

  const llm = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: mergePrompt }],
  });

  const mergedText = llm.choices[0].message.content;
  const chronicle = {
    id: `chron_${Date.now()}`,
    week: promptId,
    text: mergedText,
    createdAt: new Date().toISOString(),
  };

  await kv.set(`gen:chronicle:${promptId}`, JSON.stringify(chronicle));
  res.json({ ok: true, chronicle });
}
EOF
echo "✅ /api/generations/merge.ts created"

# 2️⃣  Chronicle viewer API (reads published stories)
cat > api/generations/chronicle.ts <<'EOF'
import { kv } from "@vercel/kv";

export const runtime = "edge";

export default async function handler(req) {
  const url = new URL(req.url);
  const week = url.searchParams.get("week");
  const data = await kv.get(`gen:chronicle:${week}`);
  if (!data) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  return new Response(data, { headers: { "content-type": "application/json" } });
}
EOF
echo "✅ /api/generations/chronicle.ts created"

# 3️⃣  Chronicle viewer page
mkdir -p src/pages/generations/chronicle
cat > src/pages/generations/chronicle/[weekId].tsx <<'EOF'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChronicleView() {
  const { weekId } = useParams();
  const [chronicle, setChronicle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/generations/chronicle?week=${weekId}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setChronicle)
      .catch((err) => setError(String(err)));
  }, [weekId]);

  if (error) return <div className="p-12 text-center text-red-500">Error loading chronicle.</div>;
  if (!chronicle) return <div className="p-12 text-center text-gray-500">Loading...</div>;

  return (
    <section className="p-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-amber-700 mb-6">
        Family Chronicle — {weekId}
      </h1>
      <article className="prose prose-lg text-gray-700 whitespace-pre-line leading-relaxed">
        {chronicle.text}
      </article>
    </section>
  );
}
EOF
echo "✅ Chronicle viewer page created"

# 4️⃣  Publish button component
mkdir -p src/components/generations
cat > src/components/generations/PublishChronicleButton.tsx <<'EOF'
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PublishChronicleButton({ promptId }: { promptId: string }) {
  const [status, setStatus] = useState<"idle"|"running"|"done"|"error">("idle");

  const publish = async () => {
    setStatus("running");
    try {
      const res = await fetch("/api/generations/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("done");
        alert("🎉 Chronicle published! You can now view the story.");
      } else throw new Error("API error");
    } catch (err) {
      console.error(err);
      setStatus("error");
      alert("❌ Failed to publish chronicle.");
    }
  };

  const label = {
    idle: "Publish Chronicle",
    running: "Weaving Story...",
    done: "✅ Chronicle Ready",
    error: "Retry Publish"
  }[status];

  return (
    <div className="flex flex-col items-center py-8">
      <Button onClick={publish} disabled={status === "running"} className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8 py-3 text-lg shadow-md">
        {label}
      </Button>
      <p className="mt-3 text-gray-500 text-sm">
        {status === "running" && "Collecting reflections → Weaving story → Saving chronicle..."}
        {status === "done" && "You can now view it under /generations/chronicle/[weekId]."}
      </p>
    </div>
  );
}
EOF
echo "✅ PublishChronicleButton component created"

# 5️⃣  Update README
cat >> README.md <<'EOF'

---

## 📖 Generations 2.0 Chronicle Flow

**APIs**
- `POST /api/generations/merge` — merges reflections into AI-generated story  
- `GET /api/generations/chronicle?week=<id>` — fetches published story  

**Front-end**
- `PublishChronicleButton.tsx` — triggers merge  
- `/generations/chronicle/[weekId].tsx` — displays story  

**Usage**
- Add `<PublishChronicleButton promptId=\"2025-W45\" />` under your ReflectionGallery  
- Click “Publish Chronicle” when ready each Sunday  
EOF

git add api src/components src/pages README.md
git commit -m "Add Generations Chronicle publish + viewer flow" || true

echo "✅ Chronicle integration complete!"
echo "Next: Run 'npm run dev' and visit http://localhost:5173/generations to publish & view your story."

