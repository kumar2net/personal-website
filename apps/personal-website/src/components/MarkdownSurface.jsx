import Box from "@mui/material/Box";

export default function MarkdownSurface({ children }) {
  return (
    <Box
      sx={() => ({
        backgroundColor: "var(--mui-palette-background-paper)",
        color: "var(--mui-palette-text-primary)",
        border: "1px solid var(--mui-palette-divider)",
        borderRadius: 12,
        p: { xs: 2.5, md: 3 },

        "& h1, & h2, & h3, & h4, & h5, & h6": {
          color: "var(--mui-palette-text-primary)",
        },
        "& p, & li, & a": {
          color: "var(--mui-palette-text-primary)",
        },
        "& a": {
          textDecoration: "underline",
        },
      })}
    >
      {children}
    </Box>
  );
}
