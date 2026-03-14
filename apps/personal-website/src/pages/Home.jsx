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
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import WaterRoundedIcon from "@mui/icons-material/WaterRounded";
import { FaTwitter, FaWordpress } from "react-icons/fa";
import SEO from "../components/SEO";
import WorldClock from "../components/WorldClock";
import { getAllBlogPosts } from "../data/blogRegistry";

const piscesPalette = [
  {
    name: "Sea Glass",
    hex: "#8fded1",
    meaning: "calm, renewal, and a gentler pace",
  },
  {
    name: "Lagoon Blue",
    hex: "#7fb9ff",
    meaning: "clarity, drift, and open sky thinking",
  },
  {
    name: "Moon Silver",
    hex: "#d9dfeb",
    meaning: "intuition, pause, and softer edges",
  },
  {
    name: "Misty Lilac",
    hex: "#cabfff",
    meaning: "imagination, music, and dream logic",
  },
];

const currents = [
  {
    kicker: "Writing",
    title: "Reflective notes with clear edges",
    summary:
      "Essays and observations that stay personal without losing structure or precision.",
    to: "/blog",
    analyticsKey: "home_current_blog",
    accent: "#8fded1",
    icon: CreateRoundedIcon,
    cta: "Read the blog",
  },
  {
    kicker: "Building",
    title: "Projects that make curiosity concrete",
    summary:
      "Small systems, experiments, and utilities built with calm hands and repeatable logic.",
    to: "/projects",
    analyticsKey: "home_current_projects",
    accent: "#7fb9ff",
    icon: AutoFixHighRoundedIcon,
    cta: "See projects",
  },
  {
    kicker: "Listening",
    title: "Music for drift, devotion, and reset",
    summary:
      "Tamil-first listening, bhajans, and playlists that keep the whole site human.",
    to: "/music",
    analyticsKey: "home_current_music",
    accent: "#cabfff",
    icon: MusicNoteRoundedIcon,
    cta: "Open music",
  },
  {
    kicker: "Memory",
    title: "Albums and field notes for the softer archive",
    summary:
      "Trips, frames, and remembered details for the moments when words should not do all the work.",
    to: "/album",
    analyticsKey: "home_current_album",
    accent: "#f3c5d6",
    icon: PhotoLibraryRoundedIcon,
    cta: "Wander the album",
  },
];

const birthdayRituals = [
  {
    label: "01",
    title: "About",
    description: "Meet the person behind the notes, systems, and obsessions.",
    to: "/about",
    analyticsKey: "home_ritual_about",
  },
  {
    label: "02",
    title: "Blog",
    description: "Start with fresh reflections, essays, and practical writing.",
    to: "/blog",
    analyticsKey: "home_ritual_blog",
  },
  {
    label: "03",
    title: "Books",
    description: "A slower shelf of ideas worth keeping close.",
    to: "/books",
    analyticsKey: "home_ritual_books",
  },
  {
    label: "04",
    title: "Music",
    description: "Playlist rituals, devotional drift, and comfort tracks.",
    to: "/music",
    analyticsKey: "home_ritual_music",
  },
];

const quickLinks = [
  { label: "Key Data", to: "/keydata", analyticsKey: "home_quick_keydata" },
  { label: "Projects", to: "/projects", analyticsKey: "home_quick_projects" },
  { label: "Learning", to: "/learning", analyticsKey: "home_quick_learning" },
  { label: "Album", to: "/album", analyticsKey: "home_quick_album" },
  { label: "Science", to: "/science", analyticsKey: "home_quick_science" },
];

const heatmapSignals = [
  "Magnificent 7 share prices",
  "Nifty 50 and Sensex",
  "WTI, Brent, and VIX",
  "Renewables and AI infra",
];

