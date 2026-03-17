import { motion } from "framer-motion";
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
import { alpha } from "@mui/material/styles";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import { FaTwitter, FaWordpress } from "react-icons/fa";
import SEO from "../components/SEO";
import WorldClock from "../components/WorldClock";
import { getAllBlogPosts } from "../data/blogRegistry";

const editionLabel = "Mid-March 2026 edition";

const moodSwatches = [
  {
    name: "Risk Amber",
    hex: "#f59e0b",
    meaning: "Energy still sets the emotional floor.",
  },
  {
    name: "Signal Blue",
    hex: "#38bdf8",
    meaning: "Diplomacy is active, but nobody trusts calm yet.",
  },
  {
    name: "Circuit Mint",
    hex: "#2dd4bf",
    meaning: "AI ambition now looks like land, power, chips, and cash.",
  },
  {
    name: "Heat Haze",
    hex: "#fb7185",
    meaning: "Climate stress keeps turning background noise into foreground reality.",
  },
];

const moodTags = [
  "Energy shock",
  "Trade reset",
  "AI buildout",
  "Weather whiplash",
];

const worldPulse = [
  {
    eyebrow: "Energy pressure",
    title: "Hormuz risk is back in the room",
    summary:
      "By March 16, 2026, Gulf conflict had slowed shipping and kept oil anxiety visible again in daily life, policy, and household budgets.",
    source: "Signal date: March 16, 2026",
    to: "/blog/2026-03-14-from-one-barrel-to-your-kitchen-refining-costs-india",
    analyticsKey: "home_worldpulse_energy",
    accent: "#f59e0b",
    icon: BoltRoundedIcon,
    cta: "Read the energy chain",
  },
  {
    eyebrow: "Trade negotiation",
    title: "Washington and Beijing are talking, carefully",
    summary:
      "Paris talks on March 16 kept retaliation in check, but the tone remains competitive, procedural, and highly conditional.",
    source: "Signal date: March 16, 2026",
    to: "/keydata",
    analyticsKey: "home_worldpulse_trade",
    accent: "#38bdf8",
    icon: CompareArrowsRoundedIcon,
    cta: "Track the market spillover",
  },
  {
    eyebrow: "AI infrastructure",
    title: "The AI race now looks physical",
    summary:
      "India's February 2026 summit pushed the story beyond models into data centers, compute access, talent, and Global South positioning.",
    source: "Signal date: February 19, 2026",
    to: "/blog/2026-03-10-indian-it-ai-reality-check",
    analyticsKey: "home_worldpulse_ai",
    accent: "#2dd4bf",
    icon: MemoryRoundedIcon,
    cta: "Read the India angle",
  },
  {
    eyebrow: "Climate stress",
    title: "Weather keeps arriving as whiplash",
    summary:
      "On March 16, the same U.S. day carried blizzards, wildfire risk, severe storms, flooding, and heat that looked more like June than March.",
    source: "Signal date: March 16, 2026",
    to: "/science",
    analyticsKey: "home_worldpulse_climate",
    accent: "#fb7185",
    icon: CloudQueueRoundedIcon,
    cta: "Open science notes",
  },
];

const siteVectors = [
  {
    eyebrow: "Writing",
    title: "Notes for a high-voltage year",
    summary:
      "Essays on energy, shipping, India, AI, policy, and the parts of life that still resist simplification.",
    to: "/blog",
    analyticsKey: "home_vector_blog",
    accent: "#f6ad37",
    icon: MenuBookRoundedIcon,
    cta: "Enter the blog",
  },
  {
    eyebrow: "Numbers",
    title: "Check the dashboard before the narrative hardens",
    summary:
      "Markets, crude, volatility, and U.S./India signals as a practical companion to whatever the headline cycle is shouting today.",
    to: "/keydata",
    analyticsKey: "home_vector_keydata",
    accent: "#7dd3fc",
    icon: QueryStatsRoundedIcon,
    cta: "Open key data",
  },
  {
    eyebrow: "Building",
    title: "Projects that turn noise into instruments",
    summary:
      "Utilities, experiments, and interfaces built for a world with tighter feedback loops and less patience for hand-waving.",
    to: "/projects",
    analyticsKey: "home_vector_projects",
    accent: "#34d399",
    icon: RocketLaunchRoundedIcon,
    cta: "See projects",
  },
  {
    eyebrow: "Culture",
    title: "Keep one channel open to music and memory",
    summary:
      "A homepage cannot be all alertness. It also needs rhythm, devotion, breath, and some residue of ordinary life.",
    to: "/music",
    analyticsKey: "home_vector_music",
    accent: "#fb7185",
    icon: MusicNoteRoundedIcon,
    cta: "Open music",
  },
];

