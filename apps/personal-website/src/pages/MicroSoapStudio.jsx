import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const CATALOG_URL = '/microsoap/catalog.json';
const VOTE_STORAGE_KEY = 'microsoap-votes-v1';

function readLocalVotes() {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    return JSON.parse(window.localStorage.getItem(VOTE_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeLocalVotes(votes) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(votes));
}

function formatDate(value) {
  if (!value) {
    return 'Unknown';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const langLabel = {
  en: 'English',
  ta: 'Tamil',
};

const beatTone = {
  hook: '#ff7b3d',
  pivot: '#ffd166',
  cliffhanger: '#7dd3fc',
};

function VoteButton({ choice, count, onClick, selected }) {
  return (
    <Button
      onClick={onClick}
      variant={selected ? 'contained' : 'outlined'}
      sx={{
        justifyContent: 'space-between',
        px: 2,
        py: 1.5,
        borderRadius: 3,
        textTransform: 'none',
        fontWeight: 700,
        ...(selected
          ? {
              background: 'linear-gradient(135deg, #ff7b3d 0%, #ffb703 100%)',
              color: '#08111f',
            }
          : {
              borderColor: 'rgba(255,255,255,0.18)',
              color: 'text.primary',
            }),
      }}
      fullWidth
    >
      <span>{choice.id}. {choice.label}</span>
      <span>{count}</span>
    </Button>
  );
}

export default function MicroSoapStudio() {
  const [catalog, setCatalog] = useState(null);
  const [votes, setVotes] = useState(() => readLocalVotes());
  const [selectedChoice, setSelectedChoice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      try {
        setLoading(true);
        const response = await fetch(`${CATALOG_URL}?t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error(`Failed to load micro-soap catalog (${response.status})`);
        }
        const payload = await response.json();
        if (active) {
          setCatalog(payload);
          setError('');
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : String(loadError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCatalog();
    return () => {
      active = false;
    };
  }, []);

  const episodes = catalog?.episodes || [];
  const currentEpisode = episodes[0] || null;
  const archiveEpisodes = useMemo(() => episodes.slice(1, 5), [episodes]);

  useEffect(() => {
    if (!currentEpisode) {
      return;
    }
    const currentVotes = votes[currentEpisode.id] || {};
    const selected = Object.entries(currentVotes).find(([, value]) => value > 0)?.[0] || '';
    setSelectedChoice(selected);
  }, [currentEpisode, votes]);

  async function handleVote(choiceId) {
    if (!currentEpisode) {
      return;
    }

    const nextVotes = {
      ...votes,
      [currentEpisode.id]: {
        A: choiceId === 'A' ? 1 : 0,
        B: choiceId === 'B' ? 1 : 0,
      },
    };
    setVotes(nextVotes);
    setSelectedChoice(choiceId);
    writeLocalVotes(nextVotes);
    setNotice(`Saved your vote for ${choiceId}.`);

    try {
      await fetch('/api/microsoap-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          episodeId: currentEpisode.id,
          choiceId,
          seriesTitle: catalog?.series?.title || 'Microsoap',
        }),
      });
    } catch {
      setNotice(`Saved your vote for ${choiceId} locally. Server sync is optional.`);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4, maxWidth: 1280, mx: 'auto' }}>
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 4 },
              borderRadius: 4,
              color: '#f8fafc',
              background:
                'radial-gradient(circle at top right, rgba(255,123,61,0.28), transparent 25%), linear-gradient(135deg, #08111f 0%, #111827 55%, #1f2937 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Stack spacing={1.2}>
              <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.78 }}>
                Interactive Shorts Lab
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1 }}>
                Bilingual Micro-Soap Engine
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 760, opacity: 0.9 }}>
                3 beats, 2 languages, 1 cliffhanger. The workspace package writes strict episode JSON,
                the site previews the latest catalog, and the vote loop is ready for same-day sequel shipping.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="22-28s arcs" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                <Chip label="Tamil + English" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                <Chip label="A/B sequel voting" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                <Chip label="OpenAI + ffmpeg scaffold" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              </Stack>
            </Stack>
          </Paper>

          {loading ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CircularProgress size={20} />
              <Typography>Loading micro-soap catalog…</Typography>
            </Stack>
          ) : null}

          {error ? <Alert severity="error">{error}</Alert> : null}
          {notice ? <Alert severity="info">{notice}</Alert> : null}

          {currentEpisode ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.35fr 0.95fr' },
                gap: 3,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 4,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack spacing={2.4}>
                  <Stack spacing={0.8}>
                    <Typography variant="overline" sx={{ letterSpacing: 1.5, color: 'text.secondary' }}>
                      Current Episode
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {currentEpisode.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentEpisode.durationSec}s • Generated {formatDate(currentEpisode.generatedAt)}
                    </Typography>
                  </Stack>

                  <Stack spacing={1.5}>
                    {currentEpisode.beats.map((beat, index) => (
                      <Paper
                        key={`${currentEpisode.id}-${beat.beat}`}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          backgroundColor: '#0f172a',
                          color: '#f8fafc',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                            <Chip
                              label={`Beat ${index + 1}: ${beat.beat}`}
                              size="small"
                              sx={{
                                bgcolor: beatTone[beat.beat] || '#ff7b3d',
                                color: '#08111f',
                                fontWeight: 700,
                              }}
                            />
                            <Chip
                              label={langLabel[beat.lang] || beat.lang}
                              size="small"
                              variant="outlined"
                              sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.18)' }}
                            />
                            <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700 }}>
                              {beat.speaker}
                            </Typography>
                          </Stack>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {beat.line}
                          </Typography>
                          {beat.pronunciation ? (
                            <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                              {beat.pronunciation}
                            </Typography>
                          ) : null}
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {currentEpisode.continuityTokens?.map((token) => (
                      <Chip key={token} label={token} variant="outlined" />
                    ))}
                  </Stack>
                </Stack>
              </Paper>

              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack spacing={1.8}>
                    <Typography variant="overline" sx={{ letterSpacing: 1.4, color: 'text.secondary' }}>
                      Vote Loop
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {currentEpisode.audiencePrompt.text}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Local votes are stored in your browser now. The `/api/microsoap-vote` scaffold accepts server sync,
                      and you can add durable storage later without changing the page contract.
                    </Typography>
                    <Stack spacing={1.2}>
                      {currentEpisode.audiencePrompt.choices.map((choice) => {
                        const count = votes[currentEpisode.id]?.[choice.id] || 0;
                        return (
                          <VoteButton
                            key={choice.id}
                            choice={choice}
                            count={count}
                            selected={selectedChoice === choice.id}
                            onClick={() => handleVote(choice.id)}
                          />
                        );
                      })}
                    </Stack>
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    background:
                      'linear-gradient(180deg, rgba(255,123,61,0.08) 0%, rgba(8,17,31,0) 100%)',
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="overline" sx={{ letterSpacing: 1.4, color: 'text.secondary' }}>
                      Repo Commands
                    </Typography>
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        p: 2,
                        borderRadius: 3,
                        overflowX: 'auto',
                        bgcolor: '#08111f',
                        color: '#f8fafc',
                        fontSize: 13,
                        lineHeight: 1.6,
                      }}
                    >
{`npm run microsoap:generate -- --mock \\
  --catalog-out apps/personal-website/public/microsoap/catalog.json
npm run microsoap:tts -- --episode packages/shorts-microsoap/out/latest.json
npm run microsoap:render -- --episode packages/shorts-microsoap/out/latest.json`}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Default script model is `gpt-5-mini`. Set `MICROSOAP_SCRIPT_MODEL` if you want a verified snapshot.
                      Tamil voice is env-configured instead of hardcoding an unverified regional voice id.
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          ) : null}

          {archiveEpisodes.length ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Recent Episodes
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2,
                  }}
                >
                  {archiveEpisodes.map((episode) => (
                    <Paper
                      key={episode.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: '#0f172a',
                        color: '#f8fafc',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {episode.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {episode.durationSec}s • {formatDate(episode.generatedAt)}
                        </Typography>
                        <Typography variant="body2">
                          {episode.beats?.[2]?.line || 'No cliffhanger recorded.'}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              </Stack>
            </Paper>
          ) : null}
        </Stack>
      </Box>
    </motion.div>
  );
}
