import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Import the markdown file as raw text
import shortcuts from "../../shortcuts.md?raw";

// Split the markdown into two sections
const [macSection, chromeSection] = (() => {
  const macHeader = "## Mac OS Shortcuts";
  const chromeHeader = "## Chrome Browser Shortcuts";
  const macStart = shortcuts.indexOf(macHeader);
  const chromeStart = shortcuts.indexOf(chromeHeader);
  return [
    shortcuts.slice(macStart, chromeStart).trim(),
    shortcuts.slice(chromeStart).trim(),
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