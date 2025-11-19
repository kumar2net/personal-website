import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Send as SendIcon } from "@mui/icons-material";
import { getPrompts, savePrompt } from "../../../lib/engagement/blob";

const PROMPTS = [
  "Which detail from this page should I amplify next week?",
  "What is one tiny action you feel inspired to take after reading?",
  "Describe the vibe of this post in five to ten words.",
];

const getWeeklyPrompt = () => {
  const now = Date.now();
  const weekIndex = Math.floor(now / (7 * 24 * 60 * 60 * 1000));
  return PROMPTS[weekIndex % PROMPTS.length];
};

const getWordCount = (value) =>
  value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;

export default function PromptBox({ slug }) {
  const theme = useTheme();
  const [answer, setAnswer] = useState("");
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const safeSlug = typeof slug === "string" && slug.trim() ? slug.trim() : "global";

  const promptQuestion = getWeeklyPrompt();
  const wordCount = getWordCount(answer);
  const isWordCountValid = wordCount === 0 || (wordCount >= 5 && wordCount <= 10);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError("");
    setEntries([]);

    getPrompts(safeSlug)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.entries)
            ? data.entries
            : [];
        setEntries(list);
      })
      .catch(() => {
        if (!cancelled) {
          // Silent fail or minimal error
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
  }, [safeSlug]);

  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => setSuccess(false), 2800);
    return () => clearTimeout(timer);
  }, [success]);

  const handleSubmit = async () => {
    const trimmed = answer.trim();
    if (!trimmed || wordCount < 5 || wordCount > 10 || isSaving) {
      return;
    }

    const optimisticId = `local-${Date.now()}`;
    const optimisticEntry = {
      anonymousID: optimisticId,
      answer: trimmed,
      timestamp: new Date().toISOString(),
      optimistic: true,
    };
    setEntries((prev) => [optimisticEntry, ...prev].slice(0, 6));
    setAnswer("");
    setError("");
    setIsSaving(true);

    try {
      const payload = await savePrompt(safeSlug, trimmed);
      if (Array.isArray(payload?.entries)) {
        setEntries(payload.entries);
      } else {
        setEntries((prev) => prev.filter((entry) => entry.anonymousID !== optimisticId));
      }
      setSuccess(true);
    } catch (err) {
      setEntries((prev) => prev.filter((entry) => entry.anonymousID !== optimisticId));
      setAnswer(trimmed);
      setError(err?.message || "Reply could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  const visibleEntries = entries.slice(0, 3);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      sx={{
        position: "relative",
        mt: 8,
        mb: 4,
        p: 3,
        borderRadius: "24px",
        background: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: theme.palette.mode === 'dark'
          ? `0 8px 32px ${alpha('#000', 0.4)}`
          : `0 8px 32px ${alpha('#000', 0.05)}`,
        overflow: "hidden"
      }}
    >
      {/* Decorative gradient blob */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Stack spacing={3} sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1.1rem", color: 'text.primary' }}>
              Weekly Whisper
            </Typography>
            <Chip
              label="New"
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 700,
                background: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                border: 'none'
              }}
            />
          </Stack>
          <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.5, color: 'text.primary' }}>
            {promptQuestion}
          </Typography>
        </Stack>

        <Box>
          <TextField
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Share your thought (5-10 words)..."
            multiline
            minRows={2}
            maxRows={4}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                color: 'text.primary',
                "& fieldset": {
                  borderColor: alpha(theme.palette.divider, 0.2),
                },
                "&:hover fieldset": {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiInputBase-input": {
                color: 'text.primary',
              },
              "& .MuiInputBase-input::placeholder": {
                color: 'text.secondary',
                opacity: 1,
              },
              "& .MuiInputBase-root": {
                color: 'text.primary',
              }
            }}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 1.5, px: 0.5 }}
          >
            <Typography
              variant="caption"
              sx={{
                color: isWordCountValid ? "text.secondary" : "error.main",
                fontWeight: 500,
                transition: "color 0.2s"
              }}
            >
              {wordCount} words <span style={{ opacity: 0.5 }}>(target 5–10)</span>
            </Typography>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!answer.trim() || wordCount < 5 || wordCount > 10 || isSaving || isLoading}
              endIcon={!isSaving && <SendIcon sx={{ fontSize: "1rem !important" }} />}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                px: 3,
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }
              }}
            >
              {isSaving ? "Saving..." : "Whisper"}
            </Button>
          </Stack>

          <AnimatePresence>
            {(success || error) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Typography
                  variant="caption"
                  color={error ? "error" : "success.main"}
                  sx={{ display: "block", mt: 1, fontWeight: 600 }}
                >
                  {error || "Saved anonymously. Thank you."}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {visibleEntries.length > 0 && (
          <Box>
            <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.divider, 0.1) }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.75rem" }}>
              Recent Whispers
            </Typography>
            <Stack spacing={2}>
              <AnimatePresence mode="popLayout">
                {visibleEntries.map((entry) => (
                  <motion.div
                    key={`${entry.anonymousID}-${entry.timestamp}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        backgroundColor: alpha(theme.palette.background.default, 0.4),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1, color: 'text.primary' }}>
                        "{entry.answer}"
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: alpha(theme.palette.text.secondary, 0.3) }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                        </Typography>
                      </Stack>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
