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
          src="https://img.shields.io/badge/AI-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="AI badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Insulin-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Insulin badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Storytelling-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Storytelling badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Audiobooks-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Audiobooks badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Ponniyin_Selvan-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Ponniyin Selvan badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Google_Home-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Google Home badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Music_Playback-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Music Playback badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Nostalgia-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Nostalgia badge"
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
          Thinking Machines, AlphaFold, and the Biology of Insulin
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Watching the documentary Thinking Machines left a deep impression on me, especially Demis Hassabis’s philosophy: "Solve intelligence → solve biology." AlphaFold’s breakthroughs in protein folding felt personal because insulin itself is a protein with a precise 3D structure. Visualizing how AI predicts protein structures helped me better understand the insulin I rely on every day. Diving into my diabetes medications — glimepiride and metformin — I gained clarity: glimepiride stimulates my pancreas to produce insulin, while metformin improves insulin sensitivity and reduces glucose production in my liver. Suddenly, AI was no longer just technology but a lens to understand my own body.
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/media/myProteinfolding.png"
          alt="Infographic explaining protein folding, insulin, and how metformin and glimepiride help"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
            objectFit: "contain",
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
          Visual cheat-sheet: how protein folding links to insulin, and how metformin plus glimepiride help.
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
          The Audiobook Experience vs Reading Paperbacks: Dan Brown’s Secret of Secrets
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          I started listening to Dan Brown’s Secret of Secrets on Audible and found the experience strikingly different from reading his paperbacks. The narrator controls pacing, rhythm, and atmosphere, making symbols like the halo more dramatic and vivid. Reading, on the other hand, allows me to be the director of my own mental cinematography, embodying Robert Langdon with my unique tone and mood. This contrast reminded me how the medium shapes the mind’s imagination. Another memorable read was Ian Iacocca’s Steve Jobs autobiography — I finished those 500 pages in one sitting, fully immersed.
        </Typography>

        <Box
          component="figure"
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
            src="/media/dnsofc.png"
            alt="Listening to Dan Brown's The Secret of Secrets on Audible"
            sx={{
              width: "100%",
              maxWidth: 360,
              borderRadius: 2,
              boxShadow: 3,
              objectFit: "contain",
            }}
            loading="lazy"
            decoding="async"
          />
          <Typography
            variant="caption"
            sx={{ textAlign: "center", color: "text.secondary" }}
          >
            Audiobook run in progress: Dan Brown’s “The Secret of Secrets.”
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
            3
          </Box>
          Ponniyin Selvan: Why the Movie Fell Short of the Novel’s Majesty
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Having read Ponniyin Selvan in print, I had a rich internal vision of characters like Arulmozhi Varman, Vandhiyathevan, and Kundavai Pratiyar, along with the intricate Chola world of politics and drama. The movie, however, didn’t resonate with me. Characters appeared almost comical compared to my imagined versions, and despite skilled direction, the emotional weight felt missing. This experience reinforced a key truth: books let imagination dominate, while movies impose someone else’s vision over yours.
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
          Radio Nostalgia: From Philips Vacuum Tube to Sangean Portable
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Reflecting on AI and storytelling took me back to three iconic radios from my life: the Philips vacuum tube radio with its warm-up hum and glowing tubes that preceded live cricket commentary and All India Radio news—Henry Blofeld, Tony Cozier, Christopher Martin-Jenkins, Jim Maxwell, and Dr. Narottam Puri were the cricket soundtrack and I’d have my ears almost rubbing the radio to understand their British/Australian accent; the Nelco tabletop radio, a stable household fixture anchoring our mornings; and the Sangean portable radio, my first truly mobile device with crisp FM sensitivity—picked up at Dubai Duty Free when I started working, though brutal work timings meant I barely used it. Radio Ceylon and B.H. Abdul Hameed were my clear-sounding favourites—often better than our own AIR transmitter from Kodaikanal, if I recall right. These radios shaped my morning rituals long before smart speakers existed. Today, devices like Google Home attempt to recreate that feeling, replacing analog circuits with cloud AI and large language models, yet preserving the emotional core of beginning the day with voices, chants, and news.
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
          Google Home, Gemini Assistant, and My Music Playback Frustrations
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          After switching to the Gemini assistant on my Google Home, I encountered frustrating issues: Spotify refused to play Rudram by Kaisinath Sastry, and YouTube Music ignored similar commands. Manual casting worked perfectly, indicating that Gemini’s media-command pipeline remains incomplete. The older Google Assistant handled Indian devotional content far better. This isn’t a Spotify Free limitation but a parsing failure on Gemini’s part.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            mt: 3,
          }}
        >
          <Box component="figure" sx={{ m: 0 }}>
            <Box
              component="img"
              src="/media/smartspeaker1.png"
              alt="Google Assistant routine setup showing starters and morning actions"
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: 3,
                objectFit: "contain",
                bgcolor: "background.paper",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              My routine: morning starter, weather, and a joke before the day begins.
            </Typography>
          </Box>
          <Box component="figure" sx={{ m: 0 }}>
            <Box
              component="img"
              src="/media/smartspeaker2.png"
              alt="News brief list inside the Assistant routine with feeds like BBC, Reuters, and Bloomberg"
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: 3,
                objectFit: "contain",
                bgcolor: "background.paper",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              News stack the routine cycles through: BBC, Reuters TV, AI Automation Minute, Bloomberg, and more.
            </Typography>
          </Box>
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
            6
          </Box>
          An Emotional Thread: From Books to Audio, Film, and AI Speakers
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          This week connected many themes: reading Dan Brown versus listening to him on Audible; reading Ponniyin Selvan versus watching the movie; memories of Philips, Nelco, and Sangean radios evolving into Google Home; AI helping me understand insulin yet failing to understand my "Play Rudram" request. Technology changes—from vacuum tubes to AI speakers, print novels to audiobooks and movies—but the soul remains: morning sound, storytelling, ritual, and human connection through voice. PS: Ha! Big relief to have completed the SIR forms with the help of the BLO (Block Development Officer).
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/generate/2025-11-30-thinking-machines-to-rudram-mornings.png"
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
