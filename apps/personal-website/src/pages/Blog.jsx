import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import SEO from "../components/SEO";
import SemanticSearch from "../components/SemanticSearch";
import { getAllBlogPosts } from "../data/blogRegistry";
import { addLastModifiedIfMissing } from "../utils/contentDates";

const INITIAL_ARCHIVE_COUNT = 8;
const ARCHIVE_BATCH_SIZE = 6;

function getPostImage(post) {
  return post.heroImage || post.image || "/media/blogwordcloud.png";
}

function getObjectPosition(post) {
  if (
    post.title ===
    "A Sobering Week: Reflections on Loss, Life, and Learning"
  ) {
    return "center 30%";
  }
  return "center";
}

function getMetaLabel(post) {
  return [post.date, post.readingTime].filter(Boolean).join(" • ");
}

function handleImageFallback(event, fallbackSrc) {
  if (event.currentTarget.dataset.fallbackApplied === "1") {
    return;
  }
  event.currentTarget.dataset.fallbackApplied = "1";
  event.currentTarget.src = fallbackSrc;
}

function TagStrip({ tags, tone = "default" }) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {tags.slice(0, tone === "hero" ? 4 : 3).map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          sx={(theme) => ({
            borderRadius: 999,
            fontWeight: 600,
            letterSpacing: "0.01em",
            border: "1px solid",
            borderColor:
              tone === "hero"
                ? alpha(theme.palette.common.white, 0.22)
                : alpha(theme.palette.primary.main, 0.12),
            backgroundColor:
              tone === "hero"
                ? alpha(theme.palette.common.white, 0.1)
                : alpha(theme.palette.primary.main, 0.08),
            color:
              tone === "hero"
                ? theme.palette.common.white
                : theme.palette.text.primary,
            backdropFilter: tone === "hero" ? "blur(12px)" : "none",
          })}
        />
      ))}
    </Stack>
  );
}

function MetaRow({ post, tone = "default" }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={(theme) => ({
        color:
          tone === "hero"
            ? alpha(theme.palette.common.white, 0.78)
            : theme.palette.text.secondary,
      })}
    >
      <CalendarTodayRoundedIcon fontSize="inherit" sx={{ fontSize: 14 }} />
      <Typography
        variant="caption"
        sx={{ fontSize: "0.78rem", letterSpacing: "0.02em" }}
        itemProp="datePublished"
        content={post.datePublished || post.date}
      >
        {getMetaLabel(post)}
      </Typography>
    </Stack>
  );
}

