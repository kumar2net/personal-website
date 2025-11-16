import React, { Suspense, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import BlogPostLayout from "../../components/BlogPostLayout";
import { getBlogSeo } from "../../data/blogIndex";
import QuickForm from "@/components/QuickForm";

const jsxModules = import.meta.glob("/src/pages/blog/*.jsx");
const mdModules = import.meta.glob("/src/pages/blog/*.md", {
  query: "?raw",
  import: "default",
});

export default function PostDynamic() {
  const { slug } = useParams();
  const [markdown, setMarkdown] = useState("");
  const postSeo = getBlogSeo(slug);

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

  if (LazyComponent) {
    return (
      <BlogPostLayout slug={slug} post={postSeo}>
        <Suspense fallback={<div>Loading…</div>}>
          <LazyComponent />
        </Suspense>
      </BlogPostLayout>
    );
  }

  if (markdown) {
    return (
      <BlogPostLayout slug={slug} post={postSeo}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        <div className="not-prose mt-8">
          <QuickForm postId={slug} sectionId="reflections" />
        </div>
      </BlogPostLayout>
    );
  }

  return <div className="text-gray-600">Post not found.</div>;
}
