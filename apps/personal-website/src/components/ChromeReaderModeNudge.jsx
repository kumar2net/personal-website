import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "chrome-reader-mode-nudge-dismissed";

const CHROME_SKIP_REGEX =
  /(Edg|OPR|OPX|Brave|SamsungBrowser|YaBrowser|UCBrowser|CriOS\/[\d.]+ Safari)/i;

function isChrome() {
  if (typeof navigator === "undefined") {
    return false;
  }

  const { userAgent = "", userAgentData } = navigator;
  if (CHROME_SKIP_REGEX.test(userAgent)) {
    return false;
  }

  if (userAgentData?.brands?.length) {
    const hasChromeBrand = userAgentData.brands.some(({ brand }) =>
      /Chrom(e|ium)/i.test(brand)
    );
    const isEdgeBrand = userAgentData.brands.some(({ brand }) =>
      /Edge/i.test(brand)
    );
    return hasChromeBrand && !isEdgeBrand;
  }

  return /Chrome|Chromium/i.test(userAgent);
}

function getInstructions() {
  if (typeof navigator === "undefined") {
    return { body: "", footnote: "" };
  }

  const ua = navigator.userAgent || "";
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

  if (isMobile) {
    return {
      body:
        "Tap the ⋮ menu and choose “Reading mode” (or enable the Simplified view toggle under Settings → Accessibility) for a distraction-free version.",
      footnote:
        "Chrome surfaces that action only on text-heavy articles, so it appears after the post finishes loading.",
    };
  }

  return {
    body:
      "Click the side panel icon near the address bar and pick “Reading mode” to turn this post into a spacious, calm layout.",
    footnote:
      "Chrome only shows the Reading mode control for article-style pages, which includes these blog posts.",
  };
}

export default function ChromeReaderModeNudge({ slug }) {
  const [visible, setVisible] = useState(false);

  const instructions = useMemo(() => getInstructions(), []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") {
        return;
      }
    } catch {
      // Fail silently if storage is unavailable.
    }

    if (isChrome()) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore storage errors.
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <section
      className="mb-6 rounded-xl border border-blue-200/60 bg-blue-50/80 p-4 text-sm text-blue-900 shadow-sm dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-100"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/70 dark:text-blue-100">
          Reader tip
        </div>
        <div className="flex-1">
          <p className="font-semibold">
            Chrome can auto-convert this into Read mode.
          </p>
          <p className="mt-1 text-blue-900/90 dark:text-blue-100/90">
            {instructions.body}
          </p>
          <p className="mt-1 text-xs text-blue-800/70 dark:text-blue-200/70">
            {instructions.footnote}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md border border-transparent px-2 py-1 text-xs font-medium text-blue-800 transition hover:border-blue-200 hover:bg-blue-100 dark:text-blue-50 dark:hover:border-blue-500/40 dark:hover:bg-blue-900/40"
          aria-label="Dismiss Chrome Reading mode tip"
        >
          Dismiss
        </button>
      </div>
    </section>
  );
}
