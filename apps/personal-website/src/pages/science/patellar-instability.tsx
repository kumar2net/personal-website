import { useEffect, useMemo, useRef, useState } from "react";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import SEO from "../../components/SEO";

type VideoChapter = {
  title: string;
  caption: string;
  start: number;
  end: number;
  thumbnail: string;
};

const MASTER_VIDEO_SRC = "/media/generated/kneecap-dislocation-sora-master-36s.mp4";
const MASTER_VIDEO_SECONDS = 36.3;

const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    title: "Chapter 1: Mechanism",
    caption: "Normal tracking to squash pivot dislocation trigger.",
    start: 0,
    end: 12.1,
    thumbnail: "/media/generated/kneecap-chapter-1.png",
  },
  {
    title: "Chapter 2: Recurrence",
    caption: "MPFL insufficiency plus anatomic risk factors.",
    start: 12.1,
    end: 24.2,
    thumbnail: "/media/generated/kneecap-chapter-2.png",
  },
  {
    title: "Chapter 3: Permanent Fix",
    caption: "Definitive stabilization with anatomy-corrective strategy.",
    start: 24.2,
    end: 36.3,
    thumbnail: "/media/generated/kneecap-chapter-3.png",
  },
];

const INFOGRAPHIC_SRC = "/media/generated/kneecap-instability-infographic.svg";

const mechanismTriggers = [
  "Planted-foot pivot with knee valgus and internal rotation during fast direction changes.",
  "The patella is most vulnerable in early knee flexion, before it is fully seated in the trochlear groove.",
  "After the first dislocation, the MPFL can remain stretched or torn and lose restraint.",
];

const recurrenceFactors = [
  "Trochlear dysplasia: shallow groove gives less bony containment.",
  "Patella alta: high-riding kneecap delays stable engagement in the groove.",
  "Elevated TT-TG distance or lateral pull bias: increases outward tracking force.",
  "Generalized laxity, valgus alignment, or rotational malalignment can compound risk.",
];

const definitiveFixSteps = [
  "MPFL reconstruction is the core stabilizing surgery for recurrent lateral patellar instability.",
  "Add tibial tubercle osteotomy when alignment and tracking metrics are unfavorable.",
  "Trochleoplasty is reserved for selected severe trochlear dysplasia in skeletally mature patients.",
  "Pre-op MRI (and often CT) guides anatomy-specific planning and checks cartilage injury.",
];

const urgentWarnings = [
  "Locked knee, inability to fully extend, or large immediate swelling.",
  "Persistent instability after a second event, especially in pivoting sport.",
  "Suspected osteochondral fragment or recurrent giving-way episodes.",
];

