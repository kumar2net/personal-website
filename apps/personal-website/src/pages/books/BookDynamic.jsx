import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link as RouterLink, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import BookCover from '../../components/BookCover';
import autoBooks from '../../data/autoBooks.json';

const jsxModules = import.meta.glob('/src/pages/books/*.jsx');
const mdModules = import.meta.glob('/src/pages/books/*.md', {
  query: '?raw',
  import: 'default',
});

// Function to strip frontmatter from markdown content
function stripFrontmatter(content) {
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterEndIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        frontmatterEndIndex = i;
        break;
      }
    }
  }

  if (frontmatterEndIndex !== -1) {
    return lines.slice(frontmatterEndIndex + 1).join('\n');
  }

  return content;
}

export default function BookDynamic() {
  const { slug } = useParams();
  const [markdown, setMarkdown] = useState('');
  const bookMeta = useMemo(
    () => autoBooks.find((entry) => entry.slug === slug),
    [slug]
  );
  const heroAlt = bookMeta
    ? `${bookMeta.title} cover art`
    : 'Auto-generated book cover';

  const LazyComponent = useMemo(() => {
    const path = `/src/pages/books/${slug}.jsx`;
    if (jsxModules[path]) {
      return React.lazy(jsxModules[path]);
    }
    return null;
  }, [slug]);

  useEffect(() => {
    const path = `/src/pages/books/${slug}.md`;
    if (mdModules[path]) {
      mdModules[path]().then((raw) => {
        const content = raw || '';
        const strippedContent = stripFrontmatter(content);
        setMarkdown(strippedContent);
      });
    } else {
      setMarkdown('');
    }
  }, [slug]);

  if (LazyComponent) {
    return (
      <Suspense fallback={<div>Loading…</div>}>
        <LazyComponent />
      </Suspense>
    );
  }

  const renderHero = () => {
    if (!bookMeta) return null;
    return (
      <Card
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Grid container spacing={0}>
          <Grid item xs={12} md={5}>
            {bookMeta.coverImage ? (
              <CardMedia
                component="img"
                image={bookMeta.coverImage}
                alt={heroAlt}
                sx={{ height: '100%', maxHeight: 360, objectFit: 'cover' }}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  minHeight: 280,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    'linear-gradient(135deg, #e0f2fe 0%, #ede9fe 50%, #fef9c3 100%)',
                }}
              >
                <BookCover
                  bookId={bookMeta.slug}
                  title={bookMeta.title}
                  author={bookMeta.author}
                  className="w-full h-full"
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={7}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="overline" color="text.secondary">
                {bookMeta.publishDate || 'Fresh read'}
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {bookMeta.title}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {bookMeta.author}
              </Typography>
              {bookMeta.summary && (
                <Typography variant="body1" sx={{ mt: 1.5 }}>
                  {bookMeta.summary}
                </Typography>
              )}
              {Array.isArray(bookMeta.tags) && bookMeta.tags.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                  {bookMeta.tags.map((tag) => (
                    <Chip key={`${bookMeta.slug}-${tag}`} label={tag} variant="outlined" size="small" />
                  ))}
                </Stack>
              )}
              {bookMeta.pdf && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    component="a"
                    href={bookMeta.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open original PDF
                  </Button>
                </Box>
              )}
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    );
  };

  if (bookMeta?.pdf) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Button
          component={RouterLink}
          to="/books"
          variant="text"
          sx={{ mb: 2, alignSelf: 'flex-start' }}
        >
          ← Back to Books
        </Button>
        {renderHero()}
        <Paper sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Inline PDF viewer
            </Typography>
            <Box
              component="object"
              data={bookMeta.pdf}
              type="application/pdf"
              sx={{
                width: '100%',
                height: { xs: 400, md: 640 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  PDF viewer is unavailable on this device. You can download it instead.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  component="a"
                  href={bookMeta.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 1 }}
                >
                  Download PDF
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button
        component={RouterLink}
        to="/books"
        variant="text"
        sx={{ mb: 2, alignSelf: 'flex-start' }}
      >
        ← Back to Books
      </Button>

      {renderHero()}

      {markdown ? (
        <Paper sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, boxShadow: 3 }}>
          <Box
            sx={{
              '& .markdown-body h1': { marginBottom: '0.5em', fontSize: '1.6rem' },
              '& .markdown-body h2': { marginTop: '1.4em', marginBottom: '0.6em', fontSize: '1.25rem' },
              '& .markdown-body p': { marginBottom: '0.8em', lineHeight: 1.7 },
              '& .markdown-body ul': { paddingLeft: '1.4em', marginBottom: '0.8em' },
            }}
            className="markdown-body"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </Box>
        </Paper>
      ) : (
        <Typography color="text.secondary">Book not found.</Typography>
      )}
    </Container>
  );
}
