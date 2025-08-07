# Personal Website - Kumar's Portfolio

**Last Updated:** August 7, 2025

A modern, responsive personal website built with React, Vite, and Tailwind CSS. Features include a blog, projects showcase, learning resources, Books section, and integrated analytics.

## 🚀 Features

- **Portfolio Showcase** - Display projects and skills
- **Blog System** - Share thoughts and experiences
- **Books** - Long-form notes rendered from Markdown (with DOCX → MD conversion)
- **Learning Hub** - Educational resources and shortcuts
- **Analytics Dashboard** - Track website performance (access via `/analytics`)
- **Responsive Design** - Works on all devices
- **Modern UI** - Built with Tailwind CSS and Framer Motion

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Animations:** Framer Motion
- **Analytics:** Custom analytics system with Netlify Functions
- **Deployment:** Netlify
- **Icons:** React Icons
  
## 📚 Books

- List page: `/books`
- Example detail page: `/books/applying-cornell-method`
- Cover: book icon placeholder for consistency
- Badges: shields.io badges for topics

Content pipeline:
- Source DOCX placed in `docs/`
- Converted to Markdown with script (see Scripts)
- Rendered via `react-markdown` + `remark-gfm`

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components and blog posts
├── hooks/         # Custom React hooks
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

The website includes a custom analytics system:
- **Backend:** Deployed on Netlify Functions
- **Dashboard:** Access at `/analytics` (hidden from navigation)
- **Tracking:** Page views, user interactions, and performance metrics

See [ANALYTICS_README.md](./ANALYTICS_README.md) for detailed documentation.

## 🎨 Customization

- Update personal information in `src/pages/About.jsx`
- Add new blog posts in `src/pages/blog/`
- Modify styling in `tailwind.config.js`
- Update analytics configuration in `src/config/analytics.js`

## 📝 Blog Posts

The blog system supports:
- Markdown and JSX posts
- Automatic routing
- SEO optimization
- Reading time estimation

## 🔧 Development

- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Lint:** `npm run lint`
- **Convert Books (DOCX → MD):** `npm run convert:books`

Scripts
- `scripts/convert-docx-to-md.mjs` converts `docs/Applying_Cornell_method.docx` → `src/pages/books/applying-cornell-method.md`.
- To add a new book, update the script inputs/outputs accordingly and re-run.

## 🌐 Deployment

- Host: Netlify
- Live Site: https://kumarsite.netlify.app
- Branch: Deployed from GitHub. Ensure Site settings → Build & deploy → Branch to deploy matches your workflow (main or master).
- Build command: `npm run build`
- Publish directory: `dist`

## 📄 License

MIT License - see LICENSE file for details.
