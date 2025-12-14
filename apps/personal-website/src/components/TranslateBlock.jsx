import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import TranslateIcon from "@mui/icons-material/GTranslate";

const LANGUAGES = [
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
];

export default function TranslateBlock({ slug, articleRef }) {
  const [open, setOpen] = useState(false);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [activeLang, setActiveLang] = useState("");

  const hasArticleContent = Boolean(articleRef?.current?.innerText?.trim());

  const apiBase = useMemo(() => {
    if (import.meta.env?.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
    if (typeof window === "undefined") return "";
    if (window.location.port === "5173") {
      return "http://localhost:" + (import.meta.env?.VITE_VERCEL_DEV_PORT || "3000");
    }
    return "";
  }, []);

  const getArticleText = () => {
    const raw = articleRef?.current?.innerText;
    if (!raw) return "";
    return raw.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  };

  const handleTranslate = async (code) => {
    setError("");
    const text = getArticleText();
    if (!text) {
      setError("Content not ready yet. Try again in a moment.");
      return;
    }

    if (translations[code]) {
      setActiveLang(code);
      setOpen(true);
      return;
    }

    setLoading(code);
    try {
      const response = await fetch(`${apiBase}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, slug, target: code }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || payload.detail || "Translation failed");
      }
      const payload = await response.json();
      setTranslations((prev) => ({ ...prev, [code]: payload.translated }));
      setActiveLang(code);
      setOpen(true);
    } catch (err) {
      setError(err?.message || "Translation failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        mt: 2,
        p: { xs: 2, md: 2.5 },
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor:
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "rgba(248, 250, 252, 0.85)",
      })}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <TranslateIcon fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Translate
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Powered by OpenAI. View quick Hindi or Tamil versions without clutter.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {LANGUAGES.map((lang) => (
            <Button
              key={lang.code}
              variant="outlined"
              size="small"
              onClick={() => handleTranslate(lang.code)}
              disabled={loading !== null || !hasArticleContent}
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600 }}
            >
              {loading === lang.code ? (
                <CircularProgress size={18} />
              ) : (
                `Read in ${lang.label}`
              )}
            </Button>
          ))}
          <Button
            variant="text"
            size="small"
            onClick={() => setOpen((prev) => !prev)}
            disabled={!Object.keys(translations).length}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {open ? "Hide translations" : "Show translations"}
          </Button>
        </Stack>
      </Stack>

      <Collapse in={Boolean(error)} unmountOnExit>
        <Alert severity="warning" sx={{ mt: 1.5 }}>
          {error}
        </Alert>
      </Collapse>

      <Collapse in={open && Boolean(activeLang && translations[activeLang])} unmountOnExit>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {(() => {
            const lang = LANGUAGES.find((l) => l.code === activeLang);
            const copy = translations[activeLang];
            if (!lang || !copy) return null;
            return (
              <Paper
                key={lang.code}
                variant="outlined"
                sx={(theme) => ({
                  p: { xs: 1.75, md: 2 },
                  borderRadius: 2,
                  borderColor: theme.palette.divider,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.9)",
                })}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 1, color: "text.secondary" }}
                >
                  {lang.label}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: "1rem" }}
                >
                  {copy}
                </Typography>
              </Paper>
            );
          })()}
        </Stack>
      </Collapse>
    </Paper>
  );
}
