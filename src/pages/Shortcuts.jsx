import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Import the markdown file as raw text
import shortcuts from "../../docs/shortcuts.md?raw";

// Split the markdown into two sections (robust against spacing/line-endings)
const [macSection, chromeSection] = (() => {
  const normalized = shortcuts.replace(/\r\n/g, "\n");
  const macMatch = normalized.match(/##\s*Mac OS Shortcuts[\s\S]*?(?=\n##\s|$)/i);
  const chromeMatch = normalized.match(/##\s*Chrome Browser Shortcuts[\s\S]*?(?=\n##\s|$)/i);
  return [
    (macMatch ? macMatch[0] : normalized).trim(),
    (chromeMatch ? chromeMatch[0] : "").trim(),
  ];
})();

export default function Shortcuts() {
  const [tab, setTab] = useState("mac");

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Ready Reckoner: Mac OS & Chrome Shortcuts</h1>
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium focus:outline-none border-b-2 transition-colors duration-200 ${tab === "mac" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-500"}`}
          onClick={() => setTab("mac")}
        >
          Mac OS Shortcuts
        </button>
        <button
          className={`ml-2 px-4 py-2 font-medium focus:outline-none border-b-2 transition-colors duration-200 ${tab === "chrome" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-500"}`}
          onClick={() => setTab("chrome")}
        >
          Chrome Browser Shortcuts
        </button>
      </div>
      <div className="prose">
        {tab === "mac" ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{macSection}</ReactMarkdown>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{chromeSection}</ReactMarkdown>
        )}
      </div>
    </div>
  );
} 