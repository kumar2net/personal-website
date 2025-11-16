import { Link } from "react-router-dom";
import QuickForm from "@/components/QuickForm";
import SEO from "@/components/SEO";

const featuredSections = [
  {
    title: "Tracker pulse check",
    subtitle: "Weekend Field Notes · Section 1",
    summary:
      "React to how Tamil Nadu’s climate tracker is evolving and where you want deeper dives in future updates.",
    postId: "2025-11-15-belam-field-notes",
    sectionId: "tamil-nadu-tracker",
    tone: "from-slate-900/80 via-indigo-900/60 to-emerald-900/40",
  },
  {
    title: "Greywater accountability",
    subtitle: "Weekend Field Notes · Section 7",
    summary:
      "Share stories or tips on keeping water reuse promises honest for AI and data-centre builds.",
    postId: "2025-11-15-belam-field-notes",
    sectionId: "greywater",
    tone: "from-rose-900/70 via-orange-900/40 to-yellow-900/20",
  },
];

export default function Reflections() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white px-4 py-10 dark:from-slate-950 dark:to-slate-900">
      <SEO
        title="Reflections | Family Feedback Lounge"
        description="A cozy corner for the family to leave reactions on each blog section, powered by emoji shortcuts and Vercel Blob storage."
        canonicalPath="/reflections"
      />

      <div className="mx-auto max-w-5xl space-y-12">
        <header className="rounded-[30px] border border-black/5 bg-gradient-to-r from-amber-100/70 via-white to-sky-100/70 p-8 shadow-xl shadow-amber-200/40 dark:border-white/5 dark:from-slate-900/80 dark:via-slate-900/30 dark:to-sky-900/20">
          <p className="text-xs uppercase tracking-[0.5em] text-stone-500">
            Family feedback loop
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-stone-900 dark:text-white">
            Reflections Lounge
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-stone-600 dark:text-slate-200">
            Leave a love note, emoji remix, or tactical nudge for any section of
            the blog. I now pin just the most useful prompts from each Field
            Notes drop, and every submission lives in a tiny JSON note inside
            the Vercel Blob store—so it persists between visits without extra
            accounts or logins.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              to="/blog"
              className="rounded-full border border-stone-900/10 bg-white/80 px-4 py-2 font-semibold text-stone-800 shadow-sm shadow-stone-200/80 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-none"
            >
              Browse Blog
            </Link>
          </div>
        </header>

        <section className="rounded-[28px] border border-stone-200 bg-white/90 p-6 shadow-lg shadow-amber-100/80 dark:border-slate-800 dark:bg-slate-900/70">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
            Quick tutorial: how to use Reflections
          </h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-stone-600 dark:text-slate-200">
            <li>
              Scan the featured cards below—each one is a curated question from
              the latest blog post that actually needs your voice.
            </li>
            <li>
              Tap the text box or emoji picker inside the card, keep the note
              short and specific, then hit submit. It’s instantly saved and tied
              to that blog section.
            </li>
            <li>
              If your thought doesn’t match a section, drop it into the
              off-script inbox at the bottom so nothing gets lost.
            </li>
          </ol>
        </section>

        <section className="space-y-10">
          {featuredSections.map((section) => (
            <article
              key={section.sectionId}
              className={`rounded-[32px] border border-white/40 bg-gradient-to-br p-6 shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 ${section.tone}`}
            >
              <div className="mb-6 space-y-1 text-white">
                <p className="text-xs uppercase tracking-[0.4em] opacity-80">
                  {section.subtitle}
                </p>
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p className="max-w-2xl text-sm opacity-90">
                  {section.summary}
                </p>
              </div>
              <QuickForm
                postId={section.postId}
                sectionId={section.sectionId}
              />
            </article>
          ))}
        </section>

        <section className="rounded-[28px] border border-dashed border-stone-200 bg-white/80 p-6 text-center shadow-inner shadow-amber-100/70 dark:border-slate-700 dark:bg-slate-900/50">
          <h2 className="text-2xl font-semibold text-stone-800 dark:text-white">
            Off-script reflections
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-stone-500 dark:text-slate-300">
            Want to archive a family voice note, lyric, or encouragement that
            isn’t tied to a specific section? Drop it here—this inbox is just
            for the family lounge.
          </p>
          <div className="mt-6">
            <QuickForm postId="reflections" sectionId="family-lounge" />
          </div>
        </section>

      </div>
    </div>
  );
}
