import { Box, Divider, Typography } from "@mui/material";

const badges = [
  "AI",
  "Energy",
  "Kardashev Scale",
  "Feynman Explainer",
  "Bitcoin",
  "Infrastructure",
];

const scaleCards = [
  {
    eyebrow: "Humanity today",
    value: "~18 TW",
    body: "On the common back-of-the-envelope estimate, this puts us around Type 0.73.",
    tone: "teal",
  },
  {
    eyebrow: "Type I benchmark",
    value: "~10,000 TW",
    body: "That sounds close to 0.73, but the scale is logarithmic. The jump is roughly 500 to 600 times more usable power.",
    tone: "amber",
  },
  {
    eyebrow: "Type II benchmark",
    value: "The Sun",
    body: "A Type II civilisation would capture the full output of its star. That is not a gap. That is a different universe of engineering.",
    tone: "violet",
  },
];

const buildBadgeUrl = (label) =>
  `https://img.shields.io/badge/${encodeURIComponent(label)}-0F766E?style=for-the-badge&labelColor=111827&logoColor=white`;

export const metadata = {
  slug: "2026-03-22-kardashev-scale-ai-energy-bottleneck",
  title:
    "The Kardashev Scale, Explained the Feynman Way: AI's Real Bottleneck Is Energy",
  description:
    "A plain-language explainer inspired by Uchiha Itachi's note: why the road from today's AI boom to a Type I civilisation runs through grids, reactors, transmission lines, cooling, and efficiency per joule.",
  excerpt:
    "A plain-language explainer inspired by Uchiha Itachi's note: why the road from today's AI boom to a Type I civilisation runs through grids, reactors, transmission lines, cooling, and efficiency per joule.",
  tags: [
    "AI",
    "Energy",
    "Kardashev Scale",
    "Feynman Explainer",
    "Bitcoin",
    "Infrastructure",
  ],
  datePublished: "2026-03-22",
  dateModified: "2026-03-22",
  image: "/generate/2026-03-22-kardashev-scale-ai-energy-bottleneck-hero.png",
  readingTime: "~6 min",
};

function Bubble({ children, tone = "teal" }) {
  const palette = {
    teal: {
      bg: "rgba(13, 148, 136, 0.14)",
      color: "#0f766e",
      border: "rgba(13, 148, 136, 0.26)",
    },
    amber: {
      bg: "rgba(245, 158, 11, 0.14)",
      color: "#b45309",
      border: "rgba(245, 158, 11, 0.26)",
    },
    violet: {
      bg: "rgba(124, 58, 237, 0.14)",
      color: "#6d28d9",
      border: "rgba(124, 58, 237, 0.26)",
    },
  };

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: "50%",
        fontWeight: 800,
        fontSize: "1rem",
        bgcolor: palette[tone].bg,
        color: palette[tone].color,
        border: "1px solid",
        borderColor: palette[tone].border,
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

function SectionHeading({ number, children, tone = "teal" }) {
  return (
    <Typography
      variant="h2"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        fontSize: { xs: "1.45rem", md: "1.9rem" },
        fontWeight: 800,
        letterSpacing: "-0.02em",
        mb: 0,
      }}
    >
      <Bubble tone={tone}>{number}</Bubble>
      {children}
    </Typography>
  );
}

function MetricCard({ eyebrow, value, body, tone }) {
  const accent = {
    teal: "#0f766e",
    amber: "#b45309",
    violet: "#6d28d9",
  }[tone];

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "var(--mui-palette-background-paper)",
        border: "1px solid",
        borderColor: "var(--mui-palette-divider)",
        boxShadow: 1,
        display: "grid",
        gap: 1,
      }}
    >
      <Typography
        variant="overline"
        sx={{
          color: accent,
          letterSpacing: 1.4,
          fontWeight: 700,
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontSize: { xs: "1.5rem", md: "1.85rem" },
          fontWeight: 800,
          letterSpacing: "-0.03em",
          m: 0,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "var(--mui-palette-text-secondary)",
          lineHeight: 1.75,
        }}
      >
        {body}
      </Typography>
    </Box>
  );
}

