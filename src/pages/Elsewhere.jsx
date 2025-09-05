import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ExternalLink, ArrowUpRight, BookOpen, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { FaWordpress } from 'react-icons/fa';

export default function Elsewhere() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const decodeEntities = (input) => {
    if (!input) return '';
    const el = document.createElement('div');
    el.innerHTML = input;
    return el.textContent || el.innerText || '';
  };

  useEffect(() => {
    let active = true;
    // Use Netlify dev server in development, production path in production
    const isDev =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    const feedUrl = isDev
      ? `${window.location.protocol}//${window.location.hostname}:8888/.netlify/functions/wp-feed`
      : '/.netlify/functions/wp-feed';

    fetch(feedUrl)
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}: Failed to load feed`);
        }

        const contentType = r.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await r.text();
          console.error('Non-JSON response received:', text.substring(0, 200));
          throw new Error('Server returned non-JSON response');
        }

        return r.json();
      })
      .then((data) => {
        if (!active) return;
        setPosts(data?.posts || []);
      })
      .catch((e) => {
        console.error('WordPress feed error:', e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SEO
        title="Elsewhere"
        description="Follow my writing on WordPress and updates on X (Twitter)."
        canonicalPath="/elsewhere"
        type="website"
      />
      
      {/* Add animation styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
        }
        
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      `}</style>
      
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Elsewhere
      </h1>
      <p className="text-gray-600 mb-6 text-lg leading-relaxed">
        I also write at{' '}
        <a
          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 transition-colors duration-200"
          href="https://kumar2net.wordpress.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWordpress className="w-4 h-4" />
          WordPress
        </a>{' '}
        and post updates on{' '}
        <a
          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 transition-colors duration-200"
          href="https://twitter.com/kumar2net"
          target="_blank"
          rel="noopener noreferrer"
        >
          X (Twitter)
          <ExternalLink className="w-3 h-3" />
        </a>
        .
      </p>

      <div className="mb-8 flex gap-4">
        <a
          href="https://twitter.com/kumar2net"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Follow on X
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Latest on WordPress</h2>
          {loading && (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="shimmer h-7 w-3/4 rounded-lg bg-gray-200"></div>
                    <div className="shimmer h-5 w-20 rounded bg-gray-200"></div>
                  </div>
                  <div className="shimmer h-4 w-32 rounded bg-gray-200 mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="shimmer h-4 w-full rounded bg-gray-200"></div>
                    <div className="shimmer h-4 w-5/6 rounded bg-gray-200"></div>
                    <div className="shimmer h-4 w-4/6 rounded bg-gray-200"></div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="shimmer h-5 w-48 rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-yellow-800">
                <strong>Unable to load latest posts:</strong> {error}
              </div>
              <div className="text-sm text-yellow-700 mt-2">
                You can still visit the WordPress site directly using the link
                below.
              </div>
            </div>
          )}
          {!loading && !error && posts.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-gray-600">
                No recent posts available at the moment.
              </div>
            </div>
          )}
          {!loading && !error && posts.length > 0 && (
            <div className="space-y-6">
              {posts.slice(0, 10).map((p, index) => (
                <article 
                  key={p.guid} 
                  className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Decorative gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 relative"
                  >
                    {/* WordPress badge */}
                    <div className="absolute top-6 right-6 flex items-center gap-2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                      <FaWordpress className="w-5 h-5" />
                      <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider">WordPress</span>
                    </div>
                    
                    {/* Title with hover effect */}
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 pr-12 sm:pr-32 mb-3">
                      {decodeEntities(p.title)}
                    </h3>
                    
                    {/* Date with icon */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={p.pubDate}>
                        {new Date(p.pubDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </time>
                    </div>
                    
                    {/* Excerpt */}
                    {p.excerpt && (
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {decodeEntities(p.excerpt)}…
                      </p>
                    )}
                    
                    {/* Elegant CTA with animation */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-gray-100 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-200">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm">Click to read the original post</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-blue-600 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                      </div>
                      
                      {/* Animated indicator */}
                      <div className="flex items-center gap-2 sm:justify-end">
                        <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:inline">
                          Opens in new tab
                        </span>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Sparkle effect for new posts (within 7 days) */}
                    {new Date() - new Date(p.pubDate) < 7 * 24 * 60 * 60 * 1000 && (
                      <div className="absolute top-4 left-4 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        NEW
                      </div>
                    )}
                  </a>
                </article>
              ))}
            </div>
          )}
          <div className="mt-8 flex justify-center">
            <a
              href="https://kumar2net.wordpress.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaWordpress className="w-5 h-5" />
              <span className="font-medium">View all posts on WordPress</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>
        </section>
      </div>

      <div className="mt-10 flex justify-between text-sm">
        <Link to="/blog" className="text-blue-600 hover:text-blue-800">
          ← Back to Blog
        </Link>
        <Link to="/" className="text-gray-600 hover:text-gray-800">
          Home
        </Link>
      </div>
    </div>
  );
}
