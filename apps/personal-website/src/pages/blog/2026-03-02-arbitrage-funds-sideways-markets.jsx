import { Box, Typography } from "@mui/material";

const badges = [
  "Arbitrage",
  "Mutual Funds",
  "Low Volatility",
  "Sideways Markets",
  "Feynman Explainer",
];

const spreadData = [
  { title: "Cash-Futures Spread", spread: 0.8, cost: 0.25, note: "usual day" },
  { title: "Overnight Collateral Yield", spread: 0.45, cost: 0.1, note: "treasury-backed" },
  { title: "Worst-Case Slippage", spread: -0.15, cost: 0.35, note: "gap-down open" },
];

const sidewaysTape = [
  { label: "Index (1Y)", value: 4.2 },
  { label: "Arbitrage fund (1Y)", value: 6.1 },
  { label: "Liquid fund (1Y)", value: 5.0 },
];

const compareRows = [
  {
    label: "Volatility",
    arbitrage: "Low; hedged cash-futures book",
    equity: "High; fully market-linked",
    debt: "Low to moderate; driven by duration and credit",
  },
  {
    label: "What drives returns",
    arbitrage: "Spread plus collateral yield",
    equity: "Earnings growth and valuation re-rating",
    debt: "Coupon plus rate moves",
  },
  {
    label: "Tax (sales on/after 23 Jul 2024)",
    arbitrage: "Equity rules: up to 12 months STCG 20%; over 12 months LTCG 12.5% with Rs 1.25 lakh annual exemption",
    equity: "Same equity rules: STCG 20%; LTCG 12.5% with Rs 1.25 lakh annual exemption",
    debt: "Post 1 Apr 2023 purchases taxed at slab regardless of holding; pre-2023 units can get LTCG 12.5% after 24 months",
  },
  {
    label: "Ideal holding window",
    arbitrage: "3-12 months for smoother experience",
    equity: "5+ years to ride cycles",
    debt: "Match to your cash-flow need and fund duration (6-36 months typical)",
  },
  {
    label: "When it shines",
    arbitrage: "Sideways or choppy markets with decent spreads",
    equity: "Trending bull phases",
    debt: "Falling rate cycles or when you need stability",
  },
];

