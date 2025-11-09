import { BoltIcon, SparklesIcon, SwatchIcon } from "@heroicons/react/24/outline";

const insightTiles = [
  {
    title: "Tiny reflections",
    description: "Micro-stories trimmed to <120 words to keep the signal high and the scroll low.",
    metric: "90s",
    label: "Avg craft time",
  },
  {
    title: "Tone radar",
    description: "Tracks emotional inflection and highlights when the author voice drifts from intent.",
    metric: "3",
    label: "tones / entry",
  },
  {
    title: "Context stack",
    description: "Blends prior reflections, current mood, and desired intent to spark better prompts.",
    metric: "45%",
    label: "less rewriting",
  },
];

const runway = [
  "Draft a quick thought",
  "Classify the tone + tension",
  "Generate a studio-ready tiny reflection",
];

export default function HeroExplainerGenerations() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_45%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 px-4 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
            <SparklesIcon className="h-4 w-4" /> Generations 2.0 • Tiny reflections
          </p>
          <div>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Capture the feeling. Ship the signal. Leave the noise.
            </h1>
            <p className="mt-4 text-lg text-slate-200">
              Generations 2.0 is a studio for “tiny reflections”—compact narratives that pair
              tone detection with intent-aware rewriting. Built for fast journaling, daily ship logs,
              and week-in-review prompts where every word has to earn its keep.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {insightTiles.map((tile) => (
              <article
                key={tile.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur"
              >
                <p className="text-sm uppercase tracking-wide text-slate-300">{tile.title}</p>
                <p className="mt-2 text-xl font-semibold text-white">{tile.metric}</p>
                <p className="text-xs text-slate-400">{tile.label}</p>
                <p className="mt-3 text-sm text-slate-200">{tile.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800/60 p-8 shadow-2xl">
          <header className="flex items-center gap-3 text-cyan-200">
            <BoltIcon className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">Narrative runway</p>
          </header>
          <ol className="space-y-5">
            {runway.map((item, index) => (
              <li key={item} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-500/10 text-sm font-semibold text-cyan-200">
                  {index + 1}
                </div>
                <p className="text-base text-slate-100">{item}</p>
              </li>
            ))}
          </ol>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100">
            <div className="flex items-center gap-2 text-cyan-200">
              <SwatchIcon className="h-4 w-4" />
              <span className="uppercase tracking-[0.2em] text-xs">Output palette</span>
            </div>
            <ul className="mt-3 grid gap-2 text-slate-200 sm:grid-cols-2">
              <li className="rounded-lg bg-slate-900/60 px-3 py-2">Intent-preserving rewrite</li>
              <li className="rounded-lg bg-slate-900/60 px-3 py-2">Tone-aware summary</li>
              <li className="rounded-lg bg-slate-900/60 px-3 py-2">Micro CTA suggestions</li>
              <li className="rounded-lg bg-slate-900/60 px-3 py-2">Reflection metadata</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
