import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

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
          src="https://img.shields.io/badge/personal_branding-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="personal branding badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/education-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="education badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/culture-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="culture badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/statistics-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="statistics badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/music-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="music badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/inspiration-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="inspiration badge"
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
          Claim Your Own Domain Name
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          I hesitated to advocate owning a personal domain until I bought one myself. While many of us regularly update our LinkedIn profiles, today's world demands showcasing our projects and creativity more visibly — this is often what catches the eye of recruiters and HR professionals. Since I handled the process end-to-end, I encourage you to take this step too. You can update your own content while focusing on your career or studies. The cost is minimal, usually under USD 12 (around Rs. 1000) per year. Owning your domain lets you express yourself freely without the restrictions imposed by standard content management systems.
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
          Thoughts to Ponder: Consciousness and Materialism vs Neotism
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          During a lecture by Professor Catherine Solomon in Prague, two compelling questions were posed: What and where is consciousness? And what are your thoughts on materialism versus neotism? I invite you to Google these topics but also to develop your own understanding beyond definitions. These reflections can deepen your perspective on the world and your place within it.
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
          Celebrating Tamil Nadu's GI Tag Approvals
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          The recent Geographical Indication (GI) tag approvals for Ambasamudram Choppu Saman sets brought me joy. Although I wonder if today's new-age parents still gift these traditional sets to their babies, as modern toys and stuffed animals have become more common. This recognition highlights the importance of preserving cultural heritage even as times change.
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
          Comparing Socio-economic Indicators: India and the USA
        </Typography>
        <Box sx={{ overflowX: "auto", borderRadius: 2, border: 1, borderColor: "divider" }}>
          <Table size="small" aria-label="India and USA indicator comparison">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Indicator</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>India (2024)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>USA (2024)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Context</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Population</TableCell>
                <TableCell>≈1.44 billion</TableCell>
                <TableCell>≈336 million</TableCell>
                <TableCell>India is the world’s most populous nation.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GDP Per Capita (PPP)</TableCell>
                <TableCell>≈$9,500</TableCell>
                <TableCell>≈$85,000</TableCell>
                <TableCell>Lower-middle income versus high income levels.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tertiary Educational Attainment</TableCell>
                <TableCell>≈28% (ages 18–23)</TableCell>
                <TableCell>≈51% (ages 25–34)</TableCell>
                <TableCell>Rapidly improving in India; high completion in the USA.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Secondary School Dropout Rate</TableCell>
                <TableCell>≈12.6%</TableCell>
                <TableCell>≈5.1%</TableCell>
                <TableCell>Reflects regional disparities and retention gaps.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Life Expectancy at Birth</TableCell>
                <TableCell>≈69.8 years</TableCell>
                <TableCell>≈77.5 years</TableCell>
                <TableCell>India has steadily improved over two decades.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Diabetes Prevalence</TableCell>
                <TableCell>≈11.4% of adults</TableCell>
                <TableCell>≈11.3% of adults</TableCell>
                <TableCell>Similar prevalence; India often called the “diabetes capital.”</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Heart Failure / Low LVEF</TableCell>
                <TableCell>≈8–10 million cases</TableCell>
                <TableCell>≈6 million cases</TableCell>
                <TableCell>Onset skews younger in India (mean age ~56–62).</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mobile Connections</TableCell>
                <TableCell>≈78% of population</TableCell>
                <TableCell>≈100% of population</TableCell>
                <TableCell>India still has large rural growth potential.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5G Mobile Share</TableCell>
                <TableCell>≈23% (projected end-2024)</TableCell>
                <TableCell>≈40% and above</TableCell>
                <TableCell>India expected to reach ~65% by 2029.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: "text.secondary",
            lineHeight: 1.7,
          }}
        >
          “Tertiary educational entitlement” here refers to tertiary educational attainment: the share of young adults who have completed college or university. It helps signal how ready a workforce is for advanced roles and innovation.
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
          A Musical Collaboration to Brighten Your Day
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          I came across a delightful collaboration between Rajesh Vaidhya and Sandeep that truly made my day. Their inventive switch from "Albela Sajan" to "Pibare" is a testament to creativity and musical synergy. You can watch it here: https://youtu.be/7WVNBz4WlcY?si=4MW5W-pKTcrWojDW
        </Typography>
        <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            component="a"
            href="https://youtu.be/7WVNBz4WlcY?si=4MW5W-pKTcrWojDW"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: 600,
              textTransform: "none",
              px: 2.5,
              py: 1.25,
              borderRadius: 999,
              borderWidth: 2,
            }}
          >
            Watch the collaboration
          </Button>
        </Box>
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
          Discovering Harrison Ford’s Storytelling Charm
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          I recently discovered a short video featuring Harrison Ford that I found so engaging, I watched it five times. His raconteur skills are captivating and inspiring. If you need a dose of storytelling mastery, check it out here: https://youtu.be/zfvw_vnmRYQ?si=kQleXE3SNEyJ_Hp_
        </Typography>
        <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            component="a"
            href="https://youtu.be/zfvw_vnmRYQ?si=kQleXE3SNEyJ_Hp_"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: 600,
              textTransform: "none",
              px: 2.5,
              py: 1.25,
              borderRadius: 999,
              borderWidth: 2,
            }}
          >
            Watch Harrison Ford’s short
          </Button>
        </Box>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/generate/2025-12-08-walk-the-talk.png"
          alt="Meme-style collage riffing on owning your domain and India–USA contrasts"
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
          Illustration nodding to sections 1 and 4: owning your domain and India–USA contrasts.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: "text.secondary",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          PS: Do check out our WebGL rendering at{" "}
          <Box
            component="a"
            href="http://localhost:5173/science/protein-folding"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "primary.main", fontWeight: 700 }}
          >
            /science/protein-folding
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
