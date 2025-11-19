import { Box, Chip, Typography } from "@mui/material";

const tags = ["AI", "Health", "Rare Earths", "Culture"];
const heroImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";
const publishedDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const summary =
  "This week's ruminations cover the practical use of AI and data tools by friends and family, an explainer on rare earth minerals and their role in clean energy, and key health insights from Happiest Health. It also includes updates on the unit converter tool and a curated music playlist.";
const tldrItems = [
  { text: "Real-life friends using AI + R + MATLAB beat billionaire gossip any day." },
  { text: "Rare earths (LREEs + HREEs) are the silent backbone of EVs, wind, defence and electronics." },
  {
    code: "/convert",
    text: " now flags US-vs-UK imperial nuances (think 3.785 L vs 4.546 L gallons) so mixed-unit math stays honest.",
  },
  { text: "Happiest Health reminds us to pair AI optimism with doctor-led judgment and disciplined routines." },
  { text: "Protein deficits, vaccine gaps and skipped leg days need more attention than new wearables." },
  { text: "Culture break: Thirukkural set to music and a Golden Gate photo set keep the mood grounded." },
];

export default function BlogPost() {
  return (
    <Box
      data-tldr-text={summary}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              borderRadius: 999,
              fontWeight: 600,
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 3,
          bgcolor: "background.default",
        }}
      >
        <Box
          component="img"
          src={heroImage}
          alt="Notebook, coffee and skyline photo representing weekly reflections"
          loading="lazy"
          sx={{ width: "100%", height: 256, objectFit: "cover" }}
        />
      </Box>

      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "2rem", md: "2.5rem" },
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        My Ruminations: Magnets, Microbes, and Mindful Living
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
        }}
      >
        by Kumar A | {publishedDate} |{" "}
        <Box
          component="a"
          href="https://kumar2net.com"
          sx={{
            color: "primary.main",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          kumar2net.com
        </Box>
      </Typography>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 600,
            mb: 2,
          }}
        >
          No Melon Billionaire Talk, Please
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.primary" }}
        >
          The headlines want us to obsess over trillion-dollar pay packages, but I am far more interested in conversations
          that happen around our dining table. This week&apos;s joy came from hearing how friends and family bend
          technology to their will: a microbiology expert now runs AI-powered test automation pipelines, and uses R language
          for clinical trials, and an environmental sciences post-grad paints MATLAB-born charts that could hang in a
          gallery. That is the real innovation economy — curiosity plus scrappy tooling.
        </Typography>
      </Box>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 600,
            mb: 2,
          }}
        >
          Rare Earths, Explained Without the Hype
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.primary" }}
        >
          Everyone is suddenly talking about rare earth minerals, so I dug in. When people say “rare earths” they usually
          mean the 17 lanthanides, with yttrium and scandium often riding shotgun. Their magic lies in magnetic,
          luminescent, and electrochemical superpowers — the invisible glue holding much of modern hardware together.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            mt: 3,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          }}
        >
          {[
            {
              title: "Light Rare Earth Elements",
              description:
                "Lanthanum, cerium, praseodymium, neodymium — the crew we lean on for catalysts and magnets.",
              bullets: [
                "Nd/Pr enable high-torque permanent magnets.",
                "Essential for EV motors, headphones, robotics.",
                "Their supply crunch defines battery and motor pricing.",
              ],
            },
            {
              title: "Heavy Rare Earth Elements",
              description:
                "Dysprosium, terbium, lutetium, yttrium and friends that keep magnets honest at high temperatures.",
              bullets: [
                "Protect EV motors from heat fade.",
                "Critical for aerospace, defence, offshore wind turbines.",
                "Often refined in China, creating geopolitical leverage.",
              ],
            },
          ].map((card) => (
            <Box
              key={card.title}
              sx={{
                borderRadius: 2,
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 1,
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h3" sx={{ fontSize: "1.125rem", fontWeight: 600, mb: 1 }}>
                {card.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                {card.description}
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, listStyle: "disc", color: "text.primary" }}>
                {card.bullets.map((item) => (
                  <Box
                    key={item}
                    component="li"
                    sx={{ mb: 1, fontSize: "0.95rem", lineHeight: 1.6 }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.primary", mt: 3 }}
        >
          Rare earths rarely travel alone. Lithium, cobalt, nickel, graphite and silicon are fellow travellers in every
          conversation about batteries, clean grids, or high-density electronics. One offshore wind turbine can quietly
          swallow four tons of rare-earth-laced magnets. Behind every delightful gadget or AI data centre sits an unsung
          materials engineer juggling these supply chains.
        </Typography>
      </Box>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 600,
            mb: 2,
          }}
        >
          Building the <code>/convert</code> Utility
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.primary" }}
        >
          I sneaked in an update to <code>kumar2net.com/convert</code> this week. The idea is simple: help people hop
          between metric and imperial systems without second-guessing the fine print. America may love inches, miles,
          ounces, and gallons, but even those are not monolithic. A US liquid gallon clocks in at 3.785 litres, while the UK
          imperial gallon stretches to 4.546 litres — a 20% delta that can wreck a brewing recipe or an EV battery logistics
          plan. The converter now nudges you with context so you know which regional definition you are working with before
          you hit “calculate.”
        </Typography>
      </Box>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 600,
            mb: 2,
          }}
        >
          Where the Minerals Matter Most
        </Typography>
        <Box component="ul" sx={{ pl: 3, color: "text.primary" }}>
          {[
            "Permanent Magnets: NdFeB magnets spin EV motors, turbines, HDDs, robots and drone gimbals.",
            "High-Heat Performance: Dysprosium and terbium make sure those magnets survive desert test tracks and fighter-jet bays.",
            "Consumer Electronics: LEDs, displays, sensors and camera modules all borrow luminescent phosphors from the rare-earth palette.",
            "Defence & Space: Radars, stealth composites, guided systems — the playbook depends on tightly specced magnetic and optical properties.",
            "Clean Energy: From battery anodes to grid-scale storage, the energy transition is a materials transition first.",
          ].map((line) => {
            const [title, detail] = line.split(": ");
            return (
              <Box
                key={line}
                component="li"
                sx={{ mb: 1.5, fontSize: "1.05rem", lineHeight: 1.8 }}
              >
                <strong>{title}:</strong> {detail}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 600,
            mb: 2,
          }}
        >
          Happiest Health, Distilled
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.primary" }}
        >
          The November issue of Happiest Health reads like a wellness ops manual for young Indians who love technology but
          want balance. I pulled out the bits that felt actionable.
        </Typography>
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            {
              title: "Ask AI, Trust Doctors",
              text: "AI can now flag tumours, grade diabetic eye scans, and detect cancers early. Use it as a map, not a manual. Generative tools draft, doctors decide.",
            },
            {
              title: "India's Digital Health Leap",
              text: "ABDM wants every citizen to own a portable health record. Tools like Qure.ai already spot 15–20% more TB cases by reading X-rays faster. Demand privacy policies before you hand over biometrics to an app.",
            },
            {
              title: "AI on the Mind",
              text: "Chatbots are becoming confidants for Gen Z. Helpful, yes, but they cannot sense a stifled sob. If the bot knows more about your feelings than your best friend, shut the laptop and call someone.",
            },
            {
              title: "Vaccines & Immunity",
              text: "Pediatricians warn of an “immunity gap” post-pandemic. Flu, typhoid (TCV) and HPV boosters are the low-hanging fruit. Prevention is still cheaper than any AI-generated cure plan.",
            },
            {
              title: "Leg Day, Every Day",
              text: "Squats, lunges, wall sits, calf raises, single-leg stands — five moves, ten minutes. Desk bodies need stability, not guilt purchased via weekend gym binges.",
            },
            {
              title: "Protein Over Pretence",
              text: "ICMR data says young Indians still get 62% calories from carbs, only 12% from protein. Add dal, eggs and ragi before you add supplements or fancy granolas.",
            },
            {
              title: "Reset the Grimy Defaults",
              text: "Retire that year-old gym tee. Fabric fatigue breeds dermatitis faster than ageing. Replace, rewash, renew — for clothes and habits alike.",
            },
          ].map((item) => (
            <Box key={item.title}>
              <Typography variant="h3" sx={{ fontSize: "1.125rem", fontWeight: 600 }}>
                {item.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: "1.05rem", lineHeight: 1.8, color: "text.primary" }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
            mt: 3,
          }}
        >
          The editors urge us to share the issue with family. If you decode the hint — “Be H-ppy” — just press Shift+2 and
          you will get the missing symbol. Drop me a WhatsApp if the clue still dodges you.
        </Typography>
      </Box>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 600,
            mb: 2,
          }}
        >
          Music and Memory Lane
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.primary" }}
        >
          For a sonic palette cleanser, tune into Lydian Nadhaswaram&apos;s Thirukkural collaborations with some of the
          finest vocalists — I tucked the playlist under <code>/music</code>. And if you need a visual breather, the latest
          album drop features the Golden Gate Bridge standing tall against an autumn haze. Sometimes curation is the best
          creation.
        </Typography>
      </Box>

      <Box
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 2,
          p: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h3" sx={{ fontSize: "1.125rem", fontWeight: 600, mb: 2 }}>
          🔎 TL;DR
        </Typography>
        <Box component="ul" sx={{ pl: 3, color: "text.primary" }}>
          {tldrItems.map((item) => (
            <Box
              key={item.code || item.text}
              component="li"
              sx={{ mb: 1.5, fontSize: "1.05rem", lineHeight: 1.8 }}
            >
              {item.code ? (
                <>
                  <code>{item.code}</code>
                  {item.text}
                </>
              ) : (
                item.text
              )}
            </Box>
          ))}
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{
          fontStyle: "italic",
          color: "text.secondary",
        }}
      >
        PS: I bumped into the word “rumination” while flipping through The Hindu and figured sprinkling it here might make
        me sound a tad more intelligent (and cool). Mission accomplished? Also, if you are game to read the 100-page
        Happiest Health PDF, ping me on WhatsApp — I will send over the link with the password.
      </Typography>
    </Box>
  );
}
