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
          src="https://img.shields.io/badge/Research-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Research badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Science-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Science badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Health-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Health badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Artificial_Intelligence-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Artificial Intelligence badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Sports-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Sports badge"
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
          src="https://img.shields.io/badge/Personal_Reflections-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Personal Reflections badge"
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
          Understanding Tracy-Widom vs Gaussian Distribution
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          While I was familiar with the Gaussian distribution, recently I came across the Tracy-Widom distribution — a fascinating new concept for me. The Gaussian distribution, or normal distribution, describes how data points tend to cluster around a mean value, forming the classic bell curve. In contrast, the Tracy-Widom distribution emerges in the study of the largest eigenvalues of random matrices, capturing the behavior of extreme values rather than averages. To visualize, imagine the Gaussian as the pattern of average heights in a population, while Tracy-Widom describes the statistical properties of the tallest individuals. This distinction opens new avenues for understanding complex systems and extremes in data.
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
          Proud Moment at AGU 2025 and Reflections on Research Funding
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Our second-year UCF student recently presented her research paper at the AGU 2025 conference in New Orleans on December 15. She spoke with a calm and composed demeanor, earning my deep appreciation. I loved the "Scan me" QR code she put up in the slide — way to go girl! I had used AI to summarize her slide deck, and you can give it a read if you like. She also shared a complete recording of the presentation. If you’re interested to listen and an ecology warrior, please ping me and let me ask her if I have permission to share. However, beneath her poise, I sensed frustration over the unfortunate cuts in research funding by her country's administration. I truly believe that university environments foster innovative and groundbreaking research more effectively than corporate R&D departments. I've been encouraging her to visit Pichavaram and experience our mangroves firsthand. Watching these two young women, born just months apart to twins born minutes apart, both studious and now embarking on their careers, is inspiring and very proud indeed. They seem well-grounded, and I wish them every success in their endeavors.
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/media/nammyAGU25.png"
          alt="AGU 2025 research poster acknowledgements and team photos"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
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
          AGU 2025 acknowledgements and lab moments.
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
          Sugar vs Artificial Sweeteners: Insights from Guardian Science Weekly
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Incorporating Guardian Science Weekly into my morning smart speaker routine has been enlightening. I have a fascination for British English, the lucid way they speak. Yesterday’s episode tackled the question: should we swap sugar for artificial sweeteners to be healthier? The answer isn’t simple. Excess sugar intake is linked to obesity, diabetes, and metabolic issues, while artificial sweeteners don’t add calories but may affect hunger, gut health, and metabolism in complex and not fully understood ways. Experts emphasize that neither sugar nor sweeteners are health foods; moderation and context are key. The takeaway? Reduce added sugar, but don’t assume artificial sweeteners are a safe health alternative—they come with their own risks.
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
          Reflections on the NASSCOM Quiz Experience
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Many took the NASSCOM quiz recently, including one of our young men who scored a perfect centum — expected given his 20+ years in software. The amusing part? The system prompted him to retake the quiz! It’s unlikely any human teacher would ask a student with a perfect score to do so. This highlights the need for better software design or, in today’s terms, smarter prompts. A gentle reminder that even in technology, human intuition and context remain vital.
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
          Anticipating the Future of AI and AGI
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          As 2025 draws to a close, my humble assessment is that language and text processing are largely solved challenges. In 2026 and 2027, large models will advance at an incredible pace, likely culminating in the achievement of Artificial General Intelligence (AGI). For those currently employed, it’s time to consider what to do if traditional work becomes obsolete—perhaps leaning on government support like Universal Basic Income (UBI) for sustenance. Make no mistake, this transformation will happen, ushering in a world unlike any before. That’s my two cents on the future.
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
          The Ashes Series and Cricket Reflections
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          I’m genuinely surprised by how dominant Australia has been over England in this Ashes series. There seems to be no contest at all, and it feels like only South Africa might stand up to Australia in a test series these days. It’s a reminder of the shifting dynamics in sports and the relentless pursuit of excellence by some teams.
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
          Immersed in Dan Brown’s ‘Secret of Secrets’
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          I haven’t read many books recently, as I’m deeply engrossed in listening to Dan Brown’s ‘Secret of Secrets.’ Approaching the climax now, the story has been so gripping that I experienced a bone-chilling moment of fear—something new for me with audio fiction. It’s my first time listening to a 700-page novel and I’m intrigued by how Brown weaves modern technology themes like AI with conscience, exploring questions about its nature—local or remote—and concepts like materialism versus neotism (a term so novel it auto-corrects to nepotism!). The narrative also touches on neural networks and synapses, blending science and fiction masterfully.
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
          Wishing You All Merry Christmas and Happy Holidays
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          As I wrap up these reflections, I want to wish all of you a Merry Christmas and Happy Holidays. May this season bring joy, peace, and inspiration as we look forward to the new year ahead.
        </Typography>
        <Box
          sx={{
            mt: 3,
            p: { xs: 2, md: 2.5 },
            borderRadius: 2,
            border: "1px solid var(--mui-palette-divider)",
            backgroundColor: "var(--mui-palette-background-paper)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "var(--mui-palette-text-primary)",
            }}
          >
            PS: Please use dark theme when you read my blog posts. Due to my
            fascination for this theme I test/quality check only on this theme.
            Some texts/headings may not be visible clearly in light theme.
          </Typography>
        </Box>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/generate/2025-12-21-new-kid-on-the-block.png"
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