function KScaleGraphic() {
  return (
    <Box
      component="svg"
      viewBox="0 0 980 340"
      role="img"
      aria-labelledby="k-scale-title k-scale-desc"
      sx={{
        width: "100%",
        height: "auto",
        display: "block",
        borderRadius: 3,
        bgcolor: "var(--mui-palette-background-paper)",
        boxShadow: 1,
      }}
    >
      <title id="k-scale-title">
        Logarithmic ruler for the Kardashev scale
      </title>
      <desc id="k-scale-desc">
        A Feynman-style chart showing that moving from Type 0.73 to Type I
        sounds small but requires roughly 500 to 600 times more usable power.
      </desc>
      <defs>
        <linearGradient id="ruleGlow" x1="80" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14b8a6" />
          <stop offset="0.58" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.16" />
        </filter>
      </defs>

      <rect x="0" y="0" width="980" height="340" rx="24" fill="transparent" />
      <text x="48" y="48" fill="currentColor" fontSize="24" fontWeight="800">
        The Feynman trick here is simple: the scale is logarithmic.
      </text>
      <text x="48" y="78" fill="#64748b" fontSize="17">
        Every 0.1 step means roughly 10 times more power. So 0.73 to 1.0 is not a stroll. It is a cliff.
      </text>

      <line
        x1="82"
        y1="192"
        x2="902"
        y2="192"
        stroke="url(#ruleGlow)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {[0, 0.5, 1, 1.5, 2].map((tick) => {
        const x = 82 + (tick / 2) * 820;
        return (
          <g key={tick}>
            <line x1={x} y1="172" x2={x} y2="212" stroke="#94a3b8" strokeWidth="3" />
            <text x={x} y="238" textAnchor="middle" fill="#64748b" fontSize="16">
              {tick}
            </text>
          </g>
        );
      })}

      <g transform="translate(381 0)">
        <line x1="0" y1="126" x2="0" y2="192" stroke="#0f766e" strokeWidth="4" />
        <circle cx="0" cy="126" r="12" fill="#14b8a6" />
        <rect
          x="-118"
          y="40"
          width="236"
          height="62"
          rx="18"
          fill="rgba(20,184,166,0.12)"
          stroke="rgba(20,184,166,0.26)"
          filter="url(#softShadow)"
        />
        <text x="0" y="66" textAnchor="middle" fill="#0f766e" fontSize="17" fontWeight="800">
          Type 0.73
        </text>
        <text x="0" y="88" textAnchor="middle" fill="#475569" fontSize="14">
          roughly where we sit today
        </text>
      </g>

      <g transform="translate(492 0)">
        <line x1="0" y1="126" x2="0" y2="192" stroke="#b45309" strokeWidth="4" />
        <circle cx="0" cy="126" r="12" fill="#f59e0b" />
        <rect
          x="-124"
          y="244"
          width="248"
          height="62"
          rx="18"
          fill="rgba(245,158,11,0.12)"
          stroke="rgba(245,158,11,0.26)"
          filter="url(#softShadow)"
        />
        <text x="0" y="270" textAnchor="middle" fill="#b45309" fontSize="17" fontWeight="800">
          Type I
        </text>
        <text x="0" y="292" textAnchor="middle" fill="#475569" fontSize="14">
          roughly 500 to 600x more usable power
        </text>
      </g>

      <g transform="translate(902 0)">
        <line x1="0" y1="126" x2="0" y2="192" stroke="#6d28d9" strokeWidth="4" />
        <circle cx="0" cy="126" r="12" fill="#7c3aed" />
        <rect
          x="-142"
          y="40"
          width="180"
          height="62"
          rx="18"
          fill="rgba(124,58,237,0.12)"
          stroke="rgba(124,58,237,0.26)"
          filter="url(#softShadow)"
        />
        <text x="-52" y="66" textAnchor="middle" fill="#6d28d9" fontSize="17" fontWeight="800">
          Type II
        </text>
        <text x="-52" y="88" textAnchor="middle" fill="#475569" fontSize="14">
          full stellar output
        </text>
      </g>

      <path d="M392 126C411 108 441 108 480 126" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 6" fill="none" />
      <text x="438" y="114" textAnchor="middle" fill="#b45309" fontSize="15" fontWeight="700">
        sounds close
      </text>
    </Box>
  );
}

