import { useMemo, useState, type FormEvent } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const moodModes = [
  {
    id: "steady",
    label: "Steady",
    description: "Keep the tone balanced while highlighting useful signals.",
    gradient: "from-slate-900 via-slate-800 to-slate-900",
  },
  {
    id: "uplift",
    label: "Uplift",
    description: "Dial up optimism without flattening honest tension.",
    gradient: "from-cyan-500 via-cyan-400 to-blue-500",
  },
  {
    id: "candid",
    label: "Candid",
    description: "Lean into contrast and ship a sharper reflection.",
    gradient: "from-rose-500 via-orange-500 to-amber-400",
  },
];

const promptShortcuts = [
  "Ship log: Highlight one experiment that worked and one that failed",
  "Morning check-in: Capture yesterday's win and today's friction",
  "Weeknote: What surprised you about the team tempo this week?",
];

type ReflectionResult = {
  tone: string;
  detectedEmotion: string;
  microSummary: string;
  actionHint: string;
  metadata: {
    wordCount: number;
    toneScore: number;
    alignment: string;
  };
};

type BuilderResponse = {
  result: ReflectionResult;
  trace: string[];
};

const toneDictionary: Record<string, string> = {
  upbeat: "Upbeat momentum",
  tense: "Tension + grit",
  reflective: "Calm clarity",
  exhausted: "Low battery",
};

function scoreText(entry: string) {
  const positive = ["shipped", "proud", "energ", "excited", "glad", "power"];
  const negative = ["stuck", "tired", "delay", "worried", "blocked", "mess"];
  const stress = ["deadline", "intense", "pressure", "chaos", "overwhelm"];

  const lower = entry.toLowerCase();
  const hitPositive = positive.filter((token) => lower.includes(token)).length;
  const hitNegative = negative.filter((token) => lower.includes(token)).length;
  const hitStress = stress.filter((token) => lower.includes(token)).length;

  const rawScore = hitPositive - hitNegative - hitStress * 0.5;
  return Math.max(-5, Math.min(5, rawScore));
}

function detectTone(entry: string): { key: string; description: string; score: number } {
  const score = scoreText(entry);

  if (score >= 2) {
    return { key: "upbeat", description: toneDictionary.upbeat, score: 0.82 };
  }
  if (score <= -2) {
    return { key: "exhausted", description: toneDictionary.exhausted, score: 0.38 };
  }
  if (score < 0) {
    return { key: "tense", description: toneDictionary.tense, score: 0.52 };
  }
  return { key: "reflective", description: toneDictionary.reflective, score: 0.66 };
}

function buildReflection(entry: string, targetMood: string): BuilderResponse {
  const sentences = entry
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((part) => part.trim().length > 0);

  const tone = detectTone(entry);
  const focus = sentences.slice(0, 2).join(" ").slice(0, 220);

  const microSummary =
    focus.length > 0
      ? `${focus}${focus.endsWith(".") ? "" : "..."}`
      : "Quick jot noted. Ready for embellishment";

  const actionHintMap: Record<string, string> = {
    steady: "Highlight one proof point. Contrast it with a single friction.",
    uplift: "Finish with gratitude or a next bold experiment.",
    candid: "Name the blocker and tag who needs to know.",
  };

  const actionHint = actionHintMap[targetMood as keyof typeof actionHintMap];

  const alignmentMap: Record<string, string> = {
    upbeat: "Matches intent",
    reflective: "Slightly calmer than requested",
    tense: "Needs softening",
    exhausted: "Needs energy injection",
  };

  return {
    result: {
      tone: tone.description,
      detectedEmotion: tone.key,
      microSummary,
      actionHint,
      metadata: {
        wordCount: entry.trim().split(/\s+/).filter(Boolean).length,
        toneScore: tone.score,
        alignment: alignmentMap[tone.key] ?? "Mixed",
      },
    },
    trace: [
      `Read ${sentences.length || 1} sentence${sentences.length === 1 ? "" : "s"}`,
      `Tone classified as ${tone.description}`,
      `Applied ${targetMood} polishing lens`,
    ],
  };
}

export default function PromptInputGenerations() {
  const [entry, setEntry] = useState("");
  const [mode, setMode] = useState(moodModes[0].id);
  const [result, setResult] = useState<ReflectionResult | null>(null);
  const [trace, setTrace] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeMood = useMemo(() => moodModes.find((m) => m.id === mode) ?? moodModes[0], [mode]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!entry.trim()) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const output = buildReflection(entry, mode);
      setResult(output.result);
      setTrace(output.trace);
      setIsLoading(false);
    }, 250);
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col gap-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Input lab
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Give Generations a quick note. Watch it return a studio-ready tiny reflection.
          </h2>
          <p className="text-base text-slate-600">
            All on-device. Nothing is saved. The heuristics below mimic the production pipeline so you
            can rehearse before sending real data through the API.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {moodModes.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setMode(mood.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    mode === mood.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500">{activeMood.description}</p>
            <label className="block text-left text-sm font-semibold text-slate-700">
              Raw thought
              <textarea
                value={entry}
                onChange={(event) => setEntry(event.target.value)}
                rows={8}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 text-base text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                placeholder="Example: Wrapped the cohort retro. Energy was high but timeline anxiety keeps popping up..."
              />
            </label>
            <div>
              <p className="text-sm font-semibold text-slate-700">Need inspiration?</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {promptShortcuts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setEntry(prompt)}
                    className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-xs text-slate-500 hover:border-slate-400"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800 disabled:opacity-50"
              disabled={isLoading || entry.trim().length === 0}
            >
              <SparklesIcon className="h-5 w-5" />
              {isLoading ? "Polishing..." : "Generate tiny reflection"}
            </button>
          </form>

          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
            <header className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-900/90 p-3 text-white">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Output stack</p>
                <p className="text-base text-slate-900">Tone detection + rewrite</p>
              </div>
            </header>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Summary
                  </p>
                  <p className="mt-2 text-base text-slate-900">{result.microSummary}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <article className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tone</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{result.tone}</p>
                    <p className="text-sm text-slate-500">Alignment: {result.metadata.alignment}</p>
                  </article>
                  <article className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Word count</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{result.metadata.wordCount}</p>
                    <p className="text-sm text-slate-500">
                      Tone score: {(result.metadata.toneScore * 100).toFixed(0)}%
                    </p>
                  </article>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Action hint</p>
                  <p className="mt-2 text-base text-slate-900">{result.actionHint}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Trace</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {trace.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-900" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                Paste a raw thought and choose a tone lens to preview the rewrite stack.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
