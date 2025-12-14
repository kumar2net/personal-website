import { Box, Typography, Stack, Paper, Link } from "@mui/material";

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
          src="https://img.shields.io/badge/December_musings-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="December musings badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Margazhi_music-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Margazhi music badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/aviation-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="aviation badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/mental_models-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="mental models badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.875rem", md: "2.5rem" },
            fontWeight: 700,
            lineHeight: 1.2,
            color: "text.primary",
          }}
        >
          Blog post topics hints: December musings
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
          }}
        >
          December and Marghazhi music season
        </Typography>
        <Stack spacing={1.25} component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            The Music academy is inviting AR Rahman to inaugurate this season and I seem accepting the fact that they need to cater to broader audiences - if they want the youngsters to attend.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Bands of Cooum is also being slated for performance - that&apos;s a huge surprise to me.
          </Typography>
        </Stack>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
          }}
        >
          Janaki patti is spamming me
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.primary" }}
        >
          Janaki patti is spamming me these days -but I end up reading their newsletter, maybe I love the retro feel. I think the Gen Z in her family is taking this e-commerce initiative to next level with nifty mobile apps and shipping mixture, murukku, athirasam all over the world
        </Typography>
        <Box
          component="img"
          src="/media/SKC_JanakiPatti.png"
          alt="SKC Janaki Patti snacks shipping worldwide"
          loading="lazy"
          decoding="async"
          sx={{
            width: "100%",
            height: "auto",
            maxWidth: "100%",
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: (theme) =>
              theme.palette.mode === "dark" ? theme.shadows[8] : theme.shadows[3],
          }}
        />
        <Stack spacing={1}>
          <Link
            href="https://drive.google.com/file/d/1Vb_ftOnDw8uUOEtZaXNOM318qarGv1Yu/view"
            target="_blank"
            rel="noreferrer"
            underline="hover"
            sx={{
              fontSize: "0.95rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              📮
            </Box>
            Open the SKC Janaki Patti newsletter (Google Drive)
          </Link>
        </Stack>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
          }}
        >
          On Indigo saga my 2 cents.
        </Typography>
        <Stack spacing={1.25} component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            I know this clear in my mind - you can choose only one of these 2 - Price or Quantity. So India wanted desperately a Low Cost Airline ( LCA) in they did that t well, common man could fly due to lower price points and they are at 65% market share - almost a monopoly. Their ontime record is fantastic and got us from Place A to B with no frills.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            The moot point is you need scaling to achieve efficiency and it&apos;s the government which is responsible for putting checks and balances in place. We know with the kind of corruption prevalent in our country - things just won&apos;t get monitored and rules/policies enforced. That&apos;s the root of the problem
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            But having another 10 more airlines is THE solution? How that can make viable business for everyone.
          </Typography>
        </Stack>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          gap: 2.25,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
          }}
        >
          A clean, no-nonsense summary of PolymathInvestor&apos;s framework on &quot;how to understand anything&quot;
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.primary" }}
        >
          It&apos;s less about memorization and more about building mental leverage. And summarixe it crisply for Gen Z and millenial users
        </Typography>

        <Stack spacing={2.25}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              1. Start With First Principles (Not Definitions)
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Don&apos;t begin with textbook definitions. Start by asking:
            </Typography>
            <Stack spacing={0.75} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                What problem does this exist to solve?
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                What would reality look like if this didn&apos;t exist?
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7, mt: 1 }}>
              Understanding flows from necessity, not vocabulary. If you can&apos;t explain why something exists, you don&apos;t understand it.
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              2. Reduce It to the Smallest Moving Parts
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Everything complex is built from a few primitives. Break things down into:
            </Typography>
            <Stack spacing={0.75} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Inputs
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Processes
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Outputs
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Constraints
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Incentives
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7, mt: 1 }}>
              If it still feels confusing, you haven&apos;t reduced it far enough.
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              3. Identify the Core Variable That Actually Matters
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Most systems look complicated because we focus on the wrong variables. Ask:
            </Typography>
            <Stack spacing={0.75} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                What variable, if changed, would disproportionately affect the outcome?
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                What do experts obsess over quietly?
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7, mt: 1 }}>
              That variable is the lever.
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              4. Learn the Mental Models, Not the Facts
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Facts expire. Models compound. Examples:
            </Typography>
            <Stack spacing={0.75} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Incentives
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Feedback loops
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Trade-offs
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Non-linear effects
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Second-order consequences
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7, mt: 1 }}>
              Once you have the model, facts plug themselves in.
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              5. Understand Incentives Before Behavior
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              People, systems, and markets do exactly what they&apos;re incentivized to do. If behavior seems irrational:
            </Typography>
            <Stack spacing={0.75} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                You&apos;re missing an incentive
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Or misunderstanding the payoff structure
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7, mt: 1 }}>
              This single lens explains politics, markets, organizations, and tech adoption.
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              6. Use Analogies Across Domains
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Deep understanding shows up as transferability. If you truly understand something, you can explain it using:
            </Typography>
            <Stack spacing={0.75} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Biology
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Physics
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Economics
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Everyday life
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7, mt: 1 }}>
              Analogies reveal structure. Memorization hides ignorance.
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              7. Ask &quot;Comed to What?&quot;
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Nothing makes sense in isolation. Always come:
            </Typography>
            <Stack spacing={0.75} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Alternatives
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Opportunity cost
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Counterfactuals
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7, mt: 1 }}>
              Understanding is relative, not absolute.
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              8. Teach It Simply (Feynman Test)
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              If you can&apos;t explain it to:
            </Typography>
            <Stack spacing={0.75} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                a smart 12-year-old
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                or in 3-5 sentences
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7, mt: 1 }}>
              You don&apos;t understand it yet. Clarity is a ruthless filter.
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              9. Seate Signal From Noise
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Most information is noise masquerading as insight. PolymathInvestor&apos;s rule:
            </Typography>
            <Stack spacing={0.75} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Ignore opinions
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Ignore headlines
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Ignore narratives
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7, mt: 1 }}>
              Focus on:
            </Typography>
            <Stack spacing={0.75} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Data
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Structure
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Incentives
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Long-term dynamics
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1,
              }}
            >
              10. Revisit With Better Questions
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Understanding is iterative. Each pass should:
            </Typography>
            <Stack spacing={0.75} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Remove assumptions
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Reduce complexity
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.6 }}>
                Improve prediction ability
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7, mt: 1 }}>
              If your understanding doesn&apos;t help you predict or decide, it&apos;s incomplete.
            </Typography>
          </Box>
        </Stack>

        <Box>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.2rem", md: "1.35rem" },
              fontWeight: 700,
              mb: 1,
            }}
          >
            One-Line Summary
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Understand the problem → reduce to primitives → identify incentives → apply mental models → test via explanation.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
