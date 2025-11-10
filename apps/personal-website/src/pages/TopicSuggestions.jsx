import { useEffect, useMemo, useState } from 'react';

function getBackendBaseUrl() {
  // In Netlify dev, everything proxies through 8888
  if (typeof window !== 'undefined') {
    const { origin } = window.location;
    // If running vite on 5173, backend likely on 3001
    if (origin.includes(':5173')) return 'http://localhost:3001';
    return origin;
  }
  return '';
}

function TopicCard({ topic }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
      {topic.rationale && (
        <p className="mt-2 text-gray-700">{topic.rationale}</p>
      )}
      {Array.isArray(topic.keywords) && topic.keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {topic.keywords.slice(0, 6).map((kw, idx) => (
            <span key={idx} className="px-2 py-1 text-xs bg-gray-100 rounded">
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopicSuggestions() {
  const [days, setDays] = useState(21);
  const [limit, setLimit] = useState(4);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({ topics: [], inputs: {} });

  const apiUrl = useMemo(() => {
    const base = getBackendBaseUrl();
    const u = new URL('/api/recommendations/topics', base);
    u.searchParams.set('days', String(days));
    u.searchParams.set('limit', String(limit));
    u.searchParams.set('language', language);
    return u.toString();
  }, [days, limit, language]);

  async function fetchTopics({ noCache } = {}) {
    setLoading(true);
    setError('');
    try {
      const url = new URL(apiUrl);
      if (noCache) url.searchParams.set('no_cache', 'true');
      const res = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json?.data || { topics: [] });
    } catch (e) {
      setError(e?.message || 'Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Topic Suggestions</h1>
        <p className="text-gray-600">Blog topics based on recent GA4 activity.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-700">Days</label>
          <select
            className="mt-1 w-full border rounded px-2 py-1"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            {[7, 14, 21, 30, 60, 90].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Limit</label>
          <select
            className="mt-1 w-full border rounded px-2 py-1"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {[3, 4, 5, 6, 8, 10].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Language</label>
          <select
            className="mt-1 w-full border rounded px-2 py-1"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {['en', 'hi', 'ta'].map((lng) => (
              <option key={lng} value={lng}>{lng}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => fetchTopics()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
          <button
            onClick={() => fetchTopics({ noCache: true })}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
            disabled={loading}
            title="Bypass backend cache"
          >
            Force Update
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {Array.isArray(data.topics) && data.topics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.topics.slice(0, limit).map((t, idx) => (
            <TopicCard key={idx} topic={t} />
          ))}
        </div>
      ) : (
        <div className="text-gray-600">
          {loading ? 'Fetching topics…' : 'No topics available yet. Ensure GA4 → BigQuery export is active.'}
        </div>
      )}
    </div>
  );
}






