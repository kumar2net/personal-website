import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-06-06-reply-ai-public-good-sanjaay-babu",
  title: "Reply: AI Access Is Not Enough. Public AI Needs Citizens Too.",
  description:
    "A reply to Sanjaay Babu's essay on AI as an individual right versus a collective public good: public AI infrastructure matters, but basic access still matters because citizens must be able to use, test, and contest the systems built in their name.",
  excerpt:
    "A reply to Sanjaay Babu's essay on AI as an individual right versus a collective public good: public AI infrastructure matters, but basic access still matters because citizens must be able to use, test, and contest the systems built in their name.",
  tags: ["Reply", "AI", "Public Goods", "Governance", "Digital Public Infrastructure"],
  datePublished: "2026-06-06",
  dateModified: "2026-06-06",
  image: "/media/blogwordcloud.png",
  readingTime: "~4 min",
};

const title = "Reply: AI Access Is Not Enough. Public AI Needs Citizens Too.";

const sourceUrl = "https://www.sanjaaybabu.com/writing/ai-collective-vs-individual-right";

const tags = ["Reply", "AI", "Public Goods", "Governance", "Digital Public Infrastructure"];

const agreementPoints = [
  "A government-sponsored login to a premium chatbot will not level the playing field by itself.",
  "The gap between casual users and power users is real. It is not only about subscription price; it is about workflow imagination, domain knowledge, confidence, and time.",
  "The public-good frame is stronger than a narrow individual-right frame because the biggest gains from AI may come through health, education, tax, welfare delivery, research, and small-business productivity.",
];

const risks = [
  "If public AI is only built inside ministries, citizens may experience it as another opaque government system.",
  "If access is only routed through public-service portals, people may never build the everyday fluency needed to question, compare, and improve those systems.",
  "If procurement goes to a few large vendors, public AI can quietly become a private monopoly wearing public clothes.",
];

const policyBundle = [
  "A baseline AI account or allowance for citizens, students, teachers, and small businesses, with extra support where cost is a real barrier.",
  "Public AI tools for high-friction services: taxes, benefits, court paperwork, health navigation, local-language translation, and school support.",
  "Open evaluation, public audits, and clear appeal routes whenever AI affects a citizen's entitlement, application, diagnosis, or official record.",
  "Compute, datasets, and model access for universities, hospitals, public-interest researchers, and small firms, not only large corporations.",
  "AI literacy as a civic skill: not just prompt tricks, but knowing when a model is useful, when it is bluffing, and when a human decision-maker must remain accountable.",
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
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {tags.map((tag) => {
          const label = encodeURIComponent(tag.replace(/\s+/g, "_"));
          return (
            <Box
              key={tag}
              component="img"
              src={`https://img.shields.io/badge/${label}-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white`}
              alt={`${tag} badge`}
              loading="lazy"
              decoding="async"
              sx={{ height: 28, width: "auto" }}
            />
          );
        })}
      </Box>

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
        <Typography variant="body1" sx={bodyTextSx}>
          Source:{" "}
          <Box
            component="a"
            href={sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            sx={{ color: "inherit" }}
          >
            {sourceUrl}
          </Box>
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            Sanjaay is right that AI policy should not stop at handing out logins. But I would not
            throw away the access argument. Public AI needs public infrastructure and public users.
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          Sanjaay&apos;s essay makes an important correction to the usual AI-access debate. The
          question is not simply whether every citizen should get a premium chatbot subscription.
          That is too thin a definition of fairness. Some people will use AI like a search box, some
          will use it like a personal staff, and some will barely touch it. A login alone cannot erase
          that gap.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          I agree with the broader move: governments should treat AI as public infrastructure. But I
          think the individual-right frame still has a useful role. The better policy is not access
          versus public good. It is access as one layer of the public good.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Where I agree
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The essay is strongest when it refuses to confuse equality of access with equality of
          capability.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {agreementPoints.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          But citizens still need direct access
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          My worry is that &quot;AI as a public good&quot; can become too state-centered if we are not
          careful. It can sound like the government will build AI into public services and citizens
          will merely receive the output. That is not enough.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          In a democracy, citizens should not only be beneficiaries of AI systems. They should be
          users, testers, critics, and co-designers. If an AI assistant helps someone file taxes,
          apply for a subsidy, translate a legal notice, or understand a medical instruction, the
          citizen needs enough direct familiarity with AI to know when the answer feels wrong and how
          to escalate it.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            Public AI without citizen fluency risks becoming another black box. Access is not the
            whole answer, but it is part of accountability.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The public-good frame has its own traps
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          Moving beyond individual access is right. But the public-good approach can fail in familiar
          ways.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {risks.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          India&apos;s digital public infrastructure story is useful here. Unified Payments Interface
          worked not only because the state and regulators enabled the rails, but because ordinary
          people and small merchants could actually use those rails every day. The same logic should
          apply to AI.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What I would actually do
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          A serious AI policy should look less like one scheme and more like a layered bundle.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {policyBundle.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The better sentence
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          So I would rephrase the debate this way: AI should not be treated only as an individual
          consumer entitlement, but citizens should have a right to meaningful participation in the AI
          infrastructure that increasingly shapes public life.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          That includes access. It also includes public tools, public compute, public audits, local
          language capability, grievance systems, and the boring state capacity needed to make all of
          this work. A free chatbot login is too small. A public AI system that citizens cannot
          understand or challenge is too distant. The useful middle is public infrastructure with
          citizens inside the loop.
        </Typography>
      </Box>
    </Box>
  );
}
