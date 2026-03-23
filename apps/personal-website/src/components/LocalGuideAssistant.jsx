import { useEffect, useMemo, useRef, useState } from "react";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const QUERY_ENDPOINT =
  import.meta.env.VITE_LOCAL_GUIDE_QUERY_ENDPOINT?.trim() ||
  "/api/local-guide-query";
const TTS_ENDPOINT =
  import.meta.env.VITE_BLOG_TTS_ENDPOINT?.trim() || "/api/blog-tts";

const EXAMPLE_PROMPTS = [
  "Which pharmacy should we try first?",
  "Where can we get milk or daily groceries nearby?",
  "What is the best backup for fruit and vegetables?",
  "Who is the best taxi or repair fallback in this guide?",
];

const CONFIDENCE_META = {
  grounded: {
    label: "Grounded in guide",
    severity: "success",
  },
  partial: {
    label: "Partial match",
    severity: "warning",
  },
  not_in_guide: {
    label: "Not covered directly",
    severity: "info",
  },
};

const VOICE_INSTRUCTIONS =
  "Speak clearly, calmly, and warmly. Keep the delivery practical and easy to follow for a family member checking nearby options.";

function normalizeText(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function buildGuideUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return new URL("/local/ananyas-nearby", window.location.origin).toString();
  }
  return "https://www.kumar2net.com/local/ananyas-nearby";
}

function extractErrorMessage(payload, fallbackMessage) {
  if (payload && typeof payload === "object" && typeof payload.error === "string") {
    return payload.error;
  }
  return fallbackMessage;
}