function formatClock(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.max(0, Math.floor(seconds % 60));
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function StitchedVideoExperience({
  chapters,
  onSurface,
  outlineVariant,
  primaryContainer,
}: {
  chapters: VideoChapter[];
  onSurface: string;
  outlineVariant: string;
  primaryContainer: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(MASTER_VIDEO_SECONDS);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  const progressValue = Math.min((currentTime / Math.max(duration, 0.001)) * 100, 100);

  const activeChapterIndex = useMemo(() => {
    return chapters.findIndex((chapter, index) => {
      if (index === chapters.length - 1) {
        return currentTime >= chapter.start && currentTime <= chapter.end + 0.5;
      }
      return currentTime >= chapter.start && currentTime < chapter.end;
    });
  }, [chapters, currentTime]);

  const activeChapter =
    activeChapterIndex >= 0 ? chapters[activeChapterIndex] : chapters[0];

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }
    video.pause();
    setIsPlaying(false);
  };

  const restartVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.currentTime = 0;
      await video.play();
      setCurrentTime(0);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const jumpToChapter = async (startTime: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = startTime;
    setCurrentTime(startTime);
    if (isPlaying) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    }
  };

  return (
    <Stack gap={1.4}>
      <Box
        component="video"
        ref={videoRef}
        controls
        playsInline
        preload="auto"
        muted={isMuted}
        onLoadedMetadata={(event) => {
          const nextDuration = Number(event.currentTarget.duration || MASTER_VIDEO_SECONDS);
          if (Number.isFinite(nextDuration) && nextDuration > 0) {
            setDuration(nextDuration);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => {
          const nextTime = Number(event.currentTarget.currentTime || 0);
          setCurrentTime(nextTime);
        }}
        onEnded={() => setIsPlaying(false)}
        sx={{
          width: "100%",
          borderRadius: 2,
          border: `1px solid ${alpha(outlineVariant, 0.8)}`,
          backgroundColor: alpha(onSurface, 0.04),
        }}
      >
        <source src={MASTER_VIDEO_SRC} type="video/mp4" />
        Your browser does not support the video tag.
      </Box>

      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        <Button
          size="small"
          variant="contained"
          onClick={togglePlayback}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={restartVideo}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Restart
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setIsMuted((value) => !value)}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          {isMuted ? "Unmute" : "Mute"}
        </Button>
      </Stack>

      <Stack gap={0.6}>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: 8,
            borderRadius: 999,
            backgroundColor: alpha(onSurface, 0.14),
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              backgroundColor: primaryContainer,
            },
          }}
        />
        <Typography variant="bodySmall" sx={{ color: alpha(onSurface, 0.7) }}>
          {formatClock(currentTime)} / {formatClock(duration)}
        </Typography>
        <Typography variant="bodySmall" sx={{ color: alpha(onSurface, 0.78) }}>
          {activeChapter.title} • {activeChapter.caption}
        </Typography>
      </Stack>

      <Grid container spacing={1.2}>
        {chapters.map((chapter, index) => {
          const isActive = index === activeChapterIndex;
          return (
            <Grid item xs={12} sm={4} key={chapter.title}>
              <Box
                role="button"
                tabIndex={0}
                onClick={() => {
                  void jumpToChapter(chapter.start);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    void jumpToChapter(chapter.start);
                  }
                }}
                sx={{
                  cursor: "pointer",
                  overflow: "hidden",
                  borderRadius: 2,
                  border: `1px solid ${
                    isActive ? alpha(primaryContainer, 0.9) : alpha(outlineVariant, 0.8)
                  }`,
                  boxShadow: isActive
                    ? `0 0 0 2px ${alpha(primaryContainer, 0.22)}`
                    : "none",
                  transition: "all 180ms ease",
                  backgroundColor: alpha(onSurface, 0.02),
                  "&:hover": {
                    borderColor: alpha(primaryContainer, 0.85),
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={chapter.thumbnail}
                  alt={`${chapter.title} preview`}
                  sx={{
                    display: "block",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                  }}
                />
                <Box sx={{ p: 1.1 }}>
                  <Typography
                    variant="bodySmall"
                    sx={{ color: alpha(onSurface, 0.72), fontWeight: 700 }}
                  >
                    {`Chapter ${index + 1} • ${formatClock(chapter.start)}`}
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    sx={{ color: onSurface, fontWeight: 600, mt: 0.3 }}
                  >
                    {chapter.title}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}

export default function PatellarInstabilityPage() {
  const theme = useTheme();
  const paletteVars = (theme.vars?.palette ?? {}) as Record<string, string | undefined>;

  const surfaceContainer =
    paletteVars.surfaceContainer ?? theme.palette.background.paper;
  const primaryContainer =
    paletteVars.primaryContainer ?? theme.palette.primary.main;
  const secondaryContainer =
    paletteVars.secondaryContainer ?? theme.palette.secondary.main;
  const onSurface = paletteVars.onSurface ?? theme.palette.text.primary;
  const outlineVariant = paletteVars.outlineVariant ?? theme.palette.divider;

  const cardSx = {
    backgroundColor: surfaceContainer,
    color: onSurface,
    border: `1px solid ${alpha(outlineVariant, 0.85)}`,
    borderRadius: 3,
    boxShadow: `0 24px 60px ${alpha(onSurface, 0.08)}`,
  };

  return (
    <>
      <SEO
        title="Recurrent Kneecap Dislocation – Anatomy and Permanent Fix"
        description="Stitched multi-part Sora 2 explainer plus infographic on recurrent lateral patellar instability and definitive correction."
        canonicalPath="/science/patellar-instability"
        type="article"
      />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack gap={4}>
          <Stack gap={1.2}>
            <Typography
              variant="headlineSmall"
              sx={{ color: onSurface, letterSpacing: 0.2 }}
            >
              Recurrent Kneecap Dislocation: Why It Returns and What Fixes It
            </Typography>
            <Typography variant="bodyLarge" sx={{ color: alpha(onSurface, 0.85) }}>
              This note explains recurrent lateral patellar instability in a squash
              athlete context: the mechanism, anatomic predisposition, and the
              definitive correction pathway after repeat episodes.
            </Typography>
          </Stack>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.4 }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                <Chip
                  size="small"
                  label="Sora 2 Master Stitch"
                  sx={{
                    width: "fit-content",
                    backgroundColor: alpha(primaryContainer, 0.14),
                    color: primaryContainer,
                    fontWeight: 700,
                  }}
                />
                <Chip
                  size="small"
                  label="~36 seconds"
                  sx={{
                    width: "fit-content",
                    backgroundColor: alpha(secondaryContainer, 0.12),
                    color: secondaryContainer,
                    fontWeight: 700,
                  }}
                />
              </Stack>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Stitched Video Explainer
              </Typography>
              <Typography variant="bodyMedium" sx={{ color: alpha(onSurface, 0.82) }}>
                Three Sora 2 clips are merged into one seamless MP4 with thumbnail
                chapter jumps: mechanism, recurrence anatomy, and definitive correction.
              </Typography>
              <StitchedVideoExperience
                chapters={VIDEO_CHAPTERS}
                onSurface={onSurface}
                outlineVariant={outlineVariant}
                primaryContainer={primaryContainer}
              />
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.4 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Annotated Infographic
              </Typography>
              <Box
                component="img"
                src={INFOGRAPHIC_SRC}
                alt="Infographic showing mechanism, recurrence factors, and permanent surgical correction for recurrent kneecap dislocation."
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  border: `1px solid ${alpha(outlineVariant, 0.8)}`,
                }}
              />
            </CardContent>
          </Card>

          <Divider sx={{ borderColor: outlineVariant, opacity: 0.9 }} />

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.4 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Anatomy: Why Recurrence Happens
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(outlineVariant, 0.75)}`,
                      backgroundColor: alpha(primaryContainer, 0.05),
                    }}
                  >
                    <Typography
                      variant="bodyLarge"
                      sx={{ color: primaryContainer, fontWeight: 700, mb: 1 }}
                    >
                      Trigger Mechanics
                    </Typography>
                    <Stack gap={1}>
                      {mechanismTriggers.map((item) => (
                        <Typography key={item} variant="bodyMedium" sx={{ color: onSurface }}>
                          • {item}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(outlineVariant, 0.75)}`,
                      backgroundColor: alpha(secondaryContainer, 0.05),
                    }}
                  >
                    <Typography
                      variant="bodyLarge"
                      sx={{ color: secondaryContainer, fontWeight: 700, mb: 1 }}
                    >
                      Predisposing Anatomy
                    </Typography>
                    <Stack gap={1}>
                      {recurrenceFactors.map((item) => (
                        <Typography key={item} variant="bodyMedium" sx={{ color: onSurface }}>
                          • {item}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.4 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Permanent Fix (Anatomy-Corrective Strategy)
              </Typography>
              <Stack gap={1}>
                {definitiveFixSteps.map((item, index) => (
                  <Typography key={item} variant="bodyLarge" sx={{ color: onSurface }}>
                    {index + 1}. {item}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.1 }}>
              <Typography variant="titleMedium" sx={{ color: secondaryContainer }}>
                Red-Flag Signs: Urgent Ortho Evaluation
              </Typography>
              <Stack gap={1}>
                {urgentWarnings.map((item) => (
                  <Typography key={item} variant="bodyMedium" sx={{ color: onSurface }}>
                    • {item}
                  </Typography>
                ))}
              </Stack>
              <Typography variant="bodySmall" sx={{ color: alpha(onSurface, 0.72) }}>
                Educational only. Diagnosis and treatment should be individualized by
                an orthopedic sports specialist.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
