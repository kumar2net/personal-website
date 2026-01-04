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
          src="https://img.shields.io/badge/New_Year-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="New Year badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Ayurveda-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Ayurveda badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Geopolitics-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Geopolitics badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Politics-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Politics badge"
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
          src="https://img.shields.io/badge/Festivities-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Festivities badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Football_World_Cup-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Football World Cup badge"
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
          Happiest Health and Ayurveda in 2026
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          As we begin 2026, I found myself revisiting Happiest Health's Ayurveda tips. There's been a lot of anti-AYUSH sentiment lately, especially from allopathy practitioners in India. It's a complex debate, so I encourage everyone to use their own discretion when considering these traditional health tips.
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
          The Calculus Direct and the Education Mountain
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          I'm reading "The Calculus Direct: An Intuitively Obvious Approach to a
          Basic Understanding of the Calculus for the Casual Observer" by John
          Weiss, and the preface stopped me. The argument is blunt: calculus is
          the core of modern technical literacy, yet students are forced through
          years of prerequisite math that can dull curiosity. I found the
          critique provocative, especially the call to rethink what we make
          students climb before they reach the summit.
        </Typography>
        <Typography
          variant="body1"
          component="blockquote"
          sx={{
            mt: 2,
            fontSize: "1.05rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-secondary)",
            borderLeft: "4px solid var(--mui-palette-divider)",
            pl: 2,
          }}
        >
          Preface: The idea for this book was formulated from my experience as
          an adjunct mathematics instructor at Northwest Vista community
          college. I became involved with the developmental mathematics in 2006
          and was appalled to learn that a student without strong mathematical
          skills who hoped to attain a technological degree had to complete 7
          semesters of mathematics to advance through calculus. This is worrisome
          because the calculus is the most important subject in modern education.
          Physics, engineering, biology, rocket science, and the electrical and
          computer systems that govern our lives derive all of their abilities
          from the calculus and not the algebras. With mastery of the calculus
          entire subjects are laid bare for the student to easily grasp. Because
          of this, developing a competent student in this area is critical in
          our modern world. Unfortunately the calculus is placed at the top of a
          mountain of mediocre material that systematically bores and frustrates
          the average prospective student to the point of hating mathematics.
          Although this "mediocre material" is useful in some respects it is not
          critical to the modern mind. Just as Latin has fallen from a required
          part of education in our modern times so must most of the "curious"
          but altogether useless algebraic puzzles that we constantly harass the
          modern student with. I make the statement that if we are ever to raise
          the average student to an appreciable technical understanding we must
          shun our antiquated embrace of...
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Start reading it for free at{" "}
          <Box
            component="a"
            href="https://read.amazon.in/kp/kshare?asin=B002V1I4FY&id=h4sosw3g35grhhf5p2f5fl6msq"
            target="_blank"
            rel="noreferrer"
            sx={{
              color: "var(--mui-palette-primary-main)",
              textDecoration: "underline",
            }}
          >
            read.amazon.in/kp/kshare?asin=B002V1I4FY
          </Box>
          .
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
          Reflections on Heavy Crude Oil and Global Power Dynamics
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          My attention was drawn to recent events in a South American country, leading me to delve into the concept of heavy crude oil and the refining processes it requires. It turns out heavy crude needs expensive upgraders to reach refinery-grade standards, or it risks clogging pipelines and slowing everything down. With an astounding 330 billion barrels at stake, it's clear that control over fossil fuels continues to shape global geopolitics. Despite the rise of renewables, fossil fuels remain dominant, especially as AI technologies demand increasing energy consumption.
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
          Transparency in Politics: A Lesson from Abroad
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          I was intrigued to learn that in some countries, politicians are required to disclose their stock investments publicly. It made me wonder — wouldn’t it be beneficial if India adopted a similar level of transparency? Such measures could strengthen public trust and accountability.
        </Typography>
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component="img"
            src="/media/stockinvertmentdisclosure.png"
            alt="Public stock holdings disclosure screenshot"
            sx={{
              width: { xs: "100%", sm: 360 },
              maxWidth: 420,
              borderRadius: 2,
              boxShadow: 3,
              display: "block",
              height: "auto",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: "var(--mui-palette-text-secondary)",
              textAlign: "center",
            }}
          >
            Public disclosure snapshot of reported holdings.
          </Typography>
        </Box>
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
          The Gig Worker Strike and Urban Delivery Debates
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          The ongoing gig worker strike over rapid food and grocery deliveries has been quite captivating. The back-and-forth between delivery workers and policymakers highlights the challenges in balancing convenience with fair labor practices. The term 'Champagne Socialist' thrown around in the political discourse adds a touch of humor to an otherwise serious debate.
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
          A New Festive Discovery: Gingerbread Decorations
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Christmas brought a new learning for me — the art of gingerbread decoration. I was fascinated to find out that edible materials are used for these festive decorations. It did make me wonder, though, do ants swarm around these treats in Western countries?
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
          Cultural Pride and Celebrations: Bharatanatyam and the World Cup
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Our cultural fabric remains rich and vibrant. Watching our girl perform Bharatanatyam on 'Nataraja Day' — Thiruvathirai — was truly captivating. The graceful foot stomps and rhythmic movements are mesmerizing. I also appreciated the playful hip-thrills reminiscent of Shakira's style, which reminded me that the Football World Cup is just around the corner.
          We are a "uyi amma" nation too — did you all see that foot-tapping
          "uyi amma" bit last year? That was a real hit.
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/generate/2026-01-04-new-year-2026-musings.png"
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

    </Box>
  );
}
