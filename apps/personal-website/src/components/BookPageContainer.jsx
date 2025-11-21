import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { alpha, useTheme } from '@mui/material/styles';

function useAccent() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (paletteKey, fallback = theme.palette.primary.main) => {
    const palette = theme.palette[paletteKey] ?? { main: fallback };
    return {
      backgroundColor: alpha(palette.main, isDark ? 0.18 : 0.1),
      borderColor: alpha(palette.main, isDark ? 0.45 : 0.25),
    };
  };
}

export default function BookPageContainer({ children }) {
  const theme = useTheme();
  const accent = useAccent();
  const subtle = {
    backgroundColor: alpha(
      theme.palette.text.primary,
      theme.palette.mode === 'dark' ? 0.08 : 0.04
    ),
    borderColor: alpha(
      theme.palette.text.primary,
      theme.palette.mode === 'dark' ? 0.2 : 0.12
    ),
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          color: 'text.primary',
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            color: 'text.primary',
            fontWeight: 700,
          },
          '& p, & li, & blockquote': { color: 'text.primary' },
          '& a': { color: 'primary.main' },
          '& .text-gray-600, & .text-gray-700, & .text-gray-800': {
            color: 'text.secondary',
          },
          '& .text-blue-600, & .text-blue-700, & .text-blue-800, & .text-indigo-800':
            { color: 'primary.main' },
          '& .text-purple-800, & .text-pink-800': {
            color: 'secondary.main',
          },
          '& .text-red-600': { color: 'error.main' },
          '& .text-green-800': { color: 'success.main' },
          '& .text-orange-800, & .text-yellow-800': { color: 'warning.main' },
          '& .text-cyan-800': { color: 'info.main' },
          '& .bg-yellow-50, & .bg-yellow-100': accent('warning'),
          '& .bg-orange-50, & .bg-orange-100': accent('warning'),
          '& .bg-blue-50, & .bg-blue-100': accent('primary'),
          '& .bg-indigo-50, & .bg-indigo-100': accent('info'),
          '& .bg-red-50': accent('error'),
          '& .bg-green-50, & .bg-green-100, & .bg-teal-50': accent('success'),
          '& .bg-purple-100, & .bg-pink-50': accent('secondary'),
          '& .bg-cyan-50': accent('info'),
          '& .bg-gray-50, & .bg-gray-100': subtle,
          '& .border-yellow-400, & .border-orange-400': {
            borderColor: alpha(theme.palette.warning.main, 0.6),
          },
          '& .border-blue-500, & .border-blue-200, & .border-indigo-400': {
            borderColor: alpha(theme.palette.primary.main, 0.5),
          },
          '& .border-red-400': {
            borderColor: alpha(theme.palette.error.main, 0.65),
          },
          '& .border-green-500, & .border-teal-400': {
            borderColor: alpha(theme.palette.success.main, 0.6),
          },
          '& .border-purple-500, & .border-pink-400': {
            borderColor: alpha(theme.palette.secondary.main, 0.6),
          },
          '& .border-cyan-400': {
            borderColor: alpha(theme.palette.info.main, 0.6),
          },
          '& .border-gray-500, & .border-gray-400': subtle,
          '& .border-gray-300, & .border-gray-200': subtle,
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
