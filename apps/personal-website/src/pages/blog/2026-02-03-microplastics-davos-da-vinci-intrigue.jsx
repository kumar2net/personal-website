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
          src="https://img.shields.io/badge/environment-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="environment badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/health-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="health badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/science-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="science badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/public-health-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="public-health badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/technology-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="technology badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/history-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="history badge"
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
          Davos Intrigue: A Costly Journey for an Easy Deal
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Our leaders flew 6,500 km one way to Davos to sign a huge MoU with a company whose CEO lives nearby. This trip burned about 2 tonnes of CO₂ per economy passenger—double for business class. They posed in front of the Alps, a backdrop they could have Photoshopped from home. Announcing a green data center by creating a carbon cloud over Europe is ironic. The optics worked, but the planet paid the price.
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
          Microplastics in Our Bodies: What Science Actually Says
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Microplastics are everywhere—in air, food, water, and dust. The recent Guardian Science Weekly podcast calmly explained that human exposure is real but many claims about plastics saturating our bodies are premature. Measuring tiny particles inside us is tricky, and some studies overstate certainty. Exposure is real; health effects are still unclear. Public health acts on plausible risks with low-cost, low-downside interventions. Microplastics fit this category well.
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
          How We Most Likely Encounter Microplastics
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Three main routes expose us to microplastics: indoor air and dust from synthetic fabrics and furniture; heating food or drinks in plastic containers; and water packaging and bottles. Inhalation matters as much as diet. The focus should be on reducing exposure in these areas rather than panicking about plastics everywhere.
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
          Practical Steps to Reduce Microplastic Exposure
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Tier 1 actions are simple and effective: avoid heating food in plastic containers, use glass or steel for hot drinks, reduce single-use bottled water, ventilate indoor spaces, and wet-clean floors to reduce dust. Tier 2 steps include using water filters, washing synthetic clothes less often, preferring natural fibers, and considering HEPA filters if affordable. Avoid extreme measures like detox products or panic-driven changes that cause more stress than benefit.
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
          Leonardo da Vinci: The Ultimate Hand Model for Robotic Surgery
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Leonardo da Vinci was more than an artist. He painted the Mona Lisa and The Last Supper. He dissected human bodies illegally to draw accurate anatomical diagrams. He designed machines with pulleys and articulated arms. His obsession with hand–eye coordination and precision inspired the surgical robot named after him. He believed the human hand, guided by intelligence, is the ultimate tool. This philosophy lives on in robotic surgery today.
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/generate/2026-02-03-microplastics-davos-da-vinci-intrigue.png"
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
            color: "var(--mui-palette-text-secondary)",
          }}
        >
          AI Generated Illustration
        </Typography>
      </Box>

    </Box>
  );
}
