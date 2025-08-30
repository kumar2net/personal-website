# Personal Website - Kumar's Portfolio

**Last Updated:** August 30, 2025

A modern, responsive personal website built with React, Vite, and Tailwind CSS. Features include a blog, projects showcase, learning resources, Books section, Music curation, and integrated analytics.

## 🚀 Features

- **Portfolio Showcase** - Display projects and skills
- **Blog System** - Share thoughts and experiences with AI-generated TL;DR summaries
- **Books** - Long-form notes rendered from Markdown (with DOCX → MD conversion)
- **Music Curation** - Personal music journey with favorite tracks and artists
- **Learning Hub** - Educational resources and shortcuts
- **Weekly Neurosurgical Dossier** - Professional medical intelligence briefings
- **Analytics** - Google Analytics 4 (GA4) via `gtag.js` with SPA route tracking
- **Semantic Search** - AI-powered search across blog content
- **Content Badges** - Automatic NEW/UPDATED indicators based on system dates
- **Responsive Design** - Works on all devices
- **Modern UI** - Built with Tailwind CSS and Framer Motion

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Animations:** Framer Motion
- **Analytics:** Google Analytics 4 (GA4)
- **AI Services:** Gemini API (TL;DR), Vertex AI (Semantic Search)
- **Deployment:** Netlify (with serverless functions)
- **Icons:** React Icons
  
## 🎵 Music Curation

- Page: `/music`
- Features current favorite tracks with emotional descriptions
- Includes complete lyrics for special tracks
- Highlights favorite artists with personal commentary
- Links to YouTube Music playlists
- Current favorites: "Ab Na Jao Chod Kar" and "Narumugaye"
- Featured artists: Karthick Iyer (Indo Soul), Mahesh (Master of Medley)

**Current Music Features:**
- **This Week's Melting Tracks** - Tracks that "melt me completely - wanting to just vaporize"
- **Complete Lyrics** - Full lyrics display for special tracks
- **Artist Spotlights** - Personal favorites with authentic reactions
- **Playlist Integration** - Direct links to KUMAR_2025 YouTube Music playlist

## 📚 Books

- List page: `/books`
- Example detail pages: `/books/atheism`, `/books/applying-cornell-method`
- Cover: book icon placeholder for consistency
- Badges: shields.io badges for topics

**Current Books:**
1. **Atheism: A Wonderful World Without Religion** by Tom Miles - Philosophical exploration of atheism
2. **The Brain: The Story of You** by David Eagleman - Neuroscience and brain science
3. **Applying the Cornell Method** - Study method guide

Content pipeline:
- Source files (PDF/DOCX) placed in `docs/`
- Converted to Markdown with scripts (see Scripts)
- Rendered via `react-markdown` + `remark-gfm`

## 🧠 Weekly Neurosurgical Dossier

- Page: `/dossier` (not visible in navigation header)
- Professional medical intelligence briefings for neurosurgeons
- Mobile-first responsive design with medical-grade layout
- Color-coded sections for easy scanning
- Content sourced from weekly research analysis
- Smooth animations and professional typography

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ContentBadge.jsx  # NEW/UPDATED content indicators
│   └── ...
├── pages/         # Page components and blog posts
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
│   └── contentDates.js  # Content date management
├── config/        # Configuration files
└── shared/        # Shared utilities and data
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/kumar2net/personal-website.git
   cd personal-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📊 Analytics

The site uses Google Analytics 4 (GA4):
- GA tag added in `index.html` with `send_page_view: false`
- SPA route changes tracked in `src/App.jsx` using React Router

## 🎨 Customization

- Update personal information in `src/pages/About.jsx`
- Add new blog posts in `src/pages/blog/`
- Modify styling in `tailwind.config.js`
- Update analytics configuration in `src/config/analytics.js`
- Manage content badges via `src/utils/contentDates.js`

## 🏷️ Content Badges

The site automatically shows NEW and UPDATED badges on content:
- **NEW Badge**: Shows on content published within last 7 days
- **UPDATED Badge**: Shows on content modified within last 30 days
- **Auto-Expiration**: Badges automatically disappear based on system dates
- **Zero Maintenance**: No manual cleanup required

See `docs/CONTENT_BADGES_GUIDE.md` for detailed usage instructions.

## 📝 Blog Posts

The blog system supports:
- Markdown and JSX posts
- Automatic routing
- SEO optimization
- Reading time estimation
- AI-generated TL;DR summaries
- Semantic search integration
- Shields.io badges for topics
- Hero images with Unsplash attribution
- Photo album integration with Google Photos
- Music playlist links integration
- Audio file embedding
- Canonical references to original sources

**Recent Blog Posts:**
- **Habit** - Daily routines and philosophy with AI-generated TL;DR
- **Boy with Music in His Veins** - Dharun's musical journey with embedded audio interview

## 🔧 Development

- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Lint:** `npm run lint`
- **Convert Books (DOCX → MD):** `npm run convert:books`

### Scripts
- `scripts/convert-docx-to-md.mjs` converts `docs/Applying_Cornell_method.docx` → `src/pages/books/applying-cornell-method.md`.
- PDF conversion: Use `pdftotext` command-line tool to extract text from PDF files (e.g., `pdftotext docs/Atheism.pdf src/pages/books/atheism.txt`).
- To add a new book, update the script inputs/outputs accordingly and re-run.

### Documentation
- **Book Conversion Guide**: `docs/BOOK_CONVERSION_GUIDE.md` - Detailed guide for converting PDF/DOCX files to website content
- **Book Cover Images Guide**: `docs/BOOK_COVER_IMAGES_GUIDE.md` - How to find and implement actual book cover images

## 🌐 Deployment

- Host: Netlify
- Live Site: https://kumarsite.netlify.app
- Branch: Deployed from GitHub. Ensure Site settings → Build & deploy → Branch to deploy matches your workflow (main or master).
- Build command: `npm run build`
- Publish directory: `dist`

## 🧠 AI TL;DR Summaries

Add concise AI-generated summaries at the top of selected blog posts.

Environment
- Set environment variables in Netlify (Site settings → Build & deploy → Environment):
  - `OPENAI_API_KEY` (required)
  - `OPENAI_MODEL` (optional; default an appropriate GPT-4o mini variant)

Local development
- Use Netlify CLI for local functions:
  - Install: `npm i -g netlify-cli`
  - Run: `netlify dev`
  - App: `http://localhost:8888` (functions proxied at `/.netlify/functions/*`)

How it works
- Backend: `netlify/functions/tldr.js` calls OpenAI Chat Completions to produce a 2–3 sentence TL;DR.
- Frontend:
  - `src/hooks/useContentText.js` extracts visible article text from a ref
  - `src/hooks/useTldrSummary.js` hashes content, caches via `localStorage`, fetches `/.netlify/functions/tldr`
  - `src/components/TldrSummary.jsx` renders the card
- Integration: posts wrap main content with a `ref` and place `<TldrSummary articleRef={articleRef} />` below title/byline.

Notes
- Only enabled on the three most recent posts by default.
- Caching is client-side only; clear with `localStorage.clear()` if needed.

## 🎵 Music Integration

The music page features:
- **Current Favorites** - Tracks that resonate deeply with personal commentary
- **Complete Lyrics** - Full song lyrics in styled text boxes
- **Artist Spotlights** - Personal favorites with authentic reactions
- **Playlist Links** - Direct integration with YouTube Music playlists
- **Emotional Descriptions** - Authentic personal responses to music

## 📄 License

MIT License - see LICENSE file for details.

Last updated: 2025-08-30
