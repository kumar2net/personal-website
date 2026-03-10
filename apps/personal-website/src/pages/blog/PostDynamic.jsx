import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogPostLayout from "../../components/BlogPostLayout";
import { getBlogPostSeo } from "../../data/blogRegistry";

const jsxModules = import.meta.glob("/src/pages/blog/*.jsx");

const pathToSlug = (filePath) => {
  const match = filePath.match(/\/([^/]+)\.jsx$/);
  return match ? match[1] : null;
};

const availableSlugs = Object.keys(jsxModules).map(pathToSlug).filter(Boolean);

const datedSlugMap = availableSlugs.reduce((acc, slug) => {
  const match = slug.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
  if (match && !acc[match[1]]) {
    acc[match[1]] = slug;
  }
  return acc;
}, {});

export default function PostDynamic() {
  const navigate = useNavigate();
  const { slug: rawSlug } = useParams();
  const slug = datedSlugMap[rawSlug] || rawSlug;
  const shouldRedirect = slug !== rawSlug;
  const [postSeo, setPostSeo] = useState(() => getBlogPostSeo(slug));

  useEffect(() => {
    if (shouldRedirect) {
      navigate(`/blog/${slug}`, { replace: true });
    }
  }, [shouldRedirect, slug, navigate]);

  useEffect(() => {
    let cancelled = false;
    const fallbackSeo = getBlogPostSeo(slug);
    setPostSeo(fallbackSeo);

    const path = `/src/pages/blog/${slug}.jsx`;
    if (!jsxModules[path]) {
      return () => {
        cancelled = true;
      };
    }

    jsxModules[path]()
      .then((mod) => {
        if (cancelled) return;
        const metadata = mod?.metadata;
        if (!metadata || typeof metadata !== "object") {
          return;
        }
        setPostSeo({
          ...fallbackSeo,
          title: metadata.title || fallbackSeo?.title,
          description:
            metadata.description ||
            metadata.excerpt ||
            fallbackSeo?.description,
          image: metadata.image || fallbackSeo?.image,
          tags: Array.isArray(metadata.tags)
            ? metadata.tags
            : fallbackSeo?.tags,
          datePublished:
            metadata.datePublished || fallbackSeo?.datePublished,
          dateModified:
            metadata.dateModified || fallbackSeo?.dateModified,
          readingTime: metadata.readingTime || fallbackSeo?.readingTime,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setPostSeo(fallbackSeo);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const LazyComponent = useMemo(() => {
    const path = `/src/pages/blog/${slug}.jsx`;
    if (jsxModules[path]) {
      return React.lazy(jsxModules[path]);
    }
    return null;
  }, [slug]);

  if (shouldRedirect) {
    return null;
  }

  if (LazyComponent) {
    return (
      <BlogPostLayout slug={slug} post={postSeo}>
        <Suspense fallback={<div>Loading…</div>}>
          <LazyComponent />
        </Suspense>
      </BlogPostLayout>
    );
  }

  return <div className="text-gray-600">Post not found.</div>;
}
