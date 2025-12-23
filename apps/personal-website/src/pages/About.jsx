import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";

const skillCards = [
  { icon: "⚛️", title: "Frontend", caption: "React 18 · Framer Motion · React Router 6" },
  { icon: "🎨", title: "Styling", caption: "Tailwind CSS · MUI 7 · CSS Variables" },
  { icon: "🧠", title: "AI/LLM", caption: "OpenAI GPT-5 · Gemini · MCP agents" },
  { icon: "🧮", title: "Data/ML", caption: "Vertex AI · scikit-learn · cosine search" },
  { icon: "🛰️", title: "Networks", caption: "Wireless testbeds · IP transport" },
  { icon: "⚙️", title: "Infra", caption: "Vercel · Turbo · Netlify · CI probes" },
];

const About = () => {
  return (
    <div className="space-y-12">
      <Year2025 />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 py-8 space-y-12"
      >
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400">
            Hello Gen Z & Gen AI curious folks 👋
          </p>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            kumar2net.com has been my digital home since dial-up—now it’s a
            control tower for agents, feeds, and slow-tech living.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-200 leading-relaxed">
            I’ve been online since the late ’90s—first on Indian forums, then
            Blogspot and WordPress—writing about open tech, privacy, and why
            minimal, sustainable computing matters. I retired from a telecom
            career (IP/MPLS networks, access & backbone) and now blend AI
            experiments with climate-aware habits: solar power, small phones,
            e-ink reading, and no car. The throughline: open culture, privacy,
            resilience, and human-speed tech.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-3">Indexed everywhere</h2>
            <p className="text-slate-600 dark:text-slate-200 mb-4">
              Google & Bing pull from{" "}
              <a
                className="text-blue-600 dark:text-blue-400 underline decoration-dotted"
                href="https://www.kumar2net.com/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
              >
                sitemap.xml
              </a>{" "}
              multiple times a day. Every story ships with structured metadata so
              it lands in Discover, Bing AI, and your favourite reader.
            </p>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                <span>Primary domain: kumar2net.com (Vercel auto SSL)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                <span>Mirror feeds: WordPress + X (restreamed below)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                <span>20+ years of uptime across minimal VPS + CDN mirrors</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-3">Stack cheat sheet</h2>
            <p className="text-slate-600 dark:text-slate-200 mb-4">
              Real tools instead of novelty shields. Here&apos;s the ground truth.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {skillCards.map((card) => (
                <div
                  key={card.title}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 p-3 shadow-sm"
                >
                  <div className="text-2xl">{card.icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {card.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      {card.caption}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Digital footprint</h2>
          <div className="space-y-3 text-slate-700 dark:text-slate-200">
            <p>
              <strong>1990s–2000s:</strong> Early Indian web forums, Rediff/Yahoo
              Groups; kumar2.net registered; open-source advocacy and Microsoft
              critiques in the local context.
            </p>
            <p>
              <strong>2005–2010:</strong> Blogspot → self-hosted WordPress on
              kumar2.net. Wrote on digital rights, Aadhaar skepticism, net
              neutrality, Creative Commons, and open data.
            </p>
            <p>
              <strong>2011–2016:</strong> Google+ networks; @kumar2net on X
              (Twitter) gets active; themes on solitude, thermodynamics in tech,
              Indian elections, water, big data, Chromecast, NSA, and occasional
              rants at Motorola support. Professionally in telecom IP/MPLS.
            </p>
            <p>
              <strong>2017–2020:</strong> AI curiosity deepens (NIPS 2017
              workshops, automation ethics), data sovereignty, de-Googling, and
              Indian FOSS alternatives.
            </p>
            <p>
              <strong>2021–2025:</strong> AI × climate action, local-language
              models, energy-efficient computing, and responsible AI. Still a
              minimalist: solar, small phones, e-ink, cycling/public transport,
              no car. Print loyalist to The Hindu, allergic to dark-pattern
              paywalls.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 text-slate-100 p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-3">
            LLM Ops, bold and transparent
          </h2>
          <p className="text-base leading-relaxed text-slate-200">
            The site is agent-ready: Model Context Protocol (MCP) aware, semantic
            search via Gemini&apos;s{" "}
            <span className="font-semibold">text-embedding-004</span>, TL;DR
            summaries via{" "}
            <span className="font-semibold">OpenAI GPT-5</span>, and WordPress/X
            feeds proxied through custom serverless handlers. You&apos;ll see
            agents cited in blog posts, CLI workflows documented in docs/, and a
            running changelog on the Status page. Ask me anything on{" "}
            <a
              href="https://x.com/kumar2net"
              className="underline decoration-dotted text-blue-300 hover:text-blue-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>{" "}
            or respond via the contact form—I ship in public so you can follow the
            entire experiment.
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default About;

function Year2025() {
  return (
    <Box
      sx={{
        bgcolor: "#0e0f12",
        color: "#e6e6e6",
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" fontWeight={600} gutterBottom>
            2025: From Curiosity to Architecture
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "#9aa4b2", maxWidth: 640, mx: "auto" }}
          >
            A year of systems, depth, and direction
          </Typography>
        </Box>

        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Section
              title="How I Thought"
              items={[
                "Curiosity → Obsession → Clarity",
                "Feynman-level understanding",
                "Questioned universality & anomalies",
                "Rejected shallow explanations",
              ]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Section
              title="What I Built"
              highlight
              items={[
                "Personal platform > personal website",
                "React · Vite · MUI v8",
                "Design tokens & theming battles",
                "Codex CLI · agent-driven workflows",
                "Ship → break → fix → ship",
              ]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Section
              title="Why It Mattered"
              items={[
                "Language-aware AI (Tamil focus)",
                "Family & generational usability",
                "Health-driven pragmatism",
                "Impact & responsibility thinking",
              ]}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 8, borderColor: "#1f2430" }} />

        <Box textAlign="center">
          <Typography
            variant="h5"
            fontWeight={500}
            sx={{ maxWidth: 720, mx: "auto" }}
          >
            2025 wasn’t about visible wins.
            <br />
            It was about positioning for compounding years.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

function Section({ title, items, highlight = false }) {
  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={600}
        gutterBottom
        sx={{ color: highlight ? "#7aa2ff" : "#e6e6e6" }}
      >
        {title}
      </Typography>
      <Box component="ul" sx={{ pl: 2, m: 0 }}>
        {items.map((item) => (
          <Typography
            key={item}
            component="li"
            sx={{
              color: "#b5bcc9",
              mb: 1.2,
              lineHeight: 1.6,
            }}
          >
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
