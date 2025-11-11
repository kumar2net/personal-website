import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const tags = ["AI labour", "Future of work", "Early career", "Policy"];

const sixFacts = [
  {
    title: "Early-career decline",
    description:
      "Workers aged 22-25 in highly AI-exposed occupations (software development, support) show about a 13% relative employment drop even after controlling for firm-level factors.",
  },
  {
    title: "Uneven growth",
    description:
      "Older cohorts and lower-exposure roles continue to expand, highlighting resilience outside AI-intensive tracks.",
  },
  {
    title: "Automation vs. augmentation",
    description:
      "Declines cluster where AI substitutes full tasks; augmentation-centric roles hold steadier employment.",
  },
  {
    title: "Headcount, not wages",
    description:
      "Firms adjust through slower hiring rather than broad pay cuts, turning first-job access into the pressure point.",
  },
  {
    title: "Robust across sectors",
    description:
      "Patterns persist even when removing tech firms or remote-heavy employers, suggesting economy-wide exposure.",
  },
  {
    title: "Early warning, not the end",
    description:
      "The authors frame these results as leading indicators rather than a final verdict on labour markets.",
  },
];

const audienceTakeaways = [
  {
    title: "For early-career professionals",
    description:
      "Entry roles in exposed fields now demand hybrid skills, AI fluency, and the ability to orchestrate systems rather than perform repetitive tasks.",
  },
  {
    title: "For organisations",
    description:
      "Rethink junior job design. If entry positions are little more than rote tasks, AI will replace them before they build human expertise.",
  },
  {
    title: "For educators and policy-makers",
    description:
      "Curricula and training must emphasise directing and auditing AI. The goal is to teach workers how to stay in the loop, not race the machine.",
  },
];

const builderSignals = [
  {
    title: "Early warning is feedback, not doom",
    summary:
      "The young workers leaving or being screened out are signalling design flaws in how we deploy AI products.",
    quote: "Does my product make humans smarter, or just more replaceable?",
  },
  {
    title: "From leverage to substitution",
    summary:
      "AI’s trajectory is shifting from giving lift to replacing labour.",
    bullets: [
      "Build for augmentation, not automation.",
      "Invite human intervention and reward original thinking.",
      "Expose reasoning paths so operators understand and can contest outcomes.",
    ],
  },
  {
    title: "The entry-level gap is an opportunity",
    summary:
      "If ladders into the field disappear, builders can create new scaffolding.",
    bullets: [
      "AI-ready apprenticeships and learning simulators.",
      "Onboarding copilots that teach workflows instead of abstract documentation.",
      "Skill dashboards that surface human-AI collaboration data.",
    ],
  },
  {
    title: "Treat AI exposure like an asset class",
    summary:
      "Know where you sit on the exposure spectrum and skill up deliberately.",
    bullets: [
      "High exposure: master prompt chaining, evaluation, and orchestration stacks.",
      "Low exposure: adopt AI to multiply output before disruption arrives from elsewhere.",
    ],
  },
  {
    title: "Keep humans in the loop",
    summary:
      "Every AI feature encodes a social contract; respect the human role in it.",
    bullets: [
      "Show reasoning steps when possible.",
      "Offer revision hooks instead of final, irreversible answers.",
      "Track what people learn from AI interaction, not only what tasks disappear.",
    ],
  },
  {
    title: "Innovation as moral architecture",
    summary:
      "Productivity gains mean little if they erode judgment, curiosity, or meaning.",
    quote:
      "The new frontier is not how fast we build, but how humanly we build.",
  },
];

const personalCommitments = [
  {
    title: "Stay a builder",
    description:
      "Keep experimenting with AI stacks and utilities that amplify human skill instead of sidelining it.",
  },
  {
    title: "Teach and document openly",
    description:
      "Share prompts, workflows, and lessons so others climb the learning curve faster when entry paths narrow.",
  },
  {
    title: "Prototype for humanity",
    description:
      "Design interfaces where AI feels like a creative companion, not an invisible replacement.",
  },
  {
    title: "Embrace lifelong learning",
    description:
      "Treat every model update as a cue to relearn and adapt. Momentum matters more than mastery.",
  },
  {
    title: "Promote ethical development",
    description:
      "Ask whether each project makes society more capable or merely more efficient, and act accordingly.",
  },
];

const openQuestions = [
  "Will AI-driven employment effects spread beyond tech and support roles?",
  "Can augmentation offsets at scale balance outright automation?",
  "How can policy, education, and innovation align to keep humans in the loop?",
];

