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
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
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

const editionLabel = "Weekend Realities · April 25-26, 2026";

const moodSwatches = [
  {
    name: "Saturday Brass",
    hex: "#d9a441",
    meaning: "Bills, repairs, groceries, and errands set the weekend ground truth.",
  },
  {
    name: "Inbox Blue",
    hex: "#5f9ed1",
    meaning: "The world keeps sending signals even when the laptop should be shut.",
  },
  {
    name: "Kitchen Leaf",
    hex: "#63b47d",
    meaning: "Health, food, sleep, and family logistics are the useful metrics.",
  },
  {
    name: "Late-Evening Plum",
    hex: "#a66aa4",
    meaning: "Music and reflection keep the weekend from becoming only admin work.",
  },
];

const moodTags = [
  "April 25-26",
  "Bills and buffers",
  "Health check",
  "Family logistics",
  "Music reset",
];

const worldPulse = [
  {
    eyebrow: "Household ledger",
    title: "The headline still becomes a weekend bill",
    summary:
      "The weekend read is not to panic about geopolitics. It is to notice how oil, freight, fertilizer, plastics, and food inputs quietly arrive inside ordinary household math.",
    source: "Weekend checkpoint: April 26, 2026",
    to: "/blog/2026-04-14-iran-war-hidden-materials-bill-helium-fertilizer",
    analyticsKey: "home_weekly_energy_chokepoint",
    accent: "#d9a441",
    icon: QueryStatsRoundedIcon,
    cta: "Read the materials map",
  },
  {
    eyebrow: "Reality check",
    title: "The dashboard matters only if it changes a decision",
    summary:
      "Use the numbers as a weekend sanity check: crude, indices, volatility, and a few cross-currents. Enough signal to stay oriented, not enough noise to ruin Sunday.",
    source: "Weekend checkpoint: April 26, 2026",
    to: "/keydata",
    analyticsKey: "home_weekly_growth_shadow",
    accent: "#5f9ed1",
    icon: QueryStatsRoundedIcon,
    cta: "Open key data",
  },
  {
    eyebrow: "Cost memory",
    title: "Big conflicts should still be counted calmly",
    summary:
      "Weekend distance helps: reconstruction bills, canal losses, freight shocks, public borrowing, and taxpayer costs need a ledger before they become slogans.",
    source: "Weekend checkpoint: April 26, 2026",
    to: "/blog/2026-04-10-middle-east-fiasco-cost-scorecard",
    analyticsKey: "home_weekly_institution_strain",
    accent: "#c98f35",
    icon: QueryStatsRoundedIcon,
    cta: "Open the cost ledger",
  },
  {
    eyebrow: "Care stack",
    title: "The most practical system is still the body at home",
    summary:
      "After markets and maps, the weekend comes back to sleep, food, medicine, movement, and the real combinations people actually live with.",
    source: "Weekend checkpoint: April 26, 2026",
    to: "/blog/2026-04-11-reply-diabetes-cardio-antibiotic-drug-combinations",
    analyticsKey: "home_weekly_human_scale",
    accent: "#63b47d",
    icon: HealthAndSafetyRoundedIcon,
    cta: "Check the drug stack",
  },
];

