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
          src="https://img.shields.io/badge/sleep-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="sleep badge"
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
          src="https://img.shields.io/badge/wellness-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="wellness badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Ayurveda-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Ayurveda badge"
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
          src="https://img.shields.io/badge/performance-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="performance badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/India-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="India badge"
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
          The Sleep Crisis Among Young Indians
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Young Indians face significant sleep deprivation, not from ignorance but from choice. Exposure to blue light delays melatonin release by up to 90 minutes, pushing bedtime later while morning commitments remain fixed. This leads to insufficient rest, impairing the brain’s glymphatic system responsible for clearing toxins, increasing risks of Alzheimer’s and dementia. The immune system also falters with reduced cytokine production. The remedy is straightforward but requires discipline: consistent wake times, avoiding screens 30 to 60 minutes before bed, and cutting off caffeine after mid-afternoon.
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
          Science-Based Infant Sleep Consulting
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          A new profession of baby sleep consultants uses infant circadian biology rather than folklore to guide parents. They interpret a child’s natural cues and tailor sleep schedules to developmental needs, aiming for 13.5 to 14 hours of total sleep. A key challenge is replacing problematic sleep associations, such as rocking or feeding to sleep, with gentler cues that foster self-soothing. The goal is to help a child’s biology express itself clearly, not enforce rigid control.
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
          Sensory Sleep Aids for Environmental Correction
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Weighted blankets provide gentle pressure that can reduce cortisol and increase serotonin and melatonin, benefiting those with insomnia, anxiety, ADHD, or autism spectrum disorders. Wedge pillows help keep airways open and reduce acid reflux. Blackout curtains and eye masks eliminate light pollution, improving sleep onset and stability, while white noise machines mask disruptive sounds. These aids restore bedroom conditions more aligned with human evolutionary sleep needs.
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
          Ayurveda’s Approach to Sleep Disturbance
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Traditional Ayurveda associates sleep disturbances with imbalances in vata (air) and pitta (fire) caused by irregular routines and mental stress. Treatments like Shirodhara—pouring warm herbal oil across the forehead—calm the nervous system and stimulate the pineal gland. Simpler remedies include warm milk before bed, a teaspoon of warm ghee after dinner, or dry grape decoction. Dietary changes such as avoiding spicy and oily foods that worsen pitta help restore the body’s natural transition into rest without sedation.
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
          The Unequal Burden of Sleep Disruption
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          The Happiest Health Sleep Survey 2025 reveals that while 72% of parents get six to eight hours of sleep, nearly half rate their sleep quality as average, and half awaken at least once nightly. Mothers bear a heavier burden with more frequent awakenings and delayed sleep onset. Work stress and work-life balance issues cause nearly 30% of disruptions. Sleep problems extend to children, with 28% staying awake due to screen time and social media serving as a major distraction for youth.
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
          The Limitations of Melatonin Supplements
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Young people often self-prescribe melatonin for lifestyle-driven insomnia, but melatonin is a chronobiotic signaling biological night, not a sleep inducer. Over-the-counter products vary widely in dosage and purity, with limited long-term safety data for children and adolescents. Potential effects on reproductive hormones raise concerns. Clinically, behavioral treatments, exercise, and consistent routines remain the recommended approach to naturally set circadian rhythms. Melatonin prepares the body for sleep but cannot replace the discipline to end the day.
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
            7
          </Box>
          Sleep as a Non-Negotiable for Performance
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          India’s fastest sprinter, Animesh Kujur, exemplifies treating sleep as essential discipline rather than optional recovery. He targets 10 to 12 hours of rest daily and uses 20-minute power naps to reset between events. His approach underscores that elite performance demands prioritizing rest—a lesson valuable for all of us.
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
            8
          </Box>
          Additional Highlights from This Issue
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Other topics covered include the gastrointestinal risks of common painkillers, persistent hiccups as a potential health signal, andropause symptoms and natural management, advances in lab-grown blood technologies, and the anti-aging benefits of modest caloric restriction and Mediterranean-style diets rich in compounds like resveratrol and spermidine.
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
            9
          </Box>
          Key Takeaways for Better Sleep
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          - Protect your last 30 to 60 minutes before bed by avoiding screens, as blue light delays melatonin production by up to 90 minutes.
- Darken your bedroom completely with blackout curtains or eye masks to improve sleep onset and reduce night awakenings.
- Keep wake times consistent daily to anchor your circadian rhythm and avoid extending sleep debt.
- Avoid relying on melatonin supplements as a shortcut; focus on behavioral and environmental corrections to address sleep issues at their source.
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/generate/2025-12-09-hh-dec-magazine-sleep-health-performance.png"
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
