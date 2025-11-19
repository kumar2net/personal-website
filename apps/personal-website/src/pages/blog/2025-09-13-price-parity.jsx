import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Link as RouterLink } from "react-router-dom";
import remarkGfm from "remark-gfm";
import markdownContent from "./compare.md?raw";

const lines = markdownContent.split("\n");
const title = lines[0].replace(/^#\s*/, "");
const date = lines[2].replace(/^\*\s*|\s*\*$/g, "");
const body = lines.slice(4).join("\n");

const MotionBox = motion(Box);

const PriceParity = () => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        maxWidth: 960,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Button
        component={RouterLink}
        to="/blog"
        variant="outlined"
        startIcon={<ArrowBackIcon fontSize="small" />}
        sx={{ alignSelf: "flex-start", borderRadius: 999 }}
      >
        Back to Blog
      </Button>

      <Box>
        <Typography variant="h3" sx={{ fontWeight: 700, color: "text.primary" }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          {date}
        </Typography>
      </Box>

      <Box
        sx={{
          "& h1": {
            fontSize: { xs: "1.75rem", md: "2.125rem" },
            fontWeight: 700,
            color: "text.primary",
            mt: 6,
            mb: 2,
          },
          "& h2": {
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            color: "text.primary",
            mt: 5,
            mb: 2,
          },
          "& h3": {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "text.primary",
            mt: 4,
            mb: 1.5,
          },
          "& p": {
            color: "text.primary",
            lineHeight: 1.8,
            mb: 2,
          },
          "& ul, & ol": {
            color: "text.primary",
            pl: 3,
            mb: 3,
          },
          "& li": {
            mb: 1,
          },
          "& a": {
            color: "primary.main",
            textDecoration: "none",
            fontWeight: 600,
          },
          "& img": {
            maxWidth: "100%",
            borderRadius: 2,
            my: 3,
          },
          "& blockquote": {
            borderLeft: "4px solid",
            borderColor: "primary.main",
            pl: 2,
            my: 3,
            color: "text.secondary",
            fontStyle: "italic",
          },
          "& code": {
            fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
            backgroundColor: "action.hover",
            px: 0.5,
            py: 0.25,
            borderRadius: 1,
            fontSize: "0.95em",
          },
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </Box>
    </MotionBox>
  );
};

export default PriceParity;
