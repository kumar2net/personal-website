import { motion } from "framer-motion";
import { ExternalLink, Music as MusicIcon, Play } from "lucide-react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { useColorMode } from "../providers/ColorModeProvider";
import musicPlaylistSnapshot from "../data/musicPlaylistSnapshot.json";

const MusicPage = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === "dark";
  const playlistBg = isDark ? alpha(theme.palette.error.main, 0.9) : theme.palette.error.main;
  const playlistTextColor = isDark
    ? theme.palette.common.white
    : theme.palette.getContrastText(theme.palette.error.main);
  const { playlistId, playlistShareId } = musicPlaylistSnapshot;
  const latestSpins = musicPlaylistSnapshot.tracks.slice(-3);
  const latestSpinTitles =
    latestSpins.length === 3
      ? `"${latestSpins[0].title}", "${latestSpins[1].title}", and "${latestSpins[2].title}"`
      : "the latest additions";

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

          <Paper
            id="kasadathaparara"
            elevation={0}
            sx={{
              scrollMarginTop: 96,
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.35)}`,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.warning.light,
                isDark ? 0.22 : 0.18,
              )}, ${alpha(theme.palette.background.paper, 0.96)})`,
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack spacing={2}>
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: "0.2em",
                  color: "text.secondary",
                  fontWeight: 700,
                }}
              >
                SONG REFERENCE
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontFamily:
                    '"Noto Sans Tamil", "Space Grotesk", "IBM Plex Sans", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3rem" },
                  letterSpacing: 0,
                }}
              >
                கசடதபரரா
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Noto Sans Tamil", "Noto Sans", sans-serif',
                  fontSize: { xs: "1.2rem", md: "1.45rem" },
                  lineHeight: 1.65,
                  color: "text.primary",
                }}
              >
                பறை அடித்துட்டு பறை அடித்துட்டு... பறை அடித்திட்டு பறை அடித்திட்டு இறை அடித்திடியா
                <br />
                எவரும் ராவணனோ எவரும் ராவணனோ அவரும் பாடனும் அவரும் பாடனும்
              </Typography>
            </Stack>
          </Paper>

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
                  <Box
                    sx={{
                      mt: 1,
                      p: 2,
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.error.main, 0.25)}`,
                      bgcolor: alpha(theme.palette.error.light, isDark ? 0.18 : 0.12),
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      Current lane
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      The playlist still cuts across devotional, retro Hindi,
                      Tamil-pop, and newer crossover tracks without trying to stay
                      in one lane. It is built for deep work, family evenings, and
                      long drives.
                    </Typography>
                  </Box>
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
                  The tail of the playlist shifts first, and right now that
                  means {latestSpinTitles}. This section stays tied to the most
                  recent adds, so the snapshot always reflects what just landed
                  in rotation.
                </Typography>

                <Stack spacing={2}>
                  {latestSpins.map((item, index) => (
                    <Box
                      key={item.videoId}
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
                        {item.artists.split(" · ")[0]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                        {index === latestSpins.length - 1
                          ? "Newest add at the bottom of the playlist."
                          : "One of the latest additions from the playlist tail."}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        href={item.url}
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

          <Paper
            id="tamil-typing-gboard"
            elevation={0}
            sx={{
              scrollMarginTop: 96,
              overflow: "hidden",
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.info.main, 0.28)}`,
              bgcolor: alpha(theme.palette.background.paper, 0.76),
              backdropFilter: "blur(10px)",
            }}
          >
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="/media/tamiltypinggboard.png"
                  alt="Gboard Tamil typing keyboard setup"
                  loading="lazy"
                  sx={{
                    display: "block",
                    width: "100%",
                    maxHeight: { xs: 520, md: 560 },
                    objectFit: "contain",
                    bgcolor: alpha(theme.palette.common.black, isDark ? 0.2 : 0.04),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2} sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: "0.2em",
                      color: "text.secondary",
                      fontWeight: 700,
                    }}
                  >
                    TAMIL TYPING HINT
                  </Typography>
                  <Typography variant="h4" component="h2" fontWeight={700}>
                    Use Gboard for quick Tamil text
                  </Typography>
                  <Typography
                    lang="ta"
                    sx={{
                      fontFamily:
                        '"Noto Sans Tamil", "Noto Sans", "IBM Plex Sans", sans-serif',
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                      lineHeight: 1.7,
                    }}
                  >
                    தமிழ் வார்த்தைகளை தட்டச்சு செய்ய Gboard-ல் Tamil keyboard
                    தேர்வு செய்தால் போதும்.
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    On mobile, switch the keyboard language to Tamil in Gboard,
                    then type the lyrics, notes, or song names directly in Tamil
                    script.
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default MusicPage;
