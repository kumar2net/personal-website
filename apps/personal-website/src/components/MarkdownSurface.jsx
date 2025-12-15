import Box from '@mui/material/Box';

export default function MarkdownSurface({ children }) {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          color: `${theme.palette.text.primary} !important`,
        },
        '& p, & li, & a': {
            color: theme.palette.text.primary,
        },
        '& a': {
            textDecoration: 'underline',
        }
      })}
    >
      {children}
    </Box>
  );
}