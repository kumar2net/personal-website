import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-04-29-pet-ct-scan-experience-explained",
  title: "PET-CT Scan: What Happened Inside That Machine Yesterday Morning",
  description:
    "A patient-friendly explanation of PET-CT after a real scan: the tracer, the CT, why the table moved in stages, what the report shows, and how PET-CT compares with MRI, EEG, and ultrasound.",
  excerpt:
    "A patient-friendly explanation of PET-CT after a real scan: the tracer, the CT, why the table moved in stages, what the report shows, and how PET-CT compares with MRI, EEG, and ultrasound.",
  tags: ["Health", "PET-CT", "Nuclear Medicine", "Imaging", "MRI", "EEG", "Ultrasound"],
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  image: "/generate/2026-04-29-pet-ct-machine.png",
  readingTime: "~7 min",
};

const title = "PET-CT Scan: What Happened Inside That Machine Yesterday Morning";

const tags = ["Health", "PET-CT", "Nuclear Medicine", "Imaging", "MRI", "EEG", "Ultrasound"];

const tracerTypes = [
  "F-18 FDG, or fluorodeoxyglucose, is the common workhorse. It behaves like glucose, so tissues with higher sugar use can show higher uptake. This is widely used in cancer imaging, infection or inflammation questions, and some heart or brain studies.",
  "Ga-68 DOTATATE is used mainly when doctors are looking for somatostatin-receptor-positive neuroendocrine tumors.",
  "PSMA PET tracers, often Ga-68 PSMA or F-18 PSMA agents, are used for prostate cancer imaging.",
  "F-18 sodium fluoride can be used for bone-focused PET imaging.",
  "Other PET tracers exist for specific heart, brain, tumor, and research questions, but most routine whole-body oncology PET-CT scans still use F-18 FDG.",
];

const machineSteps = [
  "The table first uses a quick planning view so the technologist can confirm the body region to scan.",
  "The CT part is usually quick. It uses X-rays to create an anatomic map and can also help correct the PET signal for attenuation, meaning how tissues weaken the detected photons.",
  "The PET part is slower. The table moves in small bed positions because the detector ring sees only a section of the body at a time. At each stop, the scanner collects enough signal before moving to the next section.",
  "The repeated movement is not treatment and it is not the machine doing something new to each organ. It is mostly data collection, one slice-range at a time, later stitched into a whole-body 3D map.",
  "If breathing or body movement happens, the images can blur or misalign. That is why they ask you to lie still, and sometimes to hold your breath for part of the CT.",
];

const reportOutputs = [
  "A CT image set, showing anatomy: organs, bones, lymph nodes, lungs, and other structures.",
  "A PET image set, showing where the tracer accumulated more or less strongly.",
  "Fused PET-CT images, where the metabolic PET signal is overlaid on the CT anatomy.",
  "A written radiology or nuclear medicine report, usually with sections such as indication, tracer and dose, blood glucose value for FDG scans, technique, findings, impression, and comparison with older scans if available.",
  "Numbers such as SUV, or standardized uptake value, may appear. SUV is a semi-quantitative measure of tracer uptake, useful for context but not a stand-alone diagnosis.",
];

const comparisonRows = [
  {
    test: "PET-CT",
    sees: "Metabolism or receptor activity plus CT anatomy",
    strength: "Shows where biology is unusually active before size changes are obvious",
    limit: "Uses ionizing radiation and depends on the selected tracer",
  },
  {
    test: "MRI",
    sees: "Soft-tissue structure, fluid, blood flow patterns, diffusion, and contrast behavior",
    strength: "Excellent for brain, spine, joints, liver, pelvis, and soft tissues without ionizing radiation",
    limit: "Longer scan, sensitive to motion, metal-device restrictions, and not primarily a whole-body metabolism test",
  },
  {
    test: "EEG",
    sees: "Electrical activity from the brain through scalp electrodes",
    strength: "Very useful for seizures, brain rhythm, sleep, and real-time electrical patterns",
    limit: "Does not show tumors, lymph nodes, organs, or whole-body anatomy",
  },
  {
    test: "Ultrasound",
    sees: "Real-time echoes from high-frequency sound waves",
    strength: "Portable, fast, no ionizing radiation, excellent for fluid, pregnancy, heart motion, blood flow, gallbladder, thyroid, and guided procedures",
    limit: "Sound does not travel well through air or bone, and image quality depends heavily on body habitus and operator skill",
  },
];

