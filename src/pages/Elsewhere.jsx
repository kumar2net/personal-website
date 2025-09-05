import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import OriginalPostCallout from '../components/OriginalPostCallout';
import { trackEvent } from '../utils/analytics';

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
      <h1 className="text-4xl font-bold mb-6">Elsewhere</h1>
      <p className="text-gray-600 mb-4">
        I also write at{' '}
        <a
          className="text-blue-600 hover:text-blue-800"
          href="https://kumar2net.wordpress.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          WordPress
        </a>{' '}
        and post updates on{' '}
        <a
          className="text-blue-600 hover:text-blue-800"
          href="https://twitter.com/kumar2net"
          target="_blank"
          rel="noopener noreferrer"
        >
          X (Twitter)
        </a>
        .
      </p>

      <div className="mb-8">
        <a
          href="https://twitter.com/kumar2net"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Follow on X
        </a>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Latest on WordPress</h2>
          {loading && <div className="text-gray-500">Loading posts…</div>}
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
            <ul className="space-y-6">
              {posts.slice(0, 10).map((p) => (
                <li key={p.guid} className="bg-white p-5 rounded-xl shadow border border-gray-100">
                  <div className="flex flex-col gap-3">
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('elsewhere_post_title_click', { url: p.link })}
                      className="text-lg font-semibold text-blue-700 hover:text-blue-800"
                    >
                      {decodeEntities(p.title)}
                    </a>
                    <div className="text-sm text-gray-500">
                      {new Date(p.pubDate).toLocaleDateString()}
                    </div>
                    {p.excerpt && (
                      <p className="text-gray-700 mt-1">
                        {decodeEntities(p.excerpt)}…
                      </p>
                    )}
                    <div className="pt-2">
                      <OriginalPostCallout url={p.link} source="WordPress" compact />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <a
              href="https://kumar2net.wordpress.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View all on WordPress
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