const quickLinks = [
  { label: "About", to: "/about", analyticsKey: "home_quick_about" },
  { label: "Learning", to: "/learning", analyticsKey: "home_quick_learning" },
  { label: "Album", to: "/album", analyticsKey: "home_quick_album" },
  { label: "Science", to: "/science", analyticsKey: "home_quick_science" },
  { label: "Elsewhere", to: "/elsewhere", analyticsKey: "home_quick_elsewhere" },
];

const featuredSlugs = [
  "2026-03-14-from-one-barrel-to-your-kitchen-refining-costs-india",
  "2026-03-10-indian-it-ai-reality-check",
  "2026-03-07-impact-of-straits-for-trade-commerce",
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
  const postsBySlug = new Map(getAllBlogPosts().map((post) => [post.slug, post]));
  const featuredPosts = featuredSlugs
    .map((slug) => postsBySlug.get(slug))
    .filter(Boolean);
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      sx={{
        "--home-surface": isDarkMode
          ? "rgba(11, 16, 24, 0.9)"
          : "rgba(255, 255, 255, 0.92)",
        "--home-surface-muted": isDarkMode
          ? "rgba(15, 23, 34, 0.94)"
          : "rgba(248, 251, 255, 0.96)",
        "--home-border": isDarkMode
          ? "rgba(164, 179, 197, 0.18)"
          : "rgba(66, 92, 122, 0.16)",
        "--home-muted-text": isDarkMode
          ? "rgba(219, 228, 238, 0.76)"
          : "rgba(55, 70, 92, 0.72)",
        "--home-ink": isDarkMode ? "#f8fafc" : "#09111c",
        "--home-shadow": isDarkMode
          ? "0 28px 80px rgba(0, 0, 0, 0.34)"
          : "0 26px 64px rgba(79, 110, 158, 0.14)",
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
        description="Mid-March 2026 homepage edition: energy shock, trade resets, AI buildout, weather whiplash, and a more outward-looking front page."
        canonicalPath="/"
        image="/media/blogwordcloud.png"
        type="website"
      />

      <Grid container spacing={2.5} alignItems="stretch">
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            component={motion.div}
            elevation={0}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 5,
              p: { xs: 3, md: 5 },
              border: "1px solid var(--home-border)",
              backgroundImage: isDarkMode
                ? "radial-gradient(circle at 18% 18%, rgba(245, 158, 11, 0.22), transparent 24%), radial-gradient(circle at 82% 14%, rgba(56, 189, 248, 0.18), transparent 24%), radial-gradient(circle at 72% 84%, rgba(45, 212, 191, 0.18), transparent 24%), linear-gradient(145deg, rgba(6, 10, 16, 0.98), rgba(12, 20, 31, 0.97) 52%, rgba(18, 28, 40, 0.95))"
                : "radial-gradient(circle at 18% 18%, rgba(245, 158, 11, 0.2), transparent 24%), radial-gradient(circle at 82% 14%, rgba(56, 189, 248, 0.16), transparent 24%), radial-gradient(circle at 72% 84%, rgba(45, 212, 191, 0.14), transparent 24%), linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(243, 247, 252, 0.98) 52%, rgba(236, 244, 248, 0.95))",
              boxShadow: "var(--home-shadow)",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(120deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 28%), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
                backgroundSize: "100% 100%, 52px 52px, 52px 52px",
                opacity: isDarkMode ? 0.18 : 0.1,
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
                  icon={<PublicRoundedIcon fontSize="small" />}
                  label={editionLabel}
                  sx={{
                    borderRadius: 999,
                    fontWeight: 700,
                    letterSpacing: 0.35,
                    color: "var(--home-ink)",
                    backgroundColor: isDarkMode
                      ? "rgba(248, 250, 252, 0.08)"
                      : "rgba(255, 255, 255, 0.7)",
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
                  March 17, 2026 snapshot • refreshed {todayLabel}
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 700,
                    fontSize: { xs: "2.5rem", md: "4.35rem" },
                    lineHeight: 0.94,
                    letterSpacing: "-0.05em",
                    maxWidth: 780,
                    color: "var(--home-ink)",
                  }}
                >
                  The birthday colors are gone. The world runs hotter now.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--home-muted-text)",
                    fontSize: { xs: "1rem", md: "1.08rem" },
                    maxWidth: 760,
                    lineHeight: 1.7,
                  }}
                >
                  This front page now turns outward. Mid-March 2026 feels like
                  energy stress, tariff negotiation, AI infrastructure land
                  grabs, and weather that refuses to stay background texture.
                  The site stays personal, but the homepage mood is now alert,
                  industrial, and a little heat-streaked.
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
              >
                {moodTags.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    variant="outlined"
                    sx={{
                      borderRadius: 999,
                      borderColor: "var(--home-border)",
                      color: "var(--home-ink)",
                      backgroundColor: isDarkMode
                        ? "rgba(15, 23, 34, 0.62)"
                        : "rgba(255, 255, 255, 0.74)",
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
                  to="/blog"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  onClick={() => trackClick("home_hero_blog_cta")}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    color: "#09111c",
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #fbbf24 35%, #fb7185 100%)",
                    "&:hover": {
                      boxShadow: "none",
                      background:
                        "linear-gradient(135deg, #e89006 0%, #f2b318 35%, #f85d7a 100%)",
                    },
                  }}
                >
                  Read the latest notes
                </Button>
                <Button
                  component={RouterLink}
                  to="/keydata"
                  variant="outlined"
                  size="large"
                  onClick={() => trackClick("home_hero_keydata_cta")}
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
                <Button
                  component={RouterLink}
                  to="/projects"
                  variant="text"
                  size="large"
                  onClick={() => trackClick("home_hero_projects_cta")}
                  sx={{
                    borderRadius: 999,
                    px: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    color: "var(--home-ink)",
                  }}
                >
                  See the build side
                </Button>
              </Stack>

              <Divider sx={{ borderColor: "var(--home-border)" }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--home-muted-text)", lineHeight: 1.65 }}
                  >
                    Mood: cautious forward motion. Nothing is settled, but
                    everything is moving.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--home-muted-text)", lineHeight: 1.65 }}
                  >
                    Use this page as a dispatch board: read deeper, check the
                    numbers, then step sideways into music, books, or memory.
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
              borderRadius: 4,
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
                  Mood Atlas
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  The colors steering this version
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
                      borderRadius: 2.5,
                      flexShrink: 0,
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      backgroundColor: swatch.hex,
                      boxShadow: `0 0 0 1px ${alpha("#09111c", 0.08)}`,
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
                  This is not a live newsroom. It is an honest front page for
                  this exact moment, with the date left visible on purpose.
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
                  <WorldClock compact />
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
          p: { xs: 3, md: 3.5 },
          borderRadius: 4,
          border: "1px solid var(--home-border)",
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(15, 23, 34, 0.94), rgba(9, 14, 22, 0.98))"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(244, 248, 252, 0.98))",
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
                World Pulse
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: heroFont,
                  fontWeight: 650,
                  color: "var(--home-ink)",
                }}
              >
                Four forces setting the tone right now
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{ maxWidth: 520, color: "var(--home-muted-text)" }}
            >
              These are the signals informing the page design, not a promise of
              perpetual freshness. The date is part of the design.
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            {worldPulse.map((signal, index) => {
              const SignalIcon = signal.icon;

              return (
                <Grid key={signal.title} size={{ xs: 12, sm: 6 }}>
                  <Card
                    component={motion.article}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.08 + index * 0.05,
                    }}
                    sx={(theme) => ({
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid var(--home-border)",
                      backgroundColor: "var(--home-surface-muted)",
                      boxShadow: "none",
                      transition:
                        "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        borderColor: signal.accent,
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
                              <SignalIcon sx={{ color: signal.accent }} />
                            </Box>
                            <Typography
                              variant="overline"
                              sx={{
                                color: signal.accent,
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
                              {signal.source}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.75}
                              alignItems="center"
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: signal.accent,
                                  fontWeight: 700,
                                }}
                              >
                                {signal.cta}
                              </Typography>
                              <ArrowOutwardRoundedIcon
                                sx={{ fontSize: 18, color: signal.accent }}
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
              borderRadius: 4,
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
                  Site Routes
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  Four ways into the site from this mood
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {siteVectors.map((item, index) => {
                  const ItemIcon = item.icon;

                  return (
                    <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                      <Card
                        component={motion.article}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.08 + index * 0.04,
                        }}
                        sx={(theme) => ({
                          height: "100%",
                          borderRadius: 3,
                          border: "1px solid var(--home-border)",
                          backgroundColor: "var(--home-surface-muted)",
                          boxShadow: "none",
                          transition:
                            "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            borderColor: item.accent,
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
                                  <ItemIcon sx={{ color: item.accent }} />
                                </Box>
                                <Typography
                                  variant="overline"
                                  sx={{
                                    color: item.accent,
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
                                  sx={{ fontSize: 18, color: item.accent }}
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
              borderRadius: 4,
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
                  Quick Drift
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
                      borderRadius: 3,
                      border: "1px solid var(--home-border)",
                      textDecoration: "none",
                      color: "inherit",
                      backgroundColor: isDarkMode
                        ? "rgba(18, 28, 40, 0.45)"
                        : "rgba(255, 255, 255, 0.72)",
                      transition:
                        "transform 180ms ease, border-color 180ms ease, background-color 180ms ease",
                      "&:hover": {
                        transform: "translateX(4px)",
                        borderColor: alpha("#38bdf8", 0.85),
                        backgroundColor: isDarkMode
                          ? "rgba(18, 28, 40, 0.68)"
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
                            backgroundColor: alpha("#38bdf8", 0.12),
                            color: "#38bdf8",
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
                The page is outward-facing now, but not fully surrendered to
                headlines. There is still room for books, craft, and ordinary
                human detail.
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
            Current Reading
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: heroFont,
              fontWeight: 650,
              color: "var(--home-ink)",
            }}
          >
            Three recent posts that match the weather
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {featuredPosts.map((post, index) => (
            <Grid
              key={post.slug}
              size={{ xs: 12, md: index === 0 ? 6 : 3 }}
            >
              <Card
                component={motion.article}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: 0.12 + index * 0.06 }}
                sx={(theme) => ({
                  height: "100%",
                  borderRadius: 4,
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
                        if (event.currentTarget.dataset.fallbackApplied === "1") {
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
                          "linear-gradient(180deg, rgba(8, 16, 24, 0.12) 0%, rgba(8, 16, 24, 0.74) 70%, rgba(5, 10, 18, 0.96) 100%)",
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
                              color: "#f8fafc",
                              backgroundColor: "rgba(8, 16, 24, 0.58)",
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
                          color: "#f8fafc",
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(232, 238, 247, 0.88)",
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
                            color: "rgba(232, 238, 247, 0.86)",
                            letterSpacing: 0.3,
                          }}
                        >
                          {post.date}
                        </Typography>
                        <ArrowOutwardRoundedIcon
                          sx={{ color: "#f8fafc", fontSize: 18 }}
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
