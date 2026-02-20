import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-02-20-tinglish-gen-z-terms-sivaangi",
  title: "Tinglish Slang Decoder: Gen Z Terms from Sivaangi's Short",
  description:
    "A quick decode of Tamil-English internet slang from Sivaangi's Gen Z terms short, with plain meanings, Tamil sense, and example usage.",
  excerpt:
    "A quick decode of Tamil-English internet slang from Sivaangi's Gen Z terms short, with plain meanings, Tamil sense, and example usage.",
  tags: ["Gen Z", "Gen Alpha", "Tamil", "Tinglish", "Slang", "Language"],
  datePublished: "2026-02-20",
  dateModified: "2026-02-20",
  image: "",
  readingTime: "~4 min",
};

const sourceUrl = "https://youtube.com/shorts/9fV8sQBFTvk?si=LyONCO0PiUKCUOGa";

const tags = ["Gen Z", "Gen Alpha", "Tamil", "Tinglish", "Slang", "Language"];

const terms = [
  {
    term: "Bougie",
    meaning: "Posh, premium, rich-looking vibe.",
    tamilSense: "செலவான / செட்டப் பண்ணிய luxury feel.",
    example: "That cafe is bougie; even water looks premium there.",
  },
  {
    term: "Bussin",
    meaning: "Very good. Super tasty or excellent.",
    tamilSense: "செம்ம / ரொம்ப நல்லா இருக்கு.",
    example: "This biryani is bussin.",
  },
  {
    term: "No cap",
    meaning: "No lie. I am being honest.",
    tamilSense: "பொய் இல்ல, உண்மையா சொல்றேன்.",
    example: "No cap, this is the best filter coffee in town.",
  },
  {
    term: "Cheugy",
    meaning: "Out of trend. Trying too hard to look cool.",
    tamilSense: "பழைய trend, இப்போ cool இல்ல.",
    example: "That old hashtag style looks cheugy now.",
  },
  {
    term: "Cringe",
    meaning: "Embarrassing or awkward to watch.",
    tamilSense: "அசௌகரியம் தரும் / பாவமாக feel ஆகும்.",
    example: "That forced reel acting was cringe.",
  },
  {
    term: "Outdated",
    meaning: "No longer current or relevant.",
    tamilSense: "காலாவதியான trend.",
    example: "That meme format is outdated.",
  },
  {
    term: "DINK",
    meaning: "Double Income, No Kids.",
    tamilSense: "இரட்டை வருமானம், குழந்தைகள் இல்லை.",
    example: "They are a DINK couple planning long international trips.",
  },
  {
    term: "Dank",
    meaning: "Edgy meme style, often dark-humor coded.",
    tamilSense: "டார்க் ஹியூமர் touch உடன் வரும் meme vibe.",
    example: "That meme page posts only dank jokes.",
  },
  {
    term: "Delulu",
    meaning: "Delusional; unrealistic fantasy thinking.",
    tamilSense: "உண்மை இல்லாத கற்பனை உலகம்.",
    example: "Thinking one DM means marriage is delulu.",
  },
];

const supportWords = [
  "hype",
  "hard to get",
  "expensive",
  "being honest",
  "dark humour",
];

const bodyTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "var(--mui-palette-text-primary)",
};

const labelSx = {
  fontWeight: 700,
  color: "var(--mui-palette-text-primary)",
};

const cardSx = {
  border: "1px solid var(--mui-palette-divider)",
  borderRadius: 2,
  p: 2.5,
  backgroundColor: "var(--mui-palette-background-paper)",
};

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
        {tags.map((tag) => {
          const label = encodeURIComponent(tag.replace(/\s+/g, "_"));
          return (
            <Box
              key={tag}
              component="img"
              src={`https://img.shields.io/badge/${label}-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white`}
              alt={`${tag} badge`}
              loading="lazy"
              decoding="async"
              sx={{ height: 28, width: "auto" }}
            />
          );
        })}
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.875rem", md: "2.5rem" },
            fontWeight: 700,
            lineHeight: 1.2,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Tinglish Slang Decoder
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          I watched Sivaangi&apos;s short on Gen Z terms and realized many people hear these words but
          do not know the exact meaning. This is a clean decoder for the Tamil + English internet mix
          we hear daily.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Source:{" "}
          <Box
            component="a"
            href={sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            sx={{ color: "inherit" }}
          >
            {sourceUrl}
          </Box>
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Core Terms Used in the Short
        </Typography>
        <Box sx={{ display: "grid", gap: 2 }}>
          {terms.map((item) => (
            <Box key={item.term} sx={cardSx}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.2rem", md: "1.35rem" }, fontWeight: 700 }}>
                {item.term}
              </Typography>
              <Typography variant="body1" sx={{ ...bodyTextSx, mt: 1 }}>
                <Box component="span" sx={labelSx}>
                  Meaning:
                </Box>{" "}
                {item.meaning}
              </Typography>
              <Typography variant="body1" sx={bodyTextSx}>
                <Box component="span" sx={labelSx}>
                  Tamil sense:
                </Box>{" "}
                {item.tamilSense}
              </Typography>
              <Typography variant="body1" sx={bodyTextSx}>
                <Box component="span" sx={labelSx}>
                  Example:
                </Box>{" "}
                {item.example}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Gen Z vs Gen Alpha: Quick Note
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Most words in this clip are internet slang that became popular through Gen Z social media use.
          Gen Alpha is adopting many of the same words, but these terms are not exclusive to one age group.
          Context and community matter more than strict labels.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Other Phrases Heard in the Explanation
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {supportWords.map((word) => (
            <Typography key={word} component="li" variant="body1" sx={bodyTextSx}>
              {word}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Mini Checklist Before You Use Slang
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography component="li" variant="body1" sx={bodyTextSx}>
            Check context first: same word can be praise, sarcasm, or insult.
          </Typography>
          <Typography component="li" variant="body1" sx={bodyTextSx}>
            Match the audience: friend-group slang may sound odd in formal settings.
          </Typography>
          <Typography component="li" variant="body1" sx={bodyTextSx}>
            Watch tone and facial cues: internet words often depend on delivery.
          </Typography>
          <Typography component="li" variant="body1" sx={bodyTextSx}>
            Use lightly if unsure: asking “what does this mean here?” is better than misusing it.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
