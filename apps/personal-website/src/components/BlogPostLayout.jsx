import React, { useRef } from "react";
import SEO from "./SEO";
import BlogAudioPlayer from "./BlogAudioPlayer";
import ChromeReaderModeNudge from "./ChromeReaderModeNudge";
import ReactionBar from "./engagement/ReactionBar";
import PromptBox from "./engagement/PromptBox";

export default function BlogPostLayout({ slug, post, children }) {
  const articleRef = useRef(null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post?.title,
    "image": post?.image,
    "datePublished": post?.datePublished,
    "dateModified": post?.dateModified,
    "author": {
      "@type": "Person",
      "name": "Your Name"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Your Website",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.kumar2.net/media/logo.png" // Replace with your logo
      }
    },
    "description": post?.description
  };

  return (
    <>
      <SEO
        title={post?.title}
        description={post?.description}
        canonicalPath={`/blog/${slug}`}
        image={post?.image}
        type="article"
        publishedTime={post?.datePublished}
        modifiedTime={post?.dateModified}
        tags={post?.tags}
      />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <main className="prose max-w-none px-4 md:px8">
        <BlogAudioPlayer slug={slug} articleRef={articleRef} />
        <ChromeReaderModeNudge slug={slug} />
        <article ref={articleRef}>
          {children}
          <div className="not-prose mt-12 space-y-4">
            <ReactionBar slug={slug} />
            <PromptBox slug={slug} />
          </div>
        </article>
      </main>
    </>
  );
}
