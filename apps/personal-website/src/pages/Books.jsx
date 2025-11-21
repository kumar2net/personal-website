import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import BookCover from '../components/BookCover';
import BooksDataGrid from '../components/BooksDataGrid';
import autoBooks from '../data/autoBooks.json';

const fallbackGradient = 'linear-gradient(135deg, #e0e7ff 0%, #f5d0fe 100%)';

const manualBooks = [
  {
    slug: 'the-last-drop-of-water',
    title: 'The Last Drop of Water, oh no',
    author: 'Kumar A.',
    summary:
      'A profound true story of compassion and reflection set in Vadavalli, Coimbatore—mortality, empathy, and interconnectedness in one Sunday morning.',
    tags: ['Memoir', 'Philosophy', 'Ecology'],
    publishDate: 'October 20, 2025',
    readingTime: '2–3 min',
    coverImage: '/media/darkling-beetle.jpg',
  },
  {
    slug: 'how-to-stop-caring',
    title: 'How to STOP Caring What People Think of You!',
    author: 'Russell Jamieson',
    summary:
      'Break free from others’ opinions with practical strategies to build confidence and live authentically.',
    tags: ['Self-Help', 'Psychology', 'Mindset'],
    publishDate: 'January 16, 2025',
    readingTime: 'Short read',
    coverImage: '/media/how-to-stop-caring-cover.png',
  },
  {
    slug: 'its-not-about-you',
    title: "It's Not About You: A Brief Guide to a Meaningful Life",
    author: 'Tom Rath',
    summary:
      'Find meaning through service to others; reflections on contribution, purpose, and living with constraints.',
    tags: ['Meaning', 'Service', 'Mindset'],
    publishDate: 'September 13, 2025',
    readingTime: '—',
  },
  {
    slug: 'the-subtle-art',
    title: 'The Subtle Art of Not Giving a F***',
    author: 'Mark Manson',
    summary:
      'A counterintuitive self-help take on focusing on what truly matters by embracing constraints.',
    tags: ['Self-Help', 'Philosophy'],
    publishDate: 'January 16, 2025',
    readingTime: '—',
  },
  {
    slug: 'the-stoic-art-manual',
    title: 'The Stoic Art of Living',
    author: 'David Tuffley',
    summary: 'Verbatim notes converted from PDF on stoicism and Epictetus.',
    tags: ['Stoicism', 'Notes'],
    publishDate: '2025',
    readingTime: '—',
  },
  {
    slug: 'atheism',
    title: 'Atheism: A Wonderful World Without Religion',
    author: 'Tom Miles',
    summary:
      'A comprehensive exploration of atheism, its foundations, and its implications for how we see the world.',
    tags: ['Philosophy', 'Worldview'],
    publishDate: 'July 15, 2025',
    readingTime: '—',
  },
  {
    slug: 'the-brain-story',
    title: 'The Brain: The Story of You',
    author: 'David Eagleman',
    summary:
      'Digging into neuroscience and neural implants alongside AI advances; learning from first principles.',
    tags: ['Neuroscience', 'AI'],
    publishDate: 'July 10, 2025',
    readingTime: '—',
  },
  {
    slug: 'applying-cornell-method',
    title: 'Applying the Cornell Method',
    author: 'Study Method Guide',
    summary: 'Verbatim content on the Cornell note-taking method.',
    tags: ['Study Skills', 'Note-taking'],
    publishDate: 'June 20, 2025',
    readingTime: '—',
  },
];

function BookCard({ book }) {
  const tags = Array.isArray(book?.tags) ? book.tags : [];
  const summary = book?.summary || book?.description;
  const coverAlt = book?.coverAlt || `${book?.title || 'Book'} cover art`;

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/books/${book.slug}`}
        sx={{ height: '100%', alignItems: 'stretch' }}
      >
        <Box sx={{ position: 'relative', height: 220, background: fallbackGradient }}>
          {book.coverImage ? (
            <CardMedia
              component="img"
              src={book.coverImage}
              alt={coverAlt}
              sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: fallbackGradient,
              }}
            >
              <BookCover
                bookId={book.slug}
                title={book.title}
                author={book.author}
                className="w-full h-full"
              />
            </Box>
          )}
          {book.publishDate && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: 'rgba(17, 24, 39, 0.72)',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {book.publishDate}
            </Box>
          )}
        </Box>

        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700} sx={{ pr: 1 }}>
              {book.title}
            </Typography>
            {book.readingTime && (
              <Chip size="small" label={book.readingTime} variant="outlined" />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {book.author || 'Unknown'}
          </Typography>
          {tags.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {tags.slice(0, 4).map((tag) => (
                <Chip key={`${book.slug}-${tag}`} size="small" label={tag} variant="outlined" />
              ))}
            </Stack>
          )}
          {summary && (
            <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
              {summary}
            </Typography>
          )}
          <Box sx={{ mt: 1 }}>
            <Button variant="contained" size="small">
              Read Book
            </Button>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function Books() {
  const cards = [...autoBooks, ...manualBooks];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={800}>
          Books
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Reading notes and handbooks, standardized with MUI v8.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {cards.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.slug || book.title}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 5 }} />

      <BooksDataGrid books={autoBooks} />
    </Container>
  );
}

export default Books;
