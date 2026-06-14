import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-06-14-tech-ai-news-digest",
  title: "The Week AI Became Infrastructure",
  description:
    "A June 8-14, 2026 digest of technology and AI news: Apple brings AI deeper into the operating system, OpenAI eyes the public markets, Anthropic hits the export-control wall, Microsoft pushes in-house models, Google keeps moving on research, and security teams face AI-native risk.",
  excerpt:
    "This week's technology news was less about one magic model and more about AI becoming infrastructure: in phones, work software, capital markets, national security, and cybersecurity.",
  tags: ["AI", "Technology", "OpenAI", "Apple", "Microsoft", "Anthropic", "Cybersecurity"],
  datePublished: "2026-06-14",
  dateModified: "2026-06-14",
  image: "/media/generated/2026-06-14-tech-ai-news-digest-hero.png",
  readingTime: "~6 min",
};

const title = "The Week AI Became Infrastructure";

const sources = [
  {
    label: "Apple WWDC 2026 newsroom",
    href: "https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/",
  },
  {
    label: "OpenAI confidential S-1 announcement",
    href: "https://openai.com/index/openai-submits-confidential-s-1/",
  },
  {
    label: "OpenAI June 2026 threat report",
    href: "https://openai.com/index/prc-linked-influence-operations-ai-debates/",
  },
  {
    label: "Anthropic Claude Fable 5 and Mythos 5",
    href: "https://www.anthropic.com/news/claude-fable-5-mythos-5",
  },
  {
    label: "Anthropic government directive statement",
    href: "https://www.anthropic.com/news",
  },
  {
    label: "Microsoft Build 2026 blog",
    href: "https://blogs.microsoft.com/blog/2026/06/02/microsoft-build-2026-be-yourself-at-work/",
  },
  {
    label: "Google DeepMind news",
    href: "https://deepmind.google/blog/",
  },
  {
    label: "BleepingComputer on Langflow CVE-2026-5027",
    href: "https://www.bleepingcomputer.com/news/security/path-traversal-flaw-in-ai-dev-platform-langflow-exploited-in-attacks/",
  },
];

const highlights = [
  {
    heading: "Apple moved the AI battle into the operating system",
    body:
      "Worldwide Developers Conference week made one thing clear: Apple wants Artificial Intelligence (AI) to feel less like a separate chatbot and more like a layer inside the device. The headline was the next generation of Apple Intelligence and a more capable Siri AI. The interesting part is not only the assistant itself, but the direction of travel: private-device context, app-level actions, visual understanding, writing help, and safer child-facing controls as part of the platform.",
  },
  {
    heading: "OpenAI started looking like a public-market company",
    body:
      "OpenAI confirmed that it submitted a confidential draft S-1 to the United States Securities and Exchange Commission, which keeps the initial public offering option open without committing to timing. That changes how every future product move will be read. Memory, agents, enterprise deployments, safety incidents, and capital spending now sit inside the same story: can a frontier AI lab become a durable public company without weakening its mission or its trust?",
  },
  {
    heading: "Anthropic showed the national-security ceiling",
    body:
      "Anthropic launched Claude Fable 5 and Claude Mythos 5 on June 9, then posted an update that access was unavailable on June 12. The company's newsroom says the United States government issued an export-control directive to suspend access to Fable 5 and Mythos 5. That is a sharp reminder that frontier models are no longer just software releases. They are being treated like strategic technology, with model access, citizenship, research use, and national security now tangled together.",
  },
  {
    heading: "Microsoft signaled it does not want to be only an OpenAI wrapper",
    body:
      "Microsoft's Build 2026 messaging matters because it points to a more independent model stack. The company described a family of seven in-house models from the Microsoft AI Superintelligence Team, including MAI-Thinking-1, its first reasoning model. The enterprise pitch is obvious: customers want AI features in Office, Windows, security, and developer tools, but they also want predictability, compliance, and a vendor that can control its own roadmap.",
  },
  {
    heading: "Google kept shipping research, but reliability is now part of the product",
    body:
      "Google DeepMind's June updates include work on multi-agent safety research, faster text generation, voice translation, and learning impact. That research pipeline is still formidable. But the wider Gemini conversation this week also shows a harder truth for every AI provider: once people depend on assistants for work, outages and confusing product tiers become part of the competitive scorecard, not background noise.",
  },
  {
    heading: "AI security moved from theory to exposed infrastructure",
    body:
      "The security story of the week was not science fiction. BleepingComputer reported active exploitation of CVE-2026-5027, a path traversal flaw in Langflow, a framework for building AI applications and workflows. This is the practical side of the agentic AI boom: every visual workflow builder, model gateway, plugin server, and automation layer becomes another place where credentials, files, and internal systems can leak if teams deploy first and govern later.",
  },
];

