import { motion } from "framer-motion";
import { ExternalLink, Music as MusicIcon, Play } from "lucide-react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";

const MusicPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const playlistBg = isDark ? alpha(theme.palette.error.main, 0.9) : theme.palette.error.main;
  const playlistTextColor = isDark
    ? theme.palette.common.white
    : theme.palette.getContrastText(theme.palette.error.main);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{ py: 8 }}
    >
      <Container maxWidth="md">
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Music
          </Typography>
          <Typography variant="h5" color="text.secondary">
            My curated playlist and musical journey
          </Typography>
        </Box>

        <Stack spacing={4}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              borderLeft: `6px solid ${theme.palette.error.main}`,
              background: `linear-gradient(to right, ${alpha(theme.palette.error.light, 0.1)}, ${alpha(theme.palette.error.light, 0.02)})`,
            }}
          >
            <Stack direction="row" alignItems="center" mb={3}>
              <MusicIcon size={32} color={theme.palette.error.main} style={{ marginRight: 12 }} />
              <Typography variant="h4" component="h2" fontWeight="bold">
                Kumar Playlist
              </Typography>
            </Stack>

            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                My complete curated playlist featuring a diverse collection of
                tracks from Bollywood hits to Tamil Kurals and spiritual
                melodies. Dive in to explore the sounds that inspire and move me.
              </Typography>

              <Button
                variant="contained"
                color="error"
                size="large"
                href="https://music.youtube.com/playlist?list=PLUTFXCgXawk8yPaOn2iiq1hH24OEeRVNu&si=bb_bAFMsmnMXfRWr"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<Play size={20} />}
                endIcon={<ExternalLink size={16} />}
                sx={{
                  backgroundColor: playlistBg,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: playlistTextColor,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                    backgroundColor: isDark
                      ? alpha(theme.palette.error.main, 0.8)
                      : alpha(theme.palette.error.main, 0.88),
                  },
                }}
              >
                Listen to Kumar Playlist
              </Button>
            </Paper>
          </Paper>

          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            elevation={1}
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: "blur(8px)",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
          <Typography variant="h5" component="h3" gutterBottom fontWeight="600">
            Fresh spins
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Added four tracks this week—two “Heart” anthems, a Shiva cover, and a Malayalam
            Ayyappa single—jumping between faith, hip-hop energy, and temple percussion.
          </Typography>

          <Stack spacing={2}>
            {[
              {
                title: "HEART REBUILT BY JESUS",
                desc: "Bryanforchrist short—16 seconds of pure uplift; a quick jolt of faith before coffee.",
              },
              {
                title: "Heart (Lyrics) — Kieran The Light",
                desc: "After Light production; reflective hip-hop hook with a bounce that sticks.",
              },
              {
                title: "Chandrachooda Siva Sankara Parvati (Cover)",
                desc: "R Harikrishnan’s take—slow build, devotional heft, and a satisfying crescendo.",
              },
              {
                title: "പുതിയ അയ്യപ്പാട്ട്‌ഗാനം | പമ്പാവാസൻ (DK Musicals)",
                desc: "Malayalam Ayyappa cut—layered drums, chorus lift, and a road-trip-ready groove.",
              },
            ].map((item) => (
              <Box
                key={item.title}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="error"
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      mb: 0.5,
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {item.desc}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default MusicPage;
