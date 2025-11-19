import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { getBlogPostDates } from "../../utils/blogPostDates";

const { formattedPublishDate } = getBlogPostDates(import.meta.url);

const AgenticFeatureInABrowser = () => {
  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Box>
        <Link
          component={RouterLink}
          to="/blog"
          underline="none"
          color="primary.main"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            fontWeight: 600,
            gap: 1,
            mb: 3,
          }}
        >
          ← Back to Blog
        </Link>
        <Typography variant="h3" sx={{ fontWeight: 700, color: "text.primary" }}>
          agentic feature in a browser
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 1, color: "text.secondary", display: "flex", gap: 2 }}
        >
          <span>Date: {formattedPublishDate}</span>
          <span>By: kumar2net</span>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 3,
            fontStyle: "italic",
            lineHeight: 1.8,
            color: "text.secondary",
          }}
        >
          Tell us about the last thing you got excited about. I like the agentic
          features Perplexity has got in their new Comet web browser. I tried
          out few tasks and it did work well. This along with their
          perplexity.ai/ finance page for India stock market news, earnings,
          other metrics is brilliant.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
          Tell us about the last thing you got excited about.
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.primary" }}>
          I like the agentic features Perplexity has got in their new Comet web
          browser. I tried out few tasks and it did work well. This along with
          their perplexity.ai/ finance page for India stock market news,
          earnings, other metrics is brilliant.
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 6,
          pt: 4,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Link
          component={RouterLink}
          to="/blog"
          underline="none"
          color="primary.main"
          sx={{ fontWeight: 600 }}
        >
          ← Back to Blog
        </Link>
        <Typography variant="body2" color="text.secondary">
          Originally published on{" "}
          <Link
            href="https://kumar2net.wordpress.com/2025/08/23/agentic-feature-in-a-browser/"
            target="_blank"
            rel="noopener noreferrer"
            underline="always"
          >
            WordPress
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default AgenticFeatureInABrowser;
