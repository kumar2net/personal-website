import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ContentBadge from "../components/ContentBadge";
import SEO from "../components/SEO";
import SemanticSearch from "../components/SemanticSearch";
import blogPosts from "../data/blogPostsData";
import { addLastModifiedIfMissing } from "../utils/contentDates";
import useCatchUpPosts from "../hooks/useCatchUpPosts";
import { HiCheckCircle, HiOutlineNewspaper } from "react-icons/hi";

function stripSlashes(value) {
  if (!value) return "";
  return value.replace(/^\/+|\/+$/g, "");
}

function getSlugTokens(value) {
  const normalized = stripSlashes(value);
  if (!normalized) return [];
  const withBlog = normalized.startsWith("blog/") ? normalized : `blog/${normalized}`;
  const withoutBlog = normalized.startsWith("blog/")
    ? normalized.slice(5)
    : normalized;
  return [withBlog.toLowerCase(), withoutBlog.toLowerCase()];
}

function toBlogLink(slug) {
  const normalized = stripSlashes(slug);
  if (!normalized) return "/blog";
  if (normalized.startsWith("blog/")) {
    return `/${normalized}`;
  }
  return `/blog/${normalized}`;
}

function formatDateForList(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


const Blog = () => {
  const processedPosts = useMemo(
    () => blogPosts.map(addLastModifiedIfMissing),
    [],
  );
  const { newPosts, newCount, markCaughtUp } = useCatchUpPosts();
  const [showNewOnly, setShowNewOnly] = useState(false);

  const newPostSlugSet = useMemo(() => {
    const set = new Set();
    newPosts.forEach((post) => {
      const tokens = Array.isArray(post.slugTokens) && post.slugTokens.length > 0
        ? post.slugTokens
        : getSlugTokens(post.slug);
      tokens.forEach((token) => set.add(token));
    });
    return set;
  }, [newPosts]);

  const visiblePosts = useMemo(() => {
    if (!showNewOnly) return processedPosts;
    return processedPosts.filter((post) => {
      const tokens = getSlugTokens(post.link);
      return tokens.some((token) => newPostSlugSet.has(token));
    });
  }, [processedPosts, showNewOnly, newPostSlugSet]);

  const previewPosts = useMemo(() => newPosts.slice(0, 4), [newPosts]);

  const handleMarkCaughtUp = () => {
    markCaughtUp();
    setShowNewOnly(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SEO
        title="Blog"
        description="Latest posts on technology, learning, notes, and personal writing."
        canonicalPath="/blog"
        type="website"
      />
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <SemanticSearch />
      {newCount > 0 ? (
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-base font-semibold text-blue-900">
                <HiOutlineNewspaper className="h-5 w-5" />
                Catch up on {newCount} new post{newCount === 1 ? "" : "s"}
              </p>
              <p className="text-sm text-blue-800">
                These posts were published since your last catch-up session.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowNewOnly((prev) => !prev)}
                className="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                {showNewOnly ? "Show all posts" : "View new posts"}
              </button>
              <button
                type="button"
                onClick={handleMarkCaughtUp}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                Mark as caught up
              </button>
            </div>
          </div>
          {previewPosts.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {previewPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={post.href ?? toBlogLink(post.slug)}
                  className="rounded-lg border border-blue-200 bg-white/70 px-3 py-2 text-left shadow-sm hover:border-blue-400 hover:bg-white"
                >
                  <div className="text-sm font-semibold text-blue-900 line-clamp-2">{post.title}</div>
                  <div className="text-xs text-blue-700">
                    {formatDateForList(post.dateModified || post.datePublished || post.sortDate)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <HiCheckCircle className="h-5 w-5" />
          <div>
            <p className="font-semibold">You're all caught up</p>
            <p className="text-sm">We'll highlight new posts here when they arrive.</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Latest Posts</h2>
        {showNewOnly && (
          <button
            type="button"
            onClick={() => setShowNewOnly(false)}
            className="rounded-full border border-blue-200 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            Showing new posts • View all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visiblePosts.map((post, index) => (
          <motion.div
            key={post.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                loading="lazy"
                decoding="async"
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                style={
                  post.title ===
                  "A Sobering Week: Reflections on Loss, Life, and Learning"
                    ? {
                        objectPosition: "center 30%",
                      }
                    : {}
                }
              />
              {(() => {
                const tokens = getSlugTokens(post.link);
                const isNew = tokens.some((token) => newPostSlugSet.has(token));
                if (!isNew) return null;
                return (
                  <span className="absolute top-2 left-2 rounded bg-blue-600 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    New
                  </span>
                );
              })()}
              <ContentBadge
                publishDate={post.date}
                lastModified={post.lastModified}
              />
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">
                <Link to={post.link}>{post.title}</Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="mt-3">
                <Link
                  to={post.link}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  aria-label={`Read more: ${post.title}`}
                >
                  Read more
                </Link>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {post.date}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {showNewOnly && visiblePosts.length === 0 && (
        <p className="mt-6 text-sm text-gray-600">No new posts to show right now. You're all caught up!</p>
      )}

      <div className="mt-12 text-center">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          aria-label="Load more blog posts"
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default Blog;
