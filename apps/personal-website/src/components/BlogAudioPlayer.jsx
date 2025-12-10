import React, { useEffect, useMemo, useRef, useState } from "react";
import { Languages, Loader2, Volume2 } from "lucide-react";

const LANGUAGES = [
  {
    code: "en",
    label: "English",
    helper: "Original voice",
  },
  {
    code: "hi",
    label: "Hindi",
    helper: "भारतीय पाठक",
  },
  {
    code: "ta",
    label: "Tamil",
    helper: "தமிழ் வாசகர்",
  },
];

const DEFAULT_ENDPOINTS = ["/api/blog-tts"];
const DEFAULT_VERCEL_PORT =
  import.meta.env.VITE_VERCEL_DEV_PORT || "3000";
const MODEL_LABEL =
  import.meta.env.VITE_TTS_MODEL_LABEL || "auto-select";

const HEADING_TAG_PATTERN = /^h([1-6])$/i;
const TLDR_PATTERN = /tl;?dr/i;
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const AUDIO_MIME = "audio/ogg; codecs=opus";
const MAX_CLIENT_CHARS = 1200;

function resolveAudioMime(contentTypeHeader) {
  if (!contentTypeHeader) return AUDIO_MIME;
  const [typePart, ...rest] = contentTypeHeader.split(";");
  const baseType = (typePart || "").trim();
  const params = rest.join(";").trim();
  if (!baseType) {
    return AUDIO_MIME;
  }
  return params ? `${baseType}; ${params}` : baseType;
}

function canUseMse(mimeType = AUDIO_MIME) {
  if (typeof window === "undefined") return false;
  const MS = window.MediaSource;
  return (
    MS &&
    typeof MS.isTypeSupported === "function" &&
    MS.isTypeSupported(mimeType)
  );
}

function getHeadingLevel(element) {
  const tagName = element?.tagName || "";
  const match = tagName.match(HEADING_TAG_PATTERN);
  if (!match) {
    return Infinity;
  }
  return parseInt(match[1], 10) || Infinity;
}

function normalizeText(text) {
  return (text || "").replace(/\s+/g, " ").replace(/\s+\n/g, "\n").trim();
}

function extractTextAfterHeading(heading) {
  if (!heading) {
    return "";
  }

  const fragments = [];
  const baseLevel = getHeadingLevel(heading);
  let node = heading.nextSibling;

  while (node) {
    if (node.nodeType === ELEMENT_NODE) {
      const tagName = node.tagName || "";
      if (
        HEADING_TAG_PATTERN.test(tagName) &&
        getHeadingLevel(node) <= baseLevel
      ) {
        break;
      }

      fragments.push(node.textContent || "");
    } else if (node.nodeType === TEXT_NODE) {
      fragments.push(node.textContent || "");
    }

    node = node.nextSibling;
  }

  return normalizeText(fragments.join(" "));
}

function extractTldrText(node) {
  if (!node || typeof window === "undefined") {
    return "";
  }

  const attrMatch = node.querySelector(
    "[data-tldr-text], [data-tldr], [data-tldr-section]",
  );
  if (attrMatch) {
    const text = attrMatch.getAttribute("data-tldr-text")
      ? attrMatch.getAttribute("data-tldr-text")
      : attrMatch.innerText || attrMatch.textContent || "";
    return normalizeText(text);
  }

  const headings = node.querySelectorAll("h1, h2, h3, h4, h5, h6");
  for (const heading of headings) {
    if (TLDR_PATTERN.test(heading.textContent || "")) {
      const collected = extractTextAfterHeading(heading);
      if (collected) {
        return collected;
      }

      const parentSection = heading.closest("section, div, article");
      if (parentSection) {
        const parentText = normalizeText(
          parentSection.innerText || parentSection.textContent || "",
        );
        if (parentText) {
          const withoutHeading = parentText
            .replace(heading.innerText || heading.textContent || "", "")
            .trim();
          if (withoutHeading) {
            return withoutHeading;
          }
          return parentText;
        }
      }
    }
  }

  return "";
}

