import { useEffect, useMemo, useRef, useState } from "react";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import KeyboardRoundedIcon from "@mui/icons-material/KeyboardRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
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
const RECOGNITION_LANGUAGE =
  import.meta.env.VITE_LOCAL_GUIDE_SPEECH_LANG || "en-IN";

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

function getContactNumbers(item) {
  if (!Array.isArray(item?.contactNumbers)) {
    return [];
  }

  return item.contactNumbers.filter(
    (contact) =>
      contact &&
      typeof contact.display === "string" &&
      typeof contact.tel === "string" &&
      contact.display.trim() &&
      contact.tel.trim(),
  );
}

function buildTelephoneHref(value) {
  const normalized = String(value || "").replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : undefined;
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function describeRecognitionError(code) {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone permission was blocked. Allow mic access or use typing.";
    case "no-speech":
      return "I could not hear a clear question. Try again a little closer to the microphone.";
    case "audio-capture":
      return "No working microphone was detected.";
    case "network":
      return "Speech recognition hit a network issue. Try again in a moment.";
    case "aborted":
      return "";
    default:
      return "Voice capture failed. Try again or switch to typing.";
  }
}

export default function LocalGuideAssistant() {
  const [question, setQuestion] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [heardText, setHeardText] = useState("");
  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioStatus, setAudioStatus] = useState("idle");
  const [audioError, setAudioError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningSupported, setListeningSupported] = useState(false);
  const [listeningError, setListeningError] = useState("");
  const [showTextComposer, setShowTextComposer] = useState(false);
  const audioRef = useRef(null);
  const objectUrlRef = useRef("");
  const ttsAbortRef = useRef(null);
  const autoPlayPendingRef = useRef(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const heardTextRef = useRef("");
  const manualStopRef = useRef(false);
  const submitQuestionRef = useRef(null);

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
        `Q: ${normalizeText(lastQuestion || question)}`,
        `A: ${normalizeText(reply.answer)}`,
        buildGuideUrl(),
      ].join("\n");

    return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  }, [lastQuestion, question, reply]);

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

  const submitQuestion = async (rawQuestion) => {
    const trimmedQuestion = normalizeText(rawQuestion);
    if (trimmedQuestion.length < 3 || loading) {
      return;
    }

    clearAudio();
    setLoading(true);
    setError("");
    setListeningError("");
    setLastQuestion(trimmedQuestion);
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

  useEffect(() => {
    submitQuestionRef.current = submitQuestion;
  });

  useEffect(() => {
    return () => {
      if (ttsAbortRef.current) {
        ttsAbortRef.current.abort();
        ttsAbortRef.current = null;
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore shutdown race
        }
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = "";
      }
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) {
      setListeningSupported(false);
      setShowTextComposer(true);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = RECOGNITION_LANGUAGE;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      manualStopRef.current = false;
      finalTranscriptRef.current = "";
      heardTextRef.current = "";
      setHeardText("");
      setIsListening(true);
      setListeningError("");
      setError("");
      clearAudio();
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i]?.[0]?.transcript || "";
        if (event.results[i]?.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const nextTranscript = normalizeText(finalTranscript || interimTranscript);
      if (finalTranscript) {
        finalTranscriptRef.current = normalizeText(
          `${finalTranscriptRef.current} ${finalTranscript}`,
        );
      }
      heardTextRef.current = nextTranscript || finalTranscriptRef.current;
      setHeardText(heardTextRef.current);
    };

    recognition.onerror = (event) => {
      const message = describeRecognitionError(event?.error);
      if (message) {
        setListeningError(message);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      const transcript = normalizeText(
        finalTranscriptRef.current || heardTextRef.current,
      );

      if (transcript.length >= 3) {
        setQuestion(transcript);
        setHeardText(transcript);
        heardTextRef.current = transcript;
        setShowTextComposer(false);
        void submitQuestionRef.current?.(transcript);
        return;
      }

      if (!manualStopRef.current) {
        setListeningError(
          "I did not catch a usable question. Try again or switch to typing.",
        );
      }
    };

    recognitionRef.current = recognition;
    setListeningSupported(true);

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        // ignore shutdown race
      }
      recognitionRef.current = null;
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
    await submitQuestion(question);
  };

  const handleMicToggle = () => {
    if (loading) {
      return;
    }

    if (!recognitionRef.current || !listeningSupported) {
      setShowTextComposer(true);
      setListeningError("Voice capture is not available here. Type your question instead.");
      return;
    }

    if (isListening) {
      manualStopRef.current = true;
      recognitionRef.current.stop();
      return;
    }

    setListeningError("");
    setError("");
    try {
      recognitionRef.current.start();
    } catch {
      setListeningError(
        "Microphone capture is busy right now. Wait a moment and try again.",
      );
    }
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
        p: { xs: 2.75, md: 4 },
        borderRadius: 5,
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.18),
        backgroundImage:
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 30%), linear-gradient(180deg, rgba(10, 18, 28, 0.98), rgba(5, 10, 18, 1))"
            : "radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 28%), linear-gradient(180deg, rgba(250, 252, 255, 0.98), rgba(241, 247, 255, 0.98))",
        boxShadow: `0 26px 56px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.28 : 0.08)}`,
      })}
    >
      <Stack spacing={2.5}>
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip size="small" color="primary" label="Audio-first beta" />
            <Chip size="small" variant="outlined" label="Voice reply" />
            <Chip size="small" variant="outlined" label="WhatsApp share" />
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 800, maxWidth: 760 }}>
            Speak your question first
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
            Tap the mic, ask for medicines, groceries, taxis, or repairs, and
            the guide will answer back in voice. Typing is still available, but
            it is now a fallback instead of the main path.
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 2.25, md: 3 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: alpha(
              isListening ? theme.palette.primary.main : theme.palette.divider,
              isListening ? 0.35 : 0.9,
            ),
            backgroundColor: isListening
              ? alpha(theme.palette.primary.main, 0.08)
              : alpha(theme.palette.background.paper, 0.82),
          })}
        >
          <Stack spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
            <Stack spacing={1} alignItems={{ xs: "flex-start", md: "center" }}>
              <Box
                sx={(theme) => ({
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                })}
              >
                <SmartToyRoundedIcon color="primary" sx={{ fontSize: 44 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {isListening ? "Listening now…" : "Ready to listen"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680 }}>
                {isListening
                  ? "Speak normally. The page will capture your question and submit it as soon as you stop."
                  : "Try a natural question like “Which pharmacy should we try first?” or “Where can we get milk nearby?”"}
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <Button
                type="button"
                variant="contained"
                size="large"
                onClick={handleMicToggle}
                disabled={loading}
                startIcon={isListening ? <StopRoundedIcon /> : <MicRoundedIcon />}
                sx={{
                  minWidth: 220,
                  minHeight: 52,
                  borderRadius: 999,
                }}
              >
                {isListening ? "Stop listening" : "Tap to speak"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={() => setShowTextComposer((current) => !current)}
                startIcon={<KeyboardRoundedIcon />}
                sx={{ minWidth: 180, minHeight: 52, borderRadius: 999 }}
              >
                {showTextComposer ? "Hide typing" : "Type instead"}
              </Button>
            </Stack>

            {heardText ? (
              <Paper
                elevation={0}
                sx={(theme) => ({
                  width: "100%",
                  maxWidth: 760,
                  p: 1.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.14),
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                })}
              >
                <Typography variant="caption" color="text.secondary">
                  Heard
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {heardText}
                </Typography>
              </Paper>
            ) : null}

            <Collapse in={showTextComposer} sx={{ width: "100%" }}>
              <Stack
                component="form"
                spacing={1.5}
                onSubmit={handleSubmit}
                sx={{ width: "100%", maxWidth: 760, mx: "auto" }}
              >
                <TextField
                  multiline
                  minRows={2}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  label="Type a question instead"
                  placeholder="Which pharmacy should we try first for repeat medicines?"
                  helperText="Typing is the fallback path if microphone capture is unavailable."
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!canSubmit}
                    startIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <KeyboardRoundedIcon />
                      )
                    }
                    sx={{ borderRadius: 999 }}
                  >
                    {loading ? "Checking guide…" : "Ask by text"}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      setQuestion("");
                      setShowTextComposer(false);
                    }}
                    sx={{ borderRadius: 999 }}
                  >
                    Clear typed question
                  </Button>
                </Stack>
              </Stack>
            </Collapse>
          </Stack>
        </Paper>

        {!listeningSupported ? (
          <Alert severity="info">
            Voice capture is not available in this browser, so the assistant is
            falling back to typing for the question while keeping spoken replies.
          </Alert>
        ) : null}

        {listeningError ? <Alert severity="warning">{listeningError}</Alert> : null}
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
                {lastQuestion ? (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Question
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.35, fontWeight: 600 }}>
                      {lastQuestion}
                    </Typography>
                  </Box>
                ) : null}

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Spoken reply
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, whiteSpace: "pre-line" }}>
                    {reply.answer}
                  </Typography>
                </Box>

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
                  {reply.suggestedListings.map((listing) => {
                    const contactNumbers = getContactNumbers(listing);

                    return (
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
                          {contactNumbers.length ? (
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              {contactNumbers.map((contact) => (
                                <Button
                                  key={`${listing.name}:${contact.label}:${contact.tel}`}
                                  size="small"
                                  variant="outlined"
                                  component="a"
                                  href={buildTelephoneHref(contact.tel)}
                                  startIcon={<CallRoundedIcon />}
                                >
                                  {contact.label}: {contact.display}
                                </Button>
                              ))}
                            </Stack>
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
                    );
                  })}
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
