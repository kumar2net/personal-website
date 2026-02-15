import { useCallback, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const MODES = [
  {
    key: "quick",
    label: "Quick",
  },
  {
    key: "practical",
    label: "Practical",
  },
  {
    key: "deep",
    label: "Deep",
  },
];

const ENDPOINT =
  import.meta.env.VITE_AGI_ENDPOINT?.trim() || "/api/agi";
const parseClientInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const MAX_INPUT_CHARS = parseClientInt(
  import.meta.env.VITE_AGI_MAX_CHARS,
  2400,
);
const ENDPOINTS = Array.from(
  new Set(
    [ENDPOINT, "/api/agi"].filter(Boolean),
  ),
);

const USAGE_HINTS = [
  "1) Pick a mode: Quick = action-now, Practical = plan, Deep = strategy.",
  '2) Ask for one specific outcome, e.g., "Help me plan a 30-day side project sprint."',
  "3) Tap a suggested action to continue instantly.",
];

export default function AGIAssistant() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState(MODES[0].key);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const canSubmit = useMemo(() => {
    const length = prompt.trim().length;
    return length >= 12 && !loading;
  }, [prompt, loading]);

  const safePrompt = useMemo(() => prompt.trim().slice(0, MAX_INPUT_CHARS), [prompt]);
  const hasResult = Boolean(result?.answer);

  const onSubmit = useCallback(
    async (event) => {
      event?.preventDefault?.();
      if (!canSubmit) {
        return;
      }

      setLoading(true);
      setError("");
      setResult(null);

      const payload = {
        prompt: safePrompt,
        mode,
      };

      let response = null;
      let lastError = null;

      try {
        for (const endpoint of ENDPOINTS) {
          try {
            const candidate = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (!candidate.ok) {
              const text = await candidate.text();
              lastError = new Error(text || `HTTP ${candidate.status}`);
              continue;
            }

            response = await candidate.json();
            break;
          } catch (err) {
            lastError = err;
          }
        }

        if (!response) {
          setError(
            lastError?.message ||
              "AGI assistant is temporarily unavailable. Try again in a bit.",
          );
          return;
        }

        if (response.error) {
          setError(
            response.detail
              ? `${response.error} (${response.detail})`
              : response.error,
          );
          return;
        }

        const nextActions = Array.isArray(response.nextActions)
          ? response.nextActions
          : [];

        setResult({
          answer: response.answer || "",
          nextActions,
          caveat: response.caveat || "",
          contextUsed: Boolean(response.contextUsed),
          contextAttempted: Boolean(response.contextAttempted),
          contextSources: Array.isArray(response.contextSources)
            ? response.contextSources
            : [],
          model: response.model || "unknown",
          mode: response.mode || mode,
          inputHash: response.inputHash || "",
        });
      } catch (error) {
        setError(error?.message || "Unexpected error while generating steps.");
      } finally {
        setLoading(false);
      }
    },
    [canSubmit, mode, safePrompt],
  );

  const applyAction = useCallback((action) => {
    if (!action) {
      return;
    }
    setPrompt(action);
    setResult(null);
    setError("");
  }, []);

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(2, 6, 23, 0.72)"
            : "rgba(255, 255, 255, 0.82)",
        backdropFilter: "blur(10px)",
      })}
    >
      <Stack spacing={2}>
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 2,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "flex-start",
            gap: 0.5,
          }}
        >
          AGI Quick Step
          <Box
            component="span"
            sx={{
              fontSize: "0.58rem",
              lineHeight: 1,
              verticalAlign: "super",
              mt: 0.5,
              opacity: 0.75,
            }}
          >
            Pilot
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          One question. Choose a mode. Get practical next actions in under a minute.
        </Typography>
        <Box
          sx={{
            p: 1.25,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "rgba(148, 163, 184, 0.08)",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            How to use this fast:
          </Typography>
          <Stack spacing={0.2} sx={{ mt: 0.3 }}>
            {USAGE_HINTS.map((hint) => (
              <Typography
                key={hint}
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                {hint}
              </Typography>
            ))}
          </Stack>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          {MODES.map((option) => (
            <Chip
              key={option.key}
              label={option.label}
              color={mode === option.key ? "primary" : "default"}
              variant={mode === option.key ? "filled" : "outlined"}
              onClick={() => setMode(option.key)}
              disabled={loading}
              clickable
              sx={{ borderRadius: 99 }}
            />
          ))}
        </Stack>

        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={1.5}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={5}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask for clarity, a plan, a compare, or an execution checklist."
              disabled={loading}
              helperText={`${safePrompt.length}/${MAX_INPUT_CHARS} characters`}
              inputProps={{
                maxLength: MAX_INPUT_CHARS,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!canSubmit}
              startIcon={
                loading ? <CircularProgress size={16} color="inherit" /> : null
              }
              sx={{
                alignSelf: "flex-start",
                borderRadius: 99,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              {loading ? "Thinking…" : "Get steps"}
            </Button>
          </Stack>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        ) : null}

        {!error && !result && loading ? (
          <Typography variant="caption" color="text.secondary">
            Finding your best next action now.
          </Typography>
        ) : null}

        {hasResult ? (
          <Box
            sx={{
              mt: 1,
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" fontWeight={600}>
                Here’s the next move
              </Typography>
              <Typography variant="body2">{result.answer}</Typography>

              {result.nextActions.length > 0 ? (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ textTransform: "uppercase", color: "text.secondary" }}
                  >
                    Next actions
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={0.9}>
                    {result.nextActions.map((action, index) => (
                      <Button
                        key={action || index}
                        size="small"
                        variant="text"
                        onClick={() => applyAction(action)}
                        sx={{ justifyContent: "flex-start", px: 1 }}
                      >
                        {action}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              ) : null}

              <Typography variant="caption" color="text.secondary">
                Mode: {result.mode}. Model: {result.model}
              </Typography>
              {result.caveat ? (
                <Typography variant="caption" color="text.secondary">
                  Caveat: {result.caveat}
                </Typography>
              ) : null}

              {result.contextAttempted ? (
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.4 }}
                  >
                    Context source:
                  </Typography>
                  {result.contextSources?.length ? (
                    <Stack
                      direction="column"
                      spacing={0.6}
                      sx={{ mt: 0.3 }}
                    >
                      {result.contextSources.map((source) => (
                        <Typography
                          key={`${source.url || source.title}-${source.id || "source"}`}
                          component={Link}
                          href={source.url || "#"}
                          variant="caption"
                          color="text.secondary"
                          underline="hover"
                          target="_blank"
                          rel="noreferrer"
                          sx={{
                            lineHeight: 1.6,
                          }}
                        >
                          {`${source.source ? `${source.source.toUpperCase()}: ` : ""}${source.title || source.url}`}
                        </Typography>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No close match found in blog content for this query. I answered from general reasoning.
                    </Typography>
                  )}
                </Box>
              ) : null}
            </Stack>
          </Box>
        ) : null}
      </Stack>
    </Paper>
  );
}