function collectArticleText(articleRef) {
  const node = articleRef?.current;
  if (!node) {
    return "";
  }

  const tldr = extractTldrText(node);
  if (tldr) {
    return tldr;
  }

  const raw = node.innerText || node.textContent || "";
  return normalizeText(raw);
}

export default function BlogAudioPlayer({ slug, articleRef }) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [loadingLanguage, setLoadingLanguage] = useState("");
  const [error, setError] = useState("");
  const [audioCache, setAudioCache] = useState({});
  const [autoPlayNonce, setAutoPlayNonce] = useState(0);
  const cacheRef = useRef(audioCache);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const audioRef = useRef(null);
  const abortControllerRef = useRef(null);
  const prefetchedRef = useRef(false);
  const prefetchedLanguagesRef = useRef(new Set());

  useEffect(() => {
    cacheRef.current = audioCache;
  }, [audioCache]);

  useEffect(() => {
    return () => {
      const entries = Object.values(cacheRef.current || {});
      entries.forEach((entry) => {
        if (entry?.url) {
          URL.revokeObjectURL(entry.url);
        }
      });
      if (mediaSourceRef.current) {
        try {
          mediaSourceRef.current.endOfStream?.();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const endpoints = useMemo(() => {
    const candidateEndpoints = [];
    const customEndpoint = import.meta.env.VITE_BLOG_TTS_ENDPOINT;
    const isBrowser = typeof window !== "undefined";

    // 1) Explicit override wins
    if (customEndpoint) {
      candidateEndpoints.push(customEndpoint);
    }

    if (isBrowser) {
      const { hostname, port, origin } = window.location;
      const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
      const isVitePort = port === "5173" || port === "5174";

      // 2) Local dev with vercel dev (serverless functions on 3000 by default)
      if (isLocalHost && isVitePort) {
        candidateEndpoints.push(
          `http://localhost:${DEFAULT_VERCEL_PORT}/api/blog-tts`,
        );
      }

      // 3) Non-localhost origin (deployed) uses same-origin API/function
      if (!isLocalHost) {
        candidateEndpoints.push(`${origin}/api/blog-tts`);
      }
    }

    // 4) Fallbacks (kept last)
    candidateEndpoints.push(...DEFAULT_ENDPOINTS);
    return Array.from(new Set(candidateEndpoints.filter(Boolean)));
  }, []);

  const activeEntry = audioCache[selectedLanguage];
  const hasAudio = Boolean(activeEntry?.url);

  const metaNotice = useMemo(() => {
    const cacheEntry = audioCache[selectedLanguage];
    if (!cacheEntry) {
      return "";
    }
    if (cacheEntry.translationFailed) {
      return "Displayed language is English because translation failed.";
    }
    if (cacheEntry.translated && cacheEntry.truncated) {
      return "Translated audio generated from a shortened excerpt.";
    }
    if (cacheEntry.translated) {
      return "Translated from English.";
    }
    if (cacheEntry.truncated) {
      return "Generated from a shortened excerpt.";
    }
    return "";
  }, [audioCache, selectedLanguage]);

  const buttonLabel = "Generate audio";
  const disableActions = loadingLanguage === selectedLanguage;
  const currentAudioUrl = audioCache[selectedLanguage]?.url || "";

  async function tryPlayAudio() {
    try {
      if (audioRef.current) {
        await audioRef.current.play();
      }
    } catch (err) {
      console.warn("[blog-tts] Autoplay blocked:", err);
    }
  }

  function cleanupCurrentStream(language = selectedLanguage) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (sourceBufferRef.current) {
      try {
        sourceBufferRef.current.abort();
      } catch {
        // ignore
      }
      sourceBufferRef.current = null;
    }
    if (mediaSourceRef.current) {
      try {
        mediaSourceRef.current.endOfStream?.();
      } catch {
        // ignore
      }
      mediaSourceRef.current = null;
    }
    const entry = cacheRef.current?.[language];
    if (entry?.url) {
      URL.revokeObjectURL(entry.url);
      setAudioCache((prev) => {
        const next = { ...prev };
        delete next[language];
        return next;
      });
    }
  }

  useEffect(() => {
    if (prefetchedRef.current) return;
    if (!articleRef?.current) return;
    prefetchedRef.current = true;
    prefetchedLanguagesRef.current.add("en");
    fetchAudio({ language: "en", isPrefetch: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleRef]);

  useEffect(() => {
    if (!articleRef?.current) return;
    if (prefetchedLanguagesRef.current.has(selectedLanguage)) return;
    if (loadingLanguage === selectedLanguage) return;
    prefetchedLanguagesRef.current.add(selectedLanguage);
    fetchAudio({ language: selectedLanguage, isPrefetch: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, loadingLanguage, articleRef]);

  async function fetchAudio({ language, isPrefetch } = {}) {
    const targetLanguage = language || selectedLanguage;
    const text = collectArticleText(articleRef);
    if (!text) return;

    const excerpt =
      text.length > MAX_CLIENT_CHARS
        ? `${text.slice(0, MAX_CLIENT_CHARS)}`
        : text;

    setError("");
    setLoadingLanguage(targetLanguage);
    cleanupCurrentStream(targetLanguage);
    abortControllerRef.current = new AbortController();

    const body = {
      slug,
      language: targetLanguage,
      text: excerpt,
      format: canUseMse(AUDIO_MIME) ? "opus" : "mp3",
    };
    const payload = JSON.stringify(body);
    const createPostRequest = () => ({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      signal: abortControllerRef.current?.signal,
    });

    try {
      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, createPostRequest());

          if (!response.ok) {
            let message = `Request failed with ${response.status}`;
            const contentType = response.headers.get("content-type") || "";
            try {
              if (contentType.includes("application/json")) {
                const payload = await response.json();
                if (payload?.error) {
                  message = payload.error;
                }
              } else {
                const text = await response.text();
                if (text) {
                  message = text;
                }
              }
            } catch {
              // Ignore JSON parse errors and fall back to default message
            }
            lastError = new Error(message);
            response = null;
            continue;
          }

          break;
        } catch (err) {
          lastError = err;
          response = null;
        }
      }

      if (!response) {
        throw lastError || new Error("Unable to generate audio");
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("audio/")) {
        let message = `Unexpected response type (${contentType || "unknown"})`;
        try {
          const payload = await response.json();
          if (payload?.error) {
            message = payload.error;
          }
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const resolvedMime = resolveAudioMime(contentType);
      const supportsStreaming =
        canUseMse(resolvedMime) &&
        response.body &&
        typeof response.body.getReader === "function";
      if (supportsStreaming) {
        const reader = response.body.getReader();
        const mediaSource = new MediaSource();
        mediaSourceRef.current = mediaSource;
        const objectUrl = URL.createObjectURL(mediaSource);

        const streamMeta = {
          fetchedAt: Date.now(),
          translated: response.headers.get("x-blogtts-translated") === "1",
          translationFailed:
            response.headers.get("x-blogtts-translation-failed") === "1",
          truncated: response.headers.get("x-blogtts-truncated") === "1",
          model: response.headers.get("x-blogtts-model") || "",
          mimeType: resolvedMime,
          url: objectUrl,
        };

        setAudioCache((prev) => ({
          ...prev,
          [targetLanguage]: streamMeta,
        }));
        setAutoPlayNonce((prev) => prev + 1);
        tryPlayAudio();

        mediaSource.addEventListener("sourceopen", () => {
          let sourceBuffer;
          let startedPlayback = false;
          const startPlayback = () => {
            if (startedPlayback) return;
            if (audioRef.current) {
              startedPlayback = true;
              audioRef.current.play().catch(() => {
                // Autoplay may be blocked; user can press play manually.
              });
            }
          };
          try {
            sourceBuffer = mediaSource.addSourceBuffer(resolvedMime);
          } catch (bufErr) {
            console.warn("[blog-tts] SourceBuffer unsupported, falling back to blob:", bufErr);
            mediaSource.endOfStream();
            fetchAudioAsBlobFallback(response, resolvedMime, targetLanguage);
            return;
          }
          sourceBufferRef.current = sourceBuffer;
          const queue = [];
          let doneReading = false;

          const processQueue = () => {
            if (!sourceBuffer || sourceBuffer.updating) return;
            if (queue.length > 0) {
              sourceBuffer.appendBuffer(queue.shift());
              startPlayback();
            } else if (doneReading) {
              try {
                mediaSource.endOfStream();
              } catch {
                // ignore
              }
            }
          };

          sourceBuffer.addEventListener("updateend", processQueue);

          const pump = async () => {
            try {
              while (true) {
                const { value, done } = await reader.read();
                if (done) {
                  doneReading = true;
                  processQueue();
                  break;
                }
                if (value) {
                  queue.push(value instanceof Uint8Array ? value : new Uint8Array(value));
                  processQueue();
                }
              }
            } catch (streamErr) {
              console.error("[blog-tts] Streaming to MediaSource failed:", streamErr);
              setError("Audio streaming was interrupted. Please try again.");
              try {
                mediaSource.endOfStream("network");
              } catch {
                // ignore
              }
            }
          };

          pump();
        });
      } else {
        await fetchAudioAsBlobFallback(response, resolvedMime, targetLanguage);
      }
    } catch (err) {
      if (err?.name === "AbortError") {
        return;
      }
      setError(err?.message || "Failed to generate audio");
    } finally {
      setLoadingLanguage("");
    }
  }

  useEffect(() => {
    if (currentAudioUrl && !loadingLanguage) {
      tryPlayAudio();
    }
  }, [currentAudioUrl, autoPlayNonce, loadingLanguage]);

  async function fetchAudioAsBlobFallback(
    response,
    mimeType = AUDIO_MIME,
    language = selectedLanguage,
  ) {
    try {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioCache((prev) => ({
        ...prev,
        [language]: {
          url,
          fetchedAt: Date.now(),
          translated: response.headers.get("x-blogtts-translated") === "1",
          translationFailed:
            response.headers.get("x-blogtts-translation-failed") === "1",
          truncated: response.headers.get("x-blogtts-truncated") === "1",
          model: response.headers.get("x-blogtts-model") || "",
          mimeType,
        },
      }));
      setAutoPlayNonce((prev) => prev + 1);
      tryPlayAudio();
    } catch (blobErr) {
      console.error("[blog-tts] Blob fallback failed:", blobErr);
      setError("Audio playback is not supported in this browser.");
    }
  }

  return (
    <section className="not-prose mb-8 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        <Languages className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        Listen to this post
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        OpenAI Text-to-Speech (
        {activeEntry?.model || MODEL_LABEL}) voices this post in English, Hindi,
        or Tamil.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => {
          const isActive = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelectedLanguage(lang.code)}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition ${
                isActive
                  ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
              }`}
            >
              {lang.label}
              <span className="ml-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {lang.helper}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={fetchAudio}
          disabled={disableActions}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-800/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          {loadingLanguage === selectedLanguage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
          {buttonLabel} ({LANGUAGES.find((l) => l.code === selectedLanguage)?.label})
        </button>
        {currentAudioUrl && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Ready — press play below.
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/50 dark:bg-red-950/60 dark:text-red-200">
          {error}
        </p>
      )}

      {currentAudioUrl && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <audio
            key={`${selectedLanguage}-${autoPlayNonce}`}
            className="w-full"
            controls
            autoPlay
            preload="auto"
            src={currentAudioUrl}
            ref={audioRef}
          />
          {(metaNotice || activeEntry?.model) && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {metaNotice}
              {activeEntry?.model && (
                <>
                  {metaNotice ? " " : ""}
                  Using <span className="font-medium">{activeEntry.model}</span>.
                </>
              )}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
