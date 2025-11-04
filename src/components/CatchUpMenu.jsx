import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiCheckCircle, HiOutlineNewspaper } from "react-icons/hi";
import useCatchUpPosts from "../hooks/useCatchUpPosts";
import { Link } from "react-router-dom";

function formatDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function CatchUpDialog({
  isOpen,
  onClose,
  posts,
  totalCount,
  onMarkCaughtUp,
  dialogId,
  titleId,
  descriptionId,
  onDismiss,
}) {
  const hasDocument = typeof document !== "undefined" && Boolean(document.body);
  const shouldRender = isOpen && hasDocument;

  const dialogRef = useRef(null);
  const firstLinkRef = useRef(null);
  const markButtonRef = useRef(null);

  useEffect(() => {
    if (!shouldRender) {
      return undefined;
    }

    const previouslyFocusedElement = document.activeElement;

    return () => {
      if (previouslyFocusedElement && previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus({ preventScroll: true });
      }
      onDismiss?.();
    };
  }, [shouldRender, onDismiss]);

  useEffect(() => {
    if (!shouldRender) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shouldRender, onClose]);

  useEffect(() => {
    if (!shouldRender) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTarget = firstLinkRef.current || markButtonRef.current;
    focusTarget?.focus?.();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      id={dialogId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id={titleId} className="text-lg font-semibold leading-6 text-gray-900">
          {totalCount} new post{totalCount === 1 ? "" : "s"}
        </h3>
        <div id={descriptionId} className="mt-1 space-y-1 text-sm text-gray-600">
          <p>Choose a post to read now or mark them as caught up.</p>
          {totalCount > posts.length && (
            <p>
              Showing the latest {posts.length} posts. Visit the blog to see the remaining {totalCount - posts.length}.
            </p>
          )}
        </div>
        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={post.href}
              onClick={onClose}
              ref={firstLinkRef.current ? undefined : firstLinkRef}
              className="block rounded-lg border border-gray-200 px-3 py-2 hover:border-blue-400 hover:bg-blue-50"
            >
              <div className="text-sm font-semibold text-gray-900 line-clamp-2">{post.title}</div>
              <div className="text-xs text-gray-500">
                {formatDate(post.dateModified || post.datePublished || post.sortDate)}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/blog" onClick={onClose} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all posts
          </Link>
          <button
            type="button"
            onClick={() => {
              onMarkCaughtUp();
              onClose();
            }}
            ref={markButtonRef}
            className="inline-flex justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Mark as caught up
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function CatchUpMenu() {
  const { newCount, newPosts, markCaughtUp } = useCatchUpPosts();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const dialogId = useId();
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();

  const trimmedPosts = useMemo(() => newPosts.slice(0, 12), [newPosts]);

  useEffect(() => {
    if (newCount === 0 && isOpen) {
      setIsOpen(false);
    }
  }, [newCount, isOpen]);

  if (newCount === 0) {
    return (
      <div
        className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
        role="status"
        aria-live="polite"
      >
        <HiCheckCircle className="h-4 w-4" />
        <span>You're all caught up</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={dialogId}
        ref={triggerRef}
      >
        <HiOutlineNewspaper className="h-5 w-5" />
        <span>
          Catch up
          <span className="ml-2 rounded-full bg-white bg-opacity-20 px-2 py-0.5 text-xs font-semibold">
            {newCount} new
          </span>
        </span>
      </button>
      <CatchUpDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        posts={trimmedPosts}
        totalCount={newCount}
        onMarkCaughtUp={markCaughtUp}
        dialogId={dialogId}
        titleId={dialogTitleId}
        descriptionId={dialogDescriptionId}
        onDismiss={() => {
          triggerRef.current?.focus({ preventScroll: true });
        }}
      />
    </>
  );
}
