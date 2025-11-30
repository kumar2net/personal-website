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
  Typography,
  useTheme,
  alpha,
} from "@mui/material";

const albums = [
  {
    title: "Family Highlights",
    description:
      "SB’s latest frames, mellow autumn mood pics, and a few favorite newspaper clippings stitched together.",
    url: "https://photos.app.goo.gl/ej2zF3go6NVt7Pgv6",
  },
  {
    title: "Ragas Dental Camp Diaries",
    description:
      "Snapshots from the budding dentist’s internship week – queues of patients in Puducherry, Thiruvanmiyur’s Nagarpura clinic, and the team in full PPE. A lighthearted look at serious service.",
    url: "https://photos.app.goo.gl/HQrPQxw8Q2Qa9EWM7",
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
      sx={{ py: 8 }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Photo Album
          </Typography>
          <Typography variant="h5" color="text.secondary" mb={4}>
            Captured Moments
          </Typography>
          <Box
            sx={{
              textAlign: "left",
              maxWidth: "sm",
              mx: "auto",
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              borderLeft: `4px solid ${theme.palette.primary.main}`,
            }}
          >
            <Typography variant="body1" color="text.primary">
              Lovely images from Pacific Grove, Monterey, California.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {albums.map((album, index) => (
            <Grid item xs={12} md={6} key={album.title}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: theme.shadows[4],
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Box mb={3}>
                    <Typography variant="h5" component="h2" gutterBottom fontWeight="600">
                      {album.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {album.description}
                    </Typography>

                    {isMobile && (
                      <Typography
                        variant="caption"
                        sx={{ display: "block", mt: 2, color: "primary.main" }}
                      >
                        📱 Tap to open in Google Photos app or browser
                      </Typography>
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleAlbumClick(album.url)}
                    startIcon={<FaImages />}
                    endIcon={<FaExternalLinkAlt style={{ opacity: 0.7, fontSize: "0.8em" }} />}
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main || theme.palette.primary.dark})`,
                      color: "white",
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    Open Google Photos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Album;