const takeaways = [
  "The winning AI products are becoming ambient. They sit inside operating systems, browsers, office suites, coding tools, search, and customer workflows.",
  "Capital is becoming part of the product story. Training runs, inference cost, data-center access, and public-market expectations are now central to AI strategy.",
  "Governments are moving from speeches to controls. Export rules, safety directives, procurement standards, and security timelines will shape who can use the strongest models.",
  "Agent security is the new cloud security. AI agents need identity, logging, permission boundaries, patching discipline, and human escalation paths.",
  "Reliability is a feature. A model that is brilliant but unavailable, confusing, or hard to govern will lose serious users to a slightly less flashy system that works every day.",
];

const bodyTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "var(--mui-palette-text-primary)",
};

const sectionIntroSx = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "var(--mui-palette-text-secondary)",
};

const calloutSx = {
  borderLeft: "4px solid var(--mui-palette-primary-main)",
  pl: 2,
  py: 1.5,
  backgroundColor: "var(--mui-palette-action-hover)",
  borderRadius: 1,
};

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Box
        component="img"
        src="/media/generated/2026-06-14-tech-ai-news-digest-hero.png"
        alt="Editorial illustration of AI infrastructure, chips, cloud servers, software agents, and cybersecurity signals"
        loading="eager"
        decoding="async"
        sx={{
          width: "100%",
          aspectRatio: "16 / 9",
          objectFit: "cover",
          borderRadius: 2,
          boxShadow: 3,
        }}
      />

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.875rem", md: "2.5rem" },
            fontWeight: 700,
            lineHeight: 1.2,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          {title}
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          A technology and AI digest for June 8-14, 2026.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            This week was not about one dazzling demo. It was about AI hardening into
            infrastructure: inside devices, enterprise software, capital markets, national security,
            and the attack surface of everyday applications.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The week in six moves
        </Typography>
        {highlights.map((item, index) => (
          <Box key={item.heading} sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.25rem", md: "1.45rem" },
                fontWeight: 650,
                lineHeight: 1.35,
              }}
            >
              {index + 1}. {item.heading}
            </Typography>
            <Typography variant="body1" sx={bodyTextSx}>
              {item.body}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          My read
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The old AI question was: which model is smartest? The better 2026 question is: which AI
          system is usable, governable, affordable, secure, and available when the user needs it?
          That is why Apple, Microsoft, Google, OpenAI, and Anthropic are suddenly competing across
          more than benchmarks.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Apple is trying to make AI feel native. Microsoft is trying to make it enterprise-safe and
          less dependent on one outside lab. OpenAI is preparing for the financial discipline that
          comes with scale. Anthropic is discovering how quickly safety claims can become government
          policy territory. Google is still a research powerhouse, but consumer trust now depends on
          reliability as much as capability.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What to watch next
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {takeaways.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Sources
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {sources.map((source) => (
            <Typography key={source.href} component="li" variant="body1" sx={bodyTextSx}>
              <Box
                component="a"
                href={source.href}
                target="_blank"
                rel="noreferrer noopener"
                sx={{ color: "inherit" }}
              >
                {source.label}
              </Box>
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
