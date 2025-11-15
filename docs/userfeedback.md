
Create a feature branch with appropriate name for the below requirements.

Please implement a lightweight family-feedback feature exactly as follows:

this should be created and deployed as /reflections

created blob storage in vercel project

https://vercel.com/kumar2nets-projects/personal-website/stores/blob/store_jf0xCffb3qOqwhu6/browser



-----------------------------------
### 1. Create a Blob helper
Create the file:

src/utils/blob.js

with this content:

import { put, get } from "@vercel/blob";

export const saveJSON = async (path, data) => {
  await put(path, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json"
  });
};

export const loadJSON = async (path) => {
  try {
    const file = await get(path);
    return JSON.parse(await file.text());
  } catch {
    return null;
  }
};

-----------------------------------
### 2. Create the QuickForm component

Create the file:

src/components/QuickForm.jsx

with this content:

import { useState, useEffect } from "react";
import { saveJSON, loadJSON } from "../utils/blob";

const emojis = ["❤️", "👍", "🤔", "😂", "🙌"];

export default function QuickForm({ postId, sectionId }) {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadJSON(`/notes/${postId}/${sectionId}.json`).then((data) => {
      if (data) setItems(data);
    });
  }, []);

  async function send() {
    if (!text.trim()) return;

    const updated = [
      ...items,
      { text, ts: Date.now() }
    ].slice(-8);

    setItems(updated);
    setText("");

    await saveJSON(`/notes/${postId}/${sectionId}.json`, updated);
  }

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        {emojis.map((e) => (
          <button
            key={e}
            onClick={() => setText((t) => (t + " " + e).trim())}
          >
            {e}
          </button>
        ))}
      </div>

      <textarea
        placeholder="Share your thought…"
        value={text}
        style={{ width: "100%", height: 70 }}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={send} style={{ marginTop: 6 }}>
        Send
      </button>

      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            fontSize: 14,
            opacity: 0.9,
            marginTop: 6,
            borderLeft: "3px solid #eee",
            paddingLeft: 8
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}

//-----------------------------------
### 3. Integrate feedback into blog pages

In the blog post layout file:
src/routes/blog/[slug]/+page.svelte 
(or the equivalent React page if using pages)

Import:

import QuickForm from "../../../components/QuickForm";

Add the component at the end of each section, like:

<QuickForm postId={post.slug} sectionId={`section-${index}`} />

If your blog is rendered via MDX:
Modify the MDX wrapper component and inject QuickForm after each <h2> or after each section container.

-----------------------------------//
### 4. Ensure build success
Run the dev server, fix missing imports, and push changes to master.
-----------------------------------

Please execute all steps exactly as written, create the files, modify the blog layout gracefully, and commit to master with message:

"Add lightweight family reaction form with emoji shortcuts and Blob storage"
