import React, { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaWordpress } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import {
  Link as RouterLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import SEO from "./components/SEO";
import Logo from "./components/Logo";
import ModeToggle from "./components/ModeToggle";
import ScrollToTop from "./components/ScrollToTop";
import WorldClock from "./components/WorldClock";
import PasswordGate from "./components/PasswordGate";

// Eagerly load critical components
import About from "./pages/About";

// Lazy load all other components
const Album = lazy(() => import("./pages/Album"));
const Blog = lazy(() => import("./pages/Blog"));
const Books = lazy(() => import("./pages/Books"));
const Contact = lazy(() => import("./pages/Contact"));
const Projects = lazy(() => import("./pages/Projects"));
const Learning = lazy(() => import("./pages/Learning"));
const MusicPage = lazy(() => import("./pages/Music"));
const Elsewhere = lazy(() => import("./pages/Elsewhere"));
const ScienceIndex = lazy(() => import("./pages/science"));
const ProteinFoldingPage = lazy(
  () => import("./pages/science/protein-folding"),
);
const BrainVsAiPrimerPage = lazy(() => import("./pages/science/brain-vs-ai"));
const BackPainPlanPage = lazy(() => import("./pages/science/back-pain"));
const PaperSizesPage = lazy(() => import("./pages/science/paper-sizes"));

// Lazy load blog posts
const PostDynamic = lazy(() => import("./pages/blog/PostDynamic"));

// Lazy load book pages
const BookDynamic = lazy(() => import("./pages/books/BookDynamic"));
const ApplyingCornellMethodMd = lazy(
  () => import("./pages/books/applying-cornell-method"),
);
const Atheism = lazy(() => import("./pages/books/atheism"));
const HowToStopCaring = lazy(() => import("./pages/books/how-to-stop-caring"));
const TheBrainStoryContent = lazy(
  () => import("./pages/books/the-brain-story-content"),
);
const TheLastDropOfWater = lazy(
  () => import("./pages/books/TheLastDropOfWater"),
);

// Lazy load other pages
const FlashcardSetPage = lazy(() => import("./pages/FlashcardSetPage"));
const Shortcuts = lazy(() => import("./pages/Shortcuts"));
const UtilitiesDashboard = lazy(() => import("./pages/UtilitiesDashboard"));
const ConvertPage = lazy(() => import("./pages/Convert"));

const NaruviWaterIssues = lazy(() => import("./pages/naruvi"));
const MyReminiscences = lazy(
  () => import("./pages/blog/2025-10-24-my-reminiscences"),
);

const AiRecommenderCode = lazy(
  () => import("./pages/projects/AiRecommenderCode"),
);

// Admin CMS removed

const navLinks = [
  { label: "About", to: "/about", analyticsKey: "nav_about" },
  { label: "Elsewhere", to: "/elsewhere", analyticsKey: "nav_elsewhere" },
  { label: "Projects", to: "/projects", analyticsKey: "nav_projects" },
  { label: "Books", to: "/books", analyticsKey: "nav_books" },
  { label: "Convert", to: "/convert", analyticsKey: "nav_convert" },
  { label: "Blog", to: "/blog", analyticsKey: "nav_blog" },
  { label: "Learning", to: "/learning", analyticsKey: "nav_learning" },
  { label: "Science", to: "/science", analyticsKey: "nav_science" },
  { label: "Music", to: "/music", analyticsKey: "nav_music" },
  { label: "Album", to: "/album", analyticsKey: "nav_album" },
  { label: "Contact", to: "/contact", analyticsKey: "nav_contact" },
];

const heroSections = [
  { label: "About", description: "Backstory & mission.", to: "/about" },
  { label: "Projects", description: "Selected experiments.", to: "/projects" },
  { label: "Books", description: "Reading list & notes.", to: "/books" },
  { label: "Blog", description: "Long-form writing.", to: "/blog" },
  { label: "Learning", description: "Study notes & flashcards.", to: "/learning" },
  { label: "Science", description: "Biology, metabolism, cardiology notes.", to: "/science" },
  { label: "Music", description: "Playlists on repeat.", to: "/music" },
  { label: "Album", description: "Photo essays & trips.", to: "/album" },
];

const ExternalNewsRedirect = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newTab = window.open(
        "https://news.kumar2net.com",
        "_blank",
        "noopener,noreferrer",
      );

      if (!newTab) {
        window.location.href = "https://news.kumar2net.com";
      }
    }
  }, []);

  return (
    <div className="min-h-[40vh] flex items-center justify-center text-gray-600">
      Redirecting to news.kumar2net.com...
      <a
        href="https://news.kumar2net.com"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 text-blue-600 hover:underline"
      >
        Open manually
      </a>
    </div>
  );
};

