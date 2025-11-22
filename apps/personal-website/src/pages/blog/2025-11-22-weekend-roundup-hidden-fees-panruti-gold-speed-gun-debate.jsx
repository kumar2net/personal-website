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
          src="https://img.shields.io/badge/digital_transparency-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="digital transparency badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/agriculture-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="agriculture badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/exports-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="exports badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/geographical_indication-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="geographical indication badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Japan_economy-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Japan economy badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/cricket-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="cricket badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/sports_metrics-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="sports metrics badge"
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
          The End of Drip Pricing and Other Dark Patterns
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Have you ever booked a flight only to find the price increasing mysteriously by the time you check out? That's "Drip Pricing," a deceptive practice where companies add fees gradually during the buying process instead of showing the full price upfront. This week, new regulations have classified this as a "Dark Pattern" and require that the headline price equals the final price. This is a win for transparency and consumer rights.

Beyond Drip Pricing, be aware of other dark patterns like the "Roach Motel"—subscriptions that are easy to enter but hard to leave; "Confirmshaming," where sites guilt you into opting in; and "False Urgency," where countdown timers reset to pressure you into quick decisions. Staying vigilant helps us avoid these traps.
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
          The Agriculture and Export Boom: Hyper-Local is Going Global
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          India is witnessing a transformative wave in agriculture with a focus on natural farming and local produce reaching global markets. The Prime Minister's recent visit to Coimbatore emphasized establishing Bio-Input Resource Centers to make natural farming inputs more accessible and introducing fast-track certification to help farmers secure premium prices.

Exports are diversifying beyond staples like Basmati. Specialty teas such as White and Oolong are gaining popularity (**I had never even heard of these variants before this week**), Moringa powder is becoming a sought-after superfood in the Gulf, and indigenous rice varieties—totaling around 1,000—are being promoted for their climate resilience and nutrition. **Why so many rice varieties when everyone keeps telling us to cut carbs?** Because the world still wants what India grows, and the healthier, more diverse the basket, the better. This trend reflects a growing global appetite for unique, healthy Indian foods.
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
          GI Tags: Protecting Cultural Heritage with Tamil Nadu Leading the Way
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Geographical Indication (GI) tags certify products that have unique qualities tied to their origin, helping protect cultural heritage and authenticity. This week, Tamil Nadu celebrated the launch of the official GI logo for Manapparai Murukku, distinguishing authentic twice-fried murukku from imitations.

New GI tags approved for 2024-25 highlight regional diversity: Panruti Cashew & Jackfruit known for their rich taste due to red soil; Puliyangudi Acid Lime crucial for pickles; Ramnad Chithirai Kar Arisi, a drought-resistant rice with a low glycemic index; and Odisha's Similipal Kai Chutney made from red weaver ants, showcasing tribal culinary knowledge. **I love how a snack I grew up with now has paperwork to prove its authenticity—heritage with receipts.** These tags help preserve tradition while opening markets.
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
          The Japanese Debt Paradox: A Unique Economic Model
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Japan holds the highest national debt relative to GDP globally, yet it remains economically stable. This paradox is because Japan mostly borrows from its own citizens and institutions, creating an insulated debt bubble unlike countries reliant on foreign lenders. However, with an aging population and a shrinking workforce on the horizon, economists are closely monitoring whether this model will be sustainable in the coming years.
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
          The Speed Gun Debate: Why KMPH Makes More Sense in Cricket
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          As the Ashes cricket series unfolds with fast bowlers like Jofra Archer dominating, a debate continues over measuring speed in kilometers per hour (kmph) versus miles per hour (mph). I argue that kmph is superior for impact and global understanding. Seeing "150 kmph" instantly communicates express pace to audiences in metric countries like India, Australia, and South Africa, whereas "93 mph" doesn't resonate as universally. Standardizing to kmph simplifies the game’s comprehension worldwide.
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
          Final Thoughts: Awareness is Our Best Tool
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          From spotting digital pricing tricks to recognizing authentic regional products and understanding global economic nuances, this week’s theme is clear: awareness empowers us. Although the world grows more complex, evolving regulations, certification systems, and informed consumers help us navigate challenges more confidently. Whether checking a cashew’s GI tag or a website’s pricing, staying alert keeps us one step ahead.
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/generate/2025-11-22-weekend-roundup-hidden-fees-panruti-gold-speed-gun-debate.png"
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