function FeaturedPostCard({ post }) {
  return (
    <Box
      component={motion.article}
      itemScope
      itemType="https://schema.org/BlogPosting"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      sx={(theme) => ({
        position: "relative",
        minHeight: { xs: 440, md: 560 },
        overflow: "hidden",
        borderRadius: { xs: 4, md: 5 },
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.18),
        boxShadow: `0 28px 80px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.35 : 0.14)}`,
      })}
    >
      <meta
        itemProp="mainEntityOfPage"
        content={`https://kumar2net.com${post.link}`}
      />
      <Box
        component="img"
        src={getPostImage(post)}
        loading="lazy"
        decoding="async"
        onError={(event) => handleImageFallback(event, post.image || "/media/blogwordcloud.png")}
        alt={post.title}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: getObjectPosition(post),
        }}
      />
      <Box
        sx={(theme) => ({
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.12)} 0%, ${alpha(theme.palette.common.black, 0.38)} 36%, ${alpha(theme.palette.common.black, 0.84)} 100%)`,
        })}
      />
      <Stack
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          p: { xs: 3, md: 4.5 },
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Chip
            label="Lead story"
            size="small"
            sx={(theme) => ({
              borderRadius: 999,
              fontWeight: 700,
              color: theme.palette.common.white,
              backgroundColor: alpha(theme.palette.common.white, 0.14),
              backdropFilter: "blur(12px)",
            })}
          />
          <TagStrip tags={post.tags} tone="hero" />
        </Stack>

        <Stack spacing={2.25} sx={{ maxWidth: 700 }}>
          <MetaRow post={post} tone="hero" />
          <Typography
            component={RouterLink}
            to={post.link}
            variant="h2"
            itemProp="headline"
            sx={(theme) => ({
              textDecoration: "none",
              color: theme.palette.common.white,
              fontSize: { xs: "2rem", md: "3.15rem" },
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-0.03em",
            })}
          >
            {post.title}
          </Typography>
          <Typography
            variant="body1"
            itemProp="description"
            sx={(theme) => ({
              maxWidth: 620,
              fontSize: { xs: "1rem", md: "1.12rem" },
              lineHeight: 1.75,
              color: alpha(theme.palette.common.white, 0.82),
            })}
          >
            {post.excerpt}
          </Typography>
          <Box>
            <Button
              component={RouterLink}
              to={post.link}
              variant="contained"
              endIcon={<ArrowOutwardIcon />}
              sx={{
                borderRadius: 999,
                px: 2.75,
                py: 1.1,
                fontWeight: 700,
              }}
            >
              Read article
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

function CompactPostCard({ post, index }) {
  return (
    <Box
      component={motion.article}
      itemScope
      itemType="https://schema.org/BlogPosting"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      sx={(theme) => ({
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.9),
        backgroundColor: alpha(theme.palette.background.paper, 0.96),
        boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.25 : 0.08)}`,
        transition: theme.transitions.create(
          ["transform", "border-color", "box-shadow"],
          { duration: theme.transitions.duration.shorter },
        ),
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: alpha(theme.palette.primary.main, 0.35),
          boxShadow: `0 26px 56px ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.12)}`,
        },
      })}
    >
      <meta
        itemProp="mainEntityOfPage"
        content={`https://kumar2net.com${post.link}`}
      />
      <Box
        component="img"
        src={getPostImage(post)}
        loading="lazy"
        decoding="async"
        onError={(event) => handleImageFallback(event, post.image || "/media/blogwordcloud.png")}
        alt={post.title}
        sx={{
          width: "100%",
          height: 200,
          objectFit: "cover",
          objectPosition: getObjectPosition(post),
        }}
      />
      <Stack spacing={1.75} sx={{ p: 2.5 }}>
        <MetaRow post={post} />
        <Typography
          component={RouterLink}
          to={post.link}
          variant="h5"
          itemProp="headline"
          sx={{
            textDecoration: "none",
            color: "text.primary",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          itemProp="description"
          sx={{
            color: "text.secondary",
            lineHeight: 1.7,
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {post.excerpt}
        </Typography>
        <TagStrip tags={post.tags} />
      </Stack>
    </Box>
  );
}

function ArchivePostCard({ post, index }) {
  return (
    <Box
      component={motion.article}
      itemScope
      itemType="https://schema.org/BlogPosting"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: Math.min(index * 0.04, 0.24) }}
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "180px minmax(0, 1fr)" },
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.85),
        backgroundColor: alpha(theme.palette.background.paper, 0.96),
        transition: theme.transitions.create(
          ["transform", "border-color", "box-shadow"],
          { duration: theme.transitions.duration.shorter },
        ),
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: alpha(theme.palette.primary.main, 0.28),
          boxShadow: `0 22px 40px ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.15 : 0.08)}`,
        },
      })}
    >
      <meta
        itemProp="mainEntityOfPage"
        content={`https://kumar2net.com${post.link}`}
      />
      <Box
        component="img"
        src={getPostImage(post)}
        loading="lazy"
        decoding="async"
        onError={(event) => handleImageFallback(event, post.image || "/media/blogwordcloud.png")}
        alt={post.title}
        sx={{
          width: "100%",
          height: { xs: 210, sm: "100%" },
          minHeight: { sm: 220 },
          objectFit: "cover",
          objectPosition: getObjectPosition(post),
        }}
      />
      <Stack spacing={1.6} sx={{ p: { xs: 2.4, md: 2.8 } }}>
        <MetaRow post={post} />
        <Typography
          component={RouterLink}
          to={post.link}
          variant="h6"
          itemProp="headline"
          sx={{
            textDecoration: "none",
            color: "text.primary",
            fontWeight: 700,
            lineHeight: 1.22,
            letterSpacing: "-0.02em",
          }}
        >
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          itemProp="description"
          sx={{
            color: "text.secondary",
            lineHeight: 1.75,
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {post.excerpt}
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.25}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <TagStrip tags={post.tags} />
          <Button
            component={RouterLink}
            to={post.link}
            size="small"
            endIcon={<ArrowOutwardIcon fontSize="small" />}
            sx={{
              alignSelf: { xs: "flex-start", sm: "center" },
              borderRadius: 999,
              px: 1.5,
              fontWeight: 700,
            }}
          >
            Open
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default function Blog() {
  const processedPosts = useMemo(
    () => getAllBlogPosts().map(addLastModifiedIfMissing),
    [],
  );
  const [visibleArchiveCount, setVisibleArchiveCount] = useState(INITIAL_ARCHIVE_COUNT);

  const featuredPost = processedPosts[0];
  const spotlightPosts = processedPosts.slice(1, 3);
  const archivePosts = processedPosts.slice(3);
  const visibleArchivePosts = archivePosts.slice(0, visibleArchiveCount);
  const hasMoreArchivePosts = visibleArchiveCount < archivePosts.length;

  const topTags = useMemo(() => {
    const counts = new Map();
    processedPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [processedPosts]);

  return (
    <Box
      component="section"
      sx={(theme) => ({
        py: { xs: 5, md: 8 },
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.08 : 0.04)} 0%, ${theme.palette.background.default} 18%, ${theme.palette.background.default} 100%)`,
      })}
    >
      <SEO
        title="Blog"
        description="Latest posts on technology, learning, notes, and personal writing."
        canonicalPath="/blog"
        type="website"
      />
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 4, md: 5 }}>
          <Box
            sx={(theme) => ({
              position: "relative",
              overflow: "hidden",
              borderRadius: { xs: 4, md: 5 },
              border: "1px solid",
              borderColor: alpha(theme.palette.primary.main, 0.14),
              background: `radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.16)} 0%, ${alpha(theme.palette.background.paper, 0.94)} 45%, ${theme.palette.background.paper} 100%)`,
              p: { xs: 3, md: 4.5 },
            })}
          >
            <Stack spacing={3}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "flex-end" }}
                spacing={2}
              >
                <Box sx={{ maxWidth: 760 }}>
                  <Chip
                    label={`${processedPosts.length} published posts`}
                    sx={{
                      mb: 1.5,
                      borderRadius: 999,
                      fontWeight: 700,
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: "2.5rem", md: "4.25rem" },
                      lineHeight: 0.98,
                      letterSpacing: "-0.045em",
                      mb: 1.25,
                    }}
                  >
                    Blog
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      maxWidth: 640,
                      fontSize: { xs: "1rem", md: "1.08rem" },
                      lineHeight: 1.8,
                    }}
                  >
                    Latest posts on technology, learning, notes, and personal
                    writing, reshaped into a cleaner editorial archive instead
                    of a generic card wall.
                  </Typography>
                </Box>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  justifyContent={{ xs: "flex-start", md: "flex-end" }}
                >
                  {topTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      variant="outlined"
                      sx={{ borderRadius: 999, fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              </Stack>
              <Box
                sx={(theme) => ({
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, 0.9),
                  backgroundColor: alpha(theme.palette.background.default, 0.58),
                  p: { xs: 1.5, md: 2 },
                  backdropFilter: "blur(12px)",
                })}
              >
                <SemanticSearch />
              </Box>
            </Stack>
          </Box>

          {featuredPost ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "minmax(0, 1.65fr) minmax(320px, 0.95fr)",
                },
                gap: 3,
                alignItems: "start",
              }}
            >
              <FeaturedPostCard post={featuredPost} />
              <Stack spacing={3}>
                {spotlightPosts.map((post, index) => (
                  <CompactPostCard key={post.link} post={post} index={index} />
                ))}
              </Stack>
            </Box>
          ) : null}

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={1.5}
            sx={{ pt: 1 }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.7rem", md: "2.2rem" },
                  letterSpacing: "-0.03em",
                }}
              >
                From the archive
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                A calmer, denser reading list for the rest of the catalog.
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Showing {visibleArchivePosts.length} of {archivePosts.length} archive posts
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
              gap: 3,
            }}
          >
            {visibleArchivePosts.map((post, index) => (
              <ArchivePostCard key={post.link} post={post} index={index} />
            ))}
          </Box>

          {hasMoreArchivePosts ? (
            <Box textAlign="center" sx={{ pt: 1 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() =>
                  setVisibleArchiveCount((count) =>
                    Math.min(count + ARCHIVE_BATCH_SIZE, archivePosts.length),
                  )
                }
                sx={{
                  borderRadius: 999,
                  px: 3,
                  fontWeight: 700,
                }}
              >
                Load more posts
              </Button>
            </Box>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}