const siteVectors = [
  {
    eyebrow: "Bills",
    title: "Start with what can hit the kitchen table",
    summary:
      "The materials map is the weekend bridge from distant conflict to groceries, fuel, plastics, fertilizer, medical supply chains, and small household decisions.",
    to: "/blog/2026-04-14-iran-war-hidden-materials-bill-helium-fertilizer",
    analyticsKey: "home_vector_materials_bill",
    accent: "#d9a441",
    icon: QueryStatsRoundedIcon,
    cta: "Read the materials map",
  },
  {
    eyebrow: "Pulse",
    title: "Then take a five-minute data pulse",
    summary:
      "Crude, indices, volatility, and a few metrics are enough. The weekend job is orientation, not compulsive watching.",
    to: "/keydata",
    analyticsKey: "home_vector_keydata",
    accent: "#5f9ed1",
    icon: QueryStatsRoundedIcon,
    cta: "Open key data",
  },
  {
    eyebrow: "Memory",
    title: "Then keep a cost ledger for noisy events",
    summary:
      "A calmer accounting of escalation: reconstruction bills, lost canal revenue, freight-rate shocks, borrowing, and taxpayer costs.",
    to: "/blog/2026-04-10-middle-east-fiasco-cost-scorecard",
    analyticsKey: "home_vector_middle_east_costs",
    accent: "#c98f35",
    icon: MenuBookRoundedIcon,
    cta: "Open the scorecard",
  },
  {
    eyebrow: "Body",
    title: "Then bring it back to care at home",
    summary:
      "The April 11 note turns safety into a weekend checklist: not whether each pill passed alone, but whether the real combination was checked.",
    to: "/blog/2026-04-11-reply-diabetes-cardio-antibiotic-drug-combinations",
    analyticsKey: "home_vector_drug_stack",
    accent: "#63b47d",
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
          ? "rgba(19, 18, 24, 0.9)"
          : "rgba(252, 250, 244, 0.94)",
        "--home-surface-muted": isDarkMode
          ? "rgba(27, 25, 33, 0.95)"
          : "rgba(248, 245, 237, 0.98)",
        "--home-border": isDarkMode
          ? "rgba(232, 211, 172, 0.18)"
          : "rgba(116, 94, 62, 0.16)",
        "--home-muted-text": isDarkMode
          ? "rgba(238, 230, 214, 0.76)"
          : "rgba(70, 65, 55, 0.78)",
        "--home-ink": isDarkMode ? "#fff9ef" : "#211b15",
        "--home-shadow": isDarkMode
          ? "0 30px 90px rgba(7, 7, 10, 0.42)"
          : "0 26px 64px rgba(97, 78, 43, 0.14)",
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
        description="Weekend realities for April 25-26, 2026: household ledgers, practical health checks, global signals, music, and grounded reflection."
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
                ? "radial-gradient(circle at 14% 14%, rgba(217, 164, 65, 0.28), transparent 22%), radial-gradient(circle at 83% 18%, rgba(95, 158, 209, 0.18), transparent 22%), radial-gradient(circle at 74% 84%, rgba(166, 106, 164, 0.18), transparent 24%), linear-gradient(150deg, rgba(18, 17, 23, 0.98), rgba(33, 28, 37, 0.97) 48%, rgba(20, 28, 24, 0.96))"
                : "radial-gradient(circle at 14% 14%, rgba(217, 164, 65, 0.2), transparent 22%), radial-gradient(circle at 83% 18%, rgba(95, 158, 209, 0.16), transparent 22%), radial-gradient(circle at 74% 84%, rgba(166, 106, 164, 0.14), transparent 24%), linear-gradient(150deg, rgba(252, 250, 244, 0.98), rgba(246, 241, 230, 0.98) 48%, rgba(238, 242, 233, 0.96))",
              boxShadow: "var(--home-shadow)",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(120deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 28%), repeating-linear-gradient(0deg, rgba(217, 164, 65, 0.08) 0 1px, transparent 1px 26px), repeating-linear-gradient(90deg, rgba(95, 158, 209, 0.05) 0 1px, transparent 1px 26px)",
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
                  Refreshed {todayLabel} • weekend checkpoint
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
                  Weekend reality has entered the chat.
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
                  As of Sunday, April 26, 2026, the homepage mood is grounded,
                  slightly tired, and still paying attention. The weekend has
                  its own truth: groceries, health checks, family logistics,
                  music, bills, and a few global signals that refuse to stay
                  outside the house. The site lens stays practical: count what
                  matters, lower the noise, and keep the human stack visible.
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
                        ? "rgba(30, 27, 35, 0.66)"
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
                      "linear-gradient(135deg, #d9a441 0%, #63b47d 48%, #5f9ed1 100%)",
                    "&:hover": {
                      boxShadow: "none",
                      color: "var(--variant-containedColor)",
                      background:
                        "linear-gradient(135deg, #c99535 0%, #55a66f 48%, #4f90c5 100%)",
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
                    Mood: grounded, chore-aware, health-conscious, and allergic
                    to performative optimism.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--home-muted-text)", lineHeight: 1.65 }}
                  >
                    Weekend use: do the ledger, check the body, keep the music
                    nearby, and let the data stay useful.
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
                  Weekend Mood
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  The colors steering the April 25-26 read
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
                  This frame is pinned to the April 25-26 weekend: home
                  economics, care routines, music, and a manageable read of the
                  outside world. Dates stay visible so the page reads like a
                  moment, not a timeless brand voice.
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
          ...revealUpSx(0.12, 0.5),
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: "1px solid var(--home-border)",
          backgroundImage: isDarkMode
            ? "linear-gradient(135deg, rgba(166, 106, 164, 0.28), rgba(22, 23, 28, 0.94) 48%, rgba(99, 180, 125, 0.2))"
            : "linear-gradient(135deg, rgba(166, 106, 164, 0.16), rgba(255, 255, 255, 0.96) 48%, rgba(99, 180, 125, 0.14))",
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
              label="கசடதபரரா song note · Tamil typing"
              sx={{
                alignSelf: "flex-start",
                borderRadius: 999,
                fontWeight: 700,
                color: "var(--home-ink)",
                backgroundColor: isDarkMode
                  ? "rgba(255, 247, 237, 0.08)"
                  : "rgba(255, 255, 255, 0.74)",
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
              பறை அடித்துட்டு பறை அடித்துட்டு... பறை அடித்திட்டு பறை அடித்திட்டு இறை அடித்திடியா
              <br />
              எவரும் ராவணனோ எவரும் ராவணனோ அவரும் பாடனும் அவரும் பாடனும்
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "var(--home-muted-text)",
                lineHeight: 1.7,
                maxWidth: 680,
              }}
            >
              Tamil typing hint added on the Music page: use Gboard, switch the
              keyboard language to Tamil, and type song notes or lyrics directly
              in Tamil script.
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row", md: "column" }}
            spacing={1.2}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <Button
              component={RouterLink}
              to="/music#kasadathaparara"
              variant="contained"
              size="large"
              endIcon={<ArrowOutwardRoundedIcon />}
              onClick={() => trackClick("home_kasadathaparara_music_cta")}
              sx={{
                borderRadius: 999,
                px: 3,
                flexShrink: 0,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
              }}
            >
              Open music reference
            </Button>
            <Button
              component={RouterLink}
              to="/music#tamil-typing-gboard"
              variant="outlined"
              size="large"
              endIcon={<ArrowOutwardRoundedIcon />}
              onClick={() => trackClick("home_tamil_typing_gboard_cta")}
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
              Tamil typing hint
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 3.5 },
          borderRadius: 4,
          border: "1px solid var(--home-border)",
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(27, 25, 33, 0.94), rgba(18, 17, 23, 0.98))"
            : "linear-gradient(135deg, rgba(252, 250, 244, 0.98), rgba(246, 242, 234, 0.98))",
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
                Weekend Reality
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: heroFont,
                  fontWeight: 650,
                  color: "var(--home-ink)",
                }}
              >
                What the weekend is really saying
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{ maxWidth: 520, color: "var(--home-muted-text)" }}
            >
              Four practical signals, one Sunday read. The page stays anchored
              to April 25-26, 2026 instead of pretending this mood is permanent.
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
                  Weekend Routes
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: heroFont,
                    fontWeight: 650,
                    color: "var(--home-ink)",
                  }}
                >
                  How to use the site this weekend
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
                        ? "rgba(31, 29, 38, 0.5)"
                        : "rgba(255, 255, 255, 0.74)",
                      transition:
                        "transform 180ms ease, border-color 180ms ease, background-color 180ms ease",
                      "&:hover": {
                        transform: "translateX(4px)",
                        borderColor: alpha("#64b5ff", 0.82),
                        backgroundColor: isDarkMode
                          ? "rgba(31, 29, 38, 0.7)"
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
                            backgroundColor: alpha("#5f9ed1", 0.14),
                            color: "#5f9ed1",
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
                This weekend asks for fewer slogans and more checklists: bills,
                errands, medicine, sleep, food, music, and one honest look at
                the outside world.
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
            Weekend Reading Stack
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: heroFont,
              fontWeight: 650,
              color: "var(--home-ink)",
            }}
          >
            Three posts for the current weekend-reality mood
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
