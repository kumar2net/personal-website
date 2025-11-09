import { useState } from "react";

export default function PublishChronicleButton({ promptId }: { promptId: string }) {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");

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
      } else {
        throw new Error("API error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      alert("❌ Failed to publish chronicle. Please try again.");
    }
  };

  const label = {
    idle: "Publish Chronicle",
    running: "Weaving Story...",
    done: "✅ Chronicle Ready",
    error: "Retry Publish",
  }[status];

  return (
    <div className="flex flex-col items-center py-12">
      <button
        onClick={publish}
        disabled={status === "running"}
        className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8 py-3 text-lg shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {label}
      </button>

      <p className="mt-4 text-gray-500 text-sm text-center max-w-md">
        {status === "idle" && "Click to publish this week's reflections into one family story."}
        {status === "running" && "Collecting reflections → Weaving story → Saving chronicle..."}
        {status === "done" && (
          <>
            🎉 Chronicle ready! View it at{" "}
            <span className="font-semibold text-amber-700">
              /generations/chronicle/{promptId}
            </span>
          </>
        )}
        {status === "error" && "Something went wrong. Try again."}
      </p>
    </div>
  );
}

