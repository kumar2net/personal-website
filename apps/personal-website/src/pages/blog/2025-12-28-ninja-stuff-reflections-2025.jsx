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
          src="https://img.shields.io/badge/reflection-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="reflection badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/inspiration-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="inspiration badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/psychology-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="psychology badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/music-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="music badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/technology-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="technology badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/government-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="government badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/holiday-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="holiday badge"
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
          Ninjas of 2025
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          As 2025 comes to a close, only a handful of people strike me as true experts — or as I like to call them, 'Ninjas.' These are individuals whose work or presence profoundly impacts me. For example, Andrej Karpathy recently coined the term 'Agency,' which resonated deeply. Charulatha Mani’s exquisite explanations of swaras in semi-Carnatic and film songs continue to inspire me — her masterpieces can be found in our /music playlist. And then there’s Jofra Archer, whose fluidity and poetry in motion when bowling at 150 kmph is simply mesmerizing.
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
          Curiosity and Aging Well
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          The Guardian Science Weekly podcasters are on vacation, so they’ve been rerunning some of their most popular episodes. I caught the episode on whether curiosity is key to aging well, and it was a delightful listen. I highly recommend setting aside time to hear it — it’s a beautiful reminder of the power of staying curious throughout life.
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
          The Courage to Be Disliked: A Fresh Psychological Perspective
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Having finished Dan Brown's "SoS," I’ve now dived into "The Courage to Be Disliked," which presents Adlerian psychology in a compelling way. Unlike Freud’s focus on past trauma, Adler suggests humans are driven more by future goals. For example, anxiety is not just fear — it’s a strategy; procrastination isn’t laziness but self-protection; anger is a bid for control or respect. This perspective is empowering because it means changing your goals can change your behavior. I plan to explore and articulate this more deeply early next year.
        </Typography>
        <Box
          component="img"
          src="/media/couragedisliked.png"
          alt="The Courage to Be Disliked audiobook cover"
          sx={{
            width: "100%",
            maxWidth: 360,
            mt: 3,
            borderRadius: 2,
            boxShadow: 3,
            display: "block",
            mx: "auto",
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
          The Courage to Be Disliked — audiobook cover
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
          Simple Acts of Faith and Hope
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          One touching moment for me recently was when a kind helper at home mentioned their family pilgrimage to Melmaruvathur, akin to the Ayyappa vratham for men. They asked for just Rs. 11 to pray for "அண்ணன்" (Annan). It reminded me how everyday acts of faith, hope, and positive feelings fuel my spirit and keep me going.
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
          The Magic of Marghazhi Music Season
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Listening to Spoorthi Rao and Soorya Gayathiri perform during the Marghazhi Music Season was a poignant reminder of how much time has passed. These versatile artists elegantly traverse traditional Carnatic music, blending medleys, bhajans, and multiple languages. ARR himself mentioned during the Music Academy’s December inauguration his ongoing efforts to attract younger audiences to music — a cause close to my heart.
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
          Reflections on Governance and Expectations
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          While I acknowledge that the Indian government may be doing good things, my expectations remain high. I believe far more can be accomplished if the focus shifts away from jingoistic showmanship and towards diligent policy implementation. Effective monitoring through real-time dashboards and strict accountability — reminiscent of Lee Kuan Yew’s style — could transform governance.
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
          Festive Cheer and Decorations
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Our community has shared vibrant photos of Christmas and holiday decorations at street level. These colorful displays are a reminder of the joy and togetherness the season brings. I encourage you to take a moment to enjoy these festive visuals.
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
          Signing Off with Wisdom from 'The Psychology of Money'
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          As I close out this year, I want to leave you with four simple ideas from Morgan Housel’s "The Psychology of Money":

- Don’t be quick to judge others’ spending habits.
- Utility matters more than status.
- Not minimizing regret is the biggest risk.
- Independence is the most valuable thing money can buy.

Auf Wiedersehen, and here’s to a thoughtful and inspiring year ahead.
        </Typography>
      </Box>

      <Box component="section">
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          PS:{" "}
          <a
            href="https://youtube.com/shorts/dWhpSa58WhY?si=qTS_XI-oeWzI1aRS"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://youtube.com/shorts/dWhpSa58WhY?si=qTS_XI-oeWzI1aRS
          </a>
          . As I did yesterday, please make at home and enjoy with Thiruppavai.
          The As and AAs in my city dont make VP anywhere close to this.
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/generate/2025-12-28-ninja-stuff-reflections-2025.png"
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
