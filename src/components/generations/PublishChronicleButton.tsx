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
