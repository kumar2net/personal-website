import { Box, Link, Typography } from "@mui/material";

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
          src="https://img.shields.io/badge/AI-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="AI badge"
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
          src="https://img.shields.io/badge/Politics-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Politics badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Humor-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Humor badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Books-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Books badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Markets-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Markets badge"
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
          The AI Periodic Table and a Lightboard Done Right
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          The AI Periodic Table is one of the most insightful visual maps I have seen recently. The team, along with IBM, did a fantastic job turning a messy landscape into something you can scan and discuss. I also loved the transparent lightboard demo - it is a beautiful way to brainstorm ideas in a room together.
        </Typography>
        <Box
          component="img"
          src="/media/AIPeriodictable.jpg"
          alt="AI periodic table lightboard sketch"
          loading="lazy"
          decoding="async"
          sx={{
            mt: 3,
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
          The AI periodic table sketch that made the topic click.
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
          A Calculus Pick That Makes Me Smile
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          I am glad our Duke boy chose calculus for his second semester. It feels like a strong foundation and a good signal that he wants to build rigor into his learning. His course list is here:
        </Typography>
        <Link
          href="https://www.sanjaaybabu.com/writing/my-spring26-courses"
          target="_blank"
          rel="noreferrer"
          underline="hover"
          sx={{
            width: "fit-content",
            fontWeight: 600,
            color: "var(--mui-palette-primary-main)",
          }}
        >
          Sanjaay Babu - Spring 26 courses
        </Link>
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
          Rethinking Education in the AI Age
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          In the AI age, I hope we redesign the curriculum and stop over-indexing on rote learning and high-stakes exams. Teachers should engage students through group discussions, seminars, and practical life skills from primary school onward. That shift is as much a political choice as a pedagogical one.
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
          A Spoof I Keep Rewatching
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Spoofs are something I love, and this one is among the best I have heard. I end up watching it two or three times just to catch the body language and intonation.
        </Typography>
        <Link
          href="https://youtu.be/FaPOV564YWA?si=8eR0XYqUTKTPKunZ"
          target="_blank"
          rel="noreferrer"
          underline="hover"
          sx={{
            width: "fit-content",
            fontWeight: 600,
            color: "var(--mui-palette-primary-main)",
          }}
        >
          Watch the spoof on YouTube
        </Link>
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
          The Line That Stayed With Me
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          The best part of The Courage to Be Disliked for me is the line, "All problems are interpersonal relationship problems." It does not deny pain or failure; it reframes them as struggles about approval, comparison, and belonging. The freedom in Adlerian psychology begins when you accept the risk of being disliked and still live by your values.
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
          Vegan Sushi, Panipuri, and One-Bite Foods
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          One thing I like about youngsters is how they try variety, food included. I used to think sushi was always seafood, and now I hear you can get vegan sushi too. I still wonder how people eat sushi in one chopstick move; I struggle even with a big panipuri stuffed with aloo, chana, onion, and jeera water. Handmade puris vary by size, but machine-made ones are uniform, so you cannot ask for small or medium anymore.
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
          A Crisp Read on India Capital Markets
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          I follow Naveen closely, and if you want a crisp glance at the India capital markets, his investor letter is worth your time.
        </Typography>
        <Link
          href="https://www.smallcase.com/blog/windmill-capital-investor-letter-december-2025-edition/"
          target="_blank"
          rel="noreferrer"
          underline="hover"
          sx={{
            width: "fit-content",
            fontWeight: 600,
            color: "var(--mui-palette-primary-main)",
          }}
        >
          Windmill Capital investor letter (December 2025)
        </Link>
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
          Gold, Silver, and Now Copper
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Gold, silver, and now copper are major investment themes in India. I am curious how the story looks elsewhere and would love to hear what you are seeing in your markets.
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
            9
          </Box>
          Waiting for ChatGPT Health in India
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          On AI health, I am personally keen to see ChatGPT Health go live in India. A trusted health assistant could make everyday care and prevention far more accessible.
        </Typography>
        <Box
          component="img"
          src="/media/AIhealth.png"
          alt="ChatGPT Health preview on a phone"
          loading="lazy"
          decoding="async"
          sx={{
            mt: 3,
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
          Waiting for this to land in India.
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
            10
          </Box>
          India's Beverage Chessboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          A recent article on non-alcoholic beverages reminded me that India is not one market but many. Wagh Bakri's dominance in Gujarat, filter coffee in Tamil Nadu, summer lassi in the north, and RTD coffee momentum in Maharashtra all show the same lesson: one-size-fits-all strategies fail. Winning share of throat means mastering regional taste maps, not just national headlines.
        </Typography>
      </Box>
    </Box>
  );
}
