import { Suspense, lazy } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, darken, keyframes } from "@mui/material/styles";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import { FaTwitter, FaWordpress } from "react-icons/fa";
import SEO from "../components/SEO";
import { homeFeaturedPosts } from "../data/homeFeaturedPosts";

const WorldClock = lazy(() => import("../components/WorldClock"));

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

function revealUpSx(delay = 0, duration = 0.45) {
  return {
    animation: `${fadeUp} ${duration}s cubic-bezier(0.22, 1, 0.36, 1) both`,
    animationDelay: `${delay}s`,
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 1,
      transform: "none",
    },
  };
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const dayThemePlans = [
  {
    edition: "Sunday Reset",
    checkpoint: "Sunday checkpoint",
    rhythm: "coastal reset",
    paletteTone: "seagrass teal, lagoon blue, marigold, and rose",
    useLine:
      "read the family note, keep one science idea close, check the signal, and let the week start with curiosity",
  },
  {
    edition: "Monday Launchpad",
    checkpoint: "Monday checkpoint",
    rhythm: "launch",
    useLine: "pick the signal, clear one route, and start with less ceremony",
  },
  {
    edition: "Tuesday Signal Desk",
    checkpoint: "Tuesday checkpoint",
    rhythm: "signal",
    useLine: "check the data, sharpen one draft, and keep the work visible",
  },
  {
    edition: "Wednesday Workbench",
    checkpoint: "Wednesday checkpoint",
    rhythm: "midweek",
    useLine: "trim the noise, keep the useful links close, and finish the next pass",
  },
  {
    edition: "Thursday Field Notes",
    checkpoint: "Thursday checkpoint",
    rhythm: "field-note",
    useLine: "connect the notes, test the assumptions, and leave a cleaner trail",
  },
  {
    edition: "Friday Closeout",
    checkpoint: "Friday checkpoint",
    rhythm: "closeout",
    useLine: "close the loops, save the durable signal, and make room for the reset",
  },
  {
    edition: "Saturday Workbench",
    checkpoint: "Saturday checkpoint",
    rhythm: "warm weekend",
    paletteTone: "teal, marigold, rose, and quiet ink",
    useLine:
      "read the Markdown map, check the pulse, keep the music nearby, and let the weekend colors slow the desk down",
  },
];

function getCurrentDayTheme(date = new Date()) {
  const plan = dayThemePlans[date.getDay()] ?? dayThemePlans[6];
  const dateLabel = dateFormatter.format(date);
  const shortDateLabel = shortDateFormatter.format(date);

  return {
    ...plan,
    dateLabel,
    shortDateLabel,
    editionLabel: `${plan.edition} · ${dateLabel}`,
    sourceLabel: `${plan.checkpoint}: ${dateLabel}`,
    heroTitle: `${plan.edition}: ${plan.paletteTone ?? "Markdown, signal, music"}.`,
    seoDescription: `${plan.edition} for ${dateLabel}: a ${plan.rhythm} homepage palette with prompt structure notes, key data, health explainers, music notes, learning routes, and grounded reflection.`,
    heroCopy: `As of ${dateLabel}, the homepage is tuned to a ${plan.rhythm} mood with ${plan.paletteTone ?? "clear signal colors"}: a proud family note on seagrass science, a quick data pulse, readable health explainers, and music close enough to reset the desk. The lens stays simple: explain what matters, lower the noise, and keep the human stack visible.`,
    moodTags: [
      shortDateLabel,
      plan.rhythm,
      "Seagrass teal",
      "Lagoon blue",
      "Family + STEM",
    ],
  };
}

const homeAccents = {
  prompt: "#0f766e",
  signal: "#2563eb",
  care: "#d97706",
  music: "#be123c",
  route: "#334155",
};

