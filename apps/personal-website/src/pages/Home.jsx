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
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import HowToVoteRoundedIcon from "@mui/icons-material/HowToVoteRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { FaTwitter, FaWordpress } from "react-icons/fa";
import SEO from "../components/SEO";
import WorldClock from "../components/WorldClock";
import { getAllBlogPosts } from "../data/blogRegistry";

const signalReadings = [
  {
    label: "War lanes",
    state: "volatile",
    meter: 92,
    accent: "#fb7185",
    context:
      "Ukraine, Gaza, and Red Sea spillover keep freight, insurance, and diplomacy on edge.",
  },
  {
    label: "Tariff walls",
    state: "rising",
    meter: 81,
    accent: "#f59e0b",
    context:
      "Industrial policy, port fees, and strategic trade controls are back in daily conversation.",
  },
  {
    label: "Democratic trust",
    state: "fragile",
    meter: 74,
    accent: "#38bdf8",
    context:
      "Low patience, low trust, and high noise make every election feel heavier than before.",
  },
  {
    label: "AI work rules",
    state: "rewritten",
    meter: 86,
    accent: "#34d399",
    context:
      "Platform terms, bargaining power, and automation anxiety are now workplace conditions.",
  },
];

const pressurePoints = [
  {
    kicker: "Maritime risk",
    title: "Shipping chokepoints are the new front page",
    summary:
      "Hormuz, Bab el-Mandeb, and Suez turn distant conflict into direct household pricing and delivery risk.",
    to: "/blog/2026-03-07-impact-of-straits-for-trade-commerce",
    analyticsKey: "home_pressure_shipping",
    accent: "#f97316",
    icon: LocalShippingRoundedIcon,
    cta: "Read the straits essay",
  },
  {
    kicker: "Civic strain",
    title: "Democratic fatigue changes the system beneath us",
    summary:
      "Turnout erosion and political exhaustion weaken legitimacy long before formal institutions break.",
    to: "/blog/2026-02-15-why-democratic-apathy-threatens-our-future",
    analyticsKey: "home_pressure_democracy",
    accent: "#38bdf8",
    icon: HowToVoteRoundedIcon,
    cta: "Read the democracy note",
  },
  {
    kicker: "Platform power",
    title: "AI leverage is now a terms-of-work question",
    summary:
      "The argument is no longer whether AI matters, but who gets to write the conditions under which it does.",
    to: "/blog/2026-03-02-is-terms-of-service-really-a-thing",
    analyticsKey: "home_pressure_ai",
    accent: "#34d399",
    icon: MemoryRoundedIcon,
    cta: "Read the ToS piece",
  },
  {
    kicker: "State capacity",
    title: "Public rails are becoming strategic infrastructure",
    summary:
      "Identity, payment, and verification stacks decide how resilient a country feels when private platforms wobble.",
    to: "/blog/2026-02-20-ai-on-upi-aadhaar-ground-truth",
    analyticsKey: "home_pressure_public_rails",
    accent: "#fbbf24",
    icon: AccountTreeRoundedIcon,
    cta: "Read the UPI/Aadhaar note",
  },
];

const responseLanes = [
  {
    label: "Decode",
    title: "Blog",
    description:
      "Long-form dispatches on shipping risk, democracy, AI power, and public systems.",
    to: "/blog",
    analyticsKey: "home_lane_blog",
  },
  {
    label: "Build",
    title: "Projects",
    description:
      "Utilities and experiments shaped by the edge cases that unstable periods expose.",
    to: "/projects",
    analyticsKey: "home_lane_projects",
  },
  {
    label: "Stabilize",
    title: "Learning",
    description:
      "Flashcards, notes, and repeatable study systems to slow the panic cycle and sharpen judgment.",
    to: "/learning",
    analyticsKey: "home_lane_learning",
  },
  {
    label: "Remember",
    title: "Music",
    description:
      "A cultural counterweight so the homepage does not turn into a bunker.",
    to: "/music",
    analyticsKey: "home_lane_music",
  },
];

