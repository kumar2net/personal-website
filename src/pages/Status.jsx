import React, { useEffect, useState } from "react";
import { isFeatureEnabled, setLocalOn } from "../utils/unreadStore";

const Status = () => {
  const [localFlag, setLocalFlag] = useState("unknown");
  const envFlag = (import.meta?.env?.VITE_FEATURE_UNREAD ?? "unset").toString();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("feature_unread_v1");
      setLocalFlag(v ?? "unset");
    } catch (e) {
      console.warn("Status: read localStorage error", e);
      setLocalFlag("unavailable");
    }
    setEnabled(isFeatureEnabled());
  }, []);

  const setLocal = (val) => {
    try {
      // Use shared store helper to keep behavior consistent
      setLocalOn(val === "on");
      setLocalFlag(val);
      // Recompute enabled immediately so users don't need to reload
      setEnabled(isFeatureEnabled());
      // Notify listeners similarly to other storage updates
      try {
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.warn("Status: dispatch storage event error", e);
      }
    } catch (e) {
      // best-effort: localStorage may be unavailable
      console.warn("Status: setLocal error", e);
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
          <h2 className="text-lg font-semibold mb-2">Unread Feature Flags</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <div>Env flag (Vercel): <code>VITE_FEATURE_UNREAD</code> = <span className="font-mono">{envFlag}</span></div>
            <div>Local flag (this browser): <code>feature_unread_v1</code> = <span className="font-mono">{localFlag}</span></div>
            <div>Computed enabled: <span className={`font-mono ${enabled ? 'text-green-700' : 'text-red-700'}`}>{enabled ? 'true' : 'false'}</span></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setLocal("on")}
              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Set local ON
            </button>
            <button
              onClick={() => setLocal("off")}
              className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700"
            >
              Set local OFF
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem("user_read_posts_v1");
                  window.dispatchEvent(new Event("storage"));
                } catch (e) {
                  console.warn("Status:clear read history error", e);
                }
              }}
              className="px-3 py-1 rounded bg-orange-600 text-white hover:bg-orange-700"
            >
              Clear read history
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Reload the page after toggling local flag or clearing read history.</p>
        </div>
      </div>
    </div>
  );
};

export default Status;
