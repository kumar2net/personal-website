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
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import { FaTwitter, FaWordpress } from "react-icons/fa";
import SEO from "../components/SEO";
import WorldClock from "../components/WorldClock";
import { homeFeaturedPosts } from "../data/homeFeaturedPosts";

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

const editionLabel = "This Week Mood · April 20-24, 2026";

const moodSwatches = [
  {
    name: "Hormuz Red",
    hex: "#e86f51",
    meaning: "Energy chokepoints are setting the week's risk premium.",
  },
  {
    name: "Institution Blue",
    hex: "#6db7ff",
    meaning: "Policy tools are being tested faster than institutions can adapt.",
  },
  {
    name: "Ledger Gold",
    hex: "#f6c453",
    meaning: "War, freight, fuel, and food shocks are turning into household bills.",
  },
  {
    name: "Resilience Green",
    hex: "#55c794",
    meaning: "The practical question is what keeps working under stress.",
  },
];

const moodTags = [
  "April 20-24",
  "Energy shock",
  "War-risk growth",
  "Institution strain",
  "Resilience",
];

const worldPulse = [
  {
    eyebrow: "Energy shock",
    title: "The chokepoint is back in the price of everything",
    summary:
      "By April 24, oil and fuel anxiety had moved from market ticker to daily-life pressure. The week's mood is not just conflict; it is how quickly a strait, a barrel, a tanker route, and a grocery bill become the same story.",
    source: "Signal date: April 24, 2026",
    to: "/blog/2026-04-14-iran-war-hidden-materials-bill-helium-fertilizer",
    analyticsKey: "home_weekly_energy_chokepoint",
    accent: "#e86f51",
    icon: QueryStatsRoundedIcon,
    cta: "Read the materials map",
  },
  {
    eyebrow: "Growth shadow",
    title: "The global economy is still standing, but less relaxed",
    summary:
      "The April IMF view put growth in the shadow of war: slower activity, stickier inflation, and downside risks from conflict, fragmentation, AI disappointment, and renewed trade tension.",
    source: "Signal date: April 14, 2026",
    to: "/keydata",
    analyticsKey: "home_weekly_growth_shadow",
    accent: "#6db7ff",
    icon: QueryStatsRoundedIcon,
    cta: "Open key data",
  },
  {
    eyebrow: "Institution strain",
    title: "Risk management is now the main operating system",
    summary:
      "This week's Spring Meetings takeaway was blunt: businesses are adapting to risk faster than public buffers are being rebuilt, while energy and supply-chain shocks hit lower-income economies hardest.",
    source: "Signal date: April 23, 2026",
    to: "/blog/2026-04-10-middle-east-fiasco-cost-scorecard",
    analyticsKey: "home_weekly_institution_strain",
    accent: "#f6c453",
    icon: QueryStatsRoundedIcon,
    cta: "Open the cost ledger",
  },
  {
    eyebrow: "Human scale",
    title: "Macro risk still ends at the person using the system",
    summary:
      "The site lens stays practical: after the war-risk ledger comes the bedside checklist. The April 11 drug-stack note asks whether real-world combinations are checked, not merely individual ingredients.",
    source: "Site signal: April 11, 2026",
    to: "/blog/2026-04-11-reply-diabetes-cardio-antibiotic-drug-combinations",
    analyticsKey: "home_weekly_human_scale",
    accent: "#55c794",
    icon: HealthAndSafetyRoundedIcon,
    cta: "Check the drug stack",
  },
];

const siteVectors = [
  {
    eyebrow: "Lead note",
    title: "Start with the materials map",
    summary:
      "The April 14 post explains why the current energy shock is wider than crude: helium, fertilizer inputs, plastics, LNG, oil products, and semiconductor watch items all sit inside the daily economy.",
    to: "/blog/2026-04-14-iran-war-hidden-materials-bill-helium-fertilizer",
    analyticsKey: "home_vector_materials_bill",
    accent: "#e86f51",
    icon: QueryStatsRoundedIcon,
    cta: "Read the materials map",
  },
  {
    eyebrow: "Numbers",
    title: "Then check the weekly scoreboard",
    summary:
      "Crude, indices, volatility, and the handful of metrics that tell you whether this week is repricing or just talking.",
    to: "/keydata",
    analyticsKey: "home_vector_keydata",
    accent: "#6db7ff",
    icon: QueryStatsRoundedIcon,
    cta: "Open key data",
  },
  {
    eyebrow: "Cost scorecard",
    title: "Then read the Middle East ledger",
    summary:
      "A sharper accounting of how regional escalation turns into reconstruction bills, lost canal revenue, freight-rate shocks, and taxpayer costs.",
    to: "/blog/2026-04-10-middle-east-fiasco-cost-scorecard",
    analyticsKey: "home_vector_middle_east_costs",
    accent: "#f6c453",
    icon: MenuBookRoundedIcon,
    cta: "Open the scorecard",
  },
  {
    eyebrow: "Safety stack",
    title: "Then bring it down to patient scale",
    summary:
      "The April 11 note turns safety into a real-world question: not whether each pill passed its own exam, but whether the actual combination was checked.",
    to: "/blog/2026-04-11-reply-diabetes-cardio-antibiotic-drug-combinations",
    analyticsKey: "home_vector_drug_stack",
    accent: "#55c794",
    icon: HealthAndSafetyRoundedIcon,
    cta: "Read the safety note",
  },
];

