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
                  sx={{ height: "100%", display: "flex", flexDirection: "column" }}
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
                          variant="soft"
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
                        mb: 1,
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.excerpt}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      mt: "auto",
                      px: 3,
                      pb: 3,
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      component={RouterLink}
                      to={post.link}
                      variant="contained"
                      size="small"
                      aria-label={`Read more: ${post.title}`}
                    >
                      Read more
                    </Button>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EventIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">
                        {post.date}
                      </Typography>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box textAlign="center" sx={{ mt: 4 }}>
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
