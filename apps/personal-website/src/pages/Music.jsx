import { motion } from "framer-motion";
import { ExternalLink, Music as MusicIcon, Play } from "lucide-react";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { useColorMode } from "../providers/ColorModeProvider";

const MusicPage = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === "dark";
  const playlistBg = isDark ? alpha(theme.palette.error.main, 0.9) : theme.palette.error.main;
  const playlistTextColor = isDark
    ? theme.palette.common.white
    : theme.palette.getContrastText(theme.palette.error.main);
  const playlistId = "PLUTFXCgXawk_wv0Wo8XoNPdI-SxqTfQSH";
  const playlistShareId = "WfNRuoFY0s0sW-84";

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        py: { xs: 6, md: 10 },
        background: `radial-gradient(circle at 15% 15%, ${alpha(
          theme.palette.error.light,
          0.2,
        )}, transparent 55%), radial-gradient(circle at 85% 10%, ${alpha(
          theme.palette.info.light,
          0.2,
        )}, transparent 50%), linear-gradient(180deg, ${alpha(
          theme.palette.background.default,
          0.92,
        )} 0%, ${theme.palette.background.default} 60%)`,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Box textAlign="center">
            <Typography
              variant="overline"
              sx={{
                letterSpacing: "0.3em",
                fontWeight: 700,
                color: "text.secondary",
              }}
            >
              2026 LISTENING ROOM
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2.4rem", md: "3.4rem" },
                fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif',
              }}
            >
              Music
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "text.secondary",
                maxWidth: 620,
                mx: "auto",
              }}
            >
              A 2026 listening journal with mood-first mixes, clean energy, and
              story-driven tracks I keep on repeat.
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  height: "100%",
                  border: `1px solid ${alpha(theme.palette.error.main, 0.35)}`,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.error.light,
                    0.22,
                  )}, ${alpha(theme.palette.background.paper, 0.96)})`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: playlistBg,
                        color: playlistTextColor,
                      }}
                    >
                      <MusicIcon size={24} />
                    </Box>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        CURATED PLAYLIST
                      </Typography>
                      <Typography variant="h4" component="h2" fontWeight="700">
                        Kumar Playlist
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    A handpicked blend of Bollywood hooks, Tamil Kurals, and
                    devotional warmth. Designed for deep work, family evenings,
                    and long drives.
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    href={`https://music.youtube.com/playlist?list=${playlistId}&si=${playlistShareId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<Play size={20} />}
                    endIcon={<ExternalLink size={16} />}
                    sx={{
                      alignSelf: "flex-start",
                      backgroundColor: playlistBg,
                      px: 3.5,
                      py: 1.2,
                      borderRadius: 999,
                      textTransform: "none",
                      fontSize: "1.05rem",
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
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  height: "100%",
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography variant="overline" color="text.secondary">
                  FRESH SPINS
                </Typography>
                <Typography variant="h4" component="h3" fontWeight="700" gutterBottom>
                  Latest spins
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  The full playlist rotation right now — every track in order.
                  <Link
                    href={`https://music.youtube.com/playlist?list=${playlistId}&si=${playlistShareId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    underline="always"
                  >
                    Open the playlist
                  </Link>
                  .
                </Typography>

                <Stack spacing={2}>
                  {[
                    {
                      title: "Harivarasanam | New Age Bhakti | Gowry Lekshmi",
                      videoId: "rc-QQ2bPYgA",
                      context:
                        "Soft bhakti energy with a modern texture - perfect for a calm reset.",
                    },
                    {
                      title: "Kannamoochi Yenada Live | Indosoul Mixtape",
                      videoId: "FLIm0eWR1_A",
                      context:
                        "Soulful live mix that keeps the groove while honoring the original.",
                    },
                  ].map((item) => (
                    <Box
                      key={item.title}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                        bgcolor: alpha(theme.palette.error.light, 0.08),
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="error"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          mb: 0.8,
                          fontWeight: 700,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {item.context}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        href={`https://music.youtube.com/watch?v=${item.videoId}&list=${playlistId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<ExternalLink size={16} />}
                        sx={{ textTransform: "none" }}
                      >
                        Listen
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default MusicPage;