function EnergyChainGraphic() {
  const boxStyle = {
    fill: "rgba(15, 23, 42, 0.04)",
    stroke: "rgba(15, 23, 42, 0.12)",
    strokeWidth: 1.5,
  };

  return (
    <Box
      component="svg"
      viewBox="0 0 980 350"
      role="img"
      aria-labelledby="energy-chain-title energy-chain-desc"
      sx={{
        width: "100%",
        height: "auto",
        display: "block",
        borderRadius: 3,
        bgcolor: "var(--mui-palette-background-paper)",
        boxShadow: 1,
      }}
    >
      <title id="energy-chain-title">AI energy chain infographic</title>
      <desc id="energy-chain-desc">
        A simplified chain showing a user prompt turning into compute,
        cooling, substations, and power generation, with a note that the
        energy system tends to move slower than technology deployment.
      </desc>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10Z" fill="#0f766e" />
        </marker>
      </defs>

      <text x="48" y="48" fill="currentColor" fontSize="24" fontWeight="800">
        AI is not one machine. It is a whole electricity chain.
      </text>
      <text x="48" y="78" fill="#64748b" fontSize="17">
        The software headline hides racks, cooling loops, transformers, backup systems, and the grid behind them.
      </text>

      <g transform="translate(48 124)">
        <rect width="128" height="72" rx="20" style={boxStyle} />
        <text x="64" y="34" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="700">
          Prompt
        </text>
        <text x="64" y="56" textAnchor="middle" fill="#64748b" fontSize="14">
          training or inference
        </text>
      </g>

      <g transform="translate(220 124)">
        <rect width="150" height="72" rx="20" style={boxStyle} />
        <text x="75" y="34" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="700">
          Accelerators
        </text>
        <text x="75" y="56" textAnchor="middle" fill="#64748b" fontSize="14">
          GPUs and AI chips
        </text>
      </g>

      <g transform="translate(414 124)">
        <rect width="136" height="72" rx="20" style={boxStyle} />
        <text x="68" y="34" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="700">
          Cooling
        </text>
        <text x="68" y="56" textAnchor="middle" fill="#64748b" fontSize="14">
          heat has to go somewhere
        </text>
      </g>

      <g transform="translate(594 124)">
        <rect width="144" height="72" rx="20" style={boxStyle} />
        <text x="72" y="34" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="700">
          Substation
        </text>
        <text x="72" y="56" textAnchor="middle" fill="#64748b" fontSize="14">
          transformers and backup
        </text>
      </g>

      <g transform="translate(782 124)">
        <rect width="150" height="72" rx="20" style={boxStyle} />
        <text x="75" y="34" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="700">
          Power supply
        </text>
        <text x="75" y="56" textAnchor="middle" fill="#64748b" fontSize="14">
          grid, storage, generation
        </text>
      </g>

      <path d="M176 160H220" stroke="#0f766e" strokeWidth="4" markerEnd="url(#arrow)" />
      <path d="M370 160H414" stroke="#0f766e" strokeWidth="4" markerEnd="url(#arrow)" />
      <path d="M550 160H594" stroke="#0f766e" strokeWidth="4" markerEnd="url(#arrow)" />
      <path d="M738 160H782" stroke="#0f766e" strokeWidth="4" markerEnd="url(#arrow)" />

      <rect x="48" y="236" width="884" height="72" rx="24" fill="rgba(14, 165, 233, 0.08)" stroke="rgba(14, 165, 233, 0.18)" />
      <text x="72" y="266" fill="#0c4a6e" fontSize="18" fontWeight="800">
        Why the energy point matters now
      </text>
      <text x="72" y="291" fill="#475569" fontSize="15">
        The IEA's 2025 Energy and AI report says data centres used about 415 TWh in 2024 and could reach roughly 945 TWh by 2030 in its base case.
      </text>
      <text x="72" y="312" fill="#475569" fontSize="15">
        The software stack can move in months. Substations, transmission, and firm power usually move much slower.
      </text>
    </Box>
  );
}

