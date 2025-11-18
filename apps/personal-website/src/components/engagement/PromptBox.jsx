import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";
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
          setError("Couldn't load prompt replies yet.");
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
    <Card
      elevation={0}
      sx={(theme) => ({
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
        background: alpha(theme.palette.secondary.main, 0.04),
      })}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" fontWeight={600}>
              Weekly Prompt
            </Typography>
            <Chip label="New each week" size="small" variant="outlined" />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {promptQuestion}
          </Typography>
        </Stack>

        <TextField
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Keep it crisp — 5 to 10 words."
          multiline
          minRows={2}
          maxRows={3}
          size="small"
          variant="outlined"
          fullWidth
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="caption"
            color={isWordCountValid ? "text.secondary" : "error"}
          >
            Words: {wordCount} • target 5–10
          </Typography>
          <Button
            size="small"
            variant="contained"
            disableElevation
            onClick={handleSubmit}
            disabled={
              !answer.trim() || wordCount < 5 || wordCount > 10 || isSaving || isLoading
            }
          >
            {isSaving ? "Saving…" : "Send"}
          </Button>
        </Stack>

        {success && (
          <Typography variant="caption" color="success.main">
            Saved anonymously ✓
          </Typography>
        )}
        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}

        <Divider />

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" fontWeight={600}>
              Recent whispers
            </Typography>
            {isLoading && <Chip size="small" label="Loading…" />}
          </Stack>
          {visibleEntries.length === 0 && !isLoading ? (
            <Typography variant="caption" color="text.secondary">
              No replies yet — be the first to leave a spark.
            </Typography>
          ) : (
            <Stack spacing={1.5} mt={1.5}>
              {visibleEntries.map((entry) => (
                <Box
                  key={`${entry.anonymousID}-${entry.timestamp}`}
                  sx={(theme) => ({
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    p: 1.25,
                  })}
                >
                  <Typography variant="body2" color="text.primary">
                    {entry.answer}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={formatDistanceToNow(new Date(entry.timestamp), {
                        addSuffix: true,
                      })}
                    />
                    <Typography variant="caption" color="text.secondary">
                      anon-{entry.anonymousID.slice(-4)}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
