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
        
        <Box
          component="img"
          src="https://img.shields.io/badge/Dilbert-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Dilbert badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/OPOS-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="OPOS badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Education-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Education badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Culture-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Culture badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Gen_Alpha-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Gen Alpha badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Universities-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Universities badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
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
          Remembering Scott Adams and the Charm of Dilbert
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Scott Adams' farewell letter stopped me mid-scroll. The health news made the goodbye heavier. Dilbert used to live in the finance paper at my office reception. The Pointy-Haired Boss was a mirror I did not expect to enjoy. I smiled because the jokes were too close to home. Writing ten percent as clean as Adams would be a win. I saved his writing tips in an earlier post if you want them. These small notes kept me steady this week.
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
          The One-Pot One-Shot Cooking Innovation
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          A YMCA table tennis friend once lived in the same Kodambakkam flat as Ramakrishnan of OPOS. When a Birmingham friend tried OPOS, I thought of that link. OPOS means One Pot One Shot. It uses a 2-liter pressure cooker and a fixed order of ingredients. The tools and recipe cards are standardized so results repeat. Ramakrishnan runs the 'United by Food' Facebook group and holds the patent and copyright. My friend was so grateful he brewed filter coffee at 5 a.m. and left it at Ranga's door.
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
          Challenges and Hope in Indian Education
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          India has over 40 million students in higher education. Over 10 million more enter the labor market each year. Skills, confidence, and networks matter as much as degrees. A bright 6th grader reminded me of that. Her teacher sends homework to parents through WhatsApp. She waits for her dad to return from work before she starts. I reset my unused Lenovo laptop and spent 20 minutes showing her the basics with her electrician-plumber father. She used one finger on the trackpad at first, so I nudged her to try two. The grin did the rest. She loves math and her teacher loves her back. For projects she scans her work and messages it to a local print shop. Simple tools still open doors.
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
          The Charm of Old-School Daily Calendars
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Old daily sheet calendars still impress me. Each page packed dates, festivals, and tiny data points. Local merchants gifted them, a quiet community ritual. I doubt it happens now.
        </Typography>
        <Box
          component="img"
          src="/media/dailysheet.jpg"
          alt="Daily sheet calendar"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            textAlign: "center",
            fontStyle: "italic",
            color: "var(--mui-palette-text-secondary)",
          }}
        >
          Daily sheet calendar from the good old days.
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
            5
          </Box>
          New Fitness Trends and a Touch of Humor
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          A young cousin told me she now does Lagree instead of Pilates. I had never heard the word. We laughed at the line, "the muscles you never knew existed will send you an invoice." Fitness keeps inventing new ways to humble us.
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
            6
          </Box>
          Words of Wisdom from Chennai Welfare Association
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          A Chennai welfare association shared a sequence of Pongal lines. The words praised work, love, humility, courage, and humanity. I felt the warmth even without reading them aloud. Tradition still knows how to hold a community.
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
            7
          </Box>
          Learning Gen Alpha Slang
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Gen Alpha slang has been a puzzle for me. A bright boy coached me through it. He once delivered a school speech entirely in that slang. It was funny and a little humbling.
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
            8
          </Box>
          Universities and the Changing Value Proposition
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          A line I read keeps echoing. Universities thought they sold knowledge until information went free. They pivoted to credentials, but credentials are now proxies. In a post-AI world the survivors will sell three things: networks, status signals, and four protected years to become an adult. The real product is time, and time is the rarest thing left.
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/generate/2026-01-17-reflections-dilbert-one-pot-cooking-unexpected-lessons.png"
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
            color: "var(--mui-palette-text-secondary)",
          }}
        >
          AI Generated Illustration
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Self-check
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography
            component="li"
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "var(--mui-palette-text-primary)",
            }}
          >
            Hook: opening line stops the scroll with the Dilbert farewell.
          </Typography>
          <Typography
            component="li"
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "var(--mui-palette-text-primary)",
            }}
          >
            One point: each vignette shows a small moment that steadied me.
          </Typography>
          <Typography
            component="li"
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "var(--mui-palette-text-primary)",
            }}
          >
            Short sentences: most lines carry one idea.
          </Typography>
          <Typography
            component="li"
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "var(--mui-palette-text-primary)",
            }}
          >
            Active voice: subjects act and verbs stay concrete.
          </Typography>
          <Typography
            component="li"
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "var(--mui-palette-text-primary)",
            }}
          >
            Filler cut: hedges and throat-clearing words are trimmed.
          </Typography>
          <Typography
            component="li"
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "var(--mui-palette-text-primary)",
            }}
          >
            Simple words: plain language wins over jargon.
          </Typography>
          <Typography
            component="li"
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "var(--mui-palette-text-primary)",
            }}
          >
            No cliches: avoided stock phrases and corporate tone.
          </Typography>
          <Typography
            component="li"
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "var(--mui-palette-text-primary)",
            }}
          >
            Ending: last line names time as the scarce product without a wrap-up.
          </Typography>
        </Box>
      </Box>

    </Box>
  );
}
