import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useUnreadPosts from "../hooks/useUnreadPosts";

const BellIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

export default function UnreadBell({ limit = 8 }) {
  const { unreadCount, unreadPosts, markAllRead } = useUnreadPosts({ popoverLimit: limit });
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  if (unreadCount === 0) {
    return (
      <button
        type="button"
        className="relative text-gray-600 hover:text-gray-800"
        onClick={() => setOpen((v) => !v)}
        aria-label="Unread posts"
        title="Unread posts"
      >
        <BellIcon />
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="relative text-gray-600 hover:text-gray-800"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`You have ${unreadCount} unread posts`}
        title={`${unreadCount} unread posts`}
      >
        <BellIcon />
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 min-w-[1.25rem] h-5 rounded-full bg-red-600 text-white text-xs font-semibold">
          {unreadCount}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-800">Unread posts</div>
            <button
              type="button"
              className="text-xs text-blue-600 hover:underline"
              onClick={() => {
                markAllRead();
                setOpen(false);
                if (typeof window !== "undefined" && typeof window.gtag === "function") {
                  window.gtag("event", "unread_mark_all", { count: unreadCount });
                }
              }}
            >
              Mark all as read
            </button>
          </div>
          <ul className="space-y-2 max-h-80 overflow-auto">
            {unreadPosts.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="block p-2 rounded hover:bg-gray-50"
                  onClick={() => {
                    setOpen(false);
                    if (typeof window !== "undefined" && typeof window.gtag === "function") {
                      window.gtag("event", "unread_post_click", { slug: p.slug });
                    }
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">{p.title}</div>
                  {p.datePublished && (
                    <div className="text-xs text-gray-500">{p.datePublished}</div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

