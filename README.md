# Personal Website - Kumar's Portfolio

A modern, responsive personal website built with React, Vite, and Tailwind CSS. Features include a blog, projects showcase, learning resources, and integrated analytics.

**Last Updated:** August 6, 2025

## 🚀 Features

- **Portfolio Showcase** - Display projects and skills
- **Blog System** - Share thoughts and experiences
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

## 🌐 Deployment

The website is automatically deployed to Netlify from the main branch.

**Live Site:** https://kumarsite.netlify.app

## 📄 License

MIT License - see LICENSE file for details.
