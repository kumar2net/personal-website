import { motion } from "framer-motion";
import { useState } from "react";
import { FaExternalLinkAlt, FaImages } from "react-icons/fa";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";

const albums = [
  {
    title: "Latest Album Drop",
    description:
      "A fresh set of everyday frames and warm highlights, including a Bharatanatyam dance bit and other interesting 2026 images.",
    url: "https://photos.app.goo.gl/7LgrDCzrsR9n8NbL6",
    accent: "secondary",
  },
];

const Album = () => {
  const theme = useTheme();
  const [isMobile] = useState(() => {
    if (typeof navigator === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  });

  const handleAlbumClick = (albumUrl) => {
    if (isMobile) {
      try {
        window.location.href = albumUrl;
      } catch (error) {
        console.log("Same tab failed, trying new tab...", error);
        try {
          window.open(albumUrl, "_blank", "noopener,noreferrer");
        } catch (fallbackError) {
          console.log("New tab failed, trying direct navigation...", fallbackError);
          window.location.assign(albumUrl);
        }
      }
    } else {
      window.open(albumUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        py: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
        background: `radial-gradient(circle at 20% 20%, ${alpha(
          theme.palette.primary.light,
          0.2,
        )}, transparent 55%), radial-gradient(circle at 80% 10%, ${alpha(
          theme.palette.secondary.light,
          0.22,
        )}, transparent 50%), linear-gradient(180deg, ${alpha(
          theme.palette.background.default,
          0.9,
        )} 0%, ${theme.palette.background.default} 60%)`,
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
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
              2026 ALBUM LOGBOOK
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
              Photo Album
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "text.secondary",
                maxWidth: 560,
                mx: "auto",
              }}
            >
              Captured Moments with bold color, warmer light, and quicker drops.
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: alpha(theme.palette.secondary.main, 0.08),
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  AIKumar Sothapalgal - சொதப்பல்கள் 
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Follow the latest AIKumar drops and behind-the-scenes snippets.
                  New short: "Peanut Pains" offers a funny take.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  href="https://www.youtube.com/@kumar2net"
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<FaExternalLinkAlt style={{ opacity: 0.7, fontSize: "0.8em" }} />}
                  sx={{ textTransform: "none" }}
                >
                  Visit YouTube channel
                </Button>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {albums.map((album, index) => {
              const accentColor =
                theme.palette[album.accent]?.main || theme.palette.primary.main;
              return (
                <Grid item xs={12} md={6} key={album.title}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      border: `1px solid ${alpha(accentColor, 0.4)}`,
                      background: `linear-gradient(135deg, ${alpha(
                        accentColor,
                        0.18,
                      )}, ${alpha(theme.palette.background.paper, 0.9)})`,
                      boxShadow: "none",
                      backdropFilter: "blur(10px)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="overline"
                            sx={{
                              letterSpacing: "0.2em",
                              color: alpha(accentColor, 0.85),
                              fontWeight: 700,
                            }}
                          >
                            {index === 0 ? "LATEST DROP" : "COLLECTION"}
                          </Typography>
                          <Typography
                            variant="h5"
                            component="h2"
                            fontWeight={700}
                            sx={{ mt: 0.5 }}
                          >
                            {album.title}
                          </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                          {album.description}
                        </Typography>

                        {isMobile && (
                          <Typography
                            variant="caption"
                            sx={{ display: "block", color: "text.secondary" }}
                          >
                            📱 Tap to open in Google Photos app or browser
                          </Typography>
                        )}

                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => handleAlbumClick(album.url)}
                          startIcon={<FaImages />}
                          endIcon={<FaExternalLinkAlt style={{ opacity: 0.7, fontSize: "0.8em" }} />}
                          sx={{
                            alignSelf: "flex-start",
                            backgroundColor: accentColor,
                            color: theme.palette.getContrastText(accentColor),
                            px: 3.5,
                            py: 1.3,
                            borderRadius: 999,
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: 600,
                            boxShadow: "none",
                            "&:hover": {
                              boxShadow: "none",
                              backgroundColor: alpha(accentColor, 0.85),
                            },
                          }}
                        >
                          Open Google Photos
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default Album;
