import { useMemo } from "react";
import { Link } from "react-router-dom";
import semanticIndex from "../data/semantic-index.json";

const EMBEDDING_DIM = Number(semanticIndex?.embeddingDim) || 768;
const documents = Array.isArray(semanticIndex?.items) ? semanticIndex.items : [];

function normalizeId(value) {
  if (!value) {
    return null;
  }
  return value
    .toString()
    .trim()
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/+/, "")
    .replace(/^blog\//, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

function resolvePermalink(item) {
  if (!item) {
    return null;
  }

  const rawUrl = typeof item.url === "string" ? item.url.trim() : "";
  if (rawUrl) {
    if (/^https?:\/\//i.test(rawUrl)) {
      return rawUrl;
    }
    if (rawUrl.startsWith("/")) {
      return rawUrl;
    }
    return `/${rawUrl.replace(/^\/+/, "")}`;
  }

  const normalizedId = normalizeId(item.id || item.title);
  if (!normalizedId) {
    return null;
  }
  return `/blog/${normalizedId}`;
}

function createLinkMetadata(item) {
  const permalink = resolvePermalink(item);
  if (!permalink) {
    return {
      Component: "div",
      props: {
        role: "article",
        "aria-disabled": true,
      },
      permalink: null,
    };
  }

  if (/^https?:\/\//i.test(permalink)) {
    return {
      Component: "a",
      props: {
        href: permalink,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      permalink,
    };
  }

  return {
    Component: Link,
    props: {
      to: permalink,
    },
    permalink,
  };
}

function computeNorm(vector) {
  if (!Array.isArray(vector)) {
    return 0;
  }
  return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
}

function dotProduct(a, b) {
  let total = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    total += a[i] * b[i];
  }
  return total;
}

const preparedDocuments = documents
  .filter((item) => Array.isArray(item?.vector) && item.vector.length === EMBEDDING_DIM)
  .map((item) => {
    const vector = item.vector.map((value) => Number(value) || 0);
    const norm = typeof item.norm === "number" ? item.norm : computeNorm(vector);
    return {
      id: item.id,
      title: item.title,
      url: item.url,
      excerpt: item.excerpt,
      vector,
      norm,
    };
  });

const docLookup = new Map();
const titleLookup = new Map();
preparedDocuments.forEach((doc) => {
  const normalizedId = normalizeId(doc.id);
  if (normalizedId && !docLookup.has(normalizedId)) {
    docLookup.set(normalizedId, doc);
  }
  const normalizedUrl = normalizeId(doc.url);
  if (normalizedUrl && !docLookup.has(normalizedUrl)) {
    docLookup.set(normalizedUrl, doc);
  }
  if (doc.title) {
    const titleKey = doc.title.toLowerCase();
    if (!titleLookup.has(titleKey)) {
      titleLookup.set(titleKey, doc);
    }
  }
});

const MAX_RESULTS = 4;

function formatScore(score) {
  if (!Number.isFinite(score)) {
    return null;
  }
  return Math.round(score * 100);
}

export default function RelatedPostsCard({ slug, post, limit = MAX_RESULTS }) {
  const normalizedSlug = useMemo(() => normalizeId(slug), [slug]);
  const normalizedTitle = useMemo(() => post?.title?.toLowerCase() || null, [post?.title]);

  const currentDoc = useMemo(() => {
    if (normalizedSlug && docLookup.has(normalizedSlug)) {
      return docLookup.get(normalizedSlug);
    }
    if (post?.canonicalPath) {
      const canonicalId = normalizeId(post.canonicalPath);
      if (canonicalId && docLookup.has(canonicalId)) {
        return docLookup.get(canonicalId);
      }
    }
    if (normalizedTitle && titleLookup.has(normalizedTitle)) {
      return titleLookup.get(normalizedTitle);
    }
    return null;
  }, [normalizedSlug, normalizedTitle, post?.canonicalPath]);

  const relatedPosts = useMemo(() => {
    if (!currentDoc) {
      return [];
    }
    const recommendations = [];
    for (const candidate of preparedDocuments) {
      if (candidate.id === currentDoc.id) {
        continue;
      }
      const denom = (currentDoc.norm || 1) * (candidate.norm || 1);
      const score = denom === 0 ? 0 : dotProduct(currentDoc.vector, candidate.vector) / denom;
      recommendations.push({
        ...candidate,
        score,
      });
    }
    recommendations.sort((a, b) => b.score - a.score);
    return recommendations.slice(0, Math.max(1, Math.min(limit, MAX_RESULTS)));
  }, [currentDoc, limit]);

  const showFallback = !currentDoc || relatedPosts.length === 0;

  return (
    <section className="not-prose mt-12">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:shadow-lg/10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Semantic picks
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Related posts
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
            {preparedDocuments.length} indexed
          </span>
        </div>

        {showFallback ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {currentDoc
              ? "We're still crunching the embeddings for this story. Check back soon for related reads."
              : "This post hasn't been added to the semantic index yet."}
          </p>
        ) : (
          <ul className="space-y-3">
            {relatedPosts.map((item) => {
              const linkMeta = createLinkMetadata(item);
              const LinkComponent = linkMeta.Component;
              const disabled = !linkMeta.permalink;
              const title = item.title || item.id;

              return (
                <li key={item.id}>
                  <LinkComponent
                    {...linkMeta.props}
                    className={`group block rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ring-offset-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-lg/10 dark:ring-offset-slate-950 ${
                      disabled
                        ? "cursor-not-allowed opacity-60"
                        : "hover:border-blue-200 hover:shadow-md dark:hover:border-blue-400"
                    }`}
                    aria-label={disabled ? undefined : `Open ${title}`}
                    title={disabled ? undefined : title}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-400">
                          {title}
                        </p>
                        {item.excerpt && (
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                      {Number.isFinite(item.score) && (
                        <div className="shrink-0 text-right text-xs text-slate-500 dark:text-slate-400">
                          <p className="font-semibold text-blue-600 dark:text-blue-400">
                            {formatScore(item.score)}%
                          </p>
                          <p className="text-slate-400 dark:text-slate-500">match</p>
                        </div>
                      )}
                    </div>
                  </LinkComponent>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