export const metadata = {
  slug: "arbitrage-funds-sideways-markets",
  title: "Arbitrage Funds Explained for Sideways Markets (Feynman Style)",
  description:
    "A plain-language tour of how arbitrage funds quietly earn carry when markets drift sideways, with a lemonade-stand example and two napkin charts.",
  excerpt:
    "A plain-language tour of how arbitrage funds quietly earn carry when markets drift sideways, with a lemonade-stand example and two napkin charts.",
  tags: badges,
  datePublished: "2026-03-02",
  dateModified: "2026-03-02",
  image: "/generate/2026-03-02-arbitrage-funds-sideways-markets.png",
  readingTime: "~4 min",
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
        {badges.map((badge) => (
          <Box
            key={badge}
            component="img"
            src={`https://img.shields.io/badge/${encodeURIComponent(badge)}-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white`}
            alt={`${badge} badge`}
            loading="lazy"
            decoding="async"
            sx={{ height: 28, width: "auto" }}
          />
        ))}
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          Markets feel stuck in neutral. Arbitrage funds were built for exactly this kind of sideways tape.
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.15rem", lineHeight: 1.85, color: "var(--mui-palette-text-primary)" }}
        >
          Richard Feynman loved turning scary equations into stories. So here is the story: when the broader market
          refuses to trend -- "the markers only move sideways these days" as my friend mis-typed -- the price difference
          between cash and futures becomes a tiny, predictable slope. Arbitrage funds surf that slope, not the wave.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 2 }}>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: "1.35rem", md: "1.65rem" }, fontWeight: 700, display: "flex", gap: 1.5, alignItems: "center" }}
        >
          <Bubble>1</Bubble>
          The lemonade-stand proof (why arbitrage exists)
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--mui-palette-text-primary)" }}
        >
          Imagine two stalls on the same street. One sells lemonade at Rs 20, the other at Rs 21. You buy from the cheaper
          stall and simultaneously pre-sell cups to a queue at the expensive one. Your profit is the Rs 1 spread, minus the
          cost of walking the tray over. Replace lemonade with NIFTY stocks, replace walking with a low-latency cable,
          and you have the skeleton of an arbitrage fund.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 2 }}>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: "1.35rem", md: "1.65rem" }, fontWeight: 700, display: "flex", gap: 1.5, alignItems: "center" }}
        >
          <Bubble>2</Bubble>
          How the fund actually captures the spread
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--mui-palette-text-primary)" }}
        >
          The fund buys a basket of stocks in the cash market and sells the matching index futures. It then parks the
          cash as margin in overnight collateral, earning a short-term rate. When futures expire, both legs converge;
          the fund books the spread minus costs. Because the trade is hedged, NAV wiggles less than a normal equity
          fund -- perfect for a drifting market.
        </Typography>

        <Box sx={{ mt: 1, display: "grid", gap: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "var(--mui-palette-text-secondary)" }}>
            Napkin chart: spread vs friction
          </Typography>
          {spreadData.map((row) => (
            <Box
              key={row.title}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "220px 1fr 72px" },
                alignItems: "center",
                gap: 1.25,
                p: 1,
                borderRadius: 2,
                bgcolor: "var(--mui-palette-background-paper)",
                boxShadow: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700 }}>{row.title}</Typography>
                <Typography variant="caption" sx={{ color: "var(--mui-palette-text-secondary)" }}>
                  {row.note}
                </Typography>
              </Box>
              <Box sx={{ position: "relative", height: 18, borderRadius: 999, bgcolor: "rgba(99,102,241,0.08)" }}>
                <CenterLine />
                {row.spread > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: "50%",
                      top: 2,
                      bottom: 2,
                      width: `${row.spread * 100}%`,
                      transform: "translateX(0)",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #22c55e, #16a34a)",
                    }}
                  />
                )}
                {row.spread < 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: "50%",
                      top: 2,
                      bottom: 2,
                      width: `${Math.abs(row.spread) * 100}%`,
                      transform: "translateX(0)",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #ef4444, #dc2626)",
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: 2,
                    bottom: 2,
                    width: `${row.cost * 100}%`,
                    transform: "translateX(-100%)",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #cbd5e1, #94a3b8)",
                    mixBlendMode: "multiply",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: row.spread >= row.cost ? "#16a34a" : "#dc2626", textAlign: { xs: "left", md: "right" } }}
              >
                {`${(row.spread - row.cost).toFixed(2)}% net`}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 2 }}>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: "1.35rem", md: "1.65rem" }, fontWeight: 700, display: "flex", gap: 1.5, alignItems: "center" }}
        >
          <Bubble>3</Bubble>
          Why sideways markets are a feature, not a bug, for arbitrage funds
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--mui-palette-text-primary)" }}
        >
          A trending market injects noise into hedges; spreads widen and compress unpredictably. Sideways markets keep
          the cash-futures gap neat and mechanical. The fund keeps rolling the same trade, harvesting carry while your
          equity-heavy friends wait for a breakout.
        </Typography>

        <Box sx={{ mt: 1, display: "grid", gap: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "var(--mui-palette-text-secondary)" }}>
            Napkin chart: who wins when the index drifts
          </Typography>
          {sidewaysTape.map((row) => (
            <Box
              key={row.label}
              sx={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", alignItems: "center", gap: 1, p: 1, borderRadius: 2, bgcolor: "var(--mui-palette-background-paper)", boxShadow: 1 }}
            >
              <Typography sx={{ fontWeight: 700 }}>{row.label}</Typography>
              <Box sx={{ height: 14, borderRadius: 999, bgcolor: "rgba(99,102,241,0.08)", overflow: "hidden", position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${row.value}%`,
                    background: "linear-gradient(90deg, #38bdf8, #2563eb)",
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, textAlign: "right" }}>
                {row.value.toFixed(1)}%
              </Typography>
            </Box>
          ))}
          <Typography variant="caption" sx={{ color: "var(--mui-palette-text-secondary)", ml: 0.5 }}>
            Illustrative 1-year numbers: arbitrage funds usually sit between a liquid fund and a short equity fund when markets go sideways.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 2 }}>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: "1.35rem", md: "1.65rem" }, fontWeight: 700, display: "flex", gap: 1.5, alignItems: "center" }}
        >
          <Bubble>4</Bubble>
          Quick checklist before you invest (Feynman-style sanity checks)
        </Typography>
        <Box component="ul" sx={{ pl: 3, display: "grid", gap: 1, color: "var(--mui-palette-text-primary)" }}>
          <Typography component="li" sx={{ fontSize: "1.05rem" }}>
            <strong>Spreads, not stories:</strong> Returns follow the average cash-futures spread; star managers matter less than low trading costs.
          </Typography>
          <Typography component="li" sx={{ fontSize: "1.05rem" }}>
            <strong>Exit load & taxes:</strong> Treat it like equity for taxation; check exit loads if you may redeem inside 30-60 days.
          </Typography>
          <Typography component="li" sx={{ fontSize: "1.05rem" }}>
            <strong>Tracking wobble:</strong> A surprise gap-up or gap-down day can dent a month's carry. Look at worst 1-day drawdowns, not just averages.
          </Typography>
          <Typography component="li" sx={{ fontSize: "1.05rem" }}>
            <strong>Liquidity of the basket:</strong> Funds that stick to the index constituents with the highest futures open interest usually bleed less.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 2 }}>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: "1.35rem", md: "1.65rem" }, fontWeight: 700, display: "flex", gap: 1.5, alignItems: "center" }}
        >
          <Bubble>5</Bubble>
          Arbitrage vs equity vs debt at a glance
        </Typography>
        <Box
          sx={{
            display: "grid",
            border: "1px solid var(--mui-palette-divider)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "180px repeat(3, 1fr)" },
              bgcolor: "rgba(37,99,235,0.06)",
              p: 1,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              fontSize: "0.85rem",
            }}
          >
            <Box />
            <Box>Arbitrage</Box>
            <Box>Equity</Box>
            <Box>Debt</Box>
          </Box>
          {compareRows.map((row, idx) => (
            <Box
              key={row.label}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "180px repeat(3, 1fr)" },
                p: 1,
                gap: 1,
                bgcolor: idx % 2 === 0 ? "var(--mui-palette-background-paper)" : "rgba(99,102,241,0.04)",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>{row.label}</Typography>
              <Typography sx={{ color: "var(--mui-palette-text-primary)" }}>{row.arbitrage}</Typography>
              <Typography sx={{ color: "var(--mui-palette-text-primary)" }}>{row.equity}</Typography>
              <Typography sx={{ color: "var(--mui-palette-text-primary)" }}>{row.debt}</Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="caption" sx={{ color: "var(--mui-palette-text-secondary)" }}>
          Tax rules reflect the post 23 Jul 2024 slabs (equity STCG 20%, LTCG 12.5% with Rs 1.25 lakh annual exemption) and the post 1 Apr 2023 rule that most debt funds are taxed at slab rates.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 1.5 }}>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--mui-palette-text-primary)" }}
        >
          Arbitrage funds are the lab instruments of investing: precise, limited-range, and best used when markets are
          range-bound. If the tape keeps drifting sideways, they quietly turn market noise into a modest, tax-efficient
          signal.
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "var(--mui-palette-text-secondary)", fontStyle: "italic" }}
        >
          Not investment advice. Check current spreads, expense ratios, and tax rules before acting.
        </Typography>
      </Box>
    </Box>
  );
}

function Bubble({ children }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "50%",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        fontWeight: 700,
        fontSize: "1rem",
        boxShadow: 2,
      }}
    >
      {children}
    </Box>
  );
}

function CenterLine() {
  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: 0,
        bottom: 0,
        width: 2,
        bgcolor: "rgba(30,41,59,0.25)",
        transform: "translateX(-50%)",
      }}
    />
  );
}
