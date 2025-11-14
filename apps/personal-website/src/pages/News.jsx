import { useMemo, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { HiArrowTrendingDown, HiArrowTrendingUp } from "react-icons/hi2";
import newsFeed from "../../../news/content/feed.json";

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

function formatRelativeTime(isoString) {
  if (!isoString) return null;

  const publishedDate = new Date(isoString);
  if (Number.isNaN(publishedDate.getTime())) {
    return null;
  }

  const now = new Date();
  const diffMs = publishedDate.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (Math.abs(diffMinutes) < 60) {
    return relativeTimeFormatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return relativeTimeFormatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return relativeTimeFormatter.format(diffDays, "day");
}

function formatTime(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function WatchlistBadge({ instrument }) {
  const Icon =
    instrument.direction === "down" ? HiArrowTrendingDown : HiArrowTrendingUp;
  const directionClass =
    instrument.direction === "down"
      ? "text-red-600 bg-red-50"
      : "text-emerald-600 bg-emerald-50";

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {instrument.label}
      </div>
      <div className="text-2xl font-bold text-gray-900">{instrument.value}</div>
      <div
        className={`flex items-center gap-2 w-fit rounded-full px-2 py-1 text-sm font-medium ${directionClass}`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        {instrument.change}
      </div>
    </div>
  );
}

function NewsCard({ item }) {
  const publishedAt = formatTime(item.publishedAt);
  const relative = formatRelativeTime(item.publishedAt);

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-sm font-semibold text-sky-700">
          <span>{item.source}</span>
          {item.tag ? (
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
              {item.tag}
            </span>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
        {item.summary ? (
          <p className="text-sm text-slate-600">{item.summary}</p>
        ) : null}
        {item.tags && item.tags.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-600"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
        <div className="flex flex-col">
          {publishedAt ? <span>{publishedAt}</span> : null}
          {relative ? <span className="text-xs">{relative}</span> : null}
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-700 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        >
          Open
          <FaExternalLinkAlt className="h-3 w-3 transition group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}

export default function News() {
  const sections = newsFeed.sections ?? [];
  const [activeSectionId, setActiveSectionId] = useState(
    sections[0]?.id ?? null,
  );

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeSectionId) ?? null,
    [activeSectionId, sections],
  );

  const lastUpdated = formatTime(newsFeed.updatedAt);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">News Desk</h1>
          <p className="mt-2 max-w-3xl text-base text-slate-600">
            A focused start page for the stories, data, and tools I monitor each
            morning. The feed is maintained inside the monorepo under
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-sm">
              apps/news
            </code>
            so deployments ship alongside the personal site.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-700">Last refresh</span>
          {lastUpdated ? <span>{lastUpdated}</span> : null}
          {newsFeed.updatedAt ? (
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
              Source of truth: apps/news/content/feed.json
            </span>
          ) : null}
        </div>
      </header>

      {newsFeed.headline ? (
        <section className="mb-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
            {newsFeed.headline.tag ?? "Spotlight"}
          </p>
          <h2 className="text-2xl font-semibold text-amber-900">
            {newsFeed.headline.title}
          </h2>
          {newsFeed.headline.summary ? (
            <p className="mt-3 text-base text-amber-800">
              {newsFeed.headline.summary}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-amber-800">
            {newsFeed.headline.source ? (
              <span className="font-semibold">{newsFeed.headline.source}</span>
            ) : null}
            {newsFeed.headline.publishedAt ? (
              <span>{formatTime(newsFeed.headline.publishedAt)}</span>
            ) : null}
            <a
              href={newsFeed.headline.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-sm font-semibold text-amber-800 transition hover:border-amber-400 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              Read spotlight
              <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </section>
      ) : null}

      {sections.length ? (
        <section className="mb-12">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const isActive = section.id === activeSectionId;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSectionId(section.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-sky-500 bg-sky-100 text-sky-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700"
                  }`}
                >
                  {section.title}
                </button>
              );
            })}
          </div>

          {activeSection ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <p className="text-sm text-slate-500">
                  {activeSection.summary}
                </p>
              </div>
              {activeSection.items.map((item) => (
                <NewsCard key={`${activeSection.id}-${item.title}`} item={item} />
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              Choose a briefing to load curated reading lists.
            </p>
          )}
        </section>
      ) : null}

      {Array.isArray(newsFeed.watchlist) && newsFeed.watchlist.length ? (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900">
            Market Watchlist
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Snapshot pulled together from NSE, MCX, and currency dashboards.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newsFeed.watchlist.map((instrument) => (
              <WatchlistBadge key={instrument.label} instrument={instrument} />
            ))}
          </div>
        </section>
      ) : null}

      {Array.isArray(newsFeed.quickLinks) && newsFeed.quickLinks.length ? (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900">
            Quick Links
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {newsFeed.quickLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-sky-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <span className="text-sm font-semibold text-sky-700">
                  {link.category}
                </span>
                <span className="text-lg font-semibold text-slate-900">
                  {link.title}
                </span>
                {link.summary ? (
                  <span className="text-sm text-slate-600">{link.summary}</span>
                ) : null}
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700">
                  Visit resource
                  <FaExternalLinkAlt
                    className="h-3 w-3 transition group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {Array.isArray(newsFeed.audioBriefings) &&
      newsFeed.audioBriefings.length ? (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900">
            Listen while scanning the headlines
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {newsFeed.audioBriefings.map((audio) => (
              <a
                key={audio.url}
                href={audio.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left transition hover:border-sky-400 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {audio.source}
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {audio.title}
                  </p>
                  {audio.duration ? (
                    <p className="text-xs text-slate-500">{audio.duration}</p>
                  ) : null}
                </div>
                <FaExternalLinkAlt
                  className="h-4 w-4 text-slate-500 transition group-hover:text-sky-600"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
        <p>
          Built as a lightweight curation layer. Every deployment rebuilds the
          static dataset in <code>apps/news</code>, so /news stays in sync with
          the dedicated workspace. If the embed ever fails, open the raw feed in
          a new tab:
        </p>
        <p className="mt-3 inline-flex items-center gap-2 font-semibold text-sky-700">
          <a
            href={newsFeed.fallback?.url ?? "https://impnews.netlify.app/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-white px-3 py-1.5 transition hover:border-sky-400 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            {newsFeed.fallback?.label ?? "Open the IMP News microsite"}
            <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
          </a>
        </p>
      </footer>
    </div>
  );
}