const moodSwatches = [
  {
    name: "Seagrass Teal",
    hex: homeAccents.prompt,
    meaning:
      "Science and writing stay rooted in living systems, not abstract ceremony.",
  },
  {
    name: "Lagoon Blue",
    hex: homeAccents.signal,
    meaning:
      "Waves, data, routes, and site navigation stay clear enough to act on.",
  },
  {
    name: "Care Marigold",
    hex: homeAccents.care,
    meaning:
      "Health explainers and medicine notes keep the human scale visible.",
  },
  {
    name: "Reset Rose",
    hex: homeAccents.music,
    meaning:
      "Family, music, and personal notes keep the technical desk from going sterile.",
  },
];

const worldPulse = [
  {
    eyebrow: "Family + STEM",
    title: "From seagrass meadows to Ocean Engineering",
    summary:
      "Today's lead note celebrates Namritha's thesis defense, the science of seagrass and sediment transport, and a funded PhD in Ocean Engineering.",
    to: "/blog/2026-06-07-seagrass-meadows-ocean-engineering-namritha",
    analyticsKey: "home_latest_namritha_seagrass",
    accent: homeAccents.prompt,
    icon: ScienceRoundedIcon,
    cta: "Read the family note",
  },
  {
    eyebrow: "Signal check",
    title: "Keep the data useful, not compulsive",
    summary:
      "Key Data remains the quick orientation layer: enough market and macro signal to stay awake, not enough noise to hijack the day.",
    to: "/keydata",
    analyticsKey: "home_latest_keydata_pulse",
    accent: homeAccents.signal,
    icon: QueryStatsRoundedIcon,
    cta: "Open key data",
  },
  {
    eyebrow: "Care stack",
    title: "Health notes still need plain language",
    summary:
      "The drug-combination note keeps the medical parts readable: what is tested, what is not, and what questions are worth asking.",
    to: "/blog/2026-04-11-reply-diabetes-cardio-antibiotic-drug-combinations",
    analyticsKey: "home_latest_health_clarity",
    accent: homeAccents.care,
    icon: HealthAndSafetyRoundedIcon,
    cta: "Read the health note",
  },
  {
    eyebrow: "Personal reset",
    title: "Music keeps the workbench human",
    summary:
      "Recent spins and the small ritual of listening belong beside the technical notes. The desk needs both.",
    to: "/music",
    analyticsKey: "home_latest_music_reset",
    accent: homeAccents.music,
    icon: MusicNoteRoundedIcon,
    cta: "Open music",
  },
];

const siteVectors = [
  {
    eyebrow: "Science",
    title: "Start with the coastal note",
    summary:
      "Namritha's seagrass work is the right Sunday opener: family pride, field science, coastal resilience, and the next step into Ocean Engineering.",
    to: "/blog/2026-06-07-seagrass-meadows-ocean-engineering-namritha",
    analyticsKey: "home_vector_namritha_seagrass",
    accent: homeAccents.prompt,
    icon: ScienceRoundedIcon,
    cta: "Read the family note",
  },
  {
    eyebrow: "Pulse",
    title: "Then check the outside signal",
    summary:
      "Key Data is still the compact pulse check: crude, markets, volatility, and a few numbers that are useful enough.",
    to: "/keydata",
    analyticsKey: "home_vector_keydata",
    accent: homeAccents.signal,
    icon: QueryStatsRoundedIcon,
    cta: "Open key data",
  },
  {
    eyebrow: "Care",
    title: "Then keep the body notes readable",
    summary:
      "Drug combinations, clinical trials, reports, and family health questions all deserve language that a patient can actually use.",
    to: "/blog/2026-04-11-reply-diabetes-cardio-antibiotic-drug-combinations",
    analyticsKey: "home_vector_health_notes",
    accent: homeAccents.care,
    icon: HealthAndSafetyRoundedIcon,
    cta: "Read the health note",
  },
  {
    eyebrow: "Music",
    title: "Then leave room for the reset",
    summary:
      "The Music page is the non-dashboard part of the site: recent spins, listening notes, and the small reset that keeps the desk human.",
    to: "/music",
    analyticsKey: "home_vector_music_reset",
    accent: homeAccents.music,
    icon: MusicNoteRoundedIcon,
    cta: "Open music",
  },
];

