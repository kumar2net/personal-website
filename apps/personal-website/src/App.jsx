import { Suspense, lazy, useEffect, useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
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
  CircularProgress,
  Container,
  Divider,
  Drawer,
  IconButton,
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
import ScrollToTop from "./components/ScrollToTop";
import PasswordGate from "./components/PasswordGate";

// Lazy load all other components
const About = lazy(() => import("./pages/About"));
const Home = lazy(() => import("./pages/Home"));
const Album = lazy(() => import("./pages/Album"));
const Blog = lazy(() => import("./pages/Blog"));
const Books = lazy(() => import("./pages/Books"));
const Contact = lazy(() => import("./pages/Contact"));
const Projects = lazy(() => import("./pages/Projects"));
const Learning = lazy(() => import("./pages/Learning"));
const MusicPage = lazy(() => import("./pages/Music"));
const Elsewhere = lazy(() => import("./pages/Elsewhere"));
const AnanyasLocalGuide = lazy(() => import("./pages/AnanyasLocalGuide"));
const ScienceIndex = lazy(() => import("./pages/science"));
const ProteinFoldingPage = lazy(
  () => import("./pages/science/protein-folding"),
);
const BrainVsAiPrimerPage = lazy(() => import("./pages/science/brain-vs-ai"));
const BackPainPlanPage = lazy(() => import("./pages/science/back-pain"));
const PaperSizesPage = lazy(() => import("./pages/science/paper-sizes"));
const NetworkingPage = lazy(() => import("./pages/science/networking"));
const PatellarInstabilityPage = lazy(
  () => import("./pages/science/patellar-instability"),
);

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
const KeyDataPage = lazy(() => import("./pages/KeyData"));
const UtilitiesDashboard = lazy(() => import("./pages/UtilitiesDashboard"));
const ShortsOptimizerDashboard = lazy(
  () => import("./pages/ShortsOptimizerDashboard"),
);
const MicroSoapStudio = lazy(() => import("./pages/MicroSoapStudio"));
const LocalGuideReview = lazy(() => import("./pages/LocalGuideReview"));
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
  {
    label: "Local Guide",
    to: "/local/ananyas-nearby",
    analyticsKey: "nav_local_guide",
  },
  { label: "Projects", to: "/projects", analyticsKey: "nav_projects" },
  { label: "Key Data", to: "/keydata", analyticsKey: "nav_keydata" },
  { label: "Books", to: "/books", analyticsKey: "nav_books" },
  { label: "Convert", to: "/convert", analyticsKey: "nav_convert" },
  { label: "Blog", to: "/blog", analyticsKey: "nav_blog" },
  { label: "Learning", to: "/learning", analyticsKey: "nav_learning" },
  { label: "Science", to: "/science", analyticsKey: "nav_science" },
  { label: "Music", to: "/music", analyticsKey: "nav_music" },
  { label: "Album", to: "/album", analyticsKey: "nav_album" },
  { label: "Contact", to: "/contact", analyticsKey: "nav_contact" },
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const trackPageView = () => {
      if (typeof window.gtag !== "function") {
        return;
      }

      const GA_MEASUREMENT_ID = "G-PZ37S6E5BL";
      const pagePath = location.pathname + location.search;
      window.gtag("config", GA_MEASUREMENT_ID, {
        send_page_view: true,
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title,
      });
      window.gtag("event", "page_view_custom", {
        event_category: "engagement",
        event_label: location.pathname,
        page_path: pagePath,
        page_title: document.title,
      });
    };

    if (typeof window.gtag === "function") {
      trackPageView();
      return undefined;
    }

    const handleReady = () => trackPageView();
    window.addEventListener("ga:ready", handleReady);
    return () => window.removeEventListener("ga:ready", handleReady);
  }, [location.pathname, location.search]);
}

const App = ({ mode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      {
        surface: isMobile ? "drawer" : "appbar",
      },
    );
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };
  const currentYear = new Date().getFullYear();

  useGaPageViews();

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
          description="Personal website with projects, blog, books, music, learning resources, and practical notes."
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
                onClick={() =>
                  trackClick("nav_home", {
                    surface: "appbar",
                  })
                }
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
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}
            >
              <IconButton
                onClick={() => {
                  setIsMobileMenuOpen(true);
                  trackClick("mobile_menu_toggle", { isOpen: true });
                }}
                aria-label="Open mobile menu"
                sx={{ color: isDarkMode ? "#f8fafc" : "#0f172a" }}
              >
                <MenuRoundedIcon />
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
              bgcolor: "background.paper",
              color: "text.primary",
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
              sx={{ color: "text.primary" }}
            >
              Navigate
            </Typography>
          </Stack>
          <Divider />
          <List dense>
            {navLinks.map((item) => (
              <ListItem disablePadding key={item.label}>
                <ListItemButton
                  {...getLinkProps(item)}
                  onClick={() => handleNavClick(item, true)}
                  sx={{
                    borderRadius: 2,
                    color: "text.primary",
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 600,
                        color: "inherit",
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
                    <Home
                      isDarkMode={isDarkMode}
                      showWorldClock={showWorldClock}
                      trackClick={trackClick}
                    />
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
                  path="/keydata"
                  element={
                    <>
                      <SEO
                        title="Key Data"
                        description="Daily market key data across U.S. and India indices, crude, renewables, AI infrastructure, and generated insights."
                        canonicalPath="/keydata"
                        type="website"
                      />
                      <KeyDataPage />
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
                <Route path="/local/ananyas-nearby" element={<AnanyasLocalGuide />} />
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
                  path="/shorts-metrics"
                  element={
                    <>
                      <SEO
                        title="Shorts Metrics"
                        description="Monitor YouTube Shorts CTR and retention runs generated by the Shorts optimizer."
                        canonicalPath="/shorts-metrics"
                        type="website"
                      />
                      <PasswordGate
                        title="Shorts Metrics Access"
                        description="Enter the utilities credentials to view private Shorts performance data."
                      >
                        <ShortsOptimizerDashboard />
                      </PasswordGate>
                    </>
                  }
                />
                <Route
                  path="/microsoap"
                  element={
                    <>
                      <SEO
                        title="Microsoap Studio"
                        description="Bilingual Tamil-English micro-soap Shorts scaffold with A/B sequel voting and OpenAI generation hooks."
                        canonicalPath="/microsoap"
                        type="website"
                      />
                      <MicroSoapStudio />
                    </>
                  }
                />
                <Route
                  path="/utilities/local-guide-review"
                  element={
                    <>
                      <SEO
                        title="Local Guide Review"
                        description="Private review queue for Ananyas local guide listing reports."
                        canonicalPath="/utilities/local-guide-review"
                        type="website"
                      />
                      <PasswordGate
                        title="Local Guide Review Access"
                        description="Enter the utilities credentials to review listing reports and approve updates."
                      >
                        <LocalGuideReview />
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
                  path="/science/patellar-instability"
                  element={
                    <>
                      <SEO
                        title="Recurrent Kneecap Dislocation – Anatomy and Permanent Fix"
                        description="Stitched multi-part Sora 2 explainer plus infographic on recurrent lateral patellar instability and definitive correction."
                        canonicalPath="/science/patellar-instability"
                        type="article"
                      />
                      <PatellarInstabilityPage />
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
                  path="/science/networking"
                  element={
                    <>
                      <SEO
                        title="Networking Packet Flow – Client to Internet"
                        description="Interactive WebGPU packet-flow demo with WebGL2 fallback showing client, Wi-Fi AP, router, DNS, and internet hops."
                        canonicalPath="/science/networking"
                        type="website"
                      />
                      <NetworkingPage />
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
