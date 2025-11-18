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
      sx={{
        py: { xs: 5, md: 8 },
        position: "relative",
        backgroundColor: "background.default",
      }}
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
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                    transition:
                      "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "primary.main",
                      boxShadow: theme.shadows[8],
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
                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                            color: "primary.main",
                          })}
                        />
                      ))}
                    </Stack>
                    <Typography
                      component={RouterLink}
                      to={post.link}
                      variant="h6"
                      sx={{
                        display: "inline-flex",
                        textDecoration: "none",
                        color: "text.primary",
                        mb: 0.5,
                        transition: "color 200ms ease",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                      itemProp="headline"
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                      }}
                      itemProp="description"
                    >
                      {post.excerpt}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      mt: "auto",
                      px: 3,
                      pb: 3,
                      justifyContent: "space-between",
                      borderTop: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "action.hover",
                    }}
                  >
                    <Button
                      component={RouterLink}
                      to={post.link}
                      variant="contained"
                      size="small"
                      aria-label={`Read more: ${post.title}`}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 999,
                        px: 2.5,
                      }}
                    >
                      Read more
                    </Button>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EventIcon
                        fontSize="small"
                        sx={{
                          color: "text.secondary",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                        }}
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
            sx={{
              mt: 4,
            }}
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
    </Box >
  );
};

export default Blog;
