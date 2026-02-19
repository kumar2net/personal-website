import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Languages, Volume2 } from "lucide-react";

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

const OPUS_MIME = "audio/ogg; codecs=opus";
const MP3_MIME = "audio/mpeg";
const AUDIO_MIME = MP3_MIME;
const MAX_CLIENT_CHARS = 25000;
const DEFAULT_TTS_SPEED = Number(import.meta.env.VITE_BLOG_TTS_SPEED || "1");

function clampSpeed(value) {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.min(4, Math.max(0.25, Number(value)));
}

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

function canPlayAudioType(mimeType) {
  if (typeof document === "undefined") return "";
  const audio = document.createElement("audio");
  return audio?.canPlayType?.(mimeType) || "";
}

function resolvePreferredAudioFormat() {
  const opusPlayable = canPlayAudioType(OPUS_MIME);
  if (opusPlayable && canUseMse(OPUS_MIME)) {
    return { format: "opus", mime: OPUS_MIME };
  }
  return { format: "mp3", mime: MP3_MIME };
}

function createAudioCacheEntry(response, mimeType, url) {
  return {
    url,
    fetchedAt: Date.now(),
    translated: response.headers.get("x-blogtts-translated") === "1",
    translationFailed: response.headers.get("x-blogtts-translation-failed") === "1",
    truncated: response.headers.get("x-blogtts-truncated") === "1",
    model: response.headers.get("x-blogtts-model") || "",
    mimeType,
    speed: response.headers.get("x-blogtts-speed") || "",
    streamFormat: response.headers.get("x-blogtts-stream-format") || "",
    responseFormat: response.headers.get("x-blogtts-response-format") || "",
  };
}

function waitForSourceBufferIdle(sourceBuffer) {
  if (!sourceBuffer?.updating) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const onUpdateEnd = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Failed while waiting for audio stream buffer."));
    };
    const cleanup = () => {
      sourceBuffer.removeEventListener("updateend", onUpdateEnd);
      sourceBuffer.removeEventListener("error", onError);
    };
    sourceBuffer.addEventListener("updateend", onUpdateEnd);
    sourceBuffer.addEventListener("error", onError);
  });
}

