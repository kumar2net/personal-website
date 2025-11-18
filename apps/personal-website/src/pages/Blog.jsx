import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import EventIcon from "@mui/icons-material/Event";
import { Link as RouterLink } from "react-router-dom";
import ContentBadge from "../components/ContentBadge";
import SEO from "../components/SEO";
import SemanticSearch from "../components/SemanticSearch";
import blogPosts from "../data/blogPostsData";
import { addLastModifiedIfMissing } from "../utils/contentDates";

const Blog = () => {
  const processedPosts = useMemo(
    () => blogPosts.map(addLastModifiedIfMissing),
    [],
  );

  return (
    <Box
      component="section"
      sx={(theme) => ({
        py: { xs: 5, md: 8 },
        position: "relative",
        backgroundColor: theme.vars.palette.background.default,
        backgroundImage:
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.12), transparent 45%), radial-gradient(circle at 80% 0%, rgba(129,140,248,0.1), transparent 55%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.75) 100%)",
      })}
    >
      <SEO
        title="Blog"
        description="Latest posts on technology, learning, notes, and personal writing."
        canonicalPath="/blog"
        type="website"
      />
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box textAlign="center">
            <Typography variant="h1">Blog</Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Latest posts on technology, learning, notes, and personal writing.
            </Typography>
          </Box>
          <SemanticSearch />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Typography variant="h2">Latest Posts</Typography>
          </Stack>
          <Grid container spacing={3}>
            {processedPosts.map((post, index) => (
              <Grid key={post.link} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  component={motion.article}
                  itemScope
                  itemType="https://schema.org/BlogPosting"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  sx={(theme) => ({
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    borderRadius: 3,
                    border: `1px solid ${
                      theme.palette.mode === "dark"
                        ? alpha("#94a3b8", 0.35)
                        : alpha("#0f172a", 0.08)
                    }`,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.vars.palette.background.paper, 0.8)
                        : theme.vars.palette.background.paper,
                    backgroundImage:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(180deg, rgba(15,23,42,0.55) 0%, rgba(2,6,23,0.9) 100%)"
                        : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.92) 100%)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 28px 65px -35px rgba(2,6,23,0.95)"
                        : theme.shadows[3],
                    overflow: "hidden",
                    backdropFilter:
                      theme.palette.mode === "dark" ? "blur(16px)" : "none",
                    transition:
                      "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.primary.light, 0.5)
                          : alpha(theme.palette.primary.main, 0.25),
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 35px 70px -30px rgba(3,7,18,0.95)"
                          : theme.shadows[8],
                    },
                  })}
                >
                  <meta
                    itemProp="mainEntityOfPage"
                    content={`https://kumar2net.com${post.link}`}
                  />
                  <Box
                    sx={{
                      position: "relative",
                      height: 220,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      loading="lazy"
                      decoding="async"
                      src={post.image}
                      alt={post.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition:
                          post.title ===
                          "A Sobering Week: Reflections on Loss, Life, and Learning"
                            ? "center 30%"
                            : "center",
                      }}
                    />
                    <ContentBadge
                      publishDate={post.date}
                      lastModified={post.lastModified}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      px: 3,
                      py: 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {post.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={(theme) => ({
                            fontWeight: 500,
                            borderRadius: 999,
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.primary.main, 0.15)
                                : alpha(theme.palette.primary.light, 0.15),
                            color:
                              theme.palette.mode === "dark"
                                ? theme.palette.primary.light
                                : theme.palette.primary.main,
                          })}
                        />
                      ))}
                    </Stack>
                    <Typography
                      component={RouterLink}
                      to={post.link}
                      variant="h6"
                      sx={(theme) => ({
                        display: "inline-flex",
                        textDecoration: "none",
                        color:
                          theme.palette.mode === "dark"
                            ? "rgba(248,250,252,0.95)"
                            : theme.palette.text.primary,
                        mb: 0.5,
                        transition: "color 200ms ease",
                        "&:hover": {
                          color: theme.palette.primary.main,
                        },
                      })}
                      itemProp="headline"
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={(theme) => ({
                        color:
                          theme.palette.mode === "dark"
                            ? alpha("#cbd5f5", 0.95)
                            : theme.palette.text.secondary,
                      })}
                      itemProp="description"
                    >
                      {post.excerpt}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={(theme) => ({
                      mt: "auto",
                      px: 3,
                      pb: 3,
                      justifyContent: "space-between",
                      borderTop:
                        theme.palette.mode === "dark"
                          ? "1px solid rgba(148,163,184,0.2)"
                          : "1px solid rgba(226,232,240,0.7)",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(15,23,42,0.65)"
                          : alpha(theme.palette.primary.light, 0.05),
                    })}
                  >
                    <Button
                      component={RouterLink}
                      to={post.link}
                      variant="contained"
                      size="small"
                      aria-label={`Read more: ${post.title}`}
                      sx={(theme) => ({
                        background:
                          theme.palette.mode === "dark"
                            ? "linear-gradient(135deg,#2563eb,#22d3ee)"
                            : theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 600,
                        borderRadius: 999,
                        px: 2.5,
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 15px 30px -15px rgba(14,165,233,0.7)"
                            : theme.shadows[2],
                        "&:hover": {
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(135deg,#1d4ed8,#06b6d4)"
                              : theme.palette.primary.dark,
                        },
                      })}
                    >
                      Read more
                    </Button>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EventIcon
                        fontSize="small"
                        sx={(theme) => ({
                          color:
                            theme.palette.mode === "dark"
                              ? "rgba(148,163,184,0.9)"
                              : theme.palette.text.secondary,
                        })}
                      />
                      <Typography
                        variant="caption"
                        sx={(theme) => ({
                          color:
                            theme.palette.mode === "dark"
                              ? "rgba(148,163,184,0.9)"
                              : theme.palette.text.secondary,
                        })}
                        itemProp="datePublished"
                        content={post.date}
                      >
                        {post.date}
                      </Typography>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box
            textAlign="center"
            sx={(theme) => ({
              mt: 4,
              "& .MuiButton-root": {
                color:
                  theme.palette.mode === "dark"
                    ? "rgba(226,232,240,0.95)"
                    : undefined,
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(94,234,212,0.6)"
                    : undefined,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(14,165,233,0.08)"
                    : undefined,
                "&:hover": {
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(125,211,252,0.9)"
                      : undefined,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(14,165,233,0.18)"
                      : undefined,
                },
              },
            })}
          >
            <Button
              variant="outlined"
              size="large"
              aria-label="Load more blog posts"
            >
              Load More
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Blog;
