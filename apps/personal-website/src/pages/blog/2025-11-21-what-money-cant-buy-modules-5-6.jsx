import { Box, Typography } from "@mui/material";

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
        {[
          "Michael Sandel",
          "Ethics",
          "Markets",
          "AI & Society",
          "Family Values",
        ].map((tag) => {
          const label = encodeURIComponent(tag.replace(/\s+/g, "_"));
          const badgeUrl = `https://img.shields.io/badge/${label}-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white`;
          return (
            <Box
              key={tag}
              component="img"
              src={badgeUrl}
              alt={`${tag} badge`}
              loading="lazy"
              decoding="async"
              sx={{ height: 28, width: "auto" }}
            />
          );
        })}
      </Box>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{
              display: "flex",
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
            }}
          >
            1
          </Box>
          What Money Can’t Buy — Modules 5 & 6
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          This post keeps the original dialog intact—Prof. Michael Sandel’s questions, my verbatim replies, and ChatGPT’s moderation—so the roles are clear and easy to scan.
        </Typography>
      </Box>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{
              display: "flex",
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
            }}
          >
            2
          </Box>
          Module 5 — The Case Against Market Triumphalism
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
        >
          Prof. Sandel asks
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "text.primary",
            mb: 2,
          }}
        >
          “What happens when the logic of markets invades spheres of life where it doesn’t belong?”
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
        >
          Kumar A. replies (verbatim)
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "text.primary",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mb: 2,
          }}
        >
          <span>
            <strong>1. Hospitals chasing occupancy metrics.</strong> Hospitals today operate like revenue-maximizing enterprises — tracking bed occupancy ratios like airlines track seat yield. As a result, some keep patients longer than medically necessary. The moral purpose of healthcare gets hijacked by commercial efficiency.
          </span>
          <span>
            <strong>2. Healthcare as the most distorted sector.</strong> To me, this is the area where market logic does the most damage. Vulnerable patients + huge profit incentives create a space where moral purpose is constantly compromised.
          </span>
          <span>
            <strong>3. Influencers and the loss of authenticity.</strong> Influencer culture has turned real life into a monetizable product. Emotions are optimized for views. Authenticity feels rare.
          </span>
          <span>
            <strong>4. My rule for family interactions.</strong> Family communication on my platform stays strictly human-first. No monetization, no algorithmic nudging, no gamification. This is my way of keeping connections genuine across Gen Z and millennial relatives.
          </span>
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
        >
          ChatGPT’s moderation
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "text.primary",
          }}
        >
          Your observations illustrate exactly what Prof. Sandel warns about: markets don’t just allocate goods — they shape attitudes, and in sectors like healthcare, they quietly twist the moral mission of institutions. Your commitment to keeping family spaces non-transactional mirrors the civic boundaries Sandel argues society desperately needs.
        </Typography>
      </Box>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{
              display: "flex",
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
            }}
          >
            3
          </Box>
          Module 6 — Morality, Markets, and What We Owe One Another
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
        >
          Prof. Sandel asks
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "text.primary",
            mb: 2,
          }}
        >
          “If markets can corrupt values, what principles should guide us instead?” “Can efficiency ever be a moral compass?” “Why must societies revive moral reasoning in public life instead of hiding behind economics or algorithms?”
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
        >
          Kumar A. replies (verbatim)
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "text.primary",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mb: 2,
          }}
        >
          <span>
            <strong>1. Lack of moral courage around bribery.</strong> Only a small percentage of people dare to confront bribery or corruption openly. Most accept it as “That’s how the system works.” That’s the real tragedy.
          </span>
          <span>
            <strong>2. AI creeping into emotional communication.</strong> People now use generative AI to write WhatsApp messages, festival wishes, condolences, even apologies. Convenient? Yes. But it feels like outsourcing emotional effort — and that weakens relationships.
          </span>
          <span>
            <strong>3. Authenticity &gt; perfection.</strong> We don’t need to be perfect or polished all the time. Being real is more valuable than being optimized.
          </span>
          <span>
            <strong>4. FOMO and device addiction are harming rapport.</strong> Youngsters live inside hyper-personalized feeds. Real conversation skills, empathy, and eye contact are fading. It’s becoming harder for them to build real-world rapport.
          </span>
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
        >
          ChatGPT’s moderation
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "text.primary",
          }}
        >
          These insights align directly with Prof. Sandel’s warning: when corruption becomes normal, civic morality collapses. When AI mediates emotional life, we risk losing sincerity and vulnerability. When optimization becomes the default, authenticity becomes rare and courageous. When screens dominate attention, the shared civic space shrinks. Your insistence on human-first family interactions is exactly the type of moral boundary Sandel believes societies must reclaim.
        </Typography>
      </Box>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{
              display: "flex",
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
            }}
          >
            4
          </Box>
          TL;DR (verbatim)
        </Typography>
        <Typography
          component="pre"
          sx={{
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "text.primary",
            whiteSpace: "pre-wrap",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
{`> - **Prof. Sandel:** Markets can corrupt values when allowed into healthcare, influencers, or relationships.
> - **Kumar A.:** Authenticity, dignity, and ethics matter more than efficiency — especially in family and community spaces.
> - **ChatGPT:** In 2025, AI, optimization culture, and device addiction amplify these risks.
> - Bottom line: Some things — especially family ties — must remain **human-first**, not monetized or automated.`}
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/generate/2025-11-21-what-money-cant-buy-modules-5-6.png"
          alt="AI Generated Illustration"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
            aspectRatio: "1 / 1",
            objectFit: "cover",
          }}
        />
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            textAlign: "center",
            fontStyle: "italic",
            color: "text.secondary",
          }}
        >
          AI Generated Illustration
        </Typography>
      </Box>
    </Box>
  );
}