const modalityCards = [
  {
    name: "PET-CT",
    signal: "Radioactive tracer",
    frequency: "Not RF: PET detects 511 keV gamma photons; CT uses diagnostic X-rays",
    question: "Where is active biology?",
    output: "Hot/cold metabolic map fused with CT anatomy",
    bestFor: "Cancer staging, treatment response, infection or inflammation questions, selected heart and brain studies",
    patientFeels: "Injection, quiet waiting period, moving table, short CT plus slower PET passes",
    radiation: "Yes: PET tracer plus CT X-rays",
    accent: "#2563EB",
  },
  {
    name: "MRI",
    signal: "Magnet + radiofrequency pulses",
    frequency: "RF pulses: about 64 MHz at 1.5T and 128 MHz at 3T",
    question: "What do soft tissues look like?",
    output: "High-detail soft-tissue images in many contrasts",
    bestFor: "Brain, spine, joints, liver, pelvis, soft tissue, vessels, and detailed local problem-solving",
    patientFeels: "Longer tunnel time, loud knocking sounds, must screen for metal and implants",
    radiation: "No ionizing radiation",
    accent: "#7C3AED",
  },
  {
    name: "EEG",
    signal: "Scalp electrodes",
    frequency: "Brain rhythms: delta 0.5-4 Hz, theta 4-8 Hz, alpha 8-13 Hz, beta 13-30 Hz, gamma 30+ Hz",
    question: "What is brain electricity doing?",
    output: "Brain-wave traces over time",
    bestFor: "Seizures, epilepsy workup, sleep studies, encephalopathy, and real-time brain rhythm questions",
    patientFeels: "Electrodes pasted on scalp, no scanner tunnel, recording while resting or stimulated",
    radiation: "No ionizing radiation",
    accent: "#059669",
  },
  {
    name: "Ultrasound",
    signal: "High-frequency sound waves",
    frequency: "Sound waves, not RF: roughly 1-20 MHz clinically, depending on probe and use",
    question: "What is moving or echoing now?",
    output: "Live grayscale, Doppler blood-flow, or 3D ultrasound images",
    bestFor: "Pregnancy, abdomen, heart echo, blood vessels, thyroid, muscles, fluid pockets, guided needles",
    patientFeels: "Gel on skin, handheld probe, real-time movement on screen",
    radiation: "No ionizing radiation",
    accent: "#EA580C",
  },
];