const featuredSlugs = [
  "2026-01-16-next-sentence-is-the-product",
  "2026-02-14-bhajan-clubbing",
  "2026-02-08-february-musings-health-slang-politics-legacy",
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
  const heroFont = '"Space Grotesk", "Satoshi", "Noto Sans", sans-serif';
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
          ? "rgba(10, 24, 42, 0.88)"
          : "rgba(255, 255, 255, 0.92)",
        "--home-surface-muted": isDarkMode
          ? "rgba(12, 29, 50, 0.94)"
          : "rgba(248, 251, 255, 0.96)",
        "--home-border": isDarkMode
          ? "rgba(180, 196, 224, 0.22)"
          : "rgba(111, 135, 181, 0.16)",
        "--home-muted-text": isDarkMode
          ? "rgba(223, 232, 246, 0.78)"
          : "rgba(46, 68, 98, 0.72)",
        "--home-ink": isDarkMode ? "#f5f7fb" : "#10233d",
        "--home-shadow": isDarkMode
          ? "0 26px 64px rgba(4, 12, 25, 0.45)"
          : "0 26px 64px rgba(79, 110, 158, 0.14)",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, md: 4 },
        width: "100%",
        maxWidth: 1080,
        mx: "auto",
      }}
    >
      <SEO
        title="My Stories"
        description="Birthday-week homepage in Piscean colors: sea-glass aqua, moon silver, misty lilac, and a softer entry into writing, music, projects, books, and memory."
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
                ? "radial-gradient(circle at 18% 18%, rgba(143, 222, 209, 0.18), transparent 24%), radial-gradient(circle at 82% 16%, rgba(202, 191, 255, 0.16), transparent 28%), radial-gradient(circle at 54% 82%, rgba(127, 185, 255, 0.16), transparent 28%), linear-gradient(180deg, rgba(6, 18, 34, 0.98), rgba(14, 31, 56, 0.92))"
                : "radial-gradient(circle at 18% 18%, rgba(143, 222, 209, 0.22), transparent 24%), radial-gradient(circle at 82% 16%, rgba(202, 191, 255, 0.18), transparent 28%), radial-gradient(circle at 54% 82%, rgba(127, 185, 255, 0.18), transparent 28%), linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(245, 249, 255, 0.97))",
              boxShadow: "var(--home-shadow)",
            }}
          >
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: isDarkMode ? 0.16 : 0.1,
                backgroundImage:
                  "linear-gradient(120deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0) 24%), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
                backgroundSize: "100% 100%, 56px 56px, 56px 56px",
              }}
            />
            <Stack sx={{ position: "relative", zIndex: 1 }} spacing={3}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Chip
                  icon={<WaterRoundedIcon fontSize="small" />}
                  label="Birthday week / Pisces season"
                  sx={{
                    borderRadius: 999,
                    fontWeight: 700,
                    letterSpacing: 0.35,
                    color: "var(--home-ink)",
                    backgroundColor: isDarkMode
                      ? "rgba(245, 247, 251, 0.08)"
                      : "rgba(255, 255, 255, 0.68)",
                    backdropFilter: "blur(12px)",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--home-muted-text)",
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  March 13, 2026 • refreshed {todayLabel}
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 700,
                    fontSize: { xs: "2.4rem", md: "4rem" },
                    lineHeight: 0.98,
                    letterSpacing: "-0.04em",
                    maxWidth: 760,
                    color: "var(--home-ink)",
                  }}
                >
                  Birthday week. Piscean colors. A softer front page.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--home-muted-text)",
                    fontSize: { xs: "1rem", md: "1.08rem" },
                    maxWidth: 720,
                  }}
                >
                  This week the homepage leans into sea-glass aqua, moon
                  silver, misty lilac, music, memory, and reflective writing.
                  Still practical. Still mine. Just more fluid, more personal,
                  and more Piscean in mood.
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
              >
                {[
                  "Sea-glass aqua",
                  "Lagoon blue",
                  "Moon silver",
                  "Misty lilac",
                ].map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    variant="outlined"
                    sx={{
                      borderRadius: 999,
                      borderColor: "var(--home-border)",
                      color: "var(--home-ink)",
                      backgroundColor: isDarkMode
                        ? "rgba(13, 29, 52, 0.54)"
                        : "rgba(255, 255, 255, 0.72)",
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
                  to="/about"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  onClick={() => trackClick("home_hero_about_cta")}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    color: "#10233d",
                    background:
                      "linear-gradient(135deg, #8fded1 0%, #d9dfeb 58%, #cabfff 100%)",
                    "&:hover": {
                      boxShadow: "none",
                      background:
                        "linear-gradient(135deg, #82d7ca 0%, #cfd7e6 58%, #bfaeff 100%)",
                    },
                  }}
                >
                  Start with About
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
                  to="/blog"
                  variant="text"
                  size="large"
                  onClick={() => trackClick("home_hero_blog_cta")}
                  sx={{
                    borderRadius: 999,
                    px: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    color: "var(--home-ink)",
                  }}
                >
                  Read recent notes
                </Button>
              </Stack>

              <Divider sx={{ borderColor: "var(--home-border)" }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--home-muted-text)" }}
                  >
                    Piscean mode for the week: reflective, musical, intuitive,
                    and a little dream-lit.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--home-muted-text)" }}
                  >
                    Site mode remains the same: clear writing, useful systems,
                    and enough softness to make them feel lived-in.
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
                  Pisces Palette
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  The colors setting the tone
                </Typography>
              </Box>

              {piscesPalette.map((swatch) => (
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
                      border: "1px solid rgba(255, 255, 255, 0.35)",
                      backgroundColor: swatch.hex,
                      boxShadow: `0 0 0 1px ${alpha("#10233d", 0.05)}`,
                    }}
                  />
                  <Stack spacing={0.2}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "var(--home-ink)" }}
                    >
                      {swatch.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "var(--home-muted-text)", lineHeight: 1.5 }}
                    >
                      {swatch.meaning}
                    </Typography>
                  </Stack>
                </Stack>
              ))}

              <Divider sx={{ borderColor: "var(--home-border)" }} />

              <Typography
                variant="body2"
                sx={{ color: "var(--home-muted-text)", lineHeight: 1.65 }}
              >
                Watery palette, clear head. This is a birthday-week homepage,
                not a costume change.
              </Typography>

              <Divider sx={{ borderColor: "var(--home-border)" }} />

              <Typography
                variant="caption"
                sx={{ color: "var(--home-muted-text)" }}
              >
                Still floating across time zones.
              </Typography>
              {showWorldClock ? (
                <WorldClock compact />
              ) : (
                <Box sx={{ minHeight: 120 }} aria-hidden />
              )}
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
            ? "linear-gradient(135deg, rgba(14, 31, 56, 0.94), rgba(10, 24, 42, 0.98))"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(240, 247, 255, 0.98))",
          boxShadow: "var(--home-shadow)",
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2.5}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
        >
          <Stack spacing={1.4} sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: alpha("#7fb9ff", isDarkMode ? 0.18 : 0.14),
                  color: "#7fb9ff",
                }}
              >
                <QueryStatsRoundedIcon />
              </Box>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 1.8,
                    fontWeight: 700,
                    color: "var(--home-muted-text)",
                  }}
                >
                  Featured Tool
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  Daily market key data
                </Typography>
              </Box>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                color: "var(--home-muted-text)",
                maxWidth: 700,
              }}
            >
              A daily snapshot for the themes you keep circling back to:
              U.S. benchmarks, India indices, crude, VIX, renewables, AI
              infrastructure, generated insights, and a dedicated Magnificent
              7 share-price table at the bottom.
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {heatmapSignals.map((signal) => (
                <Chip
                  key={signal}
                  label={signal}
                  variant="outlined"
                  sx={{
                    borderRadius: 999,
                    borderColor: "var(--home-border)",
                    color: "var(--home-ink)",
                    backgroundColor: isDarkMode
                      ? "rgba(14, 31, 56, 0.52)"
                      : "rgba(255, 255, 255, 0.74)",
                  }}
                />
              ))}
            </Stack>
          </Stack>

          <Stack spacing={1.2} alignItems={{ xs: "stretch", lg: "flex-end" }}>
            <Button
              component={RouterLink}
              to="/keydata"
              variant="contained"
              endIcon={<ArrowOutwardRoundedIcon />}
              onClick={() => trackClick("home_spotlight_keydata_cta")}
              sx={{
                borderRadius: 999,
                px: 3,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
              }}
            >
              Open /keydata
            </Button>
            <Typography
              variant="caption"
              sx={{ color: "var(--home-muted-text)" }}
            >
              Daily closes, generated insights, and plain-language metric explainers.
            </Typography>
          </Stack>
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
                  Currents
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  The four directions I want this week to move in
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {currents.map((item, index) => {
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
                                  {item.kicker}
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
                  Birthday Week Rituals
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  The softer route through the site
                </Typography>
              </Box>

              <Stack spacing={1.25}>
                {birthdayRituals.map((ritual) => (
                  <Box
                    key={ritual.title}
                    component={RouterLink}
                    to={ritual.to}
                    onClick={() => trackClick(ritual.analyticsKey)}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: "1px solid var(--home-border)",
                      textDecoration: "none",
                      color: "inherit",
                      backgroundColor: isDarkMode
                        ? "rgba(14, 31, 56, 0.42)"
                        : "rgba(255, 255, 255, 0.72)",
                      transition:
                        "transform 180ms ease, border-color 180ms ease, background-color 180ms ease",
                      "&:hover": {
                        transform: "translateX(4px)",
                        borderColor: alpha("#8fded1", 0.85),
                        backgroundColor: isDarkMode
                          ? "rgba(14, 31, 56, 0.62)"
                          : "rgba(255, 255, 255, 0.92)",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Typography
                        variant="overline"
                        sx={{
                          minWidth: 30,
                          color: "#8fded1",
                          letterSpacing: 1.3,
                          fontWeight: 700,
                        }}
                      >
                        {ritual.label}
                      </Typography>
                      <Stack spacing={0.4}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "var(--home-ink)" }}
                        >
                          {ritual.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--home-muted-text)" }}
                        >
                          {ritual.description}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ borderColor: "var(--home-border)" }} />

              <Typography
                variant="overline"
                sx={{
                  letterSpacing: 1.6,
                  fontWeight: 700,
                  color: "var(--home-muted-text)",
                }}
              >
                Quick Drift
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {quickLinks.map((link) => (
                  <Button
                    key={link.label}
                    component={RouterLink}
                    to={link.to}
                    size="small"
                    variant="text"
                    onClick={() => trackClick(link.analyticsKey)}
                    sx={{
                      px: 1.25,
                      borderRadius: 999,
                      textTransform: "none",
                      fontWeight: 600,
                      color: "var(--home-ink)",
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>

              <Divider sx={{ borderColor: "var(--home-border)" }} />

              <Stack direction="row" spacing={1.5}>
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
                      width: 46,
                      height: 46,
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

      <Box>
        <Stack spacing={0.75} sx={{ mb: 2 }}>
          <Typography
            variant="overline"
            sx={{
              fontFamily: heroFont,
              letterSpacing: 2,
              fontWeight: 700,
              color: "var(--home-muted-text)",
            }}
          >
            Birthday Week Picks
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: heroFont,
              fontWeight: 650,
              color: "var(--home-ink)",
            }}
          >
            Three notes to begin with
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
                          "linear-gradient(180deg, rgba(16, 35, 61, 0.08) 0%, rgba(16, 35, 61, 0.76) 70%, rgba(7, 18, 34, 0.94) 100%)",
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
                              backgroundColor: "rgba(16, 35, 61, 0.56)",
                            }}
                          />
                        ))}
                      </Stack>
                      <Typography
                        variant={index === 0 ? "h4" : "h6"}
                        sx={{
                          fontFamily: heroFont,
                          fontWeight: 650,
                          lineHeight: 1.04,
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
