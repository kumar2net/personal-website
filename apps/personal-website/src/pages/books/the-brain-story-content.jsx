import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { HiArrowLeft, HiDownload, HiExternalLink } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import BookCover from '../../components/BookCover';
import BookPageContainer from '../../components/BookPageContainer';

function TheBrainStoryContent() {
  const theme = useTheme();

  const handleReadBook = () => {
    window.open('/The_Brain_The_Story.pdf', '_blank');
  };

  return (
    <BookPageContainer>
      <Stack spacing={3}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          rowGap={1.5}
        >
          <Button
            component={Link}
            to="/books"
            startIcon={<HiArrowLeft />}
            variant="text"
            size="small"
          >
            Back to Books
          </Button>
          <Typography variant="h5" fontWeight={800}>
            The Brain: The Story of You
          </Typography>
          <Button
            component="a"
            href="/The_Brain_The_Story.pdf"
            download
            startIcon={<HiDownload />}
            variant="outlined"
            size="small"
          >
            Download PDF
          </Button>
        </Stack>

        <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, boxShadow: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md="auto">
              <Box
                sx={{
                  width: 190,
                  height: 250,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                <BookCover
                  bookId="the-brain-story"
                  title="The Brain: The Story of You"
                  author="David Eagleman"
                  className="w-full h-full"
                />
              </Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                align="center"
                sx={{ mt: 1.5 }}
              >
                David Eagleman
              </Typography>
            </Grid>
            <Grid item xs={12} md>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                About This Book
              </Typography>
              <Typography color="text.primary" sx={{ mb: 2, lineHeight: 1.7 }}>
                One of the best books I have read in a while. Observing all the
                advances in AI and listening to gyan from my kin on neurology
                brain implants, wanted to dig deeper. As they say these days -
                learn from First Principles
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Box
                  component="img"
                  loading="lazy"
                  decoding="async"
                  src="https://img.shields.io/badge/Neuroscience-Brain%20Science-purple"
                  alt="Neuroscience badge"
                  sx={{ height: 28 }}
                />
                <Box
                  component="img"
                  loading="lazy"
                  decoding="async"
                  src="https://img.shields.io/badge/AI%20%26%20Technology-Neural%20Implants-orange"
                  alt="AI Technology badge"
                  sx={{ height: 28 }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ overflow: 'hidden', borderRadius: 3, boxShadow: 6 }}>
          <Box
            sx={{
              px: { xs: 3, md: 5 },
              py: { xs: 5, md: 7 },
              textAlign: 'center',
              // M3 suggestion: this is a primary-tinted surface. Consider migrating to
              // `theme.palette.m3.primaryContainer` (and corresponding `onPrimaryContainer` for text)
              // to align with Material 3 container semantics.
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(theme.palette.secondary.main, 0.16)} 60%, ${alpha(theme.palette.info.main, 0.14)} 100%)`,
            }}
          >
            <Box
              sx={{
                width: 86,
                height: 86,
                borderRadius: '50%',
                // M3 suggestion: container fill could be `theme.palette.m3.primaryContainer`
                // with icon color `theme.palette.m3.onPrimaryContainer`.
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: 2,
              }}
            >
              <HiExternalLink size={34} />
            </Box>

            <Typography variant="h4" fontWeight={800} gutterBottom>
              Ready to Read?
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ maxWidth: 560, mx: 'auto', mb: 3 }}
            >
              Click the button below to open "The Brain: The Story of You" in
              your default PDF reader for the best reading experience.
            </Typography>

            <Stack spacing={1.5} alignItems="center">
              <Button
                onClick={handleReadBook}
                startIcon={<HiExternalLink />}
                variant="contained"
                size="large"
                sx={{ px: 4, fontWeight: 700, boxShadow: 6 }}
              >
                Click to Read
              </Button>
              <Typography variant="body2" color="text.secondary">
                Opens in your default PDF reader application
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              px: { xs: 2.5, md: 3.5 },
              py: 2.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              rowGap: 1,
              color: 'text.secondary',
              // M3 suggestion: use `theme.palette.m3.primaryContainer` for this tinted footer bar,
              // and set readable text to `theme.palette.m3.onPrimaryContainer`.
              backgroundColor: alpha(theme.palette.primary.main, 0.07),
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                  }}
                />
                <Typography variant="body2">Native PDF Reader</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                  }}
                />
                <Typography variant="body2">Full features</Typography>
              </Stack>
            </Stack>
            <Typography variant="body2" fontWeight={600}>
              📖 Zoom, search, bookmarks, and more
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                boxShadow: 4,
                display: 'flex',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.success.main, 0.15),
                  color: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <HiDownload size={20} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Download & Read Offline
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Download the PDF to read offline or transfer to your preferred
                  device.
                </Typography>
                <Button
                  component="a"
                  href="/The_Brain_The_Story.pdf"
                  download
                  variant="contained"
                  size="small"
                  startIcon={<HiDownload />}
                  sx={{ backgroundColor: 'success.main', '&:hover': { backgroundColor: 'success.dark' } }}
                >
                  Download PDF
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                boxShadow: 4,
                display: 'flex',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.info.main, 0.15),
                  color: 'info.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <HiExternalLink size={20} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Read in Browser
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Open the PDF directly in your web browser for quick access.
                </Typography>
                <Button
                  component="a"
                  href="/The_Brain_The_Story.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  startIcon={<HiExternalLink />}
                >
                  Open in Browser
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </BookPageContainer>
  );
}

export default TheBrainStoryContent;
