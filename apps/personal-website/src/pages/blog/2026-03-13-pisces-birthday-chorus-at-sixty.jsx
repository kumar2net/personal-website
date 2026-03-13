import { alpha, Box, Chip, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-03-13-pisces-birthday-chorus-at-sixty",
  title: "A Pisces Birthday Chorus at Sixty",
  description:
    "On March 13, 2026, I turned 60 and received a birthday video full of affection, memory, mentorship, and one line I will keep for a long time: we look forward to your blog posts and your Cut the Crap wisdom.",
  excerpt:
    "A March 13, 2026 birthday reflection on turning 60, hearing family voices, and feeling gratitude arrive in waves.",
  tags: ["Birthday", "Family", "Reflection", "Pisces", "Gratitude"],
  datePublished: "2026-03-13",
  dateModified: "2026-03-13",
  image: "/generate/2026-03-13-pisces-birthday-chorus-at-sixty-hero.svg",
  readingTime: "~4 min",
};

const heroImage = "/generate/2026-03-13-pisces-birthday-chorus-at-sixty-hero.svg";
const soraVideo = "/generate/2026-03-13-pisces-birthday-chorus-at-sixty-sora-2.mp4";
const soraPoster =
  "/generate/2026-03-13-pisces-birthday-chorus-at-sixty-sora-2-poster.jpg";

const colors = {
  abyss: "#10354a",
  tide: "#1f6f78",
  seafoam: "#9ed9d1",
  moon: "#dce8ee",
  pearl: "#fff8ef",
  coral: "#f0b29a",
  ink: "#133243",
};

const bodyTextSx = {
  fontSize: "1.05rem",
  lineHeight: 1.9,
  color: colors.ink,
};

const cardSx = {
  p: 3,
  borderRadius: 3,
  border: `1px solid ${alpha(colors.tide, 0.14)}`,
  background: `linear-gradient(180deg, ${alpha(colors.pearl, 0.98)} 0%, ${alpha(
    colors.moon,
    0.72,
  )} 100%)`,
  boxShadow: "0 18px 40px rgba(16, 53, 74, 0.08)",
};

const messageThemes = [
  {
    symbol: "♓",
    title: "Curiosity that does not age",
    body:
      "The opening wish placed my life across three waves of change: the internet, the computer revolution, and now AI. I liked the implication. The work is not over. Stay tuned.",
    quote:
      "You were part of the internet revolution, the computer revolution, and now you are seeing the AI change.",
  },
  {
    symbol: "≈",
    title: "Steadiness after grief",
    body:
      "The most moving part of the video was not polished praise. It was family memory. Someone remembered who stayed available when life got difficult.",
    quote:
      "You have been there for us all the while, especially after our dad passed away.",
  },
  {
    symbol: "✦",
    title: "Mentorship without performance",
    body:
      "The younger generation did not talk about titles or achievements. They talked about conduct: curiosity, discipline, kindness, responsibility, and humility. That matters more.",
    quote:
      "We have learned from you how to live a good life, how to be disciplined, kind, responsible, and humble.",
  },
  {
    symbol: "☾",
    title: "Love that travels",
    body:
      "Some wishes came in one line. Some came from an airport. Some came with a promise of a future visit. None of them felt small.",
    quote: "Relax, enjoy, eat some good food. I love you and I hope I will see you soon.",
  },
];

const quoteStrands = [
  "We look forward to your blog posts and your Cut the Crap wisdom.",
  "You are an inspiration to all of us.",
  "Thank you for being such an amazing brother.",
  "Keep in touch. We will speak with you soon.",
];

