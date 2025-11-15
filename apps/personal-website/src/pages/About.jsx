import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const skillCards = [
  { icon: "⚛️", title: "Frontend", caption: "React 18 · Framer Motion · React Router 6" },
  { icon: "🎨", title: "Styling", caption: "Tailwind CSS · MUI 7 · CSS Variables" },
  { icon: "🧠", title: "AI/LLM", caption: "OpenAI GPT-4o · Gemini · MCP agents" },
  { icon: "🧮", title: "Data/ML", caption: "Vertex AI · scikit-learn · cosine search" },
  { icon: "🛰️", title: "Networks", caption: "Wireless testbeds · IP transport" },
  { icon: "⚙️", title: "Infra", caption: "Vercel · Turbo · Netlify · CI probes" },
];

const resolveApiBase = () => {
  const configured = import.meta.env.VITE_API_BASE?.trim();
  if (configured) {
    return configured.endsWith("/") ? configured.slice(0, -1) : configured;
  }
  if (import.meta.env.PROD && typeof window !== "undefined") {
    return window.location.origin;
  }
  return null;
};

const About = () => {
  const [wpPosts, setWpPosts] = useState([]);
  const [xPosts, setXPosts] = useState([]);
  const [feedError, setFeedError] = useState("");
  const [xError, setXError] = useState("");

  const apiBase = useMemo(resolveApiBase, []);

  useEffect(() => {
    let active = true;
    if (!apiBase) {
      setFeedError("WordPress feed disabled locally.");
      return () => {
        active = false;
      };
    }

    fetch(`${apiBase}/api/wp-feed`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((data) => {
        if (!active) return;
        setWpPosts((data?.posts || []).slice(0, 3));
      })
      .catch((error) => {
        console.warn("About WP feed error:", error);
        setFeedError("Unable to load the WordPress vibe. Refresh later?");
      });

    return () => {
      active = false;
    };
  }, [apiBase]);

  useEffect(() => {
    let active = true;
    if (!apiBase) {
      setXError("X feed disabled locally.");
      return () => {
        active = false;
      };
    }

    fetch(`${apiBase}/api/x-latest?username=kumar2net`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((data) => {
        if (!active) return;
        setXPosts(Array.isArray(data?.items) ? data.items.slice(0, 3) : []);
        setXError(data?.warning || "");
      })
      .catch((error) => {
        console.warn("About X feed error:", error);
        setXError("X posts are stretching the timeline. Try again soon!");
      });

    return () => {
      active = false;
    };
  }, [apiBase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8 space-y-12"
    >
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-500">
          Hello Gen Z & Gen AI curious folks 👋
        </p>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          I run kumar2net.com like a personal control tower for agents, feeds,
          and shipping ideas.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-200 leading-relaxed">
          Telecom-tested. AI-obsessed. I started in wireless test beds and now I
          obsess over Model Context Protocol, LLM agents, and making them useful
          for everyday shipping. This site is wired for experiments—from
          WordPress cross-posts to live X updates, semantic search powered by
          Gemini embeddings, and OpenAI-powered TL;DRs. Everything you read is
          stitched together in public.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Indexed everywhere</h2>
          <p className="text-slate-600 dark:text-slate-200 mb-4">
            Google & Bing pull from{" "}
            <a
              className="text-blue-600 dark:text-blue-400 underline decoration-dotted"
              href="https://www.kumar2net.com/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
            >
              sitemap.xml
            </a>{" "}
            multiple times a day. Every story ships with structured metadata so
            it lands in Discover, Bing AI, and your favourite reader.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              <span>Primary domain: kumar2net.com (Vercel auto SSL)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              <span>Mirror feeds: WordPress + X (restreamed below)</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Stack cheat sheet</h2>
          <p className="text-slate-600 dark:text-slate-200 mb-4">
            Real tools instead of novelty shields. Here&apos;s the ground truth.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {skillCards.map((card) => (
              <div
                key={card.title}
                className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 p-3 shadow-sm"
              >
                <div className="text-2xl">{card.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {card.title}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    {card.caption}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-600 font-semibold">WordPress feed</span>
            <span className="text-xs uppercase tracking-wide text-slate-500">
              kumar2net.wordpress.com
            </span>
          </div>
          {feedError ? (
            <p className="text-sm text-rose-500">{feedError}</p>
          ) : wpPosts.length === 0 ? (
            <p className="text-sm text-slate-500">Loading highlights…</p>
          ) : (
            <ul className="space-y-4">
              {wpPosts.map((post) => (
                <li key={post.guid}>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {post.title}
                  </a>
                  <p className="text-sm text-slate-500 italic">
                    {new Date(post.pubDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-200 line-clamp-3">
                    {post.excerpt || "Fresh drop from the WP vault."}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-slate-800 dark:text-slate-100 font-semibold">
              X timeline
            </span>
            <span className="text-xs uppercase tracking-wide text-slate-500">
              @kumar2net
            </span>
          </div>
          {xError ? (
            <p className="text-sm text-rose-500">{xError}</p>
          ) : xPosts.length === 0 ? (
            <p className="text-sm text-slate-500">Booting up the X timeline…</p>
          ) : (
            <ul className="space-y-4">
              {xPosts.map((tweet) => (
                <li
                  key={tweet.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 shadow-inner"
                >
                  <p className="text-sm text-slate-500 mb-2">
                    {new Date(tweet.created_at).toLocaleString()}
                  </p>
                  <p className="text-slate-700 dark:text-slate-100 whitespace-pre-line">
                    {tweet.text}
                  </p>
                  <a
                    href={tweet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400"
                  >
                    View on X →
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 text-slate-100 p-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-3">
          LLM Ops, bold and transparent
        </h2>
        <p className="text-base leading-relaxed text-slate-200">
          The site is agent-ready: Model Context Protocol (MCP) aware, semantic
          search via Gemini&apos;s{" "}
          <span className="font-semibold">text-embedding-004</span>, TL;DR
          summaries via{" "}
          <span className="font-semibold">OpenAI GPT-4o mini</span>, and
          WordPress/X feeds proxied through custom serverless handlers. You&apos;ll see agents cited in
          blog posts, CLI workflows documented in docs/, and a running changelog
          on the Status page. Ask me anything on{" "}
          <a
            href="https://x.com/kumar2net"
            className="underline decoration-dotted text-blue-300 hover:text-blue-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </a>{" "}
          or respond via the contact form—I ship in public so you can follow the
          entire experiment.
        </p>
      </section>
    </motion.div>
  );
};

export default About;
