import { Box, Typography, Stack } from "@mui/material";

const textPrimary = "var(--mui-palette-text-primary)";
const textSecondary = "var(--mui-palette-text-secondary)";

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
        <Box
          component="img"
          src="https://img.shields.io/badge/moral_reasoning-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="moral reasoning badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/michael_sandel-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="michael sandel badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/markets-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="markets badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/meritocracy-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="meritocracy badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/common_good-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="common good badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/tech_ethics-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="tech ethics badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", md: "2.75rem" },
            fontWeight: 700,
            lineHeight: 1.15,
            color: textPrimary,
          }}
        >
          Moral Reasoning Series (Modules 7–10)
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.0625rem", color: textSecondary }}>
          Instructor Style: Michael Sandel–inspired moral reasoning
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.0625rem", color: textSecondary }}>
          Transcript Owner: Kumar. A
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            mb: 1,
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
            7
          </Box>
          Module 7 — Markets, Merit, and Moral Limits
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Core Question
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", color: textPrimary }}>
            Should everything be for sale?
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Transcript
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Let me start with a simple question: should everything be for sale?
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Most of us instinctively say no. But when we examine real cases, that confidence begins to weaken.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Markets are excellent at allocating resources efficiently. The mistake we often make is assuming that
            efficiency equals moral neutrality. It does not.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Markets don’t just allocate goods. They shape values.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Two Moral Objections to Markets
          </Typography>
          <Stack component="ol" spacing={1.25} sx={{ pl: 3 }}>
            <Box component="li" sx={{ color: textPrimary }}>
              <Typography variant="body1" sx={{ fontSize: "1.125rem", fontWeight: 600, color: textPrimary }}>
                The Fairness Objection
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
                Are people choosing freely, or are they choosing under pressure, desperation, or inequality?
              </Typography>
            </Box>
            <Box component="li" sx={{ color: textPrimary }}>
              <Typography variant="body1" sx={{ fontSize: "1.125rem", fontWeight: 600, color: textPrimary }}>
                The Corruption Objection
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
                Some things are degraded when bought and sold because their meaning changes.
              </Typography>
            </Box>
          </Stack>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            When children are paid to read, reading becomes earning. Once the payment stops, so does the motivation.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Key Insight
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            When market logic enters domains like education, health, or citizenship, it changes how we understand them.
            Civic duty becomes transactional. Care becomes a service.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            The real question is not what works, but what kind of society we are becoming.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            mb: 1,
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
            8
          </Box>
          Module 8 — What Do We Owe One Another?
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Core Question
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", color: textPrimary }}>
            Is justice only about fair rules, or also about shared responsibility?
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Transcript
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Meritocracy tells a powerful story: work hard, play by the rules, and success will follow.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            But talent is not earned. Birth circumstances are not chosen. Even effort depends on conditions we did not
            design.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Yet meritocracy encourages winners to believe they fully deserve their success, and losers to internalize
            failure as moral fault.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            This produces moral arrogance at the top and humiliation at the bottom.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Justice Reimagined
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Justice is not only about equal opportunity. It is also about solidarity, mutual dependence, and humility.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            A healthy society acknowledges that success is a collective achievement.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            mb: 1,
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
            9
          </Box>
          Module 9 — Justice, Belonging, and the Common Good
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Core Question
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", color: textPrimary }}>
            Can a society survive if people see themselves only as individuals and not as members of a shared project?
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Transcript
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Modern politics often focuses on rights while neglecting belonging.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Neutrality about values sounds appealing, but it creates a vacuum. People want recognition, not just rights.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            When public life avoids moral language, it leaves space for resentment-driven identities to take over.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            The Common Good
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            A politics of the common good asks difficult questions:
          </Typography>
          <Stack component="ul" spacing={1.25} sx={{ pl: 3 }}>
            <Typography
              component="li"
              variant="body1"
              sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}
            >
              What obligations do we have to future generations?
            </Typography>
            <Typography
              component="li"
              variant="body1"
              sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}
            >
              What kinds of work deserve honor?
            </Typography>
            <Typography
              component="li"
              variant="body1"
              sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}
            >
              What sacrifices should be shared?
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Avoiding these questions does not make a society neutral. It makes it hollow.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            mb: 1,
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
            10
          </Box>
          Module 10 — Moral Reasoning in an Age of Technology
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Core Question
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", color: textPrimary }}>
            As machines make decisions, who is morally responsible?
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Transcript
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Algorithms rank, recommend, hire, and exclude. We often tell ourselves, “the system decided.”
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            But systems are designed. Values are encoded. Trade-offs are chosen.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            Technology does not remove moral responsibility. It obscures it.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: textSecondary }}>
            Closing Reflection
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            The future will not be saved by smarter machines alone.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            It will require citizens capable of moral judgment and public debate about values.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: textPrimary }}>
            The most important skill of the 21st century is not coding. It is moral reasoning.
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ fontStyle: "italic", color: textSecondary }}>
        End of transcript.
      </Typography>
    </Box>
  );
}