const transcriptSections = [
  {
    speaker: "Speaker 1",
    text:
      "Happy birthday. Wish you a very happy birthday. It is a 60th milestone birthday and maybe even a milestone year in many ways. You were part of the internet revolution, the computer revolution, and now you are seeing the AI change. Lots of things will massively change by the end of the year, so stay tuned. As for us, we look forward to your blog posts and your Cut the Crap wisdom. Happy birthday.",
  },
  {
    speaker: "Speaker 2",
    text:
      "Happy birthday. Wish you a lovely year ahead with great health, lots of love, happiness, and joy. You are an inspiration to all of us. We really look forward to speaking with you more on the projects we are working on, and reading the articles you write really keeps us engaged. Speak soon.",
  },
  {
    speaker: "Speaker 3",
    text:
      "Hello Kumar. Wish you a very, very happy 60th birthday. We are all with you. We will always be together with you. One short sentence in this section was unclear in the source audio. You have been there for us all the while, especially after our dad passed away. Thank you for all the things that you have done for us. We hope that you continue to live happily and healthily. Wishing you all the very best, Kumar. Many happy returns of the day.",
  },
  {
    speaker: "Speaker 4",
    text:
      "Happy birthday, Kumaranna. Thank you for being such an amazing brother. Thank you so much. We love you so much.",
  },
  {
    speaker: "Speaker 5",
    text:
      "Take care, Kumar. Have a fantastic birthday. Take care. Cheers. All the best.",
  },
  {
    speaker: "Speaker 6",
    text:
      "I want to wish you a very, very happy 60th birthday. Thank you so much for being an inspiration, mentor, and friend to all of us in the younger generation of this family. Over the years, we have learned so much from you, not just in terms of technical skills and inspiration for our studies, but also how to live a good life, how to be disciplined, how to be kind, responsible, and humble. We have always admired how curious you are, and how you believe there is a lot to learn even from us youngsters. These are things I have carried with me wherever I have gone. I hope this year brings you good health, joy, and many meaningful experiences. I look forward to seeing all of your updates and blog posts. I hope you have a fantastic day today and an amazing year ahead. Keep in touch. We will speak with you soon.",
  },
  {
    speaker: "Speaker 7",
    text: "Hi Kumar, happy birthday. Sixty, huh? Enjoy your day, Kumar.",
  },
  {
    speaker: "Speaker 8",
    text: "Hi Kumar, happy birthday. Love you so much. Enjoy your birthday.",
  },
  {
    speaker: "Speaker 9",
    text:
      "Hi Kumar mama, happy birthday. Sorry for the noise. I am at an airport right now, but I hope you have a wonderful day. I miss you a ton. Hopefully we will get to see you soon. I am very grateful that you are in my life, and you are an inspiration to a lot of the things I get to do nowadays. Have a great day. Relax, enjoy, eat some good food. I love you, and I hope I will see you soon.",
  },
  {
    speaker: "Speaker 10",
    text:
      "Hi Kumar mama, happy birthday. Hope you have many more happy birthdays in the future. I am excited to come and see you next year, hopefully with Jocelyn, so that you can meet her. She has heard a lot about you. Happy birthday. Enjoy the rest of your day.",
  },
  {
    speaker: "Group sign-off",
    text: "Happy birthday.",
  },
];

