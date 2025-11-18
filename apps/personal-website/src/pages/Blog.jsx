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
    <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
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
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  sx={(theme) => ({
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    border:
                      theme.palette.mode === "dark"
                        ? "1px solid rgba(148,163,184,0.25)"
                        : "1px solid rgba(15,23,42,0.08)",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(15,23,42,0.92)"
                        : theme.palette.background.paper,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 25px 55px -25px rgba(15,23,42,0.9)"
                        : theme.shadows[3],
                    backdropFilter:
                      theme.palette.mode === "dark" ? "blur(16px)" : "none",
                  })}
                >
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
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{ mb: 2 }}
                    >
                      {post.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={(theme) => ({
                            borderColor:
                              theme.palette.mode === "dark"
                                ? "rgba(94,234,212,0.5)"
                                : undefined,
                            color:
                              theme.palette.mode === "dark"
                                ? "rgba(226,232,240,0.9)"
                                : undefined,
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(45,212,191,0.12)"
                                : undefined,
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
                        mb: 1,
                        "&:hover": {
                          color:
                            theme.palette.mode === "dark"
                              ? "rgba(125,211,252,0.95)"
                              : theme.palette.primary.main,
                        },
                      })}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={(theme) => ({
                        color:
                          theme.palette.mode === "dark"
                            ? "rgba(203,213,225,0.92)"
                            : theme.palette.text.secondary,
                      })}
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
                          ? "1px solid rgba(148,163,184,0.15)"
                          : "1px solid rgba(226,232,240,0.7)",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(15,23,42,0.85)"
                          : "transparent",
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
                            : undefined,
                        color: "#fff",
                        fontWeight: 600,
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 15px 30px -15px rgba(14,165,233,0.7)"
                            : undefined,
                        "&:hover": {
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(135deg,#1d4ed8,#06b6d4)"
                              : undefined,
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