const sources = [
  {
    label: "RadiologyInfo: PET/CT",
    url: "https://www.radiologyinfo.org/en/info/pet",
  },
  {
    label: "NCBI Bookshelf: PET Scanning",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK559089/",
  },
  {
    label: "RadiologyInfo: How to Read Your PET-CT Radiology Report",
    url: "https://www.radiologyinfo.org/en/info/htr-your-pet-ct-radiology-report",
  },
  {
    label: "Mayo Clinic: Gallium Ga 68 DOTATATE",
    url: "https://www.mayoclinic.org/drugs-supplements/gallium-ga-68-dotatate-intravenous-route/description/drg-20312288",
  },
  {
    label: "NIH NIBIB: Magnetic Resonance Imaging",
    url: "https://www.nibib.nih.gov/science-education/science-topics/magnetic-resonance-imaging-mri",
  },
  {
    label: "Mayo Clinic: EEG",
    url: "https://www.mayoclinic.org/tests-procedures/eeg/about/pac-20393875",
  },
  {
    label: "NIH News in Health: What Is Medical Ultrasound?",
    url: "https://newsinhealth.nih.gov/2025/05/what-medical-ultrasound",
  },
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
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            Yesterday morning, April 28, 2026, I went through a PET-CT scan. This is my
            attempt to demystify what happened: the injection, the waiting, the moving
            table, the donut-shaped scanner, and the report that will eventually come
            out of it.
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          PET-CT sounds like one test, but it is really two imaging systems working
          together. PET, or positron emission tomography, looks at function: where a
          radioactive tracer goes in the body. CT, or computed tomography, looks at
          structure: the anatomy built from X-ray slices. Together they answer a more
          useful question than either can answer alone: not only &quot;where is something?&quot;
          but also &quot;what is it doing?&quot;
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          This post is not a reading of my report and not medical advice. The exact
          meaning of a PET-CT depends on the tracer used, the reason for the scan, blood
          sugar at the time of scan, timing after injection, previous imaging, and the
          clinical story.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          I was also told to come on an empty stomach: no food after 10 PM the previous
          night for the first batch of scans around 8 AM. That instruction is especially
          common for FDG PET-CT, because food and high insulin levels can change how a
          glucose-like tracer is distributed in the body.
        </Typography>
        <Box component="figure" sx={{ m: 0, display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            component="img"
            src="/generate/2026-04-29-pet-ct-machine.png"
            alt="AI-generated illustration of a modern PET-CT scanner in a hospital imaging room"
            loading="lazy"
            decoding="async"
            sx={{
              width: "100%",
              borderRadius: 2,
              border: "1px solid var(--mui-palette-divider)",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
            }}
          />
          <Typography
            component="figcaption"
            variant="caption"
            sx={{ color: "var(--mui-palette-text-secondary)", textAlign: "center" }}
          >
            AI-generated visual of a modern PET-CT scanner, included as an educational
            illustration rather than a photograph of my scan room.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The technology in plain English
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          PET is molecular imaging. CT is anatomy. The combined scan aligns the two.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          In a PET scan, the injected radiotracer contains an atom that gives off a
          positron. That positron quickly meets an electron in the body. The two
          annihilate and produce two photons travelling in almost opposite directions.
          Detector rings inside the PET scanner pick up these paired signals. A computer
          then reconstructs a 3D map of where the tracer collected.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The CT part adds a structural map. It helps the doctor locate the PET signal
          precisely: lung, liver, bone, lymph node, bowel, muscle, or something else. CT
          can also be used for attenuation correction, improving the PET calculation by
          accounting for how body tissues weaken the signal before it reaches the
          detectors.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What nuclear material was injected?
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          It is better to call it a radiotracer or radiopharmaceutical, not a nuclear
          material in the bomb-scare sense.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The injected amount is tiny and diagnostic. It is chosen to create images, not
          to treat disease. The most common whole-body PET-CT tracer is F-18 FDG. The
          &quot;F-18&quot; part is radioactive fluorine. The &quot;FDG&quot; part is a glucose-like
          molecule. Active cells use more glucose, so some cancers, infections,
          inflammatory areas, brain tissue, heart muscle, and even recently exercised
          muscles can show uptake.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {tracerTypes.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            If my scan was an FDG PET-CT, the preparation rules about fasting and blood
            glucose were not random. They are part of making the glucose-like tracer
            behave interpretably.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Why I had to wait after the injection
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          After injection, the tracer needs time to circulate and settle into tissues.
          For FDG scans, this uptake period is commonly around an hour, though protocols
          vary. That quiet waiting period matters. Talking, walking, chewing, shivering,
          or unnecessary movement can increase muscle uptake and make interpretation
          harder.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The empty-stomach instruction fits into the same logic. With FDG, the scanner is
          watching a glucose-like molecule. If I eat shortly before the scan, the body&apos;s
          insulin response can push more tracer into muscles and alter the background
          pattern. Fasting helps make the image cleaner and more comparable.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Drinking water and passing urine after the scan are also practical. Many
          tracers clear partly through the kidneys and bladder, so hydration and urination
          help reduce residual activity in the body.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What happened when my body moved inside the machine?
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The repeated table movement was the scanner building a body-wide dataset.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {machineSteps.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What output will I get?
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The useful output is not one photograph. It is a stack of images plus an
          interpreted report.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {reportOutputs.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          The most important part for a patient is usually the impression: what the
          radiologist thinks the scan means in context. A bright spot is not automatically
          cancer, and a quiet area is not automatically normal. PET-CT is powerful, but
          it still needs clinical correlation.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          PET-CT vs MRI vs EEG
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          These are not rival cameras. They answer different biological questions.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {comparisonRows.map((row) => (
            <Box
              key={row.test}
              sx={{
                border: "1px solid var(--mui-palette-divider)",
                borderRadius: 1,
                p: 2,
                display: "grid",
                gap: 1,
              }}
            >
              <Typography variant="h3" sx={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {row.test}
              </Typography>
              <Typography variant="body1" sx={bodyTextSx}>
                <strong>What it sees:</strong> {row.sees}
              </Typography>
              <Typography variant="body1" sx={bodyTextSx}>
                <strong>Strength:</strong> {row.strength}
              </Typography>
              <Typography variant="body1" sx={bodyTextSx}>
                <strong>Limit:</strong> {row.limit}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            My simplest summary: PET-CT asks &quot;where is the active biology?&quot; MRI asks
            &quot;what does the soft tissue look like in detail?&quot; EEG asks &quot;what is the
            brain&apos;s electrical activity doing over time?&quot;
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          A quick visual map
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The cleanest way to separate these tests is to ask what signal enters the body,
          what signal comes back, and what clinical question the test is built to answer.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          {modalityCards.map((card) => (
            <Box
              key={card.name}
              sx={{
                border: "1px solid var(--mui-palette-divider)",
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "var(--mui-palette-background-paper)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 2,
                  borderBottom: "1px solid var(--mui-palette-divider)",
                  background: `linear-gradient(90deg, ${card.accent}22, transparent)`,
                }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    fontWeight: 800,
                    backgroundColor: card.accent,
                    flex: "0 0 auto",
                  }}
                >
                  {card.name.slice(0, 1)}
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontSize: "1.35rem", fontWeight: 800 }}>
                    {card.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "var(--mui-palette-text-secondary)" }}>
                    {card.signal}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ p: 2, display: "grid", gap: 1.25 }}>
                <Typography variant="body1" sx={bodyTextSx}>
                  <strong>Core question:</strong> {card.question}
                </Typography>
                <Typography variant="body1" sx={bodyTextSx}>
                  <strong>Output:</strong> {card.output}
                </Typography>
                <Typography variant="body1" sx={bodyTextSx}>
                  <strong>Frequency / energy:</strong> {card.frequency}
                </Typography>
                <Typography variant="body1" sx={bodyTextSx}>
                  <strong>Best for:</strong> {card.bestFor}
                </Typography>
                <Typography variant="body1" sx={bodyTextSx}>
                  <strong>Patient experience:</strong> {card.patientFeels}
                </Typography>
                <Box
                  sx={{
                    mt: 0.5,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 999,
                    width: "fit-content",
                    maxWidth: "100%",
                    backgroundColor: `${card.accent}18`,
                    color: "var(--mui-palette-text-primary)",
                    border: `1px solid ${card.accent}55`,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                  }}
                >
                  {card.radiation}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What I will ask when the report arrives
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          I would not try to self-diagnose from a few alarming words. I would ask: what
          tracer was used, what the main impression is, whether any uptake is expected
          or physiological, whether the CT shows a matching structural abnormality, how
          this compares with older scans, and what the next clinical step is.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          PET-CT is one of those technologies that feels futuristic when you are lying
          inside it. But the core idea is elegant: put a tiny signal into the body, let
          biology distribute it, detect the escaping photons, and overlay that living
          map on anatomy.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Sources
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {sources.map((source) => (
            <Typography key={source.url} component="li" variant="body1" sx={bodyTextSx}>
              <Box
                component="a"
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                sx={{ color: "inherit" }}
              >
                {source.label}
              </Box>
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
