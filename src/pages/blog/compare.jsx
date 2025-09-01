import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Compare = () => {
  const navigate = useNavigate();
  const articleRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Blog
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-6">Untitled</h1>

      <div className="flex items-center text-gray-600 mb-8">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>Date: Unknown Date</span>
        <span className="mx-2">•</span>
        <span>By Kumar</span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-8"></div>

      <div className="space-y-8">
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: `# Price/cost of essentials in places our folks live now

I made this to just vet my curiocity.

*July 9, 2025*

The main table covers cost of living and healthcare access. Separate tables below show dental/drug costs, income tax slabs, capital gains tax, and exchange rates.

### 1. Cost of Living & Healthcare Access (2025)

| City        | Staples (mo.) | Broadband (mo.) | Fuel (L/gal) | Mortgage Rate | Electricity (kWh/mo.) | Water (mo.) | Doctor Wait (GP)        |
|-------------|---------------|-----------------|--------------|---------------|----------------------|-------------|-------------------------|
| Toronto     | C$600–800 ($440–587) | C$40–80 ($29–59) | C$1.51/L ($1.11/L) | 3.8–4.6% | C$0.093–0.11 ($0.07–0.08) | C$80–100 ($59–73) | 2–4 wks (public)        |
| Orlando     | $500–700      | $25–55          | $3.40/gal ($0.90/L) | 6.5–7%    | $0.13–0.15           | $70–80      | 1–2 wks (private)       |
| Seattle     | $600–800      | $35–75          | $4.96/gal ($1.31/L) | 6.7–7.3%  | $0.11–0.20 (~$65/mo) | $20–25      | 1–2 wks (private)       |
| Singapore   | S$600–800 ($471–628) | S$29.9–55.9 ($23–44) | S$2.70–2.90/L ($2.12–2.27/L) | 2.7–3.2% | S$0.2994 ($0.23) | S$50–60 ($39–47) | 1–7 days (public), 1–3 days (private) |
| Birmingham  | £350–500 ($478–683) | £25–40 ($34–55) | £1.46/L ($1.99/L) | 6.7–7%   | £0.2419 ($0.33)      | ~£46.33 ($63) | 1–3 wks (NHS)           |
| Chennai     | ₹8,000–12,000 ($93–140) | ₹600–1,000 ($7–12) | ₹100/L ($1.17/L) | 8–9%     | ₹8 ($0.09)           | ₹300–500 ($3.50–5.80) | 1–5 days (private), 1–2 wks (public) |

### 2. Healthcare Quality, Dental & Drug Costs

| City        | Quality of Care (1–5) | Dentist Visit (USD) | Dental Implant (USD) | Diabetes/Cardio Drugs (USD/mo.) |
|-------------|----------------------|---------------------|----------------------|----------------------------------|
| Toronto     | 5                    | $150–$300           | $4,165+              | $20–$40 (with insurance)         |
| Orlando     | 4                    | $100–$250           | $3,000–$4,500        | $30–$100 (with insurance)        |
| Seattle     | 4                    | $120–$300           | $3,000–$4,500        | $30–$100 (with insurance)        |
| Singapore   | 5                    | $17–$43 (polyclinic)| $3,000–$5,500        | $24–$70 (subsidized)             |
| Birmingham  | 4                    | $32–$80 (NHS/private)| $2,000–$3,000        | $12 (NHS prescription)           |
| Chennai     | 3–4                  | $3.50–$12           | $235–$470            | $6–$18 (generic)                 |

### 3. Income Tax Slabs (2025, Individual)

| City/Country      | Tax-Free Bracket         | Main Slabs (Individual)                                              | Top Rate        |
|-------------------|-------------------------|----------------------------------------------------------------------|-----------------|
| Toronto (Canada)  | C$15,705                | 15% ≤C$55,867, 20.5% ≤C$111,733, 26% ≤C$173,205 (Fed)Ontario: 5.05% ≤C$49,231, 9.15% ≤C$98,463 | 33% (Fed)       |
| Orlando/Seattle (US) | $14,600 (standard deduction) | 12% ≤$47,150, 22% ≤$100,525, 24% ≤$191,950 (Single)                  | 37%             |
| Singapore         | S$20,000                | 2% ≤S$30k, 3.5% ≤S$40k, 7% ≤S$80k, 11.5% ≤S$120k, 15% ≤S$160k        | 24%             |
| Birmingham (UK)   | £12,570                 | 20% ≤£50,270, 40% ≤£125,140                                          | 45%             |
| Chennai (India)   | ₹2.5L (old), ₹3L (new)  | 5% ₹3–6L, 10% ₹6–9L, 15% ₹9–12L, 20% ₹12–15L, 30% >₹15L               | 30%             |

### 4. Capital Gains Tax: Long-Term vs Short-Term (2025)

| Country/Asset Class     | Short-Term Capital Gains (STCG)           | Long-Term Capital Gains (LTCG)                     | Notes/Thresholds                  |
|------------------------|-------------------------------------------|----------------------------------------------------|-----------------------------------|
| US (Stocks, Bonds, Real Estate) | Taxed as ordinary income (10–37%)            | 0%, 15%, or 20% based on income              | 1 yr holding for LTCG; collectibles at 28%  |
| Canada                 | 50% of gain added to income, taxed at marginal rate | 50% of gain added to income, taxed at marginal rate | No separate rate for LTCG         |
| Singapore              | No capital gains tax                      | No capital gains tax                               | Unless trading is main business   |
| UK                     | 10% or 20% (based on income)              | 10% (basic rate), 20% (higher rate)                | 18%/28% for property              |
| India (Equity)         | 20% (after Budget 2024)                   | 12.5% for listed equity above ₹1.25L/yr            | LTCG: >1 yr; STCG: ≤1 yr          |
| India (Other Assets)   | Slab rate (up to 30%)                     | 12.5% (after 24/36 months, indexation for some)    | LTCG: >2/3 yrs, varies by asset   |

### 5. Global Indices: Corruption, Quality of Life, Happiness, Passport (2024)

| Country/City         | Corruption Perception Index (CPI, 2024) | Quality of Life Index (2024) | World Happiness Index (2024) | Henley Passport Index (2024) |
|---------------------|:---------------------------------------:|:----------------------------:|:----------------------------:|:----------------------------:|
| Toronto (Canada)    | 76 (Canada)      | 163.5 (Canada)      | 7.0 (Canada, Rank 15)   | 6th (185 countries)      |
| Orlando/Seattle (USA)| 69 (USA)         | 172.0 (USA)         | 6.9 (USA, Rank 23)      | 7th (USA)                |
| Singapore           | 84               | 156.0               | 6.5 (Rank 30)           | 1st (Singapore)          |
| Birmingham (UK)     | 71 (UK)          | 162.0 (UK)          | 6.7 (UK, Rank 20)       | 4th (UK)                 |
| Chennai (India)     | 39 (India)       | 103.0 (India)       | 4.0 (India, Rank 126)   | 80th (India)             |

**Notes:**
- CPI: Higher is better (max 100, less corruption).
- Quality of Life: Higher is better (Numbeo, 2024).
- Happiness: Score out of 10, higher is better (World Happiness Report 2024).
- Passport: Lower rank is better (Henley Passport Index 2024).

**PS: Exchange Rate Table (July 2025)**

| Currency Pair      | 1 USD = X Local Currency | 1 Local Currency = X USD |
|--------------------|-------------------------|--------------------------|
| USD (US Dollar)    | 1.00 USD                | 1.00 USD                 |
| CAD (Canadian $)   | 1.60 CAD                | 0.625 USD                |
| SGD (Singapore $)  | 1.50 SGD                | 0.67 USD                 |
| GBP (British £)    | 0.86 GBP                | 1.16 USD                 |
| INR (Indian ₹)     | 85.15 INR               | 0.0117 USD               |

Last updated: 2025-08-11
`,
            }}
          />
        </div>

              </div>
    </motion.div>
  );
};

export default Compare;