export default function LocalGuideAssistant() {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioStatus, setAudioStatus] = useState("idle");
  const [audioError, setAudioError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const objectUrlRef = useRef("");
  const ttsAbortRef = useRef(null);
  const autoPlayPendingRef = useRef(false);

  const canSubmit = question.trim().length >= 3 && !loading;
  const confidenceMeta =
    CONFIDENCE_META[reply?.confidence] || CONFIDENCE_META.partial;

  const shareHref = useMemo(() => {
    if (!reply?.answer) {
      return "";
    }

    const shareText =
      reply.shareText ||
      [
        "Ananyas nearby guide",
        `Q: ${normalizeText(question)}`,
        `A: ${normalizeText(reply.answer)}`,
        buildGuideUrl(),
      ].join("\n");

    return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  }, [question, reply]);

  function revokeAudioUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }
  }

  function clearAudio() {
    if (ttsAbortRef.current) {
      ttsAbortRef.current.abort();
      ttsAbortRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsPlaying(false);
    setAudioUrl("");
    setAudioStatus("idle");
    setAudioError("");
    setAutoPlayBlocked(false);
    autoPlayPendingRef.current = false;
    revokeAudioUrl();
  }

  useEffect(() => {
    return () => {
      if (ttsAbortRef.current) {
        ttsAbortRef.current.abort();
        ttsAbortRef.current = null;
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!audioUrl || !autoPlayPendingRef.current || !audioRef.current) {
      return;
    }

    autoPlayPendingRef.current = false;

    const playAudio = async () => {
      try {
        await audioRef.current.play();
        setAutoPlayBlocked(false);
      } catch {
        setAutoPlayBlocked(true);
      }
    };

    void playAudio();
  }, [audioUrl]);

  const generateVoiceReply = async (answerText) => {
    const normalizedAnswer = normalizeText(answerText);
    if (!normalizedAnswer) {
      return;
    }

    clearAudio();
    setAudioStatus("loading");
    setAudioError("");

    const controller = new AbortController();
    ttsAbortRef.current = controller;

    try {
      const response = await fetch(TTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          text: normalizedAnswer,
          slug: "ananyas-nearby-assistant",
          language: "en",
          response_format: "mp3",
          stream_format: "audio",
          instructions: VOICE_INSTRUCTIONS,
        }),
      });

      if (!response.ok) {
        let payload = null;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }
        throw new Error(
          extractErrorMessage(payload, "Failed to generate the voice reply."),
        );
      }

      const blob = await response.blob();
      if (controller.signal.aborted) {
        return;
      }

      const nextUrl = URL.createObjectURL(blob);
      objectUrlRef.current = nextUrl;
      autoPlayPendingRef.current = true;
      setAudioUrl(nextUrl);
      setAudioStatus("ready");
    } catch (err) {
      if (err?.name === "AbortError") {
        return;
      }

      setAudioStatus("error");
      setAudioError(
        err?.message || "Failed to generate the spoken version of the answer.",
      );
    } finally {
      if (ttsAbortRef.current === controller) {
        ttsAbortRef.current = null;
      }
    }
  };

  const handleSubmit = async (event) => {
    event?.preventDefault?.();

    const trimmedQuestion = normalizeText(question);
    if (trimmedQuestion.length < 3 || loading) {
      return;
    }

    clearAudio();
    setLoading(true);
    setError("");
    setReply(null);

    try {
      const response = await fetch(QUERY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmedQuestion }),
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(
          extractErrorMessage(payload, "The guide assistant could not answer that."),
        );
      }

      setReply(payload);
      void generateVoiceReply(payload?.answer);
    } catch (err) {
      setError(err?.message || "The guide assistant could not answer that.");
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setQuestion(prompt);
    setError("");
  };

  const handleAudioToggle = async () => {
    if (audioStatus === "loading") {
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      return;
    }

    if (audioUrl && audioRef.current) {
      try {
        await audioRef.current.play();
        setAutoPlayBlocked(false);
      } catch {
        setAutoPlayBlocked(true);
      }
      return;
    }

    if (reply?.answer) {
      await generateVoiceReply(reply.answer);
    }
  };

  return (
    <Paper
      id="guide-assistant"
      component="section"
      elevation={0}
      sx={(theme) => ({
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.16),
        backgroundImage:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(3, 7, 18, 0.98))"
            : "linear-gradient(135deg, rgba(248, 250, 252, 0.98), rgba(239, 246, 255, 0.98))",
        boxShadow: `0 20px 48px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.24 : 0.08)}`,
      })}
    >
      <Stack spacing={2.5}>
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} alignItems="center">
            <SmartToyRoundedIcon color="primary" />
            <Chip size="small" color="primary" label="Text + voice beta" />
            <Chip size="small" variant="outlined" label="WhatsApp share" />
          </Stack>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Ask the local guide assistant
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
            Ask in plain language, get a grounded text reply, and hear the answer
            spoken back. Replies are limited to what this guide actually lists,
            so anything outside the page will be called out clearly.
          </Typography>
        </Stack>

        <Stack component="form" spacing={1.5} onSubmit={handleSubmit}>
          <TextField
            multiline
            minRows={2}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            label="Ask about nearby options"
            placeholder="Which pharmacy should we try first for repeat medicines?"
            helperText="Example: medicines, milk, taxis, repairs, diagnostics, flowers, or groceries."
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              type="submit"
              variant="contained"
              disabled={!canSubmit}
              startIcon={
                loading ? <CircularProgress size={18} color="inherit" /> : <SendRoundedIcon />
              }
              sx={{ borderRadius: 999 }}
            >
              {loading ? "Checking guide…" : "Ask assistant"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                setQuestion("");
                setReply(null);
                setError("");
                clearAudio();
              }}
              disabled={loading && !reply}
              sx={{ borderRadius: 999 }}
            >
              Clear
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {EXAMPLE_PROMPTS.map((prompt) => (
            <Chip
              key={prompt}
              label={prompt}
              variant="outlined"
              onClick={() => handlePromptClick(prompt)}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Stack>

        {error ? <Alert severity="error">{error}</Alert> : null}

        {reply ? (
          <Stack spacing={2}>
            <Alert severity={confidenceMeta.severity}>
              <strong>{confidenceMeta.label}.</strong> Recheck live timing and
              availability before depending on a listing.
            </Alert>

            {reply.fallback ? (
              <Alert severity="warning">
                OpenAI was unavailable for this request, so the page used a local
                keyword fallback.
              </Alert>
            ) : null}

            <Paper
              elevation={0}
              sx={(theme) => ({
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.14),
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              })}
            >
              <Stack spacing={1.25}>
                <Typography variant="subtitle2" color="text.secondary">
                  Assistant reply
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {reply.answer}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    size="small"
                    label={reply.provider === "openai" ? reply.model : "heuristic fallback"}
                    variant="outlined"
                  />
                  {audioStatus === "loading" ? (
                    <Chip size="small" label="Generating voice…" color="primary" />
                  ) : null}
                </Stack>
              </Stack>
            </Paper>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <Button
                type="button"
                variant="contained"
                onClick={handleAudioToggle}
                disabled={audioStatus === "loading" || !reply.answer}
                startIcon={
                  isPlaying ? <PauseRoundedIcon /> : <VolumeUpRoundedIcon />
                }
                sx={{ borderRadius: 999 }}
              >
                {audioStatus === "loading"
                  ? "Generating voice…"
                  : isPlaying
                    ? "Pause voice"
                    : audioUrl
                      ? "Play voice again"
                      : "Play voice reply"}
              </Button>

              <Button
                type="button"
                component="a"
                href={shareHref || undefined}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                disabled={!shareHref}
                startIcon={<ShareRoundedIcon />}
                sx={{ borderRadius: 999 }}
              >
                Send via WhatsApp
              </Button>
            </Stack>

            {autoPlayBlocked ? (
              <Alert severity="info">
                Your browser blocked autoplay. Use “Play voice reply” to start the
                spoken answer.
              </Alert>
            ) : null}

            {audioError ? <Alert severity="warning">{audioError}</Alert> : null}

            {Array.isArray(reply.suggestedListings) && reply.suggestedListings.length ? (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.25 }}>
                  Related listings
                </Typography>
                <Stack spacing={1.25}>
                  {reply.suggestedListings.map((listing) => (
                    <Paper
                      key={`${listing.type}:${listing.name}`}
                      elevation={0}
                      sx={(theme) => ({
                        p: 1.5,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: alpha(theme.palette.divider, 0.8),
                      })}
                    >
                      <Stack spacing={1}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          spacing={0.75}
                        >
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {listing.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {listing.categoryTitle} · {listing.area}
                            </Typography>
                          </Box>
                          <Chip
                            size="small"
                            label={listing.verificationLabel}
                            variant="outlined"
                          />
                        </Stack>
                        {listing.note ? (
                          <Typography variant="body2" color="text.secondary">
                            {listing.note}
                          </Typography>
                        ) : null}
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {listing.mapUrl ? (
                            <Button
                              size="small"
                              variant="outlined"
                              component="a"
                              href={listing.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open map
                            </Button>
                          ) : null}
                          {listing.sourceUrl ? (
                            <Button
                              size="small"
                              variant="text"
                              component="a"
                              href={listing.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open source
                            </Button>
                          ) : null}
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            ) : null}
          </Stack>
        ) : null}

        <audio
          ref={audioRef}
          src={audioUrl || undefined}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </Stack>
    </Paper>
  );
}