const quickLinks = [
  { label: "About", to: "/about", analyticsKey: "home_quick_about" },
  { label: "Blog", to: "/blog", analyticsKey: "home_quick_blog" },
  { label: "Learning", to: "/learning", analyticsKey: "home_quick_learning" },
  { label: "Album", to: "/album", analyticsKey: "home_quick_album" },
  { label: "Elsewhere", to: "/elsewhere", analyticsKey: "home_quick_elsewhere" },
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
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <Box
      sx={{
        ...revealUpSx(),
        "--home-surface": isDarkMode
          ? "rgba(24, 15, 20, 0.9)"
          : "rgba(255, 250, 246, 0.94)",
        "--home-surface-muted": isDarkMode
          ? "rgba(32, 20, 26, 0.95)"
          : "rgba(253, 248, 243, 0.98)",
        "--home-border": isDarkMode
          ? "rgba(255, 212, 171, 0.16)"
          : "rgba(139, 93, 60, 0.14)",
        "--home-muted-text": isDarkMode
          ? "rgba(244, 228, 212, 0.74)"
          : "rgba(91, 68, 55, 0.78)",
        "--home-ink": isDarkMode ? "#fff7ed" : "#1d120d",
        "--home-shadow": isDarkMode
          ? "0 30px 90px rgba(9, 6, 7, 0.4)"
          : "0 26px 64px rgba(138, 90, 51, 0.14)",
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
        description="Week of April 20-24, 2026: energy shock, war-risk growth, institutional strain, and practical resilience."
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
              borderRadius: 5,
              p: { xs: 3, md: 5 },
              border: "1px solid var(--home-border)",
              backgroundImage: isDarkMode
                ? "radial-gradient(circle at 14% 14%, rgba(255, 159, 110, 0.3), transparent 22%), radial-gradient(circle at 83% 18%, rgba(100, 181, 255, 0.18), transparent 22%), radial-gradient(circle at 74% 84%, rgba(67, 216, 201, 0.16), transparent 24%), linear-gradient(150deg, rgba(22, 12, 18, 0.98), rgba(39, 19, 27, 0.97) 48%, rgba(27, 16, 21, 0.96))"
                : "radial-gradient(circle at 14% 14%, rgba(255, 159, 110, 0.22), transparent 22%), radial-gradient(circle at 83% 18%, rgba(100, 181, 255, 0.16), transparent 22%), radial-gradient(circle at 74% 84%, rgba(67, 216, 201, 0.15), transparent 24%), linear-gradient(150deg, rgba(255, 248, 242, 0.98), rgba(255, 242, 232, 0.98) 48%, rgba(247, 240, 234, 0.96))",
              boxShadow: "var(--home-shadow)",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(120deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 28%), repeating-linear-gradient(0deg, rgba(255, 210, 170, 0.09) 0 1px, transparent 1px 26px), repeating-linear-gradient(90deg, rgba(100, 181, 255, 0.05) 0 1px, transparent 1px 26px)",
                backgroundSize: "100% 100%, 100% 100%, 100% 100%",
                opacity: isDarkMode ? 0.22 : 0.1,
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
                  label={editionLabel}
                  sx={{
                    borderRadius: 999,
                    fontWeight: 700,
                    letterSpacing: 0.35,
                    color: "var(--home-ink)",
                    backgroundColor: isDarkMode
                      ? "rgba(255, 247, 237, 0.08)"
                      : "rgba(255, 255, 255, 0.72)",
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
                  Refreshed {todayLabel} • signal dates noted below
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
                  Risk premium is this week's mood.
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
                  As of April 24, 2026, the homepage mood is alert but
                  practical. Energy chokepoints are feeding inflation worries,
                  the global growth story is being rewritten under war risk,
                  and institutions are being asked to absorb more shock with
                  thinner buffers. The site lens stays systems-first: map the
                  hidden inputs, count the ledger, then bring the question back
                  to the person using the system.
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
                        ? "rgba(34, 20, 26, 0.66)"
                        : "rgba(255, 255, 255, 0.76)",
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
                  to="/blog/2026-04-14-iran-war-hidden-materials-bill-helium-fertilizer"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  onClick={() => trackClick("home_hero_materials_bill_cta")}
                  sx={{
                    "--variant-containedColor": "#0b2440",
                    borderRadius: 999,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    color: "var(--variant-containedColor)",
                    background:
                      "linear-gradient(135deg, #ff9f6e 0%, #f6c453 44%, #64b5ff 100%)",
                    "&:hover": {
                      boxShadow: "none",
                      color: "var(--variant-containedColor)",
                      background:
                        "linear-gradient(135deg, #fb905a 0%, #efba3a 44%, #53a8ff 100%)",
                    },
                  }}
                >
                  Start with the materials map
                </Button>
                <Button
                  component={RouterLink}
                  to="/blog/2026-04-11-reply-diabetes-cardio-antibiotic-drug-combinations"
                  variant="outlined"
                  size="large"
                  onClick={() => trackClick("home_hero_drug_stack_cta")}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    color: "var(--home-ink)",
                    borderColor: "var(--home-border)",
                  }}
                >
                  Check the human stack
                </Button>
                <Button
                  component={RouterLink}
                  to="/keydata"
                  variant="text"
                  size="large"
                  onClick={() => trackClick("home_hero_keydata_cta")}
                  sx={{
                    borderRadius: 999,
                    px: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    color: "var(--home-ink)",
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
                    Mood: wary, energy-sensitive, and impatient with vague
                    resilience talk.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--home-muted-text)", lineHeight: 1.65 }}
                  >
                    Weekly use: start with the materials map, check the data,
                    then read the cost ledger and human-scale safety note.
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
                  This Week Mood
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  The colors steering the April 20-24 read
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
                  This frame is pinned to April 20-24 global signals, with the
                  April 14 materials map as the local explainer. Dates stay
                  visible so the page reads like a week, not a timeless brand
                  voice.
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
            ? "linear-gradient(135deg, rgba(34, 20, 26, 0.94), rgba(22, 13, 18, 0.98))"
            : "linear-gradient(135deg, rgba(255, 250, 246, 0.98), rgba(250, 244, 238, 0.98))",
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
                World Over
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: heroFont,
                  fontWeight: 650,
                  color: "var(--home-ink)",
                }}
              >
                This week's mood, signal by signal
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{ maxWidth: 520, color: "var(--home-muted-text)" }}
            >
              Four dated signals, one weekly read. The page stays anchored to
              April 20-24, 2026 instead of pretending these moods are permanent.
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
                      borderRadius: 3,
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
                  Weekly Routes
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  How to use the site this week
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
                          borderRadius: 3,
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
                      borderRadius: 3,
                      border: "1px solid var(--home-border)",
                      textDecoration: "none",
                      color: "inherit",
                      backgroundColor: isDarkMode
                        ? "rgba(35, 22, 28, 0.48)"
                        : "rgba(255, 255, 255, 0.74)",
                      transition:
                        "transform 180ms ease, border-color 180ms ease, background-color 180ms ease",
                      "&:hover": {
                        transform: "translateX(4px)",
                        borderColor: alpha("#64b5ff", 0.82),
                        backgroundColor: isDarkMode
                          ? "rgba(35, 22, 28, 0.68)"
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
                            backgroundColor: alpha("#64b5ff", 0.14),
                            color: "#64b5ff",
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
                This week asks for fewer slogans and more checklists: energy
                exposure, policy buffers, cost ledgers, and human-scale safety.
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
            April 20-24 Reading Stack
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: heroFont,
              fontWeight: 650,
              color: "var(--home-ink)",
            }}
          >
            Three posts for the current risk-premium mood
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {featuredPosts.map((post, index) => (
            <Grid
              key={post.slug}
              size={{ xs: 12, md: index === 0 ? 6 : 3 }}
            >
              <Card
                sx={(theme) => ({
                  ...revealUpSx(0.12 + index * 0.06, 0.38),
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
