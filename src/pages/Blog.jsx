import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ContentBadge from "../components/ContentBadge";
import SEO from "../components/SEO";
import SemanticSearch from "../components/SemanticSearch";
import blogPosts from "../data/blogPostsData";
import { addLastModifiedIfMissing } from "../utils/contentDates";


const Blog = () => {
  const processedPosts = useMemo(
    () => blogPosts.map(addLastModifiedIfMissing),
    [],
  );

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Latest Posts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {processedPosts.map((post, index) => (
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
