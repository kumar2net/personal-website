import { Box, Typography } from "@mui/material";

const badges = [
  "AI",
  "OpenClaw",
  "Mac mini",
  "Humor",
  "Interfaces",
  "Kitchen",
];

const interfaceOptions = [
  {
    title: "Room mic",
    body: "Hands-free control is the only version that feels like a real step forward while cooking, cleaning, or walking around the house.",
  },
  {
    title: "Wall tablet",
    body: "One tap beats opening a crowded chat app, finding the right thread, and typing a command like I am briefing an intern.",
  },
  {
    title: "Local dashboard",
    body: "If I want text, give me a clean browser panel with status, logs, and controls instead of another notification stream.",
  },
  {
    title: "Quiet routines",
    body: "The best automation is boring. It notices patterns, does the small thing well, and does not ask me for permission every ten minutes.",
  },
];

export const metadata = {
  slug: "2026-03-22-kumclaw-worthwhile-use-case",
  title: "KumClaw and the Search for a Worthwhile Use Case",
  description:
    "KumClaw stays on my future-project list, but a Mac mini running OpenClaw does not impress me if the interface is just WhatsApp or Telegram. Wake me up when it can make oats கஞ்சி and a respectable ராகி கூழ்.",
  excerpt:
    "KumClaw stays on my future-project list, but a Mac mini running OpenClaw does not impress me if the interface is just WhatsApp or Telegram. Wake me up when it can make oats கஞ்சி and a respectable ராகி கூழ்.",
  tags: ["AI", "OpenClaw", "Mac mini", "Humor", "Kitchen", "Interfaces"],
  datePublished: "2026-03-22",
  dateModified: "2026-03-22",
  image: "/generate/2026-03-22-kumclaw-worthwhile-use-case-hero.png",
  readingTime: "~3 min",
};

const bodyTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.85,
  color: "var(--mui-palette-text-primary)",
};

function Bubble({ children }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        fontWeight: 700,
        fontSize: "1.125rem",
        boxShadow: 2,
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

function SectionHeading({ number, children }) {
  return (
    <Typography
      variant="h2"
      sx={{
        fontSize: { xs: "1.5rem", md: "1.875rem" },
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 0,
      }}
    >
      <Bubble>{number}</Bubble>
      {children}
    </Typography>
  );
}

function Figure({ src, alt, caption }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "var(--mui-palette-background-paper)",
        boxShadow: 2,
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        sx={{
          width: "100%",
          display: "block",
        }}
      />
      <Typography
        variant="caption"
        sx={{
          px: 2.5,
          pb: 2,
          color: "var(--mui-palette-text-secondary)",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        {caption}
      </Typography>
    </Box>
  );
}

function InterfaceCard({ title, body }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "var(--mui-palette-background-paper)",
        border: "1px solid",
        borderColor: "var(--mui-palette-divider)",
        boxShadow: 1,
        display: "grid",
        gap: 1,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontSize: "1.05rem",
          fontWeight: 700,
          m: 0,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "var(--mui-palette-text-secondary)",
          lineHeight: 1.75,
        }}
      >
        {body}
      </Typography>
    </Box>
  );
}

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {badges.map((badge) => (
          <Box
            key={badge}
            component="img"
            src={`https://img.shields.io/badge/${encodeURIComponent(
              badge,
            )}-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white`}
            alt={`${badge} badge`}
            loading="lazy"
            decoding="async"
            sx={{ height: 28, width: "auto" }}
          />
        ))}
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", md: "2.6rem" },
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            m: 0,
          }}
        >
          KumClaw and the Search for a Worthwhile Use Case
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          I am parking <strong>KumClaw</strong> under future projects, but with
          one raised eyebrow. I still do not see a use case that feels solid
          enough to deserve the wiring, attention, and inevitable demo theatre.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The idea is fun. The stack is fine. The problem is simpler: I am not
          yet convinced the problem is worthwhile.
        </Typography>
      </Box>

      <Figure
        src="/generate/2026-03-22-kumclaw-worthwhile-use-case-hero.png"
        alt="Playful AI illustration of a Mac mini powered home automation assistant in a kitchen with steaming oats kanji and ragi porridge on the counter"
        caption="My benchmark for domestic AI is not a demo reel. It is breakfast."
      />

      <Box component="section" sx={{ display: "grid", gap: 2 }}>
        <SectionHeading number="1">
          My bar is not beer. It is breakfast.
        </SectionHeading>
        <Typography variant="body1" sx={bodyTextSx}>
          Peter Steinberger had a nice beer test for machines like this. Fair
          enough. My benchmark is more kitchen-table and less Silicon Valley. If
          KumClaw can wake up before me and make a proper bowl of oats{" "}
          <span lang="ta">கஞ்சி</span>, then we can begin the conversation.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          If it graduates to a respectable <span lang="ta">ராகி கூழ்</span>,
          or something close to <em>ragi mudde</em> as my rusty Kannada memory
          still insists, I may even stop teasing the idea. Until then, I remain
          politely unimpressed.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 2.5 }}>
        <SectionHeading number="2">
          A WhatsApp bot is not a control plane.
        </SectionHeading>
        <Typography variant="body1" sx={bodyTextSx}>
          Using WhatsApp or Telegram as a text interface to talk to OpenClaw
          running on a Mac mini does not enthuse me one bit. That is not a leap
          forward. That is a remote control with profile pictures.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          I can already achieve the same thing in half a dozen less theatrical
          ways. If the experience begins with opening a chat thread and typing
          <em>turn off the AC</em>, then the machine has not earned its keep. It
          has merely moved the switch into a messaging app.
        </Typography>
        <Figure
          src="/generate/2026-03-22-kumclaw-worthwhile-use-case-chat.png"
          alt="Editorial AI illustration of a tired smartphone showing WhatsApp and Telegram home control chats while a small Mac mini sits in the background"
          caption="If home automation looks like another unread chat thread, the future can wait."
        />
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 2.5 }}>
        <SectionHeading number="3">
          What would actually make KumClaw interesting
        </SectionHeading>
        <Typography variant="body1" sx={bodyTextSx}>
          The version that interests me does not shout. It disappears into the
          room, handles the boring bits well, and steps in only when it truly
          reduces friction.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          {interfaceOptions.map((option) => (
            <InterfaceCard
              key={option.title}
              title={option.title}
              body={option.body}
            />
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          So yes, I am keeping my fingers crossed. This is a light-hearted dig,
          not a burial note. The day KumClaw starts solving small domestic
          frictions with grace, and perhaps manages breakfast without turning my
          house into a chat app, I will happily upgrade my opinion.
        </Typography>
      </Box>
    </Box>
  );
}