function FlexibleLoadGraphic() {
  return (
    <Box
      component="svg"
      viewBox="0 0 980 280"
      role="img"
      aria-labelledby="bitcoin-graphic-title bitcoin-graphic-desc"
      sx={{
        width: "100%",
        height: "auto",
        display: "block",
        borderRadius: 3,
        bgcolor: "var(--mui-palette-background-paper)",
        boxShadow: 1,
      }}
    >
      <title id="bitcoin-graphic-title">
        Flexible-load explanation for Bitcoin mining
      </title>
      <desc id="bitcoin-graphic-desc">
        A balanced Feynman-style diagram showing the bullish case for Bitcoin
        mining as interruptible demand, along with a note that its system value
        depends on local grid conditions.
      </desc>
      <defs>
        <marker id="flowArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10Z" fill="#b45309" />
        </marker>
      </defs>

      <text x="48" y="46" fill="currentColor" fontSize="24" fontWeight="800">
        Bitcoin is the strange side character in the story.
      </text>
      <text x="48" y="76" fill="#64748b" fontSize="17">
        The strongest case for miners is not monetary philosophy. It is that they can behave like interruptible demand.
      </text>

      <g transform="translate(52 116)">
        <rect width="224" height="92" rx="24" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.26)" />
        <text x="112" y="36" textAnchor="middle" fill="#b45309" fontSize="18" fontWeight="800">
          Cheap or stranded power
        </text>
        <text x="112" y="60" textAnchor="middle" fill="#475569" fontSize="14">
          off-peak wind, remote hydro,
        </text>
        <text x="112" y="80" textAnchor="middle" fill="#475569" fontSize="14">
          curtailed generation
        </text>
      </g>

      <g transform="translate(378 116)">
        <rect width="224" height="92" rx="24" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.26)" />
        <text x="112" y="36" textAnchor="middle" fill="#0f766e" fontSize="18" fontWeight="800">
          Flexible mining load
        </text>
        <text x="112" y="60" textAnchor="middle" fill="#475569" fontSize="14">
          buys power when it is cheap
        </text>
        <text x="112" y="80" textAnchor="middle" fill="#475569" fontSize="14">
          can switch off when the grid tightens
        </text>
      </g>

      <g transform="translate(704 116)">
        <rect width="224" height="92" rx="24" fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.26)" />
        <text x="112" y="36" textAnchor="middle" fill="#6d28d9" fontSize="18" fontWeight="800">
          Claimed system benefit
        </text>
        <text x="112" y="60" textAnchor="middle" fill="#475569" fontSize="14">
          monetise early capacity,
        </text>
        <text x="112" y="80" textAnchor="middle" fill="#475569" fontSize="14">
          then release it when needed
        </text>
      </g>

      <path d="M276 162H378" stroke="#b45309" strokeWidth="4" markerEnd="url(#flowArrow)" />
      <path d="M602 162H704" stroke="#b45309" strokeWidth="4" markerEnd="url(#flowArrow)" />

      <rect x="52" y="226" width="876" height="30" rx="15" fill="rgba(15,23,42,0.04)" />
      <text x="490" y="246" textAnchor="middle" fill="#475569" fontSize="14">
        Important caveat: this helps only in some places and market designs. Flexible demand is useful. It is not magic.
      </text>
    </Box>
  );
}

function SourceList() {
  return (
    <Box component="ul" sx={{ display: "grid", gap: 1.25, pl: 3 }}>
      <li>
        <a href="https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai" target="_blank" rel="noreferrer">
          IEA, Energy and AI (2025)
        </a>
        {" "}
        for current data-centre electricity demand and the base-case outlook to 2030.
      </li>
      <li>
        <a href="https://blog.google/outreach-initiatives/sustainability/google-kairos-power-nuclear-energy-agreement/" target="_blank" rel="noreferrer">
          Google&apos;s October 2024 Kairos Power agreement
        </a>
        {" "}
        as one concrete sign that AI-era electricity planning is moving toward firmer power.
      </li>
      <li>
        <a href="https://www.aboutamazon.com/news/sustainability/amazon-nuclear-small-modular-reactor-net-carbon-zero" target="_blank" rel="noreferrer">
          Amazon&apos;s October 2024 nuclear-energy agreements
        </a>
        {" "}
        for data-centre-related power planning.
      </li>
      <li>
        <a href="https://investors.constellationenergy.com/static-files/1b46f64b-8010-4916-8f50-a350721c8578" target="_blank" rel="noreferrer">
          Constellation&apos;s September 2024 announcement on the Microsoft power purchase agreement
        </a>
        {" "}
        tied to restarting Three Mile Island Unit 1 as the Crane Clean Energy Center.
      </li>
    </Box>
  );
}

