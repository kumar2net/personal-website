import { Box, Typography } from "@mui/material";

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>

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
          Anticipating Major Announcements from Frontier Labs
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          As we approach the Thanksgiving weekend, I sense that major
          announcements from all the Frontier Labs are on the horizon. These
          labs are pushing the boundaries, much like Kadothgajan yearning for
          more compute capacity. Reflecting on their progress, I believe 2026
          will serve as a crucial litmus test for their advancements. Today, if
          I were to list my top five Frontier Labs, I would focus on those
          driving innovation and breakthroughs in AI and computing power.
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
          Our Shared Responsibility to Reduce Carbon Footprint
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Regardless of the agreements or disagreements in the tech world, it
          is imperative that each of us contributes to reducing our carbon
          footprint. I recall Dr. Abdul Kalam's inspiring words: "Don't ask
          what your country has done for you — ask what you can do for your
          country." This quote reminds me that individual contributions, no
          matter how small, are vital in creating a sustainable future for all.
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
          Imagining a Future with AGI and Automation
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          What happens when Artificial General Intelligence (AGI) is achieved
          and automation takes over all mundane tasks? Robots will handle our
          sundry jobs, and yet, we might find ourselves endlessly scrolling on
          screens, passing time without purpose. It's a scenario that challenges
          us to rethink how we engage with technology and find meaningful ways
          to spend our time in an automated world.
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
          The Evolution of Skills and Interfaces in the Digital Age
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Skills like typing at good speeds, shorthand writing, stenography,
          speaking multiple languages, mastering grammar and vocabulary, or
          converting metric to imperial units have become somewhat obsolete. We
          no longer need to memorize such details. What remains is the need to
          evolve beyond our current mobile devices and their touch-and-click
          interfaces. The future lies in natural voice and vision interfaces
          that work reliably. For example, the recent Lenskart IPO in India
          grabbed attention by showcasing spectacles that can make payments via
          UPI simply by looking at a shopkeeper's QR code—a glimpse into the
          seamless integration of technology in everyday life.
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/media/generated/2025-11-19-lots-of-new-announcements-frontier-labs.png"
          alt="AI Generated Illustration"
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
            color: "text.secondary",
          }}
        >
          AI Generated Illustration
        </Typography>
      </Box>

    </Box>
  );
}