export default function CanariesInTheCoalMine() {
  const MotionArticle = motion.article;
  const navigate = useNavigate();
  const publishedDate = new Date("2025-11-02T00:00:00Z");
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-5xl px-4 py-10 text-slate-900 sm:px-6 lg:px-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 transition hover:border-slate-300 dark:hover:border-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
          type="button"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to posts
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-900">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 10h18" />
          </svg>
          <span>{formattedDate}</span>
        </div>
      </div>

      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 text-white">
        <div className="absolute -left-24 -top-20 h-56 w-56 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 hidden h-48 w-48 rounded-full bg-emerald-200/20 blur-3xl sm:block" />
        <div className="relative space-y-6 px-6 py-12 sm:px-10 lg:px-14">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50">
            Labour pulse
          </span>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            "Canaries in the Coal Mine?" — What Entry-Level Workers Are Telling
            Us About the AI Labour Shift
          </h1>
          <p className="max-w-2xl text-base text-emerald-100 sm:text-lg">
            A Stanford Digital Economy Lab working paper tracks the sharpest AI
            disruptions among the youngest workers. Their experience is the
            earliest signal of how automation might reshape career ladders.
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="mt-12 space-y-6 text-lg leading-relaxed text-slate-900">
        <p>
          The rapid rise of generative artificial intelligence (AI) is more than
          a tech story; it is already reshaping the labour market. Erik
          Brynjolfsson, Bharat Chandar, and Ruyu Chen's working paper,{" "}
          <em>
            Canaries in the Coal Mine? Six Facts about the Recent Employment
            Effects of Artificial Intelligence
          </em>{" "}
          (Stanford Digital Economy Lab, August 2025), offers early data on how
          that shift is playing out.
        </p>
        <p>
          Canonical reference:{" "}
          <a
            href="https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-emerald-600 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-500"
          >
            digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/
          </a>
        </p>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Origin of the phrase
          </h2>
          <p className="mt-4 text-slate-800">
            Miners once carried canaries underground because the birds were more
            sensitive to toxic gases. If the canary showed distress, it signaled
            danger and gave humans time to escape. The metaphor now stands for
            early warning systems. In this study the canaries are young workers
            in AI-exposed jobs whose employment patterns may foreshadow deeper
            structural shifts.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            What the researchers examined
          </h2>
          <p className="mt-4 text-slate-800">
            The authors combine monthly Automatic Data Processing (ADP) payroll
            data, covering millions of U.S. workers, with occupational measures
            of AI exposure. They then track employment trends by age, firm, and
            exposure level to isolate how generative AI adoption may be altering
            hiring and retention.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">
          Six facts from the study
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {sixFacts.map((fact) => (
            <div
              key={fact.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {fact.title}
              </h3>
              <p className="mt-3 text-sm text-slate-700">{fact.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">
          Why this matters
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {audienceTakeaways.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-slate-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-8">
        <h2 className="text-2xl font-semibold text-slate-900">
          For builders and tech enthusiasts
        </h2>
        {builderSignals.map((signal) => (
          <div
            key={signal.title}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8"
          >
            <h3 className="text-xl font-semibold text-slate-900">
              {signal.title}
            </h3>
            <p className="mt-3 text-slate-800">{signal.summary}</p>
            {signal.bullets && (
              <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-800">
                {signal.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
            {signal.quote && (
              <blockquote className="mt-4 border-l-4 border-emerald-400 pl-4 text-sm italic text-emerald-700">
                {signal.quote}
              </blockquote>
            )}
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Reflection: what I can do as an AI enthusiast
        </h2>
        <ol className="mt-6 list-decimal space-y-4 pl-6 text-slate-800">
          {personalCommitments.map((item) => (
            <li key={item.title}>
              <span className="font-semibold">{item.title}.</span>{" "}
              {item.description}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Looking ahead</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-800">
          {openQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12 space-y-4 text-sm text-slate-700">
        <div>
          <h2 className="text-base font-semibold uppercase tracking-wide text-slate-500">
            Reference
          </h2>
          <p>
            Brynjolfsson, E., Chandar, B., and Chen, R. (2025).{" "}
            <em>
              Canaries in the Coal Mine? Six Facts about the Recent Employment
              Effects of Artificial Intelligence
            </em>
            . Stanford Digital Economy Lab Working Paper, August 26. Available
            at{" "}
            <a
              href="https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-500"
            >
              digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/
            </a>
          </p>
        </div>
        <p>
          Written by Kumar A ·{" "}
          <a
            href="https://kumar2net.com"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-600 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-500"
          >
            kumar2net.com
          </a>
        </p>
      </section>

      <section className="mt-12 rounded-3xl border border-dashed border-emerald-400 bg-emerald-50 p-6 text-sm text-emerald-800">
        <h2 className="text-base font-semibold uppercase tracking-wide">
          Photo gallery
        </h2>
        <p className="mt-2">
          Browse the accompanying visuals here:{" "}
          <a
            href="https://photos.app.goo.gl/xfhXjhLaow44qmjG9"
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline decoration-emerald-300 underline-offset-4 hover:text-emerald-600"
          >
            photos.app.goo.gl/xfhXjhLaow44qmjG9
          </a>
        </p>
      </section>
    </MotionArticle>
  );
}
