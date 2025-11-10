import { FaceSmileIcon, FireIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const tonePalette: Record<string, string> = {
  bright: "from-emerald-400 to-lime-300",
  calm: "from-cyan-400 to-blue-400",
  tense: "from-amber-400 to-orange-500",
  muted: "from-slate-400 to-slate-500",
};

type ReflectionMoment = {
  id: string;
  title: string;
  tone: keyof typeof tonePalette;
  tensionScore: number;
  signal: string;
  cue: string;
  tags: string[];
  action: string;
  icon: "pulse" | "shield" | "spark";
};

const reflectionMoments: ReflectionMoment[] = [
  {
    id: "ops",
    title: "Ops standup • shipping calm",
    tone: "calm",
    tensionScore: 0.42,
    signal: "Cadence restored after three sprint resets",
    cue: "Tone softened after mentioning async video updates.",
    tags: ["ritual", "async", "cadence"],
    action: "Keep the steady frame, then invite one bold ask.",
    icon: "shield",
  },
  {
    id: "launch",
    title: "Launch retro • bright energy",
    tone: "bright",
    tensionScore: 0.68,
    signal: "Excitement spikes when talking about customer voice.",
    cue: "Noticeable gratitude cues offset sleep debt mentions.",
    tags: ["retro", "customer love", "momentum"],
    action: "Name the dopamine hit, then capture one risk to track.",
    icon: "spark",
  },
  {
    id: "team",
    title: "Team health • muted",
    tone: "muted",
    tensionScore: 0.31,
    signal: "Language loses color around hiring discussions.",
    cue: "Short sentences + filler words signal decision fatigue.",
    tags: ["team", "resourcing", "clarity"],
    action: "Swap bullet list for a narrative and call out the stuck point.",
    icon: "pulse",
  },
  {
    id: "evening",
    title: "Evening log • tense",
    tone: "tense",
    tensionScore: 0.58,
    signal: "High urgency verbs paired with apology phrases.",
    cue: "Reflection loops back to the same blocker four times.",
    tags: ["burnout", "focus", "feedback"],
    action: "Break the loop with a concrete ask for support.",
    icon: "shield",
  },
];

function getIcon(icon: ReflectionMoment["icon"]) {
  if (icon === "spark") return SparkBlock;
  if (icon === "shield") return ShieldBlock;
  return PulseBlock;
}

function SparkBlock() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 p-3 text-white shadow-lg">
      <FireIcon className="h-5 w-5" />
    </div>
  );
}

function ShieldBlock() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-3 text-white shadow-lg">
      <ShieldCheckIcon className="h-5 w-5" />
    </div>
  );
}

function PulseBlock() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 p-3 text-white shadow-lg">
      <FaceSmileIcon className="h-5 w-5" />
    </div>
  );
}

export default function ReflectionGalleryToneDetection() {
  return (
    <section className="bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Tone radar</p>
          <h2 className="text-3xl font-semibold">Tiny reflections gallery</h2>
          <p className="text-base text-slate-300">
            Each card blends tone detection, tension score, and one actionable rewrite instruction.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {reflectionMoments.map((moment) => {
            const IconBlock = getIcon(moment.icon);
            const toneGradient = tonePalette[moment.tone];
            return (
              <article
                key={moment.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="flex items-center gap-4">
                  <IconBlock />
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{moment.tone}</p>
                    <h3 className="text-xl font-semibold text-white">{moment.title}</h3>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Signal strength</span>
                    <span>{Math.round(moment.tensionScore * 100)}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${toneGradient}`}
                      style={{ width: `${moment.tensionScore * 100}%` }}
                    />
                  </div>
                </div>
                <p className="mt-4 text-base text-slate-100">{moment.signal}</p>
                <p className="mt-2 text-sm text-slate-300">{moment.cue}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {moment.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide text-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Action</p>
                  <p className="mt-2">{moment.action}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
