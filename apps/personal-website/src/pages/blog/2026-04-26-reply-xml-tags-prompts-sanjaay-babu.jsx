import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-04-26-reply-xml-tags-prompts-sanjaay-babu",
  title: "Reply: XML Tags Are Useful, Not Magic",
  description:
    "A reply on prompting style: XML tags can help when boundaries matter, but Markdown, bullets, and simple English are usually enough because modern LLMs understand structure very well.",
  excerpt:
    "A reply on prompting style: XML tags can help when boundaries matter, but Markdown, bullets, and simple English are usually enough because modern LLMs understand structure very well.",
  tags: ["Reply", "AI", "Prompting", "LLMs", "Writing", "Markdown"],
  datePublished: "2026-04-26",
  dateModified: "2026-04-26",
  image: "/media/blogwordcloud.png",
  readingTime: "~3 min",
};

const title = "Reply: XML Tags Are Useful, Not Magic";

const sourceUrl = "https://www.sanjaaybabu.com/writing/using-xml-tags-";

const tags = ["Reply", "AI", "Prompting", "LLMs", "Writing", "Markdown"];

const usefulCases = [
  "You are passing multiple documents and need clean boundaries between them.",
  "You are mixing policy text, user text, examples, and task instructions in one prompt.",
  "You want a model to return structured output that another program will parse.",
  "You are building reusable prompts where predictable sections matter more than natural reading flow.",
];

const realPrinciples = [
  "State the task directly.",
  "Separate context from instructions.",
  "Give constraints in bullets.",
  "Show one or two examples when the expected output style is not obvious.",
  "Say what not to do when hallucination, verbosity, or formatting drift matters.",
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

const codeBlockSx = {
  m: 0,
  p: 2,
  overflowX: "auto",
  borderRadius: 1,
  backgroundColor: "var(--mui-palette-action-hover)",
  color: "var(--mui-palette-text-primary)",
  fontFamily: "var(--mui-fontFamily-mono, monospace)",
  fontSize: "0.95rem",
  lineHeight: 1.65,
  whiteSpace: "pre-wrap",
};

function ExampleBlock({ children }) {
  return (
    <Box component="pre" sx={codeBlockSx}>
      <Box component="code">{children}</Box>
    </Box>
  );
}

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
          {title}
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
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            My two cents: XML tags are a tool, not a law of prompting. For most prompts, Markdown
            and simple English will do.
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          I keep seeing a version of this advice: use XML tags because LLMs understand them better.
          I think that is only half true. XML can help, especially when you need hard boundaries
          between chunks of text. But treating it as the superior default feels like a fallacy.
          Modern LLMs are much smarter than that.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The model is not sitting there saying, &quot;No angle brackets, no comprehension.&quot; It is
          usually trying to infer task, context, constraints, and output style. Markdown headings,
          bullets, short labels, and plain English already give it plenty of structure.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The same prompt, two ways
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          This Markdown version is already clear.
        </Typography>
        <ExampleBlock>{`Task:
Summarize the article below.

Rules:
- Keep it under 100 words.
- Mention the main argument.
- Do not add facts not in the article.

Article:
...`}</ExampleBlock>
        <Typography variant="body1" sx={sectionIntroSx}>
          The XML version is also clear, but it is not automatically better.
        </Typography>
        <ExampleBlock>{`<task>Summarize the article below.</task>

<rules>
  <rule>Keep it under 100 words.</rule>
  <rule>Mention the main argument.</rule>
  <rule>Do not add facts not in the article.</rule>
</rules>

<article>
...
</article>`}</ExampleBlock>
        <Typography variant="body1" sx={bodyTextSx}>
          Both can work. The real win is not XML. The real win is clarity.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Bad prompt versus useful prompt
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The problem with many prompts is not that they lack tags. It is that they lack a job
          description.
        </Typography>
        <ExampleBlock>{`Make this better`}</ExampleBlock>
        <Typography variant="body1" sx={sectionIntroSx}>
          This is much better, without any XML:
        </Typography>
        <ExampleBlock>{`Rewrite this email to sound polite but direct.
Keep it under 120 words.
Preserve the original meaning.
Return only the rewritten email.

Email:
...`}</ExampleBlock>
        <Typography variant="body1" sx={bodyTextSx}>
          That prompt works because the intent, tone, length, preservation rule, and output format
          are all visible. No special syntax is doing the heavy lifting.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Where XML genuinely helps
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          I would still use tags when boundary confusion is a real risk.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {usefulCases.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <ExampleBlock>{`<customer_message>
...
</customer_message>

<policy>
...
</policy>

<task>
Decide whether the refund is allowed under the policy.
</task>`}</ExampleBlock>
        <Typography variant="body1" sx={bodyTextSx}>
          In that kind of prompt, tags act like labelled boxes. Fine. Use them. But that is a
          practical boundary device, not proof that XML is the natural language of LLMs.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What matters more
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The durable prompting principles are simpler and less fashionable.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {realPrinciples.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            LLMs do not need XML to understand structure. They need clear intent, clean context,
            explicit constraints, and good examples.
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          So my position is simple: use XML when it solves an actual boundary problem. For everyday
          prompting, Markdown and plain English are not second-class citizens. They are usually the
          most readable and maintainable format.
        </Typography>
      </Box>
    </Box>
  );
}
