import { useEffect, useRef, useState } from 'react';

export default function TwitterTimeline({ username = 'kumar2net', height = 600 }) {
  const containerRef = useRef(null);
  const hasCreatedRef = useRef(false);
  const [failed, setFailed] = useState(false);
  const [armed, setArmed] = useState(false);
  const [apiItems, setApiItems] = useState([]);

  useEffect(() => {
    const ensureScript = () => {
      return new Promise((resolve) => {
        if (window.twttr && window.twttr.widgets) return resolve(window.twttr);
        const existing = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
        if (existing) {
          existing.addEventListener('load', () => resolve(window.twttr));
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.onload = () => resolve(window.twttr);
        document.body.appendChild(script);
      });
    };

    const renderOnce = (twttr) => {
      if (!twttr || !containerRef.current || hasCreatedRef.current) return;
      if (containerRef.current.querySelector('iframe')) {
        hasCreatedRef.current = true;
        return;
      }
      hasCreatedRef.current = true;
      containerRef.current.innerHTML = '';
      twttr.widgets
        .createTimeline(
          {
            sourceType: 'profile',
            screenName: username,
          },
          containerRef.current,
          {
            height,
            dnt: true,
            theme: 'light',
            linkColor: '#1d4ed8',
          }
        )
        .catch(() => {
          setFailed(true);
        });
      // Fallback in case of rate limit/no render
      setTimeout(() => {
        if (!containerRef.current?.querySelector('iframe')) {
          setFailed(true);
        }
      }, 3000);
    };

    let observer;
    if (!armed) return;
    ensureScript().then((twttr) => {
      if (!containerRef.current) return;
      // Lazy render when visible to reduce requests
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            renderOnce(twttr);
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });
      observer.observe(containerRef.current);
    });

    return () => {
      if (observer) observer.disconnect();
    };
  }, [username, height, armed]);

  // API fallback: fetch latest posts to show links if embed fails
  useEffect(() => {
    let active = true;
    fetch(`/.netlify/functions/x-latest?username=${encodeURIComponent(username)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('x api error'))))
      .then((data) => {
        if (!active) return;
        setApiItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [username]);

  return (
    <div>
      {!armed && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setArmed(true)}
            className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Load Timeline
          </button>
          <div className="mt-2 text-xs text-gray-500">Loads on demand to avoid X rate limits.</div>
        </div>
      )}
      <div ref={containerRef} className="w-full" />
      {failed && (
        <div className="mt-3 text-sm text-gray-600">
          Unable to load the timeline right now. View on{' '}
          <a
            href={`https://twitter.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Twitter
          </a>
          .
          {apiItems.length > 0 && (
            <ul className="mt-3 space-y-2">
              {apiItems.map((it) => (
                <li key={it.id} className="text-gray-700">
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {it.text.length > 140 ? it.text.slice(0, 140) + '…' : it.text}
                  </a>
                  <span className="ml-2 text-xs text-gray-500">
                    {new Date(it.created_at).toLocaleDateString()}
                  </span>
                </li)
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
