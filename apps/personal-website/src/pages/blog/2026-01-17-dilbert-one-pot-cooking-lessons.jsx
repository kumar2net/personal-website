import { useEffect } from "react";
import { Box, Typography } from "@mui/material";

export default function BlogPost() {
  useEffect(() => {
    const loadWidgets = () => {
      if (window.twttr?.widgets?.load) {
        window.twttr.widgets.load();
      }
    };

    const existing = document.querySelector(
      'script[src="https://platform.twitter.com/widgets.js"]'
    );
    if (existing) {
      if (window.twttr?.widgets) {
        loadWidgets();
      } else {
        existing.addEventListener("load", loadWidgets, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.onload = loadWidgets;
    document.body.appendChild(script);
  }, []);

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
          Farewell to Scott Adams and Dilbert's Impact
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
          One Pot One Shot Cooking: Simplicity and Precision
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          A YMCA table tennis friend once lived in the same Kodambakkam flat as Ramakrishnan of OPOS. When Birhimham பையா tried OPOS, I thought of that link. OPOS means One Pot One Shot. It uses a 2-liter pressure cooker and a fixed order of ingredients. The tools and recipe cards are standardized so results repeat. Ramakrishnan runs the "United by Food" Facebook group and holds the patent and copyright. My friend was so grateful he brewed filter coffee at 5 a.m. and left it at Ramakrishnan's door.
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
          Youth Education and Labor Market Challenges
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          India has over 40 million students in higher education. Over 10 million more enter the labor market each year. Skills, confidence, and networks matter as much as degrees. That scale makes each small act of mentorship feel urgent.
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
          A Bright Sixth Grader and Technology's Role
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          A bright 6th grader reminded me of that. Her teacher sends homework to parents through WhatsApp. She waits for her dad to return from work before she starts. I reset my unused Lenovo laptop and spent 20 minutes showing her the basics with her electrician-plumber father. She used one finger on the trackpad at first, so I nudged her to try two. The grin did the rest. She loves math and her teacher loves her back. For projects she scans her work and messages it to a local print shop. Simple tools still open doors.
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
          The Daily Sheet Calendar: A Nostalgic Touch
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
            6
          </Box>
          Discovering 'Lagree' Classes
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Our fam girl told me she now does Lagree instead of Pilates. I had never heard the word. We laughed at the line, "the muscles you never knew existed will send you an invoice." Fitness keeps inventing new ways to humble us.
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
          Poetic Pongal Wishes from Chennai Welfare Folks
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
        <Typography
          component="div"
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.9,
            color: "var(--mui-palette-text-primary)",
            whiteSpace: "pre-line",
          }}
        >
          {`உழைப்பையே பிழைப்பாக்கும் உன்னதப்பொங்கல்;
பிழைப்பையே இனிதாக்கும் சம்மதப்பொங்கல்;
அன்பையே ஆன்மீகமாக்கும்
அருமைப்பொங்கல்;
பண்பையே பாரதமாக்கும்
பெருமைப்பொங்கல்;
பணிவையே பக்குவமாக்கும் சர்க்கரைப்பொங்கல்;
துணிவையே தூயதாக்கும் நற்சுவைப்பொங்கல்;
மனிதத்தை புனிதமாக்கும்
மானிடப்பொங்கல்;
இனியதனைத்தும் இணைக்கும் பாலம் இன்றைய பொங்கல்;
பொங்கலின் தத்துவம் காண்போம்;
பொங்கி மகிழ்ந்து மகத்துவம்
ஆள்வோம்.
பொங்கல் திருநாள்
15-01-2026.புதன்.`}
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
          Learning Gen Alpha Slang and Changing University Roles
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Gen Alpha slang has been a puzzle for me. A bright boy coached me through it. He once delivered a school speech entirely in that slang. It was funny and a little humbling. Another line stuck with me: universities thought they sold knowledge until information went free. They pivoted to credentials, but credentials are now proxies. In a post-AI world the survivors will sell three things: networks, status signals, and four protected years to become an adult. Time is the rarest thing left.
        </Typography>
        <Box
          component="blockquote"
          className="twitter-tweet"
          data-media-max-width="560"
          sx={{ margin: 0 }}
        >
          <p lang="en" dir="ltr">
            He was invited to give a speech at a high school for Language Week,
            and he delivered the entire speech in Gen Alpha slang.{" "}
            <a href="https://t.co/GxCC9scSyG">pic.twitter.com/GxCC9scSyG</a>
          </p>
          &mdash; Vala Afshar (@ValaAfshar){" "}
          <a href="https://twitter.com/ValaAfshar/status/2011803009856979452?ref_src=twsrc%5Etfw">
            January 15, 2026
          </a>
        </Box>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/generate/2026-01-17-dilbert-one-pot-cooking-lessons.png"
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
