import React from "react";
import useCatchUpPosts from "../hooks/useCatchUpPosts";

function formatDateTime(iso) {
  if (!iso) return "Never";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Status = () => {
  const { lastCatchUpAt, newCount, newPosts, markCaughtUp } = useCatchUpPosts();

  const handleReset = () => {
    try {
      localStorage.removeItem("user_last_catchup_v1");
      window.location.reload();
    } catch (error) {
      console.warn("Status: failed to reset catch-up timestamp", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Deployment Status (Vercel)</h1>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Deployments</h2>
          <div className="flex flex-col gap-2">
            <a
              href="https://kumar2net.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Production: kumar2net.com
            </a>
            <a
              href="https://vercel.com/kumar2net/personal-website/deployments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on Vercel: Deployments
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Preview deployments are created automatically for pull requests.
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Catch-up state</h2>
          <p className="text-sm text-gray-700">
            Last marked caught up: <span className="font-medium">{formatDateTime(lastCatchUpAt)}</span>
          </p>
          <p className="text-sm text-gray-700 mt-1">
            Posts waiting to catch up: <span className="font-medium">{newCount}</span>
          </p>
          {newPosts.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {newPosts.slice(0, 5).map((post) => (
                <li key={post.slug}>
                  {post.title} — {formatDateTime((post.dateModified || post.datePublished || post.sortDate)?.toISOString?.() ?? "")}
                </li>
              ))}
              {newPosts.length > 5 && (
                <li className="text-xs text-gray-500">{newPosts.length - 5} more not shown…</li>
              )}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={markCaughtUp}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Mark as caught up
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Reset timestamp
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            The catch-up experience replaces the deprecated unread posts bell.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Status;