const quickLinks = [
  { label: "About", to: "/about", analyticsKey: "home_quick_about" },
  { label: "Books", to: "/books", analyticsKey: "home_quick_books" },
  { label: "Convert", to: "/convert", analyticsKey: "home_quick_convert" },
  { label: "Science", to: "/science", analyticsKey: "home_quick_science" },
];

const featuredSlugs = [
  "2026-03-07-impact-of-straits-for-trade-commerce",
  "2026-02-15-why-democratic-apathy-threatens-our-future",
  "2026-03-02-is-terms-of-service-really-a-thing",
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
          ? "rgba(7, 13, 23, 0.9)"
          : "rgba(255, 255, 255, 0.95)",
        "--home-surface-muted": isDarkMode
          ? "rgba(10, 18, 32, 0.94)"
          : "rgba(248, 250, 252, 0.96)",
        "--home-border": isDarkMode
          ? "rgba(148, 163, 184, 0.22)"
          : "rgba(15, 23, 42, 0.12)",
        "--home-muted-text": isDarkMode
          ? "rgba(226, 232, 240, 0.74)"
          : "rgba(30, 41, 59, 0.72)",
        "--home-ink": isDarkMode ? "#f8fafc" : "#0f172a",
        "--home-shadow": isDarkMode
          ? "0 28px 60px rgba(2, 6, 23, 0.48)"
          : "0 28px 60px rgba(15, 23, 42, 0.1)",
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
        description="A pressure-map homepage covering shipping chokepoints, democratic strain, AI power, and the practical tools, notes, books, and music that keep judgment intact."
        canonicalPath="/"
        image="/generate/2026-03-07-impact-of-straits-for-trade-commerce-hero.png"
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
                ? "linear-gradient(140deg, rgba(244, 63, 94, 0.16), transparent 34%), linear-gradient(120deg, rgba(245, 158, 11, 0.12), transparent 55%), linear-gradient(180deg, rgba(2, 6, 23, 0.96), rgba(15, 23, 42, 0.88))"
                : "linear-gradient(140deg, rgba(244, 63, 94, 0.11), transparent 34%), linear-gradient(120deg, rgba(245, 158, 11, 0.11), transparent 56%), linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96))",
              boxShadow: "var(--home-shadow)",
            }}
          >
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: isDarkMode ? 0.3 : 0.18,
                backgroundImage:
                  "linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                right: -40,
                top: -30,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(248, 113, 113, 0.28) 0%, rgba(248, 113, 113, 0) 72%)",
                filter: "blur(6px)",
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
                  icon={<PublicRoundedIcon fontSize="small" />}
                  label="March 2026 fault lines"
                  sx={{
                    borderRadius: 999,
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    color: "var(--home-ink)",
                    backgroundColor: isDarkMode
                      ? "rgba(248, 250, 252, 0.1)"
                      : "rgba(15, 23, 42, 0.06)",
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
                  Editorial frame refreshed {todayLabel}
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 700,
                    fontSize: { xs: "2.35rem", md: "4rem" },
                    lineHeight: 0.98,
                    letterSpacing: "-0.04em",
                    maxWidth: 760,
                    color: "var(--home-ink)",
                  }}
                >
                  A homepage built for a world running hot.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--home-muted-text)",
                    fontSize: { xs: "1rem", md: "1.08rem" },
                    maxWidth: 720,
                  }}
                >
                  Shipping lanes, tariff walls, electoral fatigue, and AI
                  bargaining power now leak into everyday life. This front page
                  starts with those tensions and then routes into the essays,
                  tools, notes, music, and books that help me make sense of
                  them.
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
              >
                {[
                  "Red Sea + Hormuz",
                  "Tariffs + port fees",
                  "Democratic fatigue",
                  "AI terms + labor",
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
                        ? "rgba(15, 23, 42, 0.45)"
                        : "rgba(255, 255, 255, 0.64)",
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
                  to="/blog/2026-03-07-impact-of-straits-for-trade-commerce"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  onClick={() => trackClick("home_hero_straits_cta")}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    backgroundColor: "#f97316",
                    "&:hover": {
                      backgroundColor: "#ea580c",
                      boxShadow: "none",
                    },
                  }}
                >
                  Read the straits essay
                </Button>
                <Button
                  component={RouterLink}
                  to="/blog"
                  variant="outlined"
                  size="large"
                  onClick={() => trackClick("home_hero_blog_cta")}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    color: "var(--home-ink)",
                    borderColor: "var(--home-border)",
                  }}
                >
                  Open the blog
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
                  See projects
                </Button>
              </Stack>
              <Divider sx={{ borderColor: "var(--home-border)" }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--home-muted-text)" }}
                  >
                    This landing page now starts with pressure, not polish. The
                    mood is deliberate: more newsroom map than personal brochure.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--home-muted-text)" }}
                  >
                    The point is not doom. The point is orientation: where power
                    is tightening, where systems are fraying, and what deserves
                    calm attention next.
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
            <Stack spacing={2.5}>
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
                  Pressure Board
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  Four signals shaping the mood
                </Typography>
              </Box>
              {signalReadings.map((signal) => (
                <Stack key={signal.label} spacing={0.9}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "var(--home-ink)" }}
                    >
                      {signal.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: signal.accent,
                        letterSpacing: 1.1,
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      {signal.state}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      overflow: "hidden",
                      backgroundColor: isDarkMode
                        ? "rgba(51, 65, 85, 0.55)"
                        : "rgba(226, 232, 240, 0.9)",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${signal.meter}%`,
                        borderRadius: 999,
                        background: `linear-gradient(90deg, ${signal.accent}, ${alpha(signal.accent, 0.45)})`,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "var(--home-muted-text)", lineHeight: 1.5 }}
                  >
                    {signal.context}
                  </Typography>
                </Stack>
              ))}
              <Divider sx={{ borderColor: "var(--home-border)" }} />
              <Typography
                variant="caption"
                sx={{ color: "var(--home-muted-text)" }}
              >
                Editorial signals, not live market data.
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
                  Fault Lines
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  Where this site is leaning in
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {pressurePoints.map((item, index) => {
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
                                      isDarkMode ? 0.16 : 0.1,
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
                  Response Map
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  What I do with the tension
                </Typography>
              </Box>
              <Stack spacing={1.25}>
                {responseLanes.map((lane) => (
                  <Box
                    key={lane.title}
                    component={RouterLink}
                    to={lane.to}
                    onClick={() => trackClick(lane.analyticsKey)}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: "1px solid var(--home-border)",
                      textDecoration: "none",
                      color: "inherit",
                      backgroundColor: isDarkMode
                        ? "rgba(15, 23, 42, 0.38)"
                        : "rgba(255, 255, 255, 0.65)",
                      transition:
                        "transform 180ms ease, border-color 180ms ease, background-color 180ms ease",
                      "&:hover": {
                        transform: "translateX(4px)",
                        borderColor: alpha("#f97316", 0.8),
                        backgroundColor: isDarkMode
                          ? "rgba(15, 23, 42, 0.62)"
                          : "rgba(255, 255, 255, 0.88)",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Typography
                        variant="overline"
                        sx={{
                          minWidth: 56,
                          color: "#f97316",
                          letterSpacing: 1.3,
                          fontWeight: 700,
                        }}
                      >
                        {lane.label}
                      </Typography>
                      <Stack spacing={0.4}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "var(--home-ink)" }}
                        >
                          {lane.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--home-muted-text)" }}
                        >
                          {lane.description}
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
                Fast Access
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
            Dispatches
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: heroFont,
              fontWeight: 650,
              color: "var(--home-ink)",
            }}
          >
            Start with the pressure-tested writing
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
                          "linear-gradient(180deg, rgba(15, 23, 42, 0.06) 0%, rgba(15, 23, 42, 0.82) 72%, rgba(2, 6, 23, 0.96) 100%)",
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
                              backgroundColor: "rgba(15, 23, 42, 0.58)",
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
                          color: "rgba(226, 232, 240, 0.86)",
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
                            color: "rgba(226, 232, 240, 0.86)",
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
