import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-06-07-seagrass-meadows-ocean-engineering-namritha",
  title: "From Seagrass Meadows to Ocean Engineering: A Proud Maama's Note for Namritha",
  description:
    "A family note celebrating Namritha Ramakrishnan's University of Central Florida master's thesis defense on seagrass, waves, and sediment transport, and her funded PhD in Ocean Engineering at the University of New Hampshire.",
  excerpt:
    "A family note celebrating Namritha Ramakrishnan's master's thesis defense on seagrass, waves, and sediment transport, and her funded PhD in Ocean Engineering.",
  tags: [
    "Family",
    "STEM",
    "Ocean Engineering",
    "Seagrass",
    "Coastal Resilience",
    "Graduate School",
  ],
  datePublished: "2026-06-07",
  dateModified: "2026-06-07",
  image:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  readingTime: "~5 min",
};

const title =
  "From Seagrass Meadows to Ocean Engineering: A Proud Maama's Note for Namritha";

const tags = metadata.tags;

const bodyTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "var(--mui-palette-text-primary)",
};

const mutedTextSx = {
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

const thesisDetails = [
  "Master of Science thesis in Civil Engineering, Water Resources, at the University of Central Florida.",
  "Thesis title: Seasonal Seagrass Canopy Dynamics Modulate Wave Transformation and Sediment Transport.",
  "Field work in Mosquito Lagoon, Florida, comparing seagrass-covered areas with nearby bare sediment areas.",
  "A funded PhD position in Ocean Engineering at the University of New Hampshire.",
];

const gratitudeLines = [
  "Mentors who guided the science and asked the hard questions.",
  "Lab mates and collaborators who helped with field data, sediment processing, and analysis.",
  "Parents who encouraged her to attempt what once looked out of reach.",
  "A partner, brother, sister-in-law, and family who kept showing up through the long days.",
];

function TagBadges() {
  return (
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
            src={`https://img.shields.io/badge/${label}-0F766E?style=for-the-badge&labelColor=1F2937&logoColor=white`}
            alt={`${tag} badge`}
            loading="lazy"
            decoding="async"
            sx={{ height: 28, width: "auto" }}
          />
        );
      })}
    </Box>
  );
}

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
      <TagBadges />

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.875rem", md: "2.5rem" },
            fontWeight: 750,
            lineHeight: 1.2,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          {title}
        </Typography>
        <Typography variant="body1" sx={mutedTextSx}>
          Some moments look simple from the outside: a thesis title, a defense date, a
          committee, a university room, a formal announcement.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            But for those of us who know the journey behind it, this is not just another
            academic event. It is years of effort, doubt, fieldwork, writing, rewriting,
            persistence, and finally the confidence to stand up and defend one's own work.
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          Namritha Ramakrishnan has defended her Master of Science thesis in Civil
          Engineering, Water Resources, at the University of Central Florida. Her thesis,
          "Seasonal Seagrass Canopy Dynamics Modulate Wave Transformation and Sediment
          Transport," may sound technical at first. Beneath those scientific words is a
          beautiful and meaningful idea: she studied how underwater seagrass meadows
          interact with waves, influence water movement, and affect how sediment moves in
          coastal environments.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          In simple terms, she studied how nature itself helps shape and protect
          coastlines. That is something truly worth celebrating.
        </Typography>
      </Box>

      <Box>
        <Box
          component="img"
          src={metadata.image}
          alt="Waves rolling across coastal water"
          loading="eager"
          decoding="async"
          sx={{
            width: "100%",
            height: { xs: 240, sm: 340 },
            objectFit: "cover",
            borderRadius: 2,
            boxShadow: "0 16px 45px rgba(15, 23, 42, 0.18)",
            my: 0,
          }}
        />
        <Typography variant="body2" sx={{ mt: 1, color: "var(--mui-palette-text-secondary)" }}>
          Coastal systems are not just scenery. They are living infrastructure.
        </Typography>
      </Box>

      <Section title="A young researcher studying what the world badly needs">
        <Typography variant="body1" sx={bodyTextSx}>
          Coastlines across the world are under pressure from storms, erosion, climate
          change, sea-level rise, human activity, and ecological damage. The old instinct
          was often to build walls, pour concrete, and fight nature.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The future will need something wiser: engineers and scientists who understand
          how to work with nature through seagrass meadows, wetlands, mangroves, reefs,
          and other living systems that can protect coastlines while also supporting life.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          That is where Namritha's work becomes important. She studied how seagrass
          changes through the season - its height, density, and coverage - and how those
          changes affect wave energy, suspended sediment, turbulence, and sediment
          transport. This is practical, future-facing research.
        </Typography>
      </Section>

      <Section title="This was not easy science">
        <Typography variant="body1" sx={bodyTextSx}>
          What I admire most is that this was not simply a desk-based project. This was
          field science.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {thesisDetails.map((detail) => (
            <Typography key={detail} component="li" variant="body1" sx={bodyTextSx}>
              {detail}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          Field science means real water, real weather, real instruments, real field
          conditions, and real data that rarely behaves neatly. Anyone can admire science
          from a distance. Doing science means patience. It means confusion. It means
          checking and rechecking. It means learning to trust the process even when the
          results are not immediately obvious.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Namritha did not just study a subject. She stayed with a difficult question
          long enough to produce knowledge. That is a big step in any academic life.
        </Typography>
      </Section>

      <Section title="What a thesis defense really means">
        <Typography variant="body1" sx={bodyTextSx}>
          A thesis defense is not just a presentation. It is a moment of ownership. It
          asks: do you understand your work, can you explain what you did, can you defend
          your methods, and can you connect your research to the larger world?
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          By reaching this milestone, Namritha has crossed an important threshold. She
          has moved from being only a learner of knowledge to becoming a creator of
          knowledge.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            Her committee - Dr. Kelly Kibler, Dr. Thomas Wahl, and Dr. Jennifer Hansen -
            represents the seriousness behind the work. Their guidance, questioning, and
            support helped shape this thesis into a real contribution.
          </Typography>
        </Box>
      </Section>

      <Section title="The heart behind the achievement">
        <Typography variant="body1" sx={bodyTextSx}>
          The acknowledgments section of Namritha's thesis touched me deeply because it
          reminds us of something true: nothing hard was ever accomplished alone.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {gratitudeLines.map((line) => (
            <Typography key={line} component="li" variant="body1" sx={bodyTextSx}>
              {line}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          She thanks her Appa and Amma for encouraging her to attempt what seemed out of
          reach, and for reassuring her that she could accomplish anything she set her
          heart to. That line alone says so much about parenting. The best parents do
          not merely protect children from difficulty. They give them the courage to
          attempt difficult things.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Then came a line that, as her Kumar maama, I will quietly treasure for a long
          time. Namritha thanked her uncle Kumar for inspiring her to pursue a career in
          STEM by living with curiosity.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          What can I say to that? For someone like me, who has always believed that
          curiosity is not a hobby but a way of living, this is one of the most
          meaningful acknowledgments I could receive.
        </Typography>
      </Section>

      <Section title="And now, a funded PhD in Ocean Engineering">
        <Typography variant="body1" sx={bodyTextSx}>
          As if defending her master's thesis was not already a proud enough moment,
          Namritha has now received even more wonderful news: a funded PhD position at
          the University of New Hampshire in Ocean Engineering.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          A funded PhD offer is not just admission. It is recognition. It means a
          university is willing to invest in her potential, her training, and her future
          contribution to the field.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          From studying seagrass canopy dynamics, waves, and sediment transport, she is
          now moving into the broader world of Ocean Engineering - a field that will
          matter more and more in the coming decades. The oceans are powerful, fragile,
          and central to the future of our planet. We will need people who understand
          waves, coasts, marine systems, climate stress, infrastructure, ecology, and
          engineering together.
        </Typography>
      </Section>

      <Section title="Congratulations, Namritha">
        <Typography variant="body1" sx={bodyTextSx}>
          Congratulations, Namritha, on defending your master's thesis. Congratulations
          on your funded PhD position at the University of New Hampshire in Ocean
          Engineering.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          You have chosen a path that is intellectually demanding and deeply relevant to
          the future of our world. You studied seagrass, waves, sediment, and coastal
          systems - but in a larger sense, you are learning how nature and engineering
          can speak to each other.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            As your Kumar maama, I feel proud, moved, and grateful: proud of your
            achievement, moved by your acknowledgment, and grateful that curiosity, in
            some small way, became part of your journey.
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          May your next chapter bring strong mentors, generous collaborators, bold
          research questions, and the courage to keep going when the work becomes
          difficult. The coastline needs thoughtful scientists. The ocean needs careful
          engineers. Our family is lucky to celebrate someone who is becoming both.
        </Typography>
        <Typography variant="body1" sx={{ ...bodyTextSx, fontWeight: 650 }}>
          Well done, Namritha. Onward - from seagrass meadows to the open ocean.
        </Typography>
      </Section>
    </Box>
  );
}
