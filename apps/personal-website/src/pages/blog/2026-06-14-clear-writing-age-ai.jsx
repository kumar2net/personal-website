import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-06-14-clear-writing-age-ai",
  title: "Why Clear Writing Wins in the Age of AI",
  description:
    "A reflection inspired by Steven Pinker on clarity, jargon, the curse of knowledge, and why human judgment matters even more when AI can produce polished text instantly.",
  excerpt:
    "AI can produce smooth sentences, but clear writing still needs judgment, examples, humour, memory, and respect for the reader.",
  tags: ["Writing", "AI", "Clarity", "Steven Pinker", "Communication", "LLMs"],
  datePublished: "2026-06-14",
  dateModified: "2026-06-14",
  image: "/media/blogwordcloud.png",
  readingTime: "~5 min",
};

const title = "Why Clear Writing Wins in the Age of AI";
const subtitle = "Steven Pinker on clarity, jargon, and the reader's mind";

const enemies = [
  {
    heading: "Jargon",
    body:
      "Jargon is not always bad. Doctors, engineers, lawyers, and programmers need precise terms. It becomes a problem when it is used to signal status instead of meaning.",
  },
  {
    heading: "Abstraction",
    body:
      "Words like optimization, transformation, enablement, and alignment can be useful. But if every sentence floats in abstraction, the reader never touches the ground.",
  },
  {
    heading: "Needless words",
    body:
      "Many sentences are not wrong. They are just overweight. Due to the fact that can become because. At this point in time can become now. For the purpose of can become to.",
  },
];

const formulaSteps = [
  "Idea: AI hallucination.",
  "Simple explanation: Sometimes AI gives an answer that sounds confident but is false.",
  "Example: Like a student who did not study but still speaks fluently in class.",
  "Why it matters: We must verify important facts before trusting AI output.",
  "Memorable line: AI is fluent, not automatically truthful.",
];

const bodyTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "var(--mui-palette-text-primary)",
};

const sectionIntroSx = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "var(--mui-palette-text-secondary)",
};

const calloutSx = {
  borderLeft: "4px solid var(--mui-palette-primary-main)",
  pl: 2,
  py: 1.5,
  backgroundColor: "var(--mui-palette-action-hover)",
  borderRadius: 1,
};

const quoteSx = {
  m: 0,
  pl: 2,
  borderLeft: "4px solid var(--mui-palette-secondary-main)",
  color: "var(--mui-palette-text-secondary)",
  fontStyle: "italic",
};

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Box
        component="img"
        src="/media/blogwordcloud.png"
        alt="Word cloud representing recurring blog themes and writing ideas"
        loading="eager"
        decoding="async"
        sx={{
          width: "100%",
          aspectRatio: "16 / 9",
          objectFit: "cover",
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "var(--mui-palette-action-hover)",
        }}
      />

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
        <Typography variant="body1" sx={sectionIntroSx}>
          {subtitle}
        </Typography>
        <Box component="blockquote" sx={quoteSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            "Good start, needs more gibberish."
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          That tongue-in-cheek line from Steven Pinker's discussion on writing is funny because we
          have all seen that kind of writing.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          A simple idea enters the room wearing a clean white shirt. By the time it comes out of a
          corporate deck, academic paper, policy note, or AI-generated blog post, it is wearing a
          ten-layer winter coat of jargon: leverage stakeholder-aligned synergies to optimize
          scalable paradigms.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            Translation: we should work together better. That is the problem Pinker keeps returning
            to. Bad writing is not always caused by bad thinking. Very often, it is caused by the
            writer forgetting the reader.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The curse of knowledge
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Pinker's most useful idea is the curse of knowledge. Once we know something, we forget
          what it felt like not to know it. So we skip steps. We use shorthand. We assume the reader
          can follow our mental jump from Point A to Point Z.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          But the reader is still standing at Point B, holding a cup of coffee, wondering what just
          happened. This is why experts often write badly. Not because they are unintelligent. Quite
          the opposite. They know too much. Their mind is full of background context, invisible
          assumptions, old debates, and specialist vocabulary.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The reader does not have that map. Good writing gives the reader the map.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Clarity is not dumbing down
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          There is a dangerous myth that simple writing is shallow writing. It is not. Clear writing
          is disciplined writing. It says: I understand this well enough to explain it without
          hiding behind fog.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Feynman had the same instinct. If you cannot explain an idea simply, maybe you do not
          understand it deeply enough yet.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            A weak explanation says a large language model (LLM) is a probabilistic next-token
            prediction system trained on large-scale corpora. A useful explanation says an LLM is
            like a super-fast autocomplete trained on a huge amount of text. It predicts what words
            are likely to come next, which is why it can sound brilliant one moment and confidently
            wrong the next.
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          The second version is not childish. It is useful.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The three enemies of clear writing
        </Typography>
        {enemies.map((enemy) => (
          <Box key={enemy.heading} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: "1.25rem", md: "1.45rem" }, fontWeight: 650, lineHeight: 1.35 }}
            >
              {enemy.heading}
            </Typography>
            <Typography variant="body1" sx={bodyTextSx}>
              {enemy.body}
            </Typography>
          </Box>
        ))}
        <Typography variant="body1" sx={bodyTextSx}>
          The old rule still works: remove needless words. Not because short is always better, but
          because the reader's attention is precious.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          AI makes this more important
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          This lesson matters even more in the age of Artificial Intelligence (AI). LLMs can now
          generate grammatically polished text instantly. That is useful. But the default output
          often sounds like a polite committee wrote it after drinking lukewarm tea.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Clean grammar is not the same as good writing. AI can produce sentences, but the writer
          must supply judgment. AI can draft, but the writer must decide what matters. AI can
          summarize, but the writer must bring examples, memory, taste, humour, and lived
          experience.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            The danger is not that AI writes badly. The danger is that AI writes smoothly enough
            that we stop noticing the emptiness. A sentence can be correct and still be dead.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Write for the reader
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The real test is simple: would a smart non-expert understand this?
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          For my own writing, especially when writing for family, younger readers, or friends
          outside my field, this is the question that matters most. Not whether it sounds
          impressive. Not whether experts will know I have read enough. Not whether I can make it
          look sophisticated.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The better question is whether someone who trusts me will feel respected after reading
          this. That changes everything. You give context. You define the term. You use an example.
          You remove the show-off sentence. You explain why the idea matters.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          A better writing formula
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          A useful structure for clear blog writing is: idea, simple explanation, example, why it
          matters, and a memorable line.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {formulaSteps.map((step) => (
            <Typography key={step} component="li" variant="body1" sx={bodyTextSx}>
              {step}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          That is clear. It gives the reader something to hold.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The best writers are good hosts
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          A good writer is like a good host. A bad host says, you should know where everything is.
          A good host says, come in, the light switch is here, tea is on the table, let me show you
          the way.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          That is what clear writing does. It welcomes the reader. It does not make the reader feel
          stupid. It does not throw a dictionary at their head. It does not say keep up. It says
          come along.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The final lesson
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The funniest line remains the sharpest warning: good start, needs more gibberish. That
          should be printed and pasted above every corporate slide deck, academic abstract,
          AI-generated article, and over-engineered blog post.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Most writing does not need more sophistication. It needs more honesty. It needs more
          examples. It needs more respect for the reader.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            Words should serve ideas, not impress people. In the age of AI, that may become the most
            human writing skill of all.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
