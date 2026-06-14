import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-06-14-china-india-human-capital-lesson",
  title: "Why China Got Rich and India Didn't: The Human Capital Lesson India Must Not Ignore",
  description:
    "A reflective India-China development essay on why China's market opening worked on top of earlier mass human-capital preparation, and why India must now make schooling, nutrition, health, women's participation, and skills its central growth strategy.",
  excerpt:
    "China's rise was not just about opening markets earlier. It was about markets meeting a population already prepared by basic literacy, health, mobility, and social change. India's next miracle has to be people first.",
  tags: ["India", "China", "Human Capital", "Development", "Manufacturing", "Education"],
  datePublished: "2026-06-14",
  dateModified: "2026-06-14",
  image: "/generate/2026-06-14-china-india-human-capital-hero.png",
  readingTime: "~7 min",
};

const title = "Why China Got Rich and India Didn't";
const subtitle = "The human-capital lesson India must not ignore";

const bodyTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.82,
  color: "var(--mui-palette-text-primary)",
};

const mutedTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.82,
  color: "var(--mui-palette-text-secondary)",
};

const calloutSx = {
  borderLeft: "4px solid var(--mui-palette-primary-main)",
  pl: 2,
  py: 1.5,
  backgroundColor: "var(--mui-palette-action-hover)",
  borderRadius: 1,
};

