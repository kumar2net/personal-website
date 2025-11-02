import React, { Suspense, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import SEO from "../../components/SEO";
import { getBlogSeo } from "../../data/blogIndex";
import { markRead, isFeatureEnabled } from "../../utils/unreadStore";

const jsxModules = import.meta.glob("/src/pages/blog/*.jsx");
const mdModules = import.meta.glob("/src/pages/blog/*.md", {
  query: "?raw",
  import: "default",
});

export default function PostDynamic() {
  const { slug } = useParams();
  const [markdown, setMarkdown] = useState("");

  const LazyComponent = useMemo(() => {
    const path = `/src/pages/blog/${slug}.jsx`;
    if (jsxModules[path]) {
      return React.lazy(jsxModules[path]);
    }
    return null;
  }, [slug]);

  useEffect(() => {
    const path = `/src/pages/blog/${slug}.md`;
    if (mdModules[path]) {
      mdModules[path]().then((raw) => setMarkdown(raw || ""));
    } else {
      setMarkdown("");
    }
  }, [slug]);

  // Dwell-based read marking: 3 seconds after page/content resolves
  useEffect(() => {
    if (!slug || !isFeatureEnabled()) return undefined;
    const t = setTimeout(() => {
      try {
        markRead(slug, { source: "auto" });
      } catch {}
    }, 3000);
    return () => clearTimeout(t);
  }, [slug]);

  if (LazyComponent) {
    return (
      <Suspense fallback={<div>Loading…</div>}>
        <SEO
          title={getBlogSeo(slug)?.title}
          description={getBlogSeo(slug)?.description}
          canonicalPath={`/blog/${slug}`}
          image={getBlogSeo(slug)?.image}
          type="article"
          publishedTime={getBlogSeo(slug)?.datePublished}
          modifiedTime={getBlogSeo(slug)?.dateModified}
          tags={getBlogSeo(slug)?.tags}
        />
        <LazyComponent />
      </Suspense>
    );
  }

  if (markdown) {
    return (
      <div className="prose max-w-none px-4 md:px-8">
        <SEO
          title={getBlogSeo(slug)?.title || slug.replace(/-/g, " ")}
          description={getBlogSeo(slug)?.description}
          canonicalPath={`/blog/${slug}`}
          image={getBlogSeo(slug)?.image}
          type="article"
          publishedTime={getBlogSeo(slug)?.datePublished}
          modifiedTime={getBlogSeo(slug)?.dateModified}
          tags={getBlogSeo(slug)?.tags}
        />
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    );
  }

  return <div className="text-gray-600">Post not found.</div>;
}