export default function BlogPost() {
  return (
    <Box
      component="article"
      data-tldr-text="On the usual back-of-the-envelope estimate, humanity is only around Type 0.73 on the Kardashev scale. That sounds close to Type I, but the scale is logarithmic, so reaching Type I means roughly 500 to 600 times more usable power. The point of AI is not only better models. It is whether grids, substations, cooling, transmission, and firm generation can keep up with compute demand."
      sx={{ display: "grid", gap: 5 }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
        {badges.map((badge) => (
          <Box
            key={badge}
            component="img"
            src={buildBadgeUrl(badge)}
            alt={`${badge} badge`}
            loading="lazy"
            decoding="async"
            sx={{ height: 28, width: "auto", my: 0 }}
          />
        ))}
      </Box>

      <Box sx={{ display: "grid", gap: 2 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.96rem",
            color: "var(--mui-palette-text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontWeight: 700,
          }}
        >
          Sparked by a sharp note from Uchiha Itachi
        </Typography>

        <Typography
          component="h1"
          variant="h1"
          sx={{
            fontSize: { xs: "2.3rem", md: "3.2rem" },
            lineHeight: 1.04,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            m: 0,
          }}
        >
          The Kardashev Scale, Explained the Feynman Way: AI&apos;s Real Bottleneck Is Energy
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: "1.15rem",
            lineHeight: 1.85,
            color: "var(--mui-palette-text-primary)",
            maxWidth: 760,
          }}
        >
          The next great AI model is not waiting only for a smarter algorithm. It is also waiting for a bigger power plug.
        </Typography>
      </Box>

      <Box
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(8,47,73,0.92) 48%, rgba(120,53,15,0.88) 100%)",
          color: "#f8fafc",
          display: "grid",
          gap: 2,
          overflow: "hidden",
          boxShadow: 2,
        }}
      >
        <Typography variant="h2" sx={{ fontSize: { xs: "1.35rem", md: "1.6rem" }, fontWeight: 800, m: 0, color: "inherit" }}>
          The short version
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(248,250,252,0.88)", lineHeight: 1.85 }}>
          On the usual back-of-the-envelope estimate, we are only around <strong>Type 0.73</strong>. That sounds close to
          Type I until you remember the scale is logarithmic. The climb from <strong>0.73 to 1.0</strong> means roughly
          <strong> 500 to 600 times more usable power</strong>. That is why AI stops being a software story and becomes a
          grid story.
        </Typography>
        <Box
          component="img"
          src="/generate/2026-03-22-kardashev-scale-ai-energy-bottleneck-hero.png"
          alt="OpenAI-generated hero illustration showing Earth, an AI data centre, and the Sun connected by power arcs"
          loading="lazy"
          decoding="async"
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: 3,
            border: "1px solid rgba(255,255,255,0.08)",
            my: 0,
          }}
        />
        <Typography variant="caption" sx={{ color: "rgba(226,232,240,0.75)" }}>
          Hero art generated with the OpenAI Images API for this post.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 2.25 }}>
        <SectionHeading number="1">The Kardashev scale is just a power meter</SectionHeading>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          Richard Feynman would probably strip the drama out of this first. A civilisation is not a mood. It is not a brand.
          It is a power budget.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          The Kardashev scale is a simple way to ask one question: <strong>how much energy can a civilisation reliably use?</strong>
          In the common Carl Sagan-style version, the scale is written as <strong>K = (log10 P - 6) / 10</strong>, where P is power in watts.
          That one line explains the whole trick.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          If you plug in roughly <strong>1.8 × 10^13 watts</strong> for humanity today, you land near <strong>0.73</strong>.
          If you move to <strong>1.0</strong>, you are in Type I territory. The decimal looks close. The engineering is not.
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
          {scaleCards.map((card) => (
            <MetricCard key={card.eyebrow} {...card} />
          ))}
        </Box>

        <KScaleGraphic />
      </Box>

      <Divider />

      <Box component="section" sx={{ display: "grid", gap: 2.25 }}>
        <SectionHeading number="2" tone="amber">
          Why 0.73 to 1.0 is a brutally physical climb
        </SectionHeading>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          This is the part many people miss. The distance from 0.73 to 1.0 is not 27% more effort. On a logarithmic scale,
          it means multiplying available usable power by something like <strong>10^2.7</strong>. That is why the phrase
          &quot;we are almost Type I&quot; is emotionally tempting but physically wrong.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          Feynman would say: do not stare at the decimal. Follow the units. The unit here is watts, and watts come from power
          plants, transmission lines, storage, cooling systems, transformers, market design, and brutal construction lead times.
        </Typography>
        <Box
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.18)",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 800, mb: 1 }}>
            Feynman takeaway
          </Typography>
          <Typography variant="body1" sx={{ m: 0, lineHeight: 1.8 }}>
            A civilisation does not become Type I because it learns to talk more cleverly. It becomes Type I when it can
            move vastly more electrons, reliably, every day.
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box component="section" sx={{ display: "grid", gap: 2.25 }}>
        <SectionHeading number="3" tone="violet">
          Why AI keeps colliding with the grid
        </SectionHeading>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          This is why Uchiha Itachi&apos;s note lands. Frontier AI feels like pure software, but the moment it scales, it becomes
          infrastructure. Training is electricity. Inference is electricity. Cooling is electricity. Even redundancy is electricity.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          The{" "}
          <a href="https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai" target="_blank" rel="noreferrer">
            International Energy Agency&apos;s 2025 report
          </a>
          {" "}
          makes the point concrete: global data-centre electricity use was about <strong>415 TWh in 2024</strong>, and its base case
          points to roughly <strong>945 TWh by 2030</strong>. The number is big, but the more important point is timing. Data centres
          can rise fast. Grids and firm generation usually do not.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          That is why the recent nuclear-linked moves by <strong>Google in October 2024</strong>, <strong>Amazon in October 2024</strong>,
          and <strong>Microsoft via Constellation in September 2024</strong> matter. They are not philosophical gestures. They are procurement.
        </Typography>
        <EnergyChainGraphic />
      </Box>

      <Divider />

      <Box component="section" sx={{ display: "grid", gap: 2.25 }}>
        <SectionHeading number="4">Bitcoin&apos;s odd place in the argument</SectionHeading>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          The note also pulls Bitcoin into the story, and this is where the argument gets interesting. The bullish case is not
          &quot;Bitcoin fixes everything.&quot; The stronger case is narrower: miners can behave like a highly mobile, highly price-sensitive,
          interruptible customer for electricity.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          In plain English, that means miners can buy power when it is cheap or stranded and shut off when the grid is stressed.
          If that happens in the right market design, they can help monetise early capacity. If it happens in the wrong place, they
          are simply another hungry load. Both things can be true.
        </Typography>
        <FlexibleLoadGraphic />
      </Box>

      <Divider />

      <Box component="section" sx={{ display: "grid", gap: 2.25 }}>
        <SectionHeading number="5" tone="amber">
          What a serious climb to Type I would actually require
        </SectionHeading>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          If you accept the energy framing, the to-do list becomes much less mystical.
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
          <MetricCard
            tone="teal"
            eyebrow="1. More generation"
            value="Firm + clean"
            body="You need far more power than today, and not only when the weather behaves. That means some mix of renewables, storage, nuclear, geothermal, and whatever else actually scales."
          />
          <MetricCard
            tone="amber"
            eyebrow="2. More wires"
            value="Transmission"
            body="Electricity is not useful only where it is generated. Type I ambition means moving large amounts of power across regions without turning the grid into a bottleneck."
          />
          <MetricCard
            tone="violet"
            eyebrow="3. More efficiency"
            value="Compute per joule"
            body="Better chips, better cooling, better model design, and better software all buy time. Every efficiency gain is a way to flatten the demand curve before it hits the wall."
          />
          <MetricCard
            tone="teal"
            eyebrow="4. Better coordination"
            value="Markets + policy"
            body="Civilisations do not scale on hardware alone. They scale on permitting, pricing, regulation, and the boring competence needed to finish infrastructure on time."
          />
        </Box>
      </Box>

      <Divider />

      <Box component="section" sx={{ display: "grid", gap: 2.25 }}>
        <SectionHeading number="6" tone="violet">
          The real Feynman test
        </SectionHeading>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          If you had to explain this to a child, you would not start with AGI. You would start with a city. Lights, trains, pumps,
          servers, hospitals, traffic signals, factories, and homes all need steady power. Intelligence at scale is the same story,
          only hungrier.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          That is why the cleanest reading of the Kardashev scale is not cosmic chest-thumping. It is a reminder that civilisation is
          constrained by what it can energise. AI simply drags that truth out into the open.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.05rem", lineHeight: 1.85 }}>
          Sources and dated examples that informed this framing:
        </Typography>
        <SourceList />
        <Typography variant="body1" sx={{ fontSize: "1.08rem", fontWeight: 700, lineHeight: 1.85 }}>
          The future may look like software on the screen, but underneath it is still transformers, turbines, copper, cooling water,
          and the long patience of civil engineering.
        </Typography>
      </Box>
    </Box>
  );
}