const quickLinks = [
  { label: "About", to: "/about", analyticsKey: "home_quick_about" },
  { label: "Blog", to: "/blog", analyticsKey: "home_quick_blog" },
  { label: "Learning", to: "/learning", analyticsKey: "home_quick_learning" },
  { label: "Album", to: "/album", analyticsKey: "home_quick_album" },
  {
    label: "Elsewhere",
    to: "/elsewhere",
    analyticsKey: "home_quick_elsewhere",
  },
];

const socialLinks = [
  {
    href: "https://kumar2net.wordpress.com/",
    label: "WordPress",
    icon: <FaWordpress />,
    analyticsKey: "social_wordpress",
  },
  {
    href: "https://twitter.com/kumar2net",
    label: "X (Twitter)",
    icon: <FaTwitter />,
    analyticsKey: "social_twitter",
  },
];

function Home({ isDarkMode, showWorldClock, trackClick }) {
  const heroFont =
    '"Space Grotesk", "IBM Plex Sans", "Avenir Next", "Noto Sans", sans-serif';
  const featuredPosts = homeFeaturedPosts;
  const dayTheme = getCurrentDayTheme();

  return (
    <Box
      sx={{
        ...revealUpSx(),
        "--home-surface": isDarkMode
          ? "rgba(16, 22, 32, 0.96)"
          : "rgba(255, 252, 247, 0.98)",
        "--home-surface-muted": isDarkMode
          ? "rgba(22, 30, 43, 0.96)"
          : "rgba(250, 247, 241, 0.98)",
        "--home-border": isDarkMode
          ? "rgba(148, 163, 184, 0.28)"
          : "rgba(120, 113, 108, 0.24)",
        "--home-muted-text": isDarkMode
          ? "rgba(226, 232, 240, 0.74)"
          : "rgba(68, 64, 60, 0.86)",
        "--home-ink": isDarkMode ? "#f8fafc" : "#1c1917",
        "--home-accent": homeAccents.prompt,
        "--home-accent-strong": isDarkMode ? "#5eead4" : homeAccents.prompt,
        "--home-shadow": isDarkMode
          ? "0 24px 70px rgba(0, 0, 0, 0.4)"
          : "0 18px 48px rgba(41, 37, 36, 0.12)",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, md: 4 },
        width: "100%",
        maxWidth: 1120,
        mx: "auto",
      }}
    >
      <SEO
        title="Home"
        description={dayTheme.seoDescription}
        canonicalPath="/"
        image="/media/blogwordcloud.png"
        type="website"
      />

      <Grid container spacing={2.5} alignItems="stretch">
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              ...revealUpSx(0.05, 0.5),
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
              p: { xs: 3, md: 5 },
              border: "1px solid var(--home-border)",
              backgroundImage: isDarkMode
                ? "linear-gradient(135deg, rgba(15, 118, 110, 0.24) 0%, rgba(16, 22, 32, 0.98) 34%, rgba(49, 46, 129, 0.32) 68%, rgba(190, 18, 60, 0.18) 100%)"
                : "linear-gradient(135deg, rgba(240, 253, 250, 0.98) 0%, rgba(255, 251, 235, 0.98) 38%, rgba(250, 247, 241, 0.98) 70%, rgba(255, 241, 242, 0.96) 100%)",
              boxShadow: "var(--home-shadow)",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(120deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 30%), repeating-linear-gradient(0deg, rgba(15, 118, 110, 0.08) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(217, 119, 6, 0.07) 0 1px, transparent 1px 28px)",
                backgroundSize: "100% 100%, 100% 100%, 100% 100%",
                opacity: isDarkMode ? 0.22 : 0.16,
                pointerEvents: "none",
              },
            }}
          >
            <Stack sx={{ position: "relative", zIndex: 1 }} spacing={3}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Chip
                  icon={<TravelExploreRoundedIcon fontSize="small" />}
                  label={dayTheme.editionLabel}
                  sx={{
                    borderRadius: 999,
                    fontWeight: 700,
                    letterSpacing: 0.35,
                    color: "var(--home-ink)",
                    backgroundColor: isDarkMode
                      ? "rgba(15, 118, 110, 0.2)"
                      : "rgba(240, 253, 250, 0.84)",
                    backdropFilter: "blur(14px)",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--home-muted-text)",
                    letterSpacing: 0.45,
                    textTransform: "uppercase",
                  }}
                >
                  Refreshed {dayTheme.dateLabel} • {dayTheme.checkpoint}
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 700,
                    fontSize: { xs: "2.45rem", md: "4.3rem" },
                    lineHeight: 0.94,
                    letterSpacing: 0,
                    maxWidth: 760,
                    color: "var(--home-ink)",
                  }}
                >
                  {dayTheme.heroTitle}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--home-muted-text)",
                    fontSize: { xs: "1rem", md: "1.08rem" },
                    maxWidth: 760,
                    lineHeight: 1.72,
                  }}
                >
                  {dayTheme.heroCopy}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {dayTheme.moodTags.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    variant="outlined"
                    sx={{
                      borderRadius: 999,
                      borderColor: "var(--home-border)",
                      color: "var(--home-ink)",
                      backgroundColor: isDarkMode
                        ? "rgba(15, 23, 42, 0.72)"
                        : "rgba(255, 255, 255, 0.82)",
                    }}
                  />
                ))}
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ alignItems: { xs: "stretch", sm: "center" } }}
              >
                <Button
                  component={RouterLink}
                  to="/blog/2026-06-07-seagrass-meadows-ocean-engineering-namritha"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  onClick={() => trackClick("home_hero_namritha_seagrass_cta")}
                  sx={{
                    "--variant-containedColor": "#0b2440",
                    borderRadius: 999,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    color: "var(--variant-containedColor)",
                    background:
                      "linear-gradient(135deg, #99f6e4 0%, #fde68a 52%, #fecdd3 100%)",
                    "&:hover": {
                      boxShadow: "none",
                      color: "var(--variant-containedColor)",
                      background:
                        "linear-gradient(135deg, #5eead4 0%, #fde68a 58%, #fda4af 100%)",
                    },
                  }}
                >
                  Read Namritha&apos;s seagrass note
                </Button>
                <Button
                  component={RouterLink}
                  to="/keydata"
                  variant="outlined"
                  size="large"
                  onClick={() => trackClick("home_hero_keydata_secondary_cta")}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    color: "var(--home-ink)",
                    borderColor: "var(--home-border)",
                  }}
                >
                  Open key data
                </Button>
              </Stack>

              <Divider sx={{ borderColor: "var(--home-border)" }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--home-muted-text)", lineHeight: 1.65 }}
                  >
                    Mood: agent-aware, signal-first, health-conscious, and
                    grounded in curiosity, field science, and family pride.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--home-muted-text)", lineHeight: 1.65 }}
                  >
                    Today&apos;s use: {dayTheme.useLine}.
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              p: { xs: 3, md: 3.5 },
              borderRadius: 2,
              border: "1px solid var(--home-border)",
              backgroundColor: "var(--home-surface-muted)",
              boxShadow: "var(--home-shadow)",
            }}
          >
            <Stack spacing={2.3}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    fontFamily: heroFont,
                    letterSpacing: 2,
                    fontWeight: 700,
                    color: "var(--home-muted-text)",
                  }}
                >
                  Today&apos;s Mood
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  The colors steering the {dayTheme.shortDateLabel} workbench
                </Typography>
              </Box>

              {moodSwatches.map((swatch) => (
                <Stack
                  key={swatch.name}
                  direction="row"
                  spacing={1.4}
                  alignItems="flex-start"
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      flexShrink: 0,
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      backgroundColor: swatch.hex,
                      boxShadow: `0 0 0 1px ${alpha("#1d120d", 0.08)}`,
                    }}
                  />
                  <Stack spacing={0.25}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "var(--home-ink)" }}
                    >
                      {swatch.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "var(--home-muted-text)", lineHeight: 1.55 }}
                    >
                      {swatch.meaning}
                    </Typography>
                  </Stack>
                </Stack>
              ))}

              <Divider sx={{ borderColor: "var(--home-border)" }} />

              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 1.6,
                    fontWeight: 700,
                    color: "var(--home-muted-text)",
                  }}
                >
                  Operating Note
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--home-muted-text)", lineHeight: 1.7 }}
                >
                  This frame is pinned to {dayTheme.dateLabel}: seagrass
                  science, key data, health explainers, music, and a manageable
                  read of the outside world. Dates stay visible so the page
                  reads like a moment, not a timeless brand voice.
                </Typography>
              </Box>

              <Divider sx={{ borderColor: "var(--home-border)" }} />

              <Stack spacing={1}>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--home-muted-text)" }}
                >
                  Still watching multiple time zones.
                </Typography>
                {showWorldClock ? (
                  <Suspense
                    fallback={<Box sx={{ minHeight: 120 }} aria-hidden />}
                  >
                    <WorldClock compact />
                  </Suspense>
                ) : (
                  <Box sx={{ minHeight: 120 }} aria-hidden />
                )}
              </Stack>

              <Divider sx={{ borderColor: "var(--home-border)" }} />

              <Stack direction="row" spacing={1}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    onClick={() => trackClick(social.analyticsKey)}
                    sx={{
                      borderRadius: "50%",
                      width: 44,
                      height: 44,
                      border: "1px solid var(--home-border)",
                      color: "var(--home-ink)",
                      backgroundColor: "var(--home-surface)",
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          ...revealUpSx(0.12, 0.5),
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid var(--home-border)",
          backgroundImage: isDarkMode
            ? "linear-gradient(135deg, rgba(15, 118, 110, 0.22), rgba(16, 22, 32, 0.94) 48%, rgba(190, 18, 60, 0.2))"
            : "linear-gradient(135deg, rgba(240, 253, 250, 0.98), rgba(255, 251, 235, 0.96) 48%, rgba(255, 241, 242, 0.98))",
          boxShadow: "var(--home-shadow)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Stack spacing={1.4} sx={{ maxWidth: 780 }}>
            <Chip
              icon={<MusicNoteRoundedIcon fontSize="small" />}
              label="Sunday note · family, science, ocean engineering"
              sx={{
                alignSelf: "flex-start",
                borderRadius: 999,
                fontWeight: 700,
                color: "var(--home-ink)",
                backgroundColor: isDarkMode
                  ? "rgba(190, 18, 60, 0.18)"
                  : "rgba(255, 241, 242, 0.86)",
              }}
            />
            <Typography
              component="blockquote"
              sx={{
                m: 0,
                fontFamily:
                  '"Noto Sans Tamil", "Noto Sans", "Space Grotesk", sans-serif',
                fontWeight: 800,
                fontSize: { xs: "1.65rem", md: "2.45rem" },
                lineHeight: 1.35,
                letterSpacing: 0,
                color: "var(--home-ink)",
              }}
            >
              From seagrass meadows to the open ocean.
              <br />
              A proud maama&apos;s note for Namritha.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "var(--home-muted-text)",
                lineHeight: 1.7,
                maxWidth: 680,
              }}
            >
              Today&apos;s color story is coastal: seagrass teal for curiosity,
              lagoon blue for engineering, marigold for care, and rose for the
              family warmth behind the achievement.
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row", md: "column" }}
            spacing={1.2}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <Button
              component={RouterLink}
              to="/blog/2026-06-07-seagrass-meadows-ocean-engineering-namritha"
              variant="contained"
              size="large"
              endIcon={<ArrowOutwardRoundedIcon />}
              onClick={() => trackClick("home_namritha_feature_cta")}
              sx={{
                borderRadius: 999,
                px: 3,
                flexShrink: 0,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
              }}
            >
              Open the note
            </Button>
            <Button
              component={RouterLink}
              to="/blog/2025-12-16-agu-2025-seagrass-wave-climates"
              variant="outlined"
              size="large"
              endIcon={<ArrowOutwardRoundedIcon />}
              onClick={() => trackClick("home_agu_seagrass_cta")}
              sx={{
                borderRadius: 999,
                px: 3,
                flexShrink: 0,
                textTransform: "none",
                fontWeight: 700,
                color: "var(--home-ink)",
                borderColor: "var(--home-border)",
              }}
            >
              Related seagrass post
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 3.5 },
          borderRadius: 2,
          border: "1px solid var(--home-border)",
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(19, 27, 39, 0.98), rgba(13, 18, 28, 0.98))"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98))",
          boxShadow: "var(--home-shadow)",
        }}
      >
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", lg: "flex-end" }}
          >
            <Stack spacing={1}>
              <Typography
                variant="overline"
                sx={{
                  fontFamily: heroFont,
                  letterSpacing: 2,
                  fontWeight: 700,
                  color: "var(--home-muted-text)",
                }}
              >
                Today&apos;s Reality
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: heroFont,
                  fontWeight: 650,
                  color: "var(--home-ink)",
                }}
              >
                What the {dayTheme.rhythm} workbench is really saying
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{ maxWidth: 520, color: "var(--home-muted-text)" }}
            >
              Four practical signals, one current-day read. The page stays
              anchored to {dayTheme.dateLabel} instead of pretending this mood
              is permanent.
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            {worldPulse.map((signal, index) => {
              const SignalIcon = signal.icon;
              const signalAccentInk = isDarkMode
                ? signal.accent
                : darken(signal.accent, 0.42);

              return (
                <Grid key={signal.title} size={{ xs: 12, sm: 6 }}>
                  <Card
                    sx={(theme) => ({
                      ...revealUpSx(0.08 + index * 0.05, 0.35),
                      height: "100%",
                      borderRadius: 2,
                      border: "1px solid var(--home-border)",
                      backgroundColor: "var(--home-surface-muted)",
                      boxShadow: "none",
                      transition:
                        "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        borderColor: signalAccentInk,
                        boxShadow: theme.shadows[6],
                      },
                    })}
                  >
                    <CardActionArea
                      component={RouterLink}
                      to={signal.to}
                      onClick={() => trackClick(signal.analyticsKey)}
                      sx={{ height: "100%" }}
                    >
                      <CardContent sx={{ p: 3, height: "100%" }}>
                        <Stack spacing={1.5} sx={{ height: "100%" }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: alpha(
                                  signal.accent,
                                  isDarkMode ? 0.18 : 0.12,
                                ),
                              }}
                            >
                              <SignalIcon sx={{ color: signalAccentInk }} />
                            </Box>
                            <Typography
                              variant="overline"
                              sx={{
                                color: signalAccentInk,
                                letterSpacing: 1.5,
                                fontWeight: 700,
                              }}
                            >
                              {signal.eyebrow}
                            </Typography>
                          </Stack>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: heroFont,
                              fontWeight: 650,
                              color: "var(--home-ink)",
                              maxWidth: 360,
                            }}
                          >
                            {signal.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "var(--home-muted-text)",
                              lineHeight: 1.65,
                              flexGrow: 1,
                            }}
                          >
                            {signal.summary}
                          </Typography>
                          <Divider sx={{ borderColor: "var(--home-border)" }} />
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "var(--home-muted-text)",
                                letterSpacing: 0.2,
                              }}
                            >
                              {dayTheme.sourceLabel}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.75}
                              alignItems="center"
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: signalAccentInk,
                                  fontWeight: 700,
                                }}
                              >
                                {signal.cta}
                              </Typography>
                              <ArrowOutwardRoundedIcon
                                sx={{ fontSize: 18, color: signalAccentInk }}
                              />
                            </Stack>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Paper>

      <Grid container spacing={2.5} alignItems="stretch">
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              p: { xs: 3, md: 3.5 },
              borderRadius: 2,
              border: "1px solid var(--home-border)",
              backgroundColor: "var(--home-surface)",
            }}
          >
            <Stack spacing={2.25}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    fontFamily: heroFont,
                    letterSpacing: 2,
                    fontWeight: 700,
                    color: "var(--home-muted-text)",
                  }}
                >
                  Today&apos;s Routes
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  How to use the site today
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {siteVectors.map((item, index) => {
                  const ItemIcon = item.icon;
                  const itemAccentInk = isDarkMode
                    ? item.accent
                    : darken(item.accent, 0.42);

                  return (
                    <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                      <Card
                        sx={(theme) => ({
                          ...revealUpSx(0.08 + index * 0.04, 0.35),
                          height: "100%",
                          borderRadius: 2,
                          border: "1px solid var(--home-border)",
                          backgroundColor: "var(--home-surface-muted)",
                          boxShadow: "none",
                          transition:
                            "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            borderColor: itemAccentInk,
                            boxShadow: theme.shadows[6],
                          },
                        })}
                      >
                        <CardActionArea
                          component={RouterLink}
                          to={item.to}
                          onClick={() => trackClick(item.analyticsKey)}
                          sx={{ height: "100%" }}
                        >
                          <CardContent sx={{ p: 3, height: "100%" }}>
                            <Stack spacing={1.5} sx={{ height: "100%" }}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                              >
                                <Box
                                  sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: alpha(
                                      item.accent,
                                      isDarkMode ? 0.17 : 0.13,
                                    ),
                                  }}
                                >
                                  <ItemIcon sx={{ color: itemAccentInk }} />
                                </Box>
                                <Typography
                                  variant="overline"
                                  sx={{
                                    color: itemAccentInk,
                                    letterSpacing: 1.6,
                                    fontWeight: 700,
                                  }}
                                >
                                  {item.eyebrow}
                                </Typography>
                              </Stack>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontFamily: heroFont,
                                  fontWeight: 650,
                                  color: "var(--home-ink)",
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "var(--home-muted-text)",
                                  lineHeight: 1.6,
                                  flexGrow: 1,
                                }}
                              >
                                {item.summary}
                              </Typography>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "var(--home-muted-text)",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.cta}
                                </Typography>
                                <ArrowOutwardRoundedIcon
                                  sx={{ fontSize: 18, color: itemAccentInk }}
                                />
                              </Stack>
                            </Stack>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              p: { xs: 3, md: 3.5 },
              borderRadius: 2,
              border: "1px solid var(--home-border)",
              backgroundColor: "var(--home-surface-muted)",
            }}
          >
            <Stack spacing={2.25}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    fontFamily: heroFont,
                    letterSpacing: 2,
                    fontWeight: 700,
                    color: "var(--home-muted-text)",
                  }}
                >
                  Other Routes
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  Other routes worth keeping nearby
                </Typography>
              </Box>

              <Stack spacing={1.1}>
                {quickLinks.map((link) => (
                  <Box
                    key={link.label}
                    component={RouterLink}
                    to={link.to}
                    onClick={() => trackClick(link.analyticsKey)}
                    sx={{
                      p: 1.75,
                      borderRadius: 2,
                      border: "1px solid var(--home-border)",
                      textDecoration: "none",
                      color: "inherit",
                      backgroundColor: isDarkMode
                        ? "rgba(15, 23, 42, 0.58)"
                        : "rgba(255, 255, 255, 0.74)",
                      transition:
                        "transform 180ms ease, border-color 180ms ease, background-color 180ms ease",
                      "&:hover": {
                        transform: "translateX(4px)",
                        borderColor: alpha(homeAccents.prompt, 0.72),
                        backgroundColor: isDarkMode
                          ? "rgba(15, 23, 42, 0.76)"
                          : "rgba(255, 255, 255, 0.92)",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: alpha(homeAccents.route, 0.14),
                            color: homeAccents.route,
                          }}
                        >
                          <TravelExploreRoundedIcon sx={{ fontSize: 20 }} />
                        </Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, color: "var(--home-ink)" }}
                        >
                          {link.label}
                        </Typography>
                      </Stack>
                      <ArrowOutwardRoundedIcon
                        sx={{ color: "var(--home-muted-text)", fontSize: 18 }}
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ borderColor: "var(--home-border)" }} />

              <Typography
                variant="body2"
                sx={{ color: "var(--home-muted-text)", lineHeight: 1.7 }}
              >
                Today asks for fewer slogans and more useful surfaces: agent
                science, data, health, learning, books, music, and one honest
                look at the outside world.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Box>
        <Stack spacing={0.8} sx={{ mb: 2 }}>
          <Typography
            variant="overline"
            sx={{
              fontFamily: heroFont,
              letterSpacing: 2,
              fontWeight: 700,
              color: "var(--home-muted-text)",
            }}
          >
            Today&apos;s Reading Stack
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: heroFont,
              fontWeight: 650,
              color: "var(--home-ink)",
            }}
          >
            Three posts for the latest workbench mood
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {featuredPosts.map((post, index) => (
            <Grid key={post.slug} size={{ xs: 12, md: index === 0 ? 6 : 3 }}>
              <Card
                sx={(theme) => ({
                  ...revealUpSx(0.12 + index * 0.06, 0.38),
                  height: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid var(--home-border)",
                  backgroundColor: "var(--home-surface)",
                  boxShadow: "none",
                  transition:
                    "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: theme.palette.primary.main,
                    boxShadow: theme.shadows[6],
                  },
                })}
              >
                <CardActionArea
                  component={RouterLink}
                  to={post.link}
                  onClick={() => trackClick(`home_featured_${post.slug}`)}
                  sx={{ height: "100%" }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      minHeight: index === 0 ? 320 : 280,
                      height: "100%",
                    }}
                  >
                    <Box
                      component="img"
                      loading="lazy"
                      decoding="async"
                      src={post.image || post.heroImage}
                      onError={(event) => {
                        if (
                          event.currentTarget.dataset.fallbackApplied === "1"
                        ) {
                          return;
                        }
                        event.currentTarget.dataset.fallbackApplied = "1";
                        event.currentTarget.src =
                          post.heroImage || "/media/blogwordcloud.png";
                      }}
                      alt={post.title}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(20, 12, 16, 0.12) 0%, rgba(20, 12, 16, 0.74) 70%, rgba(11, 7, 9, 0.96) 100%)",
                      }}
                    />
                    <Stack
                      spacing={1.4}
                      sx={{
                        position: "relative",
                        zIndex: 1,
                        justifyContent: "flex-end",
                        height: "100%",
                        p: 3,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.75}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        {(post.tags || []).slice(0, 2).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              borderRadius: 999,
                              color: "#fff7ed",
                              backgroundColor: "rgba(20, 12, 16, 0.58)",
                            }}
                          />
                        ))}
                      </Stack>
                      <Typography
                        variant={index === 0 ? "h4" : "h6"}
                        sx={{
                          fontFamily: heroFont,
                          fontWeight: 650,
                          lineHeight: 1.05,
                          color: "#fff7ed",
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(249, 233, 218, 0.9)",
                          maxWidth: index === 0 ? 520 : 320,
                        }}
                      >
                        {post.excerpt}
                      </Typography>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(249, 233, 218, 0.84)",
                            letterSpacing: 0.3,
                          }}
                        >
                          {post.date}
                        </Typography>
                        <ArrowOutwardRoundedIcon
                          sx={{ color: "#fff7ed", fontSize: 18 }}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