async function appendToSourceBuffer(sourceBuffer, chunk) {
  await waitForSourceBufferIdle(sourceBuffer);
  return new Promise((resolve, reject) => {
    const onUpdateEnd = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Failed to append streaming audio chunk."));
    };
    const cleanup = () => {
      sourceBuffer.removeEventListener("updateend", onUpdateEnd);
      sourceBuffer.removeEventListener("error", onError);
    };
    sourceBuffer.addEventListener("updateend", onUpdateEnd);
    sourceBuffer.addEventListener("error", onError);
    try {
      sourceBuffer.appendBuffer(chunk);
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
}

function normalizeText(text) {
  return (text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function collectArticleText(articleRef) {
  const node = articleRef?.current;
  if (!node) {
    return "";
  }

  const raw = node.innerText || node.textContent || "";
  return normalizeText(raw);
}

export default function BlogAudioPlayer({ slug, articleRef }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [loadingLanguage, setLoadingLanguage] = useState("");
  const [error, setError] = useState("");
  const [audioCache, setAudioCache] = useState({});
  const [autoPlayNonce, setAutoPlayNonce] = useState(0);
  const [userInitiated, setUserInitiated] = useState(false);
  const cacheRef = useRef(audioCache);
  const audioRef = useRef(null);
  const abortControllerRef = useRef(null);

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
    };
  }, []);

  const endpoints = useMemo(() => {
    const candidateEndpoints = [];
    const customEndpoint = import.meta.env.VITE_BLOG_TTS_ENDPOINT;
    const useVercelDev = import.meta.env.VITE_USE_VERCEL_DEV === "true";
    const isBrowser = typeof window !== "undefined";

    if (customEndpoint) {
      candidateEndpoints.push(customEndpoint);
    }

    if (isBrowser) {
      const { hostname, port, origin } = window.location;
      const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
      const isVitePort = port === "5173" || port === "5174";

      if (origin) {
        candidateEndpoints.push(`${origin}/api/blog-tts`);
      }

      if (useVercelDev && isLocalHost && isVitePort) {
        candidateEndpoints.push(
          `http://localhost:${DEFAULT_VERCEL_PORT}/api/blog-tts`,
        );
      }
    }

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

  const buttonLabel = hasAudio ? "Play audio" : "Generate audio";
  const disableActions = loadingLanguage === selectedLanguage;
  const currentAudioUrl = audioCache[selectedLanguage]?.url || "";
  const primaryButtonBg = isDark
    ? theme.palette.primary.main
    : theme.palette.grey[900];
  const primaryButtonHoverBg = isDark
    ? theme.palette.grey[100]
    : theme.palette.grey[800];
  const primaryButtonText = isDark
    ? theme.palette.primary.contrastText
    : theme.palette.common.white;

  async function tryPlayAudio(force = false) {
    try {
      if (audioRef.current && (force || userInitiated)) {
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

  async function fetchAudio({ language } = {}) {
    const targetLanguage = language || selectedLanguage;
    const text = collectArticleText(articleRef);
    if (!text) return;

    const excerpt = text.length > MAX_CLIENT_CHARS
      ? text.slice(0, MAX_CLIENT_CHARS)
      : text;

    setError("");
    setLoadingLanguage(targetLanguage);
    cleanupCurrentStream(targetLanguage);
    abortControllerRef.current = new AbortController();

    const { format: preferredFormat } = resolvePreferredAudioFormat();
    const speed = clampSpeed(DEFAULT_TTS_SPEED);
    const body = {
      slug,
      language: targetLanguage,
      text: excerpt,
      stream_format: "audio",
      response_format: preferredFormat,
      speed,
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
            if (response.status === 401 || response.status === 403) {
              throw lastError;
            }
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
      if (response.body && canUseMse(resolvedMime)) {
        await fetchAudioAsMediaSourceStream(
          response,
          resolvedMime,
          targetLanguage,
        );
      } else {
        await fetchAudioAsBlobFallback(response, resolvedMime, targetLanguage);
      }
    } catch (err) {
      if (err?.name === "AbortError") {
        return;
      }
      cleanupCurrentStream(targetLanguage);
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
        [language]: createAudioCacheEntry(response, mimeType, url),
      }));
      setAutoPlayNonce((prev) => prev + 1);
      setUserInitiated(true);
      tryPlayAudio(true);
    } catch (blobErr) {
      console.error("[blog-tts] Blob fallback failed:", blobErr);
      setError("Audio playback is not supported in this browser.");
    }
  }

  async function fetchAudioAsMediaSourceStream(
    response,
    mimeType = AUDIO_MIME,
    language = selectedLanguage,
  ) {
    if (!response.body) {
      throw new Error("Streaming response body is unavailable.");
    }
    if (typeof window === "undefined" || !window.MediaSource) {
      throw new Error("MediaSource streaming is not supported in this browser.");
    }

    const mediaSource = new window.MediaSource();
    const streamUrl = URL.createObjectURL(mediaSource);
    const reader = response.body.getReader();

    setAudioCache((prev) => ({
      ...prev,
      [language]: createAudioCacheEntry(response, mimeType, streamUrl),
    }));
    setAutoPlayNonce((prev) => prev + 1);
    setUserInitiated(true);
    tryPlayAudio(true);

    try {
      await new Promise((resolve, reject) => {
        const onOpen = () => {
          cleanup();
          resolve();
        };
        const onError = () => {
          cleanup();
          reject(new Error("Failed to open MediaSource stream."));
        };
        const cleanup = () => {
          mediaSource.removeEventListener("sourceopen", onOpen);
          mediaSource.removeEventListener("error", onError);
        };
        mediaSource.addEventListener("sourceopen", onOpen);
        mediaSource.addEventListener("error", onError);
      });

      const sourceBuffer = mediaSource.addSourceBuffer(mimeType);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (!value || !value.byteLength) {
          continue;
        }
        await appendToSourceBuffer(sourceBuffer, value);
      }

      await waitForSourceBufferIdle(sourceBuffer);
      if (mediaSource.readyState === "open") {
        mediaSource.endOfStream();
      }
    } catch (streamError) {
      if (mediaSource.readyState === "open") {
        try {
          mediaSource.endOfStream("network");
        } catch {
          // no-op
        }
      }
      throw streamError;
    } finally {
      try {
        reader.releaseLock();
      } catch {
        // no-op
      }
    }
  }

  const handlePrimaryAction = () => {
    setUserInitiated(true);
    if (hasAudio) {
      tryPlayAudio(true);
      return;
    }
    fetchAudio();
  };

  return (
    <section className="not-prose mb-8 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        <Languages className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        Listen to this post
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Audio is AI-generated (not a human voice). OpenAI Text-to-Speech (
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
        <Button
          type="button"
          onClick={handlePrimaryAction}
          disabled={disableActions}
          startIcon={<Volume2 size={16} />}
          variant="contained"
          sx={{
            px: 2,
            py: 1,
            borderRadius: "12px",
            fontSize: "0.875rem",
            fontWeight: 600,
            textTransform: "none",
            backgroundColor: primaryButtonBg,
            color: primaryButtonText,
            boxShadow: "0 12px 24px rgba(15, 23, 42, 0.2)",
            transition: "transform 150ms ease, background-color 150ms ease",
            "&:hover": {
              backgroundColor: primaryButtonHoverBg,
              transform: "translateY(-2px)",
            },
            "&.Mui-disabled": {
              opacity: 0.5,
              backgroundColor: primaryButtonBg,
              color: primaryButtonText,
            },
          }}
        >
          {buttonLabel} ({LANGUAGES.find((l) => l.code === selectedLanguage)?.label})
        </Button>
          {currentAudioUrl && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Ready — press play below.
          </div>
        )}
      </div>

      {loadingLanguage === selectedLanguage && (
        <div className="mt-3 w-full">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Generating audio…
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          </div>
        </div>
      )}

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
