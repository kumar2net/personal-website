import { useEffect, useMemo, useState } from "react";
import {
  Box,
  ButtonBase,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";
import { getReactions, saveReaction } from "../../../lib/engagement/blob";

const REACTIONS = [
  { emoji: "❤️", label: "Loved it" },
  { emoji: "😂", label: "Made me smile" },
  { emoji: "🤔", label: "Made me think" },
  { emoji: "👍", label: "Useful" },
  { emoji: "😮", label: "Surprised me" },
  { emoji: "🙏", label: "Grateful" },
];

const bounce = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.35); }
  55% { transform: scale(0.92); }
  100% { transform: scale(1); }
`;

const burst = keyframes`
  0% { opacity: 0.4; transform: scale(0.6); }
  60% { opacity: 0.15; }
  100% { opacity: 0; transform: scale(1.7); }
`;

export default function ReactionBar({ slug }) {
  const [counts, setCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pulseMap, setPulseMap] = useState({});
  const safeSlug = typeof slug === "string" && slug.trim() ? slug.trim() : "global";

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError("");
    setCounts({});

    getReactions(safeSlug)
      .then((data) => {
        if (cancelled) return;
        const nextCounts = data?.counts || data || {};
        setCounts(nextCounts);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load reactions yet.");
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

  const totalReactions = useMemo(
    () =>
      REACTIONS.reduce(
        (sum, item) => sum + (counts[item.emoji] ? Number(counts[item.emoji]) : 0),
        0,
      ),
    [counts],
  );

  const handleReact = async (emoji) => {
    setError("");
    setCounts((prev) => ({
      ...prev,
      [emoji]: (prev?.[emoji] || 0) + 1,
    }));
    setPulseMap((prev) => ({ ...prev, [emoji]: Date.now() }));

    try {
      const next = await saveReaction(safeSlug, emoji);
      if (next?.counts) {
        setCounts(next.counts);
      }
    } catch (err) {
      setCounts((prev) => {
        const adjusted = { ...prev };
        adjusted[emoji] = Math.max(0, (adjusted[emoji] || 1) - 1);
        if (!adjusted[emoji]) {
          delete adjusted[emoji];
        }
        return adjusted;
      });
      setError(err?.message || "Reaction did not stick. Try again?");
    }
  };

  return (
    <Box
      sx={(theme) => ({
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        background: alpha(theme.palette.primary.main, 0.03),
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      })}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" fontWeight={600}>
          Quick Reactions
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            size="small"
            label={`${totalReactions} ${totalReactions === 1 ? "tap" : "taps"}`}
            variant="outlined"
          />
          {isLoading && <CircularProgress size={16} thickness={5} />}
        </Stack>
      </Stack>
      <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
        {REACTIONS.map(({ emoji, label }) => (
          <ButtonBase
            key={emoji}
            onClick={() => handleReact(emoji)}
            sx={(theme) => ({
              position: "relative",
              flex: "1 1 88px",
              minWidth: 82,
              borderRadius: 2.5,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.06),
              px: 1.25,
              py: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              transition: "transform 120ms ease, box-shadow 120ms ease",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
              '&:hover': {
                transform: "translateY(-2px)",
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.14)",
              },
            })}
            aria-label={label}
          >
            <Box sx={{ position: "relative", minHeight: 32 }}>
              <Box
                key={pulseMap[emoji] || "idle"}
                component="span"
                sx={{
                  fontSize: 24,
                  display: "inline-flex",
                  animation: pulseMap[emoji] ? `${bounce} 420ms ease` : "none",
                }}
              >
                {emoji}
              </Box>
              {pulseMap[emoji] && (
                <Box
                  key={`burst-${pulseMap[emoji]}`}
                  sx={(theme) => ({
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 34,
                    height: 34,
                    marginTop: "-17px",
                    marginLeft: "-17px",
                    borderRadius: "50%",
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    animation: `${burst} 480ms ease`,
                    pointerEvents: "none",
                  })}
                />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {counts?.[emoji] || 0}
            </Typography>
          </ButtonBase>
        ))}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Tap to react — updates save in the background instantly.
      </Typography>
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
}
