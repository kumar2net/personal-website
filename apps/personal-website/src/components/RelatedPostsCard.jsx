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
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Semantic picks</p>
            <h3 className="text-lg font-semibold text-slate-900">Related posts</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {preparedDocuments.length} indexed
          </span>
        </div>

        {showFallback ? (
          <p className="text-sm text-slate-600">
            {currentDoc
              ? "We're still crunching the embeddings for this story. Check back soon for related reads."
              : "This post hasn't been added to the semantic index yet."}
          </p>
        ) : (
          <ul className="space-y-3">
            {relatedPosts.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.url}
                  className="group block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 group-hover:text-blue-600">
                        {item.title || item.id}
                      </p>
                      {item.excerpt && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.excerpt}</p>
                      )}
                    </div>
                    {Number.isFinite(item.score) && (
                      <div className="shrink-0 text-right text-xs text-slate-500">
                        <p className="font-semibold text-blue-600">
                          {formatScore(item.score)}%
                        </p>
                        <p>match</p>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
