import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const endpoint =
  import.meta.env.VITE_SEMANTIC_SEARCH_ENDPOINT?.trim() ||
  "/api/semantic-search";

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState({ tookMs: 0, provider: "" });

  const canSearch = useMemo(
    () => query.trim().length > 0 && !loading,
    [query, loading],
  );

  const onSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!canSearch) {
        return;
      }
      setLoading(true);
      setError("");
      setResults([]);
      setMeta({ tookMs: 0, provider: "" });
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: query.trim(),
            topK: Math.max(1, Math.min(10, Number(topK) || 5)),
          }),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        const data = await res.json();
        setResults(Array.isArray(data?.results) ? data.results : []);
        setMeta({
          tookMs: Number(data?.tookMs || 0),
          provider: data?.provider || "",
        });
      } catch (err) {
        setError(
          typeof err?.message === "string" ? err.message : "Search failed",
        );
      } finally {
        setLoading(false);
      }
    },
    [canSearch, query, topK],
  );

  return (
    <div className="mb-10 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm text-gray-900 dark:text-slate-100">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 md:flex-row md:items-center"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts semantically (try: india usa trade gap)"
          className="flex-1 rounded border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300" htmlFor="topk">
            Top K
          </label>
          <input
            id="topk"
            type="number"
            min={1}
            max={10}
            value={topK}
            onChange={(e) => setTopK(e.target.value)}
            className="w-20 rounded border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 px-2 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!canSearch}
          className={`rounded px-4 py-2 text-white ${canSearch ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400" : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"}`}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && (
        <div className="mt-3 rounded border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs text-gray-500 dark:text-gray-300">
            <span>Found {results.length}</span>
            {meta.tookMs ? (
              <span className="ml-2">in {meta.tookMs} ms</span>
            ) : null}
            {meta.provider ? (
              <span className="ml-2">via {meta.provider}</span>
            ) : null}
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-slate-800 rounded border border-gray-200 dark:border-slate-800">
            {results.map((r) => (
              <li key={r.id} className="p-3 hover:bg-gray-50 dark:hover:bg-slate-800">
                <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
                  <Link to={r.url} className="hover:text-blue-600">
                    {r.title || r.id}
                  </Link>
                </div>
                {r.excerpt ? (
                  <div className="text-sm text-gray-600 dark:text-gray-300">{r.excerpt}</div>
                ) : null}
                <div className="mt-1 text-xs text-gray-400 dark:text-gray-400">
                  score:{" "}
                  {typeof r.score === "number" ? r.score.toFixed(4) : r.score}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