export default function BlogPost() {
  return (
    <article
      data-tldr-text="On March 13, 2026, I turned 60 and received a birthday video that said the same thing in different ways: stay curious, keep writing, keep showing up for family, and know that you have been deeply loved."
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          "& .pisces-surface": {
            color: colors.ink,
            "& h2, & h3, & h4, & p": {
              color: `${colors.ink} !important`,
            },
            "& .pisces-accent, & .pisces-kicker": {
              color: `${colors.tide} !important`,
            },
          },
        }}
      >
        <Box
          component="section"
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: `linear-gradient(140deg, ${colors.abyss} 0%, ${colors.tide} 42%, ${colors.seafoam} 100%)`,
            color: colors.pearl,
            boxShadow: "0 30px 80px rgba(16, 53, 74, 0.24)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 15% 20%, ${alpha(
                colors.pearl,
                0.18,
              )} 0%, transparent 26%), radial-gradient(circle at 82% 18%, ${alpha(
                colors.coral,
                0.18,
              )} 0%, transparent 22%), radial-gradient(circle at 78% 84%, ${alpha(
                colors.moon,
                0.14,
              )} 0%, transparent 24%)`,
            }}
          />
          <Typography
            variant="overline"
            sx={{
              position: "relative",
              display: "block",
              letterSpacing: 1.4,
              color: alpha(colors.pearl, 0.82),
            }}
          >
            March 13, 2026  •  Pisces season  •  ♓
          </Typography>
          <Typography
            variant="h1"
            sx={{
              position: "relative",
              maxWidth: "12ch",
              mt: 1.5,
              mb: 2,
              color: colors.pearl,
            }}
          >
            A Pisces Birthday Chorus at Sixty
          </Typography>
          <Typography
            variant="body1"
            sx={{
              position: "relative",
              maxWidth: 700,
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.9,
              color: alpha(colors.pearl, 0.94),
            }}
          >
            On March 13, 2026, I turned 60. The video that reached me today did
            not feel like a formal tribute. It felt like water: voices arriving
            in waves, each one carrying memory, teasing, gratitude, advice, and
            affection back to me.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              position: "relative",
              maxWidth: 700,
              mt: 2,
              mb: 0,
              fontSize: { xs: "1rem", md: "1.05rem" },
              lineHeight: 1.85,
              color: alpha(colors.pearl, 0.9),
              fontStyle: "italic",
            }}
          >
            Many thanks to சின்ன பையா for stitching this and making me tear
            up.
          </Typography>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              gap: 1.25,
              mt: 3,
            }}
          >
            {["♓ Pisces", "60th birthday", "family voices", "gratitude"].map(
              (label) => (
                <Chip
                  key={label}
                  label={label}
                  sx={{
                    bgcolor: alpha(colors.pearl, 0.14),
                    color: colors.pearl,
                    border: `1px solid ${alpha(colors.pearl, 0.22)}`,
                    fontWeight: 600,
                  }}
                />
              ),
            )}
          </Box>
          <Typography
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: 18, md: 28 },
              top: { xs: 12, md: 18 },
              fontSize: { xs: "3rem", md: "5rem" },
              lineHeight: 1,
              color: alpha(colors.pearl, 0.12),
            }}
          >
            ♓
          </Typography>
        </Box>

        <Box
          component="section"
          className="pisces-surface"
          sx={{
            ...cardSx,
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, md: 3 },
            gap: 2,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              display: "block",
              letterSpacing: 1.2,
              color: colors.tide,
            }}
          >
            Sora 2 companion video
          </Typography>
          <Typography variant="h2" sx={{ mt: 0, mb: 1, color: colors.ink }}>
            The thank-you note, answered in the same medium
          </Typography>
          <Typography variant="body1" sx={{ ...bodyTextSx, mb: 0 }}>
            I wanted this near the top because it is the closest thing to a
            reply in kind: a first-person thank-you stitched around Singapore,
            Orlando, SFO, and Seattle, with the narration text I sent back.
          </Typography>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              mt: 1,
              borderRadius: 4,
              background: `linear-gradient(180deg, ${colors.abyss} 0%, ${alpha(
                colors.abyss,
                0.82,
              )} 100%)`,
              border: `1px solid ${alpha(colors.tide, 0.22)}`,
              boxShadow: "0 28px 60px rgba(16, 53, 74, 0.18)",
            }}
          >
            <Box
              component="video"
              controls
              playsInline
              preload="metadata"
              poster={soraPoster}
              sx={{
                display: "block",
                width: "100%",
                aspectRatio: "9 / 16",
                objectFit: "cover",
                backgroundColor: colors.abyss,
              }}
            >
              <source src={soraVideo} type="video/mp4" />
              Your browser does not support the embedded video. You can still
              access it directly at {soraVideo}.
            </Box>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: alpha(colors.ink, 0.76),
              lineHeight: 1.7,
            }}
          >
            Captioned 48-second vertical cut with first-person narration and
            the four-city birthday reply.
          </Typography>
        </Box>

        <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            component="img"
            src={heroImage}
            alt="Contemporary Pisces-themed hero artwork for a 60th birthday reflection"
            loading="lazy"
            decoding="async"
            sx={{
              width: "100%",
              display: "block",
              borderRadius: 4,
              border: `1px solid ${alpha(colors.tide, 0.18)}`,
              boxShadow: "0 24px 60px rgba(16, 53, 74, 0.18)",
              mb: 1,
            }}
          />
          <Typography variant="h2" sx={{ mt: 0, color: colors.ink }}>
            What the video really gave me
          </Typography>
          <Typography variant="body1" sx={bodyTextSx}>
            Birthdays can reduce a life to a number if you let them. This one
            did the opposite. It returned the number to relationship.
          </Typography>
          <Typography variant="body1" sx={bodyTextSx}>
            One voice located me across three technological eras: the internet,
            the computer revolution, and now AI. Another thanked me not for
            achievement but for steadiness after loss. The younger generation
            said something even harder to earn: that they had learned
            discipline, kindness, responsibility, and humility by watching.
            Others simply said what family says when it means it most: we love
            you, eat well, stay healthy, keep in touch, come see us soon.
          </Typography>
          <Typography variant="body1" sx={bodyTextSx}>
            I cherish and keep using the jumper and T-shirts you folks have
            given me over time. Today I am wearing the Under Armour T-shirt sis
            gave me about a year back, one of the two, and even that feels like
            part of this birthday chorus.
          </Typography>
          <Typography variant="body1" sx={bodyTextSx}>
            If Pisces is supposed to mean feeling, intuition, and long memory,
            then the symbolism fit. Today felt sea-colored: soft on the surface,
            deep underneath, and full of things that kept shining after the
            video ended.
          </Typography>
        </Box>

        <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h2" sx={{ mt: 0, color: colors.ink }}>
            Four strands I want to keep
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              gap: 2.5,
            }}
          >
            {messageThemes.map((item) => (
              <Box key={item.title} className="pisces-surface" sx={cardSx}>
                <Typography
                  className="pisces-accent"
                  sx={{
                    fontSize: "1.6rem",
                    lineHeight: 1,
                    color: colors.tide,
                    mb: 1.5,
                  }}
                >
                  {item.symbol}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    mt: 0,
                    mb: 1.25,
                    fontSize: "1.25rem",
                    color: colors.ink,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body1" sx={bodyTextSx}>
                  {item.body}
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2.5,
                    backgroundColor: alpha(colors.tide, 0.08),
                    border: `1px solid ${alpha(colors.tide, 0.14)}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.98rem",
                      lineHeight: 1.75,
                      color: colors.ink,
                      fontStyle: "italic",
                    }}
                  >
                    “{item.quote}”
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Typography variant="h2" sx={{ mt: 0, color: colors.ink }}>
            Lines I want to keep
          </Typography>
          {quoteStrands.map((quote) => (
            <Box
              key={quote}
              className="pisces-surface"
              sx={{
                ...cardSx,
                position: "relative",
                pl: 4,
                "&::before": {
                  content: '"~"',
                  position: "absolute",
                  left: 18,
                  top: 18,
                  fontSize: "1.1rem",
                  color: colors.tide,
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1.02rem", md: "1.08rem" },
                  lineHeight: 1.85,
                  color: colors.ink,
                }}
              >
                {quote}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Typography variant="h2" sx={{ mt: 0, color: colors.ink }}>
            Lightly cleaned transcript
          </Typography>
          <Typography variant="body1" sx={bodyTextSx}>
            I normalized punctuation for readability and marked one short unclear
            family-memory sentence honestly instead of pretending certainty.
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
            }}
          >
            {transcriptSections.map((section) => (
              <Box key={section.speaker} className="pisces-surface" sx={cardSx}>
                <Typography
                  variant="overline"
                  className="pisces-kicker"
                  sx={{
                    display: "block",
                    mb: 1,
                    letterSpacing: 1.2,
                    color: colors.tide,
                  }}
                >
                  {section.speaker}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1rem",
                    lineHeight: 1.85,
                    color: colors.ink,
                  }}
                >
                  {section.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          component="section"
          className="pisces-surface"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: `1px solid ${alpha(colors.tide, 0.16)}`,
            background: `linear-gradient(135deg, ${alpha(
              colors.seafoam,
              0.22,
            )} 0%, ${alpha(colors.pearl, 0.98)} 72%)`,
          }}
        >
          <Typography variant="h2" sx={{ mt: 0, color: colors.ink }}>
            What I want to give back
          </Typography>
          <Typography variant="body1" sx={bodyTextSx}>
            The cleanest way I know to answer a video like this is not with
            sentiment alone. It is to keep doing the things those voices trusted
            me for: stay curious, keep writing, speak plainly, show up for
            family, and remain teachable even at sixty.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              ...bodyTextSx,
              mb: 0,
            }}
          >
            That feels like the right Pisces ending to March 13, 2026: gratitude
            that does not sit still, but keeps moving. ≈
          </Typography>
        </Box>

        <Box
          component="section"
          className="pisces-surface"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: `1px solid ${alpha(colors.tide, 0.14)}`,
            background: `linear-gradient(180deg, ${alpha(
              colors.pearl,
              0.96,
            )} 0%, ${alpha(colors.moon, 0.8)} 100%)`,
          }}
        >
          <Typography variant="h2" sx={{ mt: 0, color: colors.ink }}>
            A March 13 footnote
          </Typography>
          <Typography variant="body1" sx={{ ...bodyTextSx, mb: 0 }}>
            March 13 comes with a few curious cultural and historical
            coincidences. This year, March 13, 2026, also happens to fall on
            the famous <strong>Friday the 13th</strong>, a date many people
            consider unlucky, even though <strong>13 is actually a prime
            number</strong>, mathematically elegant rather than ominous.
            Because of long-standing superstition, many <strong>hotels and
            office buildings skip the 13th floor</strong>, airlines sometimes
            avoid row 13, and some people postpone travel or big decisions on
            that day. Yet historically the month itself symbolizes beginnings:
            in the calendar of <strong>Ancient Rome</strong>, <strong>March was
            originally the first month of the year</strong>, representing
            renewal and fresh starts. The date also appears in the story of
            human exploration, as <strong>Apollo 9</strong> launched on March
            13 to test the lunar module systems that later enabled astronauts
            to reach the Moon. So a March 13 birthday can sit inside the
            mystery of Friday the 13th while belonging to a month historically
            associated with new beginnings and milestones in exploration. 🎂🚀
          </Typography>
        </Box>
      </Box>
    </article>
  );
}
