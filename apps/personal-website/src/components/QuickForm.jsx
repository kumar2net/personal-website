import { useEffect, useMemo, useState } from "react";
import { loadJSON, saveJSON } from "@/utils/blob";

const emojis = ["❤️", "👍", "🤔", "😂", "🙌"];
const MAX_ITEMS = 8;

const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "just now";
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.round(diff / (1000 * 60));

  if (minutes < 1) return "just now";
  if (minutes < 60) return relativeTimeFormat.format(-minutes, "minute");

  const hours = Math.round(minutes / 60);
  if (hours < 24) return relativeTimeFormat.format(-hours, "hour");

  const days = Math.round(hours / 24);
  if (days < 7) return relativeTimeFormat.format(-days, "day");

  const weeks = Math.round(days / 7);
  return relativeTimeFormat.format(-weeks, "week");
};

export default function QuickForm({ postId, sectionId }) {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const storagePath = useMemo(
    () => `/notes/${postId}/${sectionId}.json`,
    [postId, sectionId],
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    loadJSON(storagePath)
      .then((data) => {
        if (cancelled) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [storagePath]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 2500);
    return () => clearTimeout(timer);
  }, [success]);

  const handleEmoji = (emoji) => {
    setText((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  const handleSubmit = async () => {
    const draft = text.trim();
    if (!draft || isSending) return;

    const prevItems = items;
    const newItem = {
      text: draft,
      ts: Date.now(),
    };
    const nextItems = [...prevItems, newItem].slice(-MAX_ITEMS);

    setIsSending(true);
    setError("");
    setItems(nextItems);
    setText("");

    try {
      await saveJSON(storagePath, nextItems);
      setSuccess(true);
    } catch (err) {
      setError("Could not save. Try once more?");
      setItems(prevItems); // revert optimistic update
      setText(draft);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="rounded-3xl border border-outline/30 bg-gradient-to-br from-primaryContainer/90 via-surface/80 to-secondaryContainer/80 p-4 shadow-lg shadow-primaryContainer/50 backdrop-blur-sm dark:border-outline/10 dark:from-surface/70 dark:via-surface/40 dark:to-secondaryContainer/20">
      <div className="flex flex-wrap gap-2 pb-3">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleEmoji(emoji)}
            className="rounded-full border border-transparent bg-surface/80 px-3 py-1 text-lg transition hover:scale-110 hover:border-onSurface/10 dark:bg-surfaceContainer/70"
            aria-label={`Add ${emoji}`}
          >
            {emoji}
          </button>
        ))}
        <span className="ml-auto text-xs uppercase tracking-[0.2em] text-onSurfaceVariant">
          Leave a quick vibe
        </span>
      </div>

      <div className="space-y-3">
        <textarea
          value={text}
          placeholder="Drop a note, memory, or emoji remix…"
          onChange={(event) => setText(event.target.value)}
          rows={3}
          className="w-full resize-none rounded-2xl border border-outlineVariant/70 bg-surface/90 p-3 text-sm shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primaryContainer dark:border-outline dark:bg-surface/50 dark:focus:border-secondary dark:focus:ring-secondaryContainer/30"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSending}
            className="inline-flex items-center gap-2 rounded-full bg-onSurface px-5 py-2 text-sm font-semibold uppercase tracking-wide text-surface shadow-lg shadow-onSurface/20 transition disabled:cursor-not-allowed disabled:opacity-60 dark:bg-surface dark:text-onSurface"
          >
            {isSending ? "Sending…" : "Send"}
          </button>
          {success && (
            <span className="text-xs font-medium text-success dark:text-success">
              Saved for the family album ✓
            </span>
          )}
          {error && (
            <span className="text-xs text-error dark:text-error">
              {error}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-onSurface dark:text-onSurface">
        {isLoading && (
          <div className="text-xs text-onSurfaceVariant dark:text-onSurfaceVariant">
            Loading previous notes…
          </div>
        )}
        {!isLoading && items.length === 0 && (
          <div className="text-xs text-onSurfaceVariant dark:text-onSurfaceVariant">
            Be the first to leave a love note for this section.
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.ts}
            className="rounded-2xl border border-outlineVariant bg-surface/80 p-3 shadow-sm dark:border-outline dark:bg-surface/40"
          >
            <p className="text-sm leading-relaxed">{item.text}</p>
            <span className="text-xs uppercase tracking-widest text-onSurfaceVariant">
              {formatRelativeTime(item.ts)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
