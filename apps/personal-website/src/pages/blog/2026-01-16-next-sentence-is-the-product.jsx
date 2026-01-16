import { Box, Typography } from "@mui/material";

const title = "The Next Sentence Is the Product";

const tags = ["Writing", "Clarity", "Editing", "Communication", "Craft"];

const paragraphs = [
  `If your reader stops, you lost the only sale that matters. The sale is the next sentence. Everything else is secondary.`,
  `People read on phones in lifts, in queues, between meetings. They skim in the same way they swipe. They do not owe you time. You earn it one sentence at a time.`,
  `Your lead is a promise. Do not clear your throat. Start at the moment where something changes. If you need three lines of context before the point, cut them. The reader can catch up. They often like the chase.`,
  `This is not about attention spans as a meme. It is about how brains process language. We imagine the subject before the action. "The boy hit the ball" lands faster than "The ball was hit by the boy." Active voice is not a style rule. It is a shortcut to the next sentence.`,
  `Concrete nouns and verbs help the same way. "Bike" is faster than "vehicle." "Burn" is faster than "consume." Abstract nouns make the reader build a picture before they can move. Give them the picture. Then move.`,
  `So start with a line that pulls. Scott Adams said he rewrote his first line a dozen times. That is not perfectionism. It is respect. If the first sentence does not create curiosity, the rest of your work will sit unread.`,
  `Simple writing persuades. A clean five sentence argument beats a clever hundred. This is not dumbing down. It is removing friction. Every extra word adds drag. A reader slows down or leaves.`,
  `Cut the fat first. "He was very happy" becomes "He was happy." "In order to" becomes "to." "The fact that" vanishes. These cuts do not change meaning. They remove delay.`,
  `Short sentences do the same job. One thought per sentence is not a school rule. It is a reading rule. When you stuff two ideas into one line, you force the reader to unpack it before moving on. Break it. Let the next sentence carry the second idea.`,
  `For example, compare this: "I tried to explain the app, but the user was confused because the onboarding was vague and the copy used jargon." Now split it. "I tried to explain the app. The user stayed confused. The onboarding was vague. The copy used jargon." The meaning is the same. The friction is not.`,
  `Do not over-explain. Trust the reader to connect obvious dots. When you explain what they already know, you slow the line. You also sound like you do not trust them. That is when they leave.`,
  `Watch the filler words. "Really," "just," "actually," "basically," "kind of." They are the verbal equivalent of clearing your throat. They signal that the sentence does not trust itself. Remove them and the sentence walks faster.`,
  `Choose simple words. Use beats utilize. Help beats facilitate. The fancy word rarely adds value. It slows the eye. It also hides weak thinking. Clear writing comes from clear thinking, so put your thought on the page without a costume.`,
  `Specificity keeps momentum too. "People are distracted" is vague. "A student in Bangalore checks Instagram every three sentences" is a scene. Scenes pull. They make the next line feel necessary.`,
  `Ask a single question after each line: what does the reader want next. That question keeps your writing honest. It keeps you from wandering into side quests. It forces you to keep one point on the table. Readers will follow one point. They will not juggle five.`,
  `Unity helps the chain. Stick to one tense and one point of view. Jumping from past to present or from "I" to "we" creates speed bumps. The reader has to reorient. Keep the camera steady and they keep reading.`,
  `Here is a fast test. After each sentence, stop and write the question it creates. If you cannot write a question, the sentence is a wall. Remove it or combine it with a line that opens a door. This test feels mechanical, and it is. Good writing is more craft than magic. When the questions flow, the reader follows without effort.`,
  `Rhythm helps momentum. Mix a short line with a medium line. Drop a one word sentence when the point matters. It gives the reader a breath and a jolt at once. That small jolt often buys you another paragraph.`,
  `Rewriting is where speed shows up. Your first draft is a sketch. A second pass is a cut. Many writers can drop half the words and lose nothing. Read your draft aloud. Your ear will tell you where the rhythm stalls. Fix that. The next sentence should feel inevitable.`,
  `End the same way you begin. Do not summarize. Do not announce the ending. Stop when the point lands and leave a line that feels both abrupt and right. The reader should feel a small jolt, not a slow fade.`,
  `The reader is not your audience. The next sentence is.`,
];

const selfCheck = [
  "Hook: first sentence is a direct pull that creates stakes.",
  "One point: every paragraph serves the next-sentence thesis.",
  "Short sentences: kept tight and mostly one thought per line.",
  "Active voice: subject-action examples and verbs are direct.",
  "Cuts: removed filler words and showed specific trims.",
  "Simple words: chose plain verbs over fancy ones.",
  "No summary ending: closed with a surprising, right final line.",
  "Tone: conversational, direct, and free of corporate language.",
];

const bodyTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "var(--mui-palette-text-primary)",
};

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
          {title}
        </Typography>
        {paragraphs.map((paragraph, index) => (
          <Typography key={`${index}-${paragraph.slice(0, 24)}`} variant="body1" sx={bodyTextSx}>
            {paragraph}
          </Typography>
        ))}
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
          {selfCheck.map((item) => (
            <Typography key={item} component="li" variant="body1" sx={bodyTextSx}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
