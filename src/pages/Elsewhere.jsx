import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TwitterTimeline from '../components/TwitterTimeline';
import SEO from '../components/SEO';

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
    fetch('/.netlify/functions/wp-feed')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed to load feed'))))
      .then((data) => {
        if (!active) return;
        setPosts(data?.posts || []);
      })
      .catch((e) => setError(e.message))
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
      <p className="text-gray-600 mb-8">
        I also write at{' '}
        <a className="text-blue-600 hover:text-blue-800" href="https://kumar2net.wordpress.com/" target="_blank" rel="noopener noreferrer">
          WordPress
        </a>{' '}
        and post updates on{' '}
        <a className="text-blue-600 hover:text-blue-800" href="https://twitter.com/kumar2net" target="_blank" rel="noopener noreferrer">
          X (Twitter)
        </a>
        .
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Latest on WordPress</h2>
          {loading && <div className="text-gray-500">Loading posts…</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && (
            <ul className="space-y-4">
              {posts.slice(0, 10).map((p) => (
                <li key={p.guid} className="bg-white p-4 rounded-lg shadow">
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-700 hover:text-blue-800">
                    {decodeEntities(p.title)}
                  </a>
                  <div className="text-sm text-gray-500">{new Date(p.pubDate).toLocaleDateString()}</div>
                  {p.excerpt && <p className="text-gray-700 mt-2">{decodeEntities(p.excerpt)}…</p>}
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

        <section>
          <h2 className="text-2xl font-semibold mb-4">On X (Twitter)</h2>
          <TwitterTimeline username="kumar2net" height={700} />
        </section>
      </div>

      <div className="mt-10">
        <Link to="/blog" className="text-blue-600 hover:text-blue-800">← Back to Blog</Link>
      </div>
    </div>
  );
}


