import React, { useRef } from "react";
import { Box, Container, alpha } from "@mui/material";
import SEO from "./SEO";
import BlogAudioPlayer from "./BlogAudioPlayer";

export default function BlogPostLayout({ slug, post, children }) {
  const articleRef = useRef(null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post?.title,
    image: post?.image,
    datePublished: post?.datePublished,
    dateModified: post?.dateModified,
    author: {
      "@type": "Person",
      name: "Your Name",
    },
    publisher: {
      "@type": "Organization",
      name: "Your Website",
      logo: {
        "@type": "ImageObject",
        url: "https://www.kumar2.net/media/logo.png", // Replace with your logo
      },
    },
    description: post?.description,
  };

  return (
    <>
      <SEO
        title={post?.title}
        description={post?.description}
        canonicalPath={`/blog/${slug}`}
        image={post?.image}
        type="article"
        publishedTime={post?.datePublished}
        modifiedTime={post?.dateModified}
        tags={post?.tags}
      />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <BlogAudioPlayer slug={slug} articleRef={articleRef} />
        <Box
          component="article"
          ref={articleRef}
          sx={(theme) => {
            const isDark = theme.palette.mode === "dark";
            const colors = {
              blue: isDark ? theme.palette.primary.light : theme.palette.primary.main,
              green: isDark ? theme.palette.success.light : theme.palette.success.main,
              yellow: isDark ? theme.palette.warning.light : theme.palette.warning.main,
              red: isDark ? theme.palette.error.light : theme.palette.error.main,
              purple: isDark ? "#d8b4fe" : "#7e22ce",
              orange: isDark ? "#fdba74" : "#c2410c",
              indigo: isDark ? "#818cf8" : "#4338ca",
            };

            return {
              // Typography
              "& h1": {
                ...theme.typography.h1,
                fontSize: { xs: "2rem", md: "2.5rem" },
                mb: 3,
                color: "text.primary",
              },
              "& h2": {
                ...theme.typography.h2,
                fontSize: { xs: "1.5rem", md: "2rem" },
                mt: 6,
                mb: 3,
                color: theme.palette.text.primary,
              },
              "& h3": {
                ...theme.typography.h3,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                mt: 4,
                mb: 2,
                color: theme.palette.text.primary,
              },
              "& h4": {
                ...theme.typography.h4,
                fontSize: "1.125rem",
                mt: 3,
                mb: 2,
                color: theme.palette.text.primary,
              },
              "& p": {
                ...theme.typography.body1,
                mb: 2.5,
                color: theme.palette.text.secondary,
                lineHeight: 1.8,
              },
              "& ul, & ol": {
                ...theme.typography.body1,
                mb: 2.5,
                pl: 4,
                color: "text.secondary",
              },
              "& li": {
                mb: 1,
              },
              "& a": {
                color: "primary.main",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },

              // Blockquotes
              "& blockquote": {
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                pl: 3,
                py: 1,
                my: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: "0 8px 8px 0",
                "& p": {
                  mb: 0,
                  fontStyle: "italic",
                  color: "text.primary",
                },
              },

              // Code blocks
              "& code": {
                fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
                fontSize: "0.875em",
                padding: "0.2em 0.4em",
                borderRadius: 4,
                bgcolor: alpha(theme.palette.text.primary, 0.05),
                color: isDark ? "secondary.light" : "secondary.dark",
              },
              "& pre": {
                p: 2,
                borderRadius: 2,
                bgcolor: isDark ? alpha("#000", 0.3) : alpha("#000", 0.05),
                overflowX: "auto",
                mb: 3,
                "& code": {
                  bgcolor: "transparent",
                  p: 0,
                  color: "inherit",
                },
              },

              // Images and HR
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: 8,
                my: 4,
              },
              "& hr": {
                my: 6,
                border: "none",
                borderBottom: `1px solid ${theme.palette.divider}`,
              },

              // --- Legacy Tailwind Overrides ---

              // Text Colors
              "& .text-gray-500, & .text-gray-600, & .text-gray-700": {
                color: "text.secondary !important",
              },
              "& .text-gray-800, & .text-gray-900, & .text-black": {
                color: "text.primary !important",
              },
              "& .text-blue-600, & .text-blue-700, & .text-blue-800": { color: colors.blue },
              "& .text-green-600, & .text-green-700, & .text-green-800": { color: colors.green },
              "& .text-yellow-600, & .text-yellow-700, & .text-yellow-800": { color: colors.yellow },
              "& .text-red-600, & .text-red-700, & .text-red-800": { color: colors.red },
              "& .text-purple-600, & .text-purple-700, & .text-purple-800": { color: colors.purple },
              "& .text-orange-600, & .text-orange-700, & .text-orange-800": { color: colors.orange },
              "& .text-indigo-600, & .text-indigo-700, & .text-indigo-800": { color: colors.indigo },

              // Background Colors (Cards, Callouts)
              "& .bg-white": {
                backgroundColor: "background.paper",
                borderColor: "divider",
              },
              "& .bg-gray-50, & .bg-gray-100, & .bg-gray-200": {
                backgroundColor: isDark ? alpha(theme.palette.text.primary, 0.05) : theme.palette.grey[50],
                color: "text.primary !important",
              },
              "& .bg-blue-50, & .bg-blue-100": {
                backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.15 : 0.08),
                borderColor: alpha(theme.palette.primary.main, 0.2),
              },
              "& .bg-green-50, & .bg-green-100": {
                backgroundColor: alpha(theme.palette.success.main, isDark ? 0.15 : 0.08),
                borderColor: alpha(theme.palette.success.main, 0.2),
              },
              "& .bg-yellow-50, & .bg-yellow-100": {
                backgroundColor: alpha(theme.palette.warning.main, isDark ? 0.15 : 0.08),
                borderColor: alpha(theme.palette.warning.main, 0.2),
              },
              "& .bg-red-50, & .bg-red-100": {
                backgroundColor: alpha(theme.palette.error.main, isDark ? 0.15 : 0.08),
                borderColor: alpha(theme.palette.error.main, 0.2),
              },
              "& .bg-purple-50, & .bg-purple-100": {
                backgroundColor: alpha(colors.purple, isDark ? 0.15 : 0.08),
                borderColor: alpha(colors.purple, 0.2),
              },
              "& .bg-orange-50, & .bg-orange-100": {
                backgroundColor: alpha(colors.orange, isDark ? 0.15 : 0.08),
                borderColor: alpha(colors.orange, 0.2),
              },
              "& .bg-indigo-50, & .bg-indigo-100": {
                backgroundColor: alpha(colors.indigo, isDark ? 0.15 : 0.08),
                borderColor: alpha(colors.indigo, 0.2),
              },

              // Gradients (often used in headers)
              "& .bg-gradient-to-r, & .bg-gradient-to-br": {
                backgroundImage: "none", // Remove potentially clashing gradients
                backgroundColor: isDark ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
              },

              // Borders
              "& .border-gray-200, & .border-gray-300": {
                borderColor: "divider",
              },
              "& .border-blue-200": { borderColor: alpha(theme.palette.primary.main, 0.3) },
              "& .border-green-200": { borderColor: alpha(theme.palette.success.main, 0.3) },
              "& .border-yellow-200": { borderColor: alpha(theme.palette.warning.main, 0.3) },
              "& .border-red-200": { borderColor: alpha(theme.palette.error.main, 0.3) },

              // Buttons (Back to Blog)
              "& button": {
                backgroundColor: isDark ? alpha(theme.palette.text.primary, 0.1) : theme.palette.grey[100],
                color: "text.primary",
                "&:hover": {
                  backgroundColor: isDark ? alpha(theme.palette.text.primary, 0.2) : theme.palette.grey[200],
                },
                // Fix SVG icons inside buttons
                "& svg": {
                  color: "inherit",
                },
              },

              // SVGs in general
              "& svg": {
                fill: "currentColor", // Force SVGs to use the text color
              },
              // Specific SVG overrides if they have hardcoded text classes
              "& .text-indigo-600 svg": { color: colors.indigo },
              "& .text-yellow-400 svg": { color: colors.yellow },
              "& .text-green-800 svg": { color: colors.green },
              "& .text-blue-800 svg": { color: colors.blue },
              "& .text-amber-600 svg": { color: colors.orange },

              // Tables
              "& table": {
                width: "100%",
                borderCollapse: "collapse",
                my: 4,
              },
              "& th": {
                textAlign: "left",
                fontWeight: 600,
                p: 2,
                borderBottom: `2px solid ${theme.palette.divider}`,
                color: "text.primary",
              },
              "& td": {
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: "text.secondary",
              },
            };
          }}
        >
          {children}
        </Box>
      </Container>
    </>
  );
}