function useGaPageViews() {
  const location = useLocation();

  // Track GA4 page_view on route change
  const trackPageView = React.useCallback(() => {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;

    // GA4 SPA best practice: use `gtag('config', measurementId, { page_path })`
    // on route changes. This reliably produces GA4 pageviews for client-side
    // routing even when the initial `gtag('config', ...)` uses `send_page_view: false`.
    const GA_MEASUREMENT_ID = "G-PZ37S6E5BL";
    const pagePath = location.pathname + location.search;
    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: true,
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });

    // Also track custom event for better analytics
    window.gtag("event", "page_view_custom", {
      event_category: "engagement",
      event_label: location.pathname,
      page_path: pagePath,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleReady = () => trackPageView();
    window.addEventListener("ga:ready", handleReady);
    if (window.__gaReady) {
      handleReady();
    }
    return () => window.removeEventListener("ga:ready", handleReady);
  }, [trackPageView]);
}

const App = ({ mode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showWorldClock, setShowWorldClock] = useState(false);
  const isDarkMode = mode === "dark";

  const trackClick = (eventName, parameters = {}) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, {
        event_category: "navigation",
        event_label: eventName,
        ...parameters,
      });
    }
  };

  const getLinkProps = (item) =>
    item.to
      ? { component: RouterLink, to: item.to }
      : {
          component: "a",
          href: item.href,
          target: "_blank",
          rel: "noopener noreferrer",
        };

  const handleNavClick = (item, isMobile = false) => {
    trackClick(
      isMobile ? `${item.analyticsKey}_mobile` : item.analyticsKey,
      { surface: isMobile ? "drawer" : "appbar" },
    );
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };
  const currentYear = new Date().getFullYear();
  const heroFont = '"Space Grotesk", "Satoshi", "Noto Sans", sans-serif';
  const serifFont = '"Newsreader", "Iowan Old Style", "Palatino", serif';

  useGaPageViews();

  // Handle app loading and error states
  useEffect(() => {
    // Remove artificial delay for faster loading
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const reveal = () => setShowWorldClock(true);
    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(reveal, { timeout: 1500 })
        : window.setTimeout(reveal, 400);
    return () => {
      if ("cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  // Error boundary for mobile browsers
  useEffect(() => {
    const handleError = (error) => {
      console.error("App error:", error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="primary" />
          <Typography variant="body2" color="text.secondary">
            Loading…
          </Typography>
        </Stack>
      </Box>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          px: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            maxWidth: 420,
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h4" color="error" sx={{ mb: 2 }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please refresh the page or try again later.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            aria-label="Refresh the page to try again"
          >
            Refresh Page
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box
        className="mobile-fix"
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SEO
          title="My Stories"
          description="AI enthusiast. Projects, blog, books, music, learning resources, and more."
          canonicalPath="/"
          image="/vite.svg"
          type="website"
        />
        <ScrollToTop />
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{
            backdropFilter: "blur(18px)",
            backgroundColor: isDarkMode
              ? "rgba(5, 11, 22, 0.9)"
              : "rgba(255, 255, 255, 0.92)",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ minHeight: 80, gap: 2 }}>
            <Tooltip title="Click to go Home">
              <Box
                component={RouterLink}
                to="/"
                onClick={() => trackClick("nav_home")}
                aria-label="கு कु Home"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                  gap: 1,
                  transition: "transform 200ms ease",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                <Logo className="h-[60px] w-[60px]" />
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: { xs: "inline-flex", md: "none" },
                    color: "text.secondary",
                    fontWeight: 600,
                  }}
                >
                  Home
                </Typography>
              </Box>
            </Tooltip>
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" }, ml: "auto" }}
            >
              {navLinks.map((item) => (
                <Button
                  key={item.label}
                  {...getLinkProps(item)}
                  onClick={() => handleNavClick(item)}
                  color="inherit"
                  size="small"
                  sx={{
                    color: isDarkMode ? "rgba(248,250,252,0.92)" : "#0f172a",
                    borderRadius: 999,
                    px: 2,
                    fontWeight: 600,
                    letterSpacing: 0.2,
                    transition:
                      "color 180ms ease, background-color 180ms ease, transform 180ms ease",
                    "&:hover": {
                      color: isDarkMode ? "#ffffff" : "#1d4ed8",
                      backgroundColor: isDarkMode
                        ? "rgba(248,250,252,0.12)"
                        : "rgba(59,130,246,0.08)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <ModeToggle />
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}
            >
              <ModeToggle />
              <IconButton
                onClick={() => {
                  setIsMobileMenuOpen(true);
                  trackClick("mobile_menu_toggle", { isOpen: true });
                }}
                aria-label="Open mobile menu"
                sx={{ color: isDarkMode ? "#f8fafc" : "#0f172a" }}
              >
                <HiMenu />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="right"
          open={isMobileMenuOpen}
          onClose={() => {
            setIsMobileMenuOpen(false);
            trackClick("mobile_menu_toggle", { isOpen: false });
          }}
          PaperProps={{
            sx: {
              width: 320,
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: isDarkMode ? "#f8fafc" : "#0f172a" }}
            >
              Navigate
            </Typography>
            <ModeToggle />
          </Stack>
          <Divider />
          <List dense>
            {navLinks.map((item) => (
              <ListItem disablePadding key={item.label}>
                <ListItemButton
                  {...getLinkProps(item)}
                  onClick={() => handleNavClick(item, true)}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 600,
                        color: isDarkMode ? "#f8fafc" : "#0f172a",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
            <Suspense
              fallback={
                <Box
                  sx={{
                    py: 16,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary">
                    Loading…
                  </Typography>
                </Box>
              }
            >
            <ScrollToTop>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Box
                      component={motion.section}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: 6, md: 8 },
                        position: "relative",
                      }}
                    >
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: 5,
                          px: { xs: 3, md: 6 },
                          py: { xs: 4, md: 6 },
                          border: "1px solid",
                          borderColor: "divider",
                          backgroundImage: isDarkMode
                            ? "radial-gradient(circle at 16% 20%, rgba(14,165,233,0.22), transparent 55%), radial-gradient(circle at 88% 12%, rgba(245,158,11,0.18), transparent 45%), linear-gradient(135deg, rgba(2,6,23,0.96), rgba(15,23,42,0.9))"
                            : "radial-gradient(circle at 16% 20%, rgba(59,130,246,0.18), transparent 55%), radial-gradient(circle at 88% 12%, rgba(245,158,11,0.2), transparent 45%), linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241,245,249,0.9))",
                          boxShadow: isDarkMode
                            ? "0 28px 60px rgba(2,6,23,0.65)"
                            : "0 28px 60px rgba(15,23,42,0.12)",
                        }}
                      >
                        <Box
                          aria-hidden
                          sx={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            backgroundImage:
                              "linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(0deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
                            backgroundSize: "48px 48px",
                            opacity: isDarkMode ? 0.35 : 0.2,
                          }}
                        />
                        <Grid
                          container
                          spacing={{ xs: 3, md: 4 }}
                          sx={{ position: "relative", zIndex: 1 }}
                          alignItems="center"
                        >
                          <Grid size={{ xs: 12, md: 7 }}>
                            <Stack spacing={{ xs: 2.5, md: 3 }}>
                              <Stack spacing={1}>
                                <Typography
                                  variant="overline"
                                  sx={{
                                    letterSpacing: 3,
                                    fontWeight: 700,
                                    color: "text.secondary",
                                  }}
                                >
                                  KUMAR2NET / 2026
                                </Typography>
                                <Typography
                                  variant="h2"
                                  sx={{
                                    fontFamily: heroFont,
                                    fontWeight: 700,
                                    fontSize: { xs: "2.35rem", md: "3.6rem" },
                                    lineHeight: 1.05,
                                    letterSpacing: "-0.02em",
                                    color: "text.primary",
                                  }}
                                >
                                  Human-first AI, practical learning, and calm
                                  tech notes.
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontSize: { xs: "1.05rem", md: "1.2rem" },
                                    color: "text.secondary",
                                    maxWidth: 560,
                                  }}
                                >
                                  I build, test, and document AI workflows,
                                  science notes, and cultural stories. Everything
                                  here is meant to be reused.
                                </Typography>
                              </Stack>
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                sx={{
                                  alignItems: { xs: "stretch", sm: "center" },
                                  flexWrap: "wrap",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  size="large"
                                  {...getLinkProps({ to: "/blog" })}
                                  onClick={() => trackClick("hero_blog_cta")}
                                  sx={{
                                    borderRadius: 999,
                                    px: 3,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    boxShadow: isDarkMode
                                      ? "0 16px 30px rgba(14,165,233,0.25)"
                                      : "0 16px 30px rgba(37,99,235,0.25)",
                                  }}
                                >
                                  Read the blog
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="large"
                                  {...getLinkProps({ to: "/projects" })}
                                  onClick={() => trackClick("hero_projects_cta")}
                                  sx={{
                                    borderRadius: 999,
                                    px: 3,
                                    textTransform: "none",
                                    fontWeight: 600,
                                  }}
                                >
                                  Explore projects
                                </Button>
                                <Button
                                  variant="text"
                                  size="large"
                                  {...getLinkProps({ to: "/contact" })}
                                  onClick={() => trackClick("hero_contact_cta")}
                                  sx={{
                                    borderRadius: 999,
                                    px: 2,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    color: "text.primary",
                                  }}
                                >
                                  Contact
                                </Button>
                              </Stack>
                              <Stack
                                direction="row"
                                spacing={1}
                                useFlexGap
                                flexWrap="wrap"
                              >
                                {[
                                  "AI systems",
                                  "Education",
                                  "Markets",
                                  "Culture",
                                  "Science notes",
                                ].map((item) => (
                                  <Box
                                    key={item}
                                    sx={{
                                      px: 1.5,
                                      py: 0.6,
                                      borderRadius: 999,
                                      border: "1px solid",
                                      borderColor: "divider",
                                      fontSize: "0.7rem",
                                      fontWeight: 700,
                                      letterSpacing: "0.08em",
                                      textTransform: "uppercase",
                                      bgcolor: isDarkMode
                                        ? "rgba(2,6,23,0.6)"
                                        : "rgba(255,255,255,0.8)",
                                    }}
                                  >
                                    {item}
                                  </Box>
                                ))}
                              </Stack>
                            </Stack>
                          </Grid>
                          <Grid size={{ xs: 12, md: 5 }}>
                            <Stack spacing={2}>
                              <Paper
                                variant="outlined"
                                sx={{
                                  p: 3,
                                  borderRadius: 3,
                                  backgroundColor: isDarkMode
                                    ? "rgba(2,6,23,0.65)"
                                    : "rgba(255,255,255,0.75)",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                <Stack spacing={1.5}>
                                  <Typography
                                    variant="overline"
                                    sx={{
                                      letterSpacing: 2,
                                      fontWeight: 700,
                                      color: "text.secondary",
                                    }}
                                  >
                                    Now
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontFamily: heroFont,
                                      fontWeight: 700,
                                    }}
                                  >
                                    2026 focus
                                  </Typography>
                                  <Stack spacing={1}>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      AI workflows that stay human-readable.
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Learning notes you can reuse in class or at
                                      work.
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Markets, policy, and culture as lived
                                      signals.
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Paper>
                              <Paper
                                variant="outlined"
                                sx={{
                                  p: 3,
                                  borderRadius: 3,
                                  backgroundColor: isDarkMode
                                    ? "rgba(2,6,23,0.65)"
                                    : "rgba(255,255,255,0.8)",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    variant="overline"
                                    sx={{
                                      letterSpacing: 2,
                                      fontWeight: 700,
                                      color: "text.secondary",
                                    }}
                                  >
                                    Copyleft
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Copy, reuse, and remix anything on this site.
                                    Credit is appreciated but not required.
                                  </Typography>
                                </Stack>
                              </Paper>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                      <Box>
                        <Stack spacing={1} sx={{ mb: 2 }}>
                          <Typography
                            variant="overline"
                            sx={{
                              letterSpacing: 2,
                              fontWeight: 700,
                              color: "text.secondary",
                            }}
                          >
                            Navigate
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, fontFamily: heroFont }}
                          >
                            Explore the archive
                          </Typography>
                        </Stack>
                        <Grid container spacing={3}>
                          {heroSections.map((section, index) => (
                            <Grid
                              key={section.label}
                              size={{ xs: 12, sm: 6, md: 4 }}
                            >
                              <Card
                                component={motion.article}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.45,
                                  delay: index * 0.05,
                                }}
                                sx={(theme) => ({
                                  height: "100%",
                                  borderRadius: 3,
                                  border: "1px solid",
                                  borderColor: "divider",
                                  backgroundColor: isDarkMode
                                    ? "rgba(2,6,23,0.55)"
                                    : "rgba(255,255,255,0.9)",
                                  backdropFilter: "blur(10px)",
                                  transition:
                                    "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
                                  "&:hover": {
                                    transform: "translateY(-4px)",
                                    borderColor: "primary.main",
                                    boxShadow: theme.shadows[6],
                                  },
                                })}
                              >
                                <CardActionArea
                                  {...getLinkProps(section)}
                                  onClick={() =>
                                    trackClick(
                                      `hero_${section.label.toLowerCase()}_card`,
                                    )
                                  }
                                  sx={{ height: "100%" }}
                                >
                                  <CardContent
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="overline"
                                      sx={{
                                        letterSpacing: 2,
                                        fontWeight: 700,
                                        color: "text.secondary",
                                      }}
                                    >
                                      {String(index + 1).padStart(2, "0")}
                                    </Typography>
                                    <Typography variant="h6">
                                      {section.label}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {section.description}
                                    </Typography>
                                  </CardContent>
                                </CardActionArea>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                      <Grid container spacing={3} alignItems="stretch">
                        <Grid size={{ xs: 12, md: 7 }}>
                          <Paper
                            component={motion.blockquote}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            sx={{
                              height: "100%",
                              p: { xs: 4, md: 5 },
                              borderRadius: 4,
                              border: "1px solid",
                              borderColor: "divider",
                              backgroundColor: isDarkMode
                                ? "rgba(2,6,23,0.65)"
                                : "rgba(255,255,255,0.9)",
                              boxShadow: isDarkMode
                                ? "0 18px 40px rgba(2,6,23,0.4)"
                                : "0 18px 40px rgba(15,23,42,0.12)",
                            }}
                          >
                            <Typography
                              variant="h5"
                              sx={{
                                fontFamily: serifFont,
                                fontStyle: "italic",
                                lineHeight: 1.6,
                                color: "text.primary",
                              }}
                            >
                              "Courage isn't having the strength to go on - it is
                              going on when you don't have strength."
                            </Typography>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              sx={{ mt: 3 }}
                            >
                              <Box
                                sx={{
                                  width: 48,
                                  height: 4,
                                  borderRadius: 999,
                                  bgcolor: "primary.main",
                                }}
                              />
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                - Napoleon Bonaparte
                              </Typography>
                            </Stack>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                          <Paper
                            variant="outlined"
                            sx={{
                              height: "100%",
                              p: 3,
                              borderRadius: 3,
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              backgroundColor: isDarkMode
                                ? "rgba(2,6,23,0.6)"
                                : "rgba(255,255,255,0.85)",
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            <Typography
                              variant="overline"
                              sx={{
                                letterSpacing: 2,
                                fontWeight: 700,
                                color: "text.secondary",
                              }}
                            >
                              Quick tools
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ fontFamily: heroFont, fontWeight: 700 }}
                            >
                              Jump in fast
                            </Typography>
                            <Stack spacing={1}>
                              {[
                                {
                                  label: "Unit converter",
                                  to: "/convert",
                                  analyticsKey: "hero_tool_convert",
                                },
                                {
                                  label: "Utilities dashboard",
                                  to: "/utilities",
                                  analyticsKey: "hero_tool_utilities",
                                },
                                {
                                  label: "Flashcards and learning",
                                  to: "/learning",
                                  analyticsKey: "hero_tool_learning",
                                },
                              ].map((tool) => (
                                <Button
                                  key={tool.label}
                                  {...getLinkProps(tool)}
                                  onClick={() => trackClick(tool.analyticsKey)}
                                  variant="text"
                                  size="small"
                                  sx={{
                                    justifyContent: "flex-start",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    color: "text.primary",
                                  }}
                                >
                                  {tool.label}
                                </Button>
                              ))}
                            </Stack>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Practical tools, trimmed for speed.
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                      <Stack spacing={2} alignItems="center">
                        <Typography
                          variant="overline"
                          sx={{
                            letterSpacing: 2,
                            fontWeight: 700,
                            color: "text.secondary",
                          }}
                        >
                          Live time
                        </Typography>
                        {showWorldClock ? (
                          <WorldClock compact />
                        ) : (
                          <Box sx={{ mt: 2, minHeight: 140 }} aria-hidden />
                        )}
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        sx={{ flexWrap: "wrap" }}
                      >
                        {[
                          {
                            href: "https://kumar2net.wordpress.com/",
                            label: "WordPress",
                            icon: <FaWordpress />,
                          },
                          {
                            href: "https://twitter.com/kumar2net",
                            label: "X (Twitter)",
                            icon: <FaTwitter />,
                          },
                        ].map((social) => (
                          <IconButton
                            key={social.label}
                            component="a"
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            sx={{
                              borderRadius: "50%",
                              width: 56,
                              height: 56,
                              border: "1px solid",
                              borderColor: "divider",
                              boxShadow: "0 12px 30px rgba(15,23,42,0.15)",
                              color: "text.primary",
                            }}
                          >
                            {social.icon}
                          </IconButton>
                        ))}
                      </Stack>
                    </Box>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <>
                      <SEO
                        title="About"
                        description="About Kumar and this website."
                        canonicalPath="/about"
                        type="website"
                      />
                      <About />
                    </>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <>
                      <SEO
                        title="Projects"
                        description="Selected projects and experiments."
                        canonicalPath="/projects"
                        type="website"
                      />
                      <Projects />
                    </>
                  }
                />
                <Route
                  path="/projects/ai-recommender-code"
                  element={
                    <>
                      <SEO
                        title="AI Recommender Code"
                        description="Full Colab notebook powering the AI-driven blog topic recommender."
                        canonicalPath="/projects/ai-recommender-code"
                        type="article"
                      />
                      <AiRecommenderCode />
                    </>
                  }
                />
                <Route
                  path="/blog"
                  element={
                    <>
                      <SEO
                        title="Blog"
                        description="Latest posts on technology, learning, and life."
                        canonicalPath="/blog"
                        type="website"
                      />
                      <Blog />
                    </>
                  }
                />
                <Route path="/news" element={<ExternalNewsRedirect />} />
                <Route
                  path="/blog/2025-10-24-my-reminiscences"
                  element={
                    <>
                      <SEO
                        title="My Reminiscences"
                        description="Personal reflections on family, technology, and life changes over the years. From mobile services evolution to cryptocurrency battles, data science insights to cultural connections."
                        canonicalPath="/blog/2025-10-24-my-reminiscences"
                        type="article"
                      />
                      <MyReminiscences />
                    </>
                  }
                />
                <Route
                  path="/learning"
                  element={
                    <>
                      <SEO
                        title="Learning"
                        description="Learning hub: flashcards, notes, and more."
                        canonicalPath="/learning"
                        type="website"
                      />
                      <Learning />
                    </>
                  }
                />
                <Route
                  path="/music"
                  element={
                    <>
                      <SEO
                        title="Music"
                        description="Favorite tracks and playlists."
                        canonicalPath="/music"
                        type="website"
                      />
                      <MusicPage />
                    </>
                  }
                />
                <Route
                  path="/album"
                  element={
                    <>
                      <SEO
                        title="Album"
                        description="Travel albums and photos."
                        canonicalPath="/album"
                        type="website"
                      />
                      <Album />
                    </>
                  }
                />
                <Route
                  path="/elsewhere"
                  element={
                    <>
                      <SEO
                        title="Elsewhere"
                        description="WordPress posts and X timeline."
                        canonicalPath="/elsewhere"
                        type="website"
                      />
                      <Elsewhere />
                    </>
                  }
                />
                <Route
                  path="/books"
                  element={
                    <>
                      <SEO
                        title="Books"
                        description="Books I’m reading and notes."
                        canonicalPath="/books"
                        type="website"
                      />
                      <Books />
                    </>
                  }
                />
                <Route
                  path="/books/applying-cornell-method"
                  element={<ApplyingCornellMethodMd />}
                />
                <Route
                  path="/books/the-brain-story-content"
                  element={<TheBrainStoryContent />}
                />
                <Route
                  path="/books/atheism"
                  element={
                    <>
                      <SEO
                        title="Atheism"
                        description="Atheism book notes and excerpts."
                        canonicalPath="/books/atheism"
                        type="article"
                      />
                      <Atheism />
                    </>
                  }
                />
                <Route
                  path="/books/how-to-stop-caring"
                  element={
                    <>
                      <SEO
                        title="How to STOP Caring What People Think of You!"
                        description="A concise guide to breaking free from others' opinions and living authentically. Russell Jamieson provides practical strategies for developing self-confidence."
                        canonicalPath="/books/how-to-stop-caring"
                        type="article"
                      />
                      <HowToStopCaring />
                    </>
                  }
                />
                <Route
                  path="/books/the-last-drop-of-water"
                  element={
                    <>
                      <SEO
                        title="The Last Drop of Water, oh no - A True Story of Compassion"
                        description="A profound true story about compassion and reflection. When a dying darkling beetle crosses paths with Kumar.A on a Sunday morning in Coimbatore, a simple act of kindness becomes a meditation on mortality and empathy."
                        canonicalPath="/books/the-last-drop-of-water"
                        type="article"
                        image="/media/darkling-beetle.jpg"
                      />
                      <TheLastDropOfWater />
                    </>
                  }
                />
                <Route path="/books/:slug" element={<BookDynamic />} />
                <Route path="/learning/:setId" element={<FlashcardSetPage />} />
                <Route
                  path="/learning/shortcuts"
                  element={
                    <>
                      <SEO
                        title="Shortcuts"
                        description="Keyboard shortcuts and practice."
                        canonicalPath="/learning/shortcuts"
                        type="website"
                      />
                      <Shortcuts />
                    </>
                  }
                />

                <Route
                  path="/utilities"
                  element={
                    <>
                      <SEO
                        title="Utilities"
                        description="Utilities dashboard and tools."
                        canonicalPath="/utilities"
                        type="website"
                      />
                      <PasswordGate>
                        <UtilitiesDashboard />
                      </PasswordGate>
                    </>
                  }
                />
                <Route
                  path="/science"
                  element={
                    <>
                      <SEO
                        title="Science"
                        description="Science explorations across biology, metabolism, and cardiology."
                        canonicalPath="/science"
                        type="website"
                      />
                      <ScienceIndex />
                    </>
                  }
                />
                <Route
                  path="/science/protein-folding"
                  element={
                    <>
                      <SEO
                        title="Protein Folding – Insulin & Heart Medication Insights"
                        description="Interactive WebGPU visual of insulin folding with cardiometabolic explanations."
                        canonicalPath="/science/protein-folding"
                        type="website"
                      />
                      <ProteinFoldingPage />
                    </>
                  }
                />
                <Route
                  path="/science/brain-vs-ai"
                  element={
                    <>
                      <SEO
                        title="Brain Vs AI Neural Network Primer"
                        description="WebGPU visualization comparing neurons + synapses with transformer-style neural nets powering LLMs."
                        canonicalPath="/science/brain-vs-ai"
                        type="website"
                      />
                      <BrainVsAiPrimerPage />
                    </>
                  }
                />
                <Route
                  path="/science/back-pain"
                  element={
                    <>
                      <SEO
                        title="Back Pain Relief – Paraspinal Calm-Down Plan"
                        description="Annotated, voiceover-friendly plan to reduce paraspinal spasm with low-gravity moves and safety guardrails."
                        canonicalPath="/science/back-pain"
                        type="website"
                      />
                      <BackPainPlanPage />
                    </>
                  }
                />
                <Route
                  path="/science/paper-sizes"
                  element={
                    <>
                      <SEO
                        title="A-Series Paper Sizes – A4 to A0"
                        description="WebGPU demo illustrating how A4 to A0 follow the sqrt(2) ratio."
                        canonicalPath="/science/paper-sizes"
                        type="website"
                      />
                      <PaperSizesPage />
                    </>
                  }
                />
                <Route
                  path="/convert"
                  element={
                    <>
                      <SEO
                        title="Unit Converter"
                        description="Convert between U.S. lifestyle units and their metric counterparts."
                        canonicalPath="/convert"
                        type="website"
                      />
                      <ConvertPage />
                    </>
                  }
                />
                <Route
                  path="/naruvi"
                  element={
                    <>
                      <SEO
                        title="Naruvi Water Issues"
                        description="Naruvi water issues dashboard and notes."
                        canonicalPath="/naruvi"
                        type="website"
                      />
                      <NaruviWaterIssues />
                    </>
                  }
                />
                {/* Admin route removed */}
                <Route path="/blog/:slug" element={<PostDynamic />} />

                <Route
                  path="/contact"
                  element={
                    <>
                      <SEO
                        title="Contact"
                        description="Get in touch with Kumar."
                        canonicalPath="/contact"
                        type="website"
                      />
                      <Contact />
                    </>
                  }
                />
                {/* Admin route is handled by static files, not React Router */}
              </Routes>
            </ScrollToTop>
          </Suspense>
        </Container>
      </Box>
      <Box
        component="footer"
        sx={{
          mt: "auto",
          borderTop: "1px solid",
          borderColor: "divider",
          py: 4,
          backgroundColor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="body2" color="text.secondary">
              © {currentYear} My Stories. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Button
                component="a"
                href="https://kumar2net.wordpress.com/"
                target="_blank"
                rel="noopener noreferrer"
                variant="text"
                size="small"
              >
                WordPress
              </Button>
              <Button
                component="a"
                href="https://twitter.com/kumar2net"
                target="_blank"
                rel="noopener noreferrer"
                variant="text"
                size="small"
              >
                Twitter
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
    </ErrorBoundary>
  );
}

export default App;