function Section({ title: sectionTitle, children }) {
  return (
    <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 650 }}>
        {sectionTitle}
      </Typography>
      {children}
    </Box>
  );
}

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Box
        component="img"
        src={metadata.image}
        alt="Editorial illustration connecting factories, ports, schools, health care, nutrition, and skills as the foundation of development"
        loading="eager"
        decoding="async"
        sx={{
          width: "100%",
          aspectRatio: "16 / 9",
          objectFit: "cover",
          borderRadius: 2,
          boxShadow: "0 18px 50px rgba(15, 23, 42, 0.22)",
        }}
      />

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.875rem", md: "2.55rem" },
            fontWeight: 750,
            lineHeight: 1.18,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          {title}
        </Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.25rem", md: "1.55rem" }, fontWeight: 500 }}>
          {subtitle}
        </Typography>
        <Typography variant="body1" sx={mutedTextSx}>
          Some comparisons refuse to go away. India and China is one of them.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Two ancient civilizations. Two giant populations. Two poor countries in the middle of
          the twentieth century. Two newly formed modern states trying to escape hunger,
          illiteracy, disease, and colonial or wartime trauma.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            The question is not only why China grew faster. The deeper question is what China
            prepared before it opened its economy, and what India still has to prepare now.
          </Typography>
        </Box>
      </Box>

      <Section title="The usual answer is too simple">
        <Typography variant="body1" sx={bodyTextSx}>
          The standard explanation is familiar. China opened up in 1978. India liberalized only
          in 1991. China got a thirteen-year head start.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          That is true, but it is not enough. A thirteen-year head start cannot fully explain why
          China continued to pull ahead even after India liberalized. It cannot explain China's
          massive manufacturing machine. It cannot explain why millions of rural Chinese workers
          could move into factories, learn processes, show up in disciplined shifts, and plug into
          global supply chains at extraordinary speed.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The better answer is more uncomfortable: China did not merely open its economy. It had
          already changed its society.
        </Typography>
      </Section>

      <Section title="Mao failed economically, but changed Chinese society">
        <Typography variant="body1" sx={bodyTextSx}>
          Mao's China was brutal. The Great Leap Forward was a catastrophe. The Cultural
          Revolution tore the country apart. Millions suffered. Nothing about that should be
          romanticized.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          But one paradox remains. While Mao failed to make China rich, the Chinese state changed
          many conditions of ordinary Chinese life. It attacked old landlord power. It weakened
          traditional village authority. It pushed literacy. It expanded basic health. It pulled
          women into public and economic life. It made the family less absolute and the state more
          absolute. Often this was done violently, coercively, and in ways no humane society
          should celebrate.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Yet when Deng Xiaoping opened China to markets, China had something rare: a very poor
          population with surprisingly strong human-development foundations. That is an explosive
          combination.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Low wages attract factories, but low wages alone are not enough. Workers must be
          healthy enough to work, literate enough to train, mobile enough to migrate, and socially
          free enough to leave the village. China had created much of that workforce before it
          became rich.
        </Typography>
      </Section>

      <Section title="India built islands of excellence">
        <Typography variant="body1" sx={bodyTextSx}>
          India chose a very different path. India preserved democracy. It protected free
          elections, courts, press, pluralism, and civil society. That is no small achievement.
          India avoided the scale of Maoist horror. That matters deeply.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          But India also carried forward much of the old social order. Caste networks remained
          powerful. Land reform was uneven. Patriarchy survived legal reform. Dowry persisted
          despite being outlawed. Women's economic participation remained low. The joint family,
          caste, village, and local hierarchy continued to shape life chances.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Most damagingly, India underinvested in the basics. We built Indian Institutes of
          Technology (IITs), but neglected primary schools. We produced brilliant engineers, but
          tolerated mass illiteracy. We celebrated science, but failed sanitation. We produced
          global chief executive officers, but left millions of children undernourished.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          India created elite capability, but not universal capability. That is the central
          tragedy. India did not lack intelligence. India lacked mass preparation.
        </Typography>
      </Section>

      <Section title="The factory test">
        <Typography variant="body1" sx={bodyTextSx}>
          Manufacturing is unforgiving. A factory does not run on slogans. It runs on
          punctuality, training, process discipline, basic numeracy, logistics, women's
          participation, electricity, roads, ports, and predictable administration.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          India had talent at the top. China had capability at the base. That is why China became
          the world's workshop. India became the world's back office.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          There is nothing wrong with services. India's information-technology revolution was
          real, impressive, and globally important. But services could not absorb hundreds of
          millions of semi-skilled workers the way manufacturing did in China.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          China put its rural poor into factories. India put its educated English-speaking class
          into offices. One path transformed the masses. The other transformed the middle class.
        </Typography>
      </Section>

      <Section title="The uncomfortable democracy question">
        <Typography variant="body1" sx={bodyTextSx}>
          Some people will read this and say: "So authoritarianism works?" That is the wrong
          lesson.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          China's rise came with immense suffering, repression, and human cost. No serious Indian
          should wish for Maoism. A country is not a spreadsheet. Gross domestic product (GDP)
          cannot be used to launder mass trauma.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          But democracy cannot be used as an excuse for weak execution either. India's real
          challenge is to prove that a democracy can do the basics at scale: schooling, nutrition,
          women's safety, clean cities, public health, fast courts, simple business rules, and
          reliable infrastructure.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The lesson is not that India needed Mao. The lesson is that India needed mission-mode
          human development.
        </Typography>
      </Section>

      <Section title="India's next opportunity">
        <Typography variant="body1" sx={bodyTextSx}>
          India still has a chance. In fact, India may be entering its most important decade since
          1991. Supply chains are shifting. China is aging. Global companies want alternatives.
          India has digital public infrastructure, a huge market, improving roads, startup energy,
          and geopolitical relevance.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          But none of that is enough unless India invests in ordinary Indians. Not just elite
          universities: primary schools. Not just Artificial Intelligence (AI) missions:
          anganwadis and nutrition. Not just expressways: walkable, livable industrial towns. Not
          just speeches about women's empowerment: safe transport, jobs, property rights, and
          childcare.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          And not just ease of doing business for billion-dollar companies. India needs ease of
          working, learning, moving, and living for ordinary families.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The real "China plus one" opportunity is not about replacing China's factories alone. It
          is about upgrading India's people.
        </Typography>
      </Section>

      <Section title="The real lesson">
        <Typography variant="body1" sx={bodyTextSx}>
          China's story says that when markets meet prepared people, growth can explode. India's
          story says that when markets meet uneven human capital, growth happens, but it remains
          narrower, slower, and more unequal than it should be.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          India does not need to imitate China's politics. It should not imitate China's
          brutality. But India must learn from China's seriousness about human capability.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The next Indian miracle will not be built only by chief executive officers, coders,
          ministers, unicorn founders, or stock-market investors. It will be built when the
          average Indian child is well-fed, well-taught, healthy, safe, skilled, and free enough
          to move toward opportunity.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            Not socialism. Not capitalism. Not authoritarianism. Not mere liberalization. People
            first. Everything else is commentary.
          </Typography>
        </Box>
      </Section>
    </Box>
  );
}
