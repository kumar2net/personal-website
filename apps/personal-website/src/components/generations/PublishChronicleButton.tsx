import { useState } from "react";

type TokenUsageSummary =
  | {
      source: "openai";
      model: string;
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      costUsd: number;
      promptRatePer1k: number;
      completionRatePer1k: number;
    }
  | {
      source: "fallback";
      message: string;
    };

const FALLBACK_USAGE: TokenUsageSummary = {
  source: "fallback",
  message:
    "Chronicle generated locally before billing info was wired up. No token usage is available for this run.",
};

export default function PublishChronicleButton({ promptId }: { promptId: string }) {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [tokenUsage, setTokenUsage] = useState<TokenUsageSummary | null>(null);

  const publish = async () => {
    setStatus("running");
    setTokenUsage(null);

    try {
      const res = await fetch("/api/generations/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId }),
      });

      const data = await res.json();
      if (data.ok) {
        const usagePayload: TokenUsageSummary =
          data.tokenUsage ?? {
            ...FALLBACK_USAGE,
            message:
              "Chronicle generated locally after the merge API responded without usage metrics.",
          };

        setTokenUsage(usagePayload);
        setStatus("done");
        alert("🎉 Chronicle published! You can now view the story.");
      } else {
        throw new Error("API error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTokenUsage(FALLBACK_USAGE);
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
    <div className="flex flex-col items-center py-8">
      <button
        type="button"
        onClick={publish}
        disabled={status === "running"}
        className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8 py-3 text-lg shadow-md transition hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {label}
      </button>

      <p className="mt-3 text-gray-500 text-sm text-center max-w-md">
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

      {tokenUsage && (
        <div className="mt-6 w-full max-w-lg">
          {tokenUsage.source === "openai" ? (
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                  Token usage
                </p>
                <span className="text-xs font-semibold text-slate-400">{tokenUsage.model}</span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Prompt</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {tokenUsage.promptTokens.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    ${tokenUsage.promptRatePer1k.toFixed(4)} / 1k
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Completion</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {tokenUsage.completionTokens.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    ${tokenUsage.completionRatePer1k.toFixed(4)} / 1k
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {tokenUsage.totalTokens.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">API reported total</p>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Est. cost</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    ${tokenUsage.costUsd.toFixed(4)}
                  </p>
                </div>
                <p className="text-right text-xs text-slate-500">
                  Based on ${tokenUsage.promptRatePer1k.toFixed(4)}/1k input ·{" "}
                  ${tokenUsage.completionRatePer1k.toFixed(4)}/1k output
                </p>
              </div>
            </section>
          ) : (
            <section className="rounded-3xl border border-amber-200/70 bg-amber-50/80 p-5 text-amber-900 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em]">Local chronicle</p>
              <p className="mt-2 text-sm text-amber-800">{tokenUsage.message}</p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
