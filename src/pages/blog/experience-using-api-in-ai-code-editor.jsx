import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ExperienceUsingApiInAiCodeEditor = () => {
  const navigate = useNavigate();
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
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-6">My Experience with the stock market API: Building a Mutual Fund Performance Tracker</h1>
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>June 14, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              A dive into integrating LLMs and specialized APIs for personal finance.
            </p>
          </header>

          {/* Introduction Section */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              The Quest for a Unified Mutual Fund View
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Like many investors, I hold mutual fund schemes across various Asset Management Companies (AMCs). While each AMC provides its own portal, getting a consolidated, real-time view of my entire portfolio's performance was always a challenge. I envisioned a personal performance tracker that could pull data from all my schemes, offering a holistic perspective. 

**Note:** My tracker does not cross-verify NAV or fund details with individual AMC (fund house) websites. It relies on official data from AMFI and trusted APIs such as indianapi.in. This is sufficient for most use cases, but for absolute accuracy or regulatory purposes, investors should always refer to the official AMC website.
            </p>
          </section>

          {/* The Initial Data Hurdle: AMFI and Parser Scripts */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Navigating Data Disparity: Where LLMs Shined (Initially)
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              The first major hurdle was data consistency. Mutual fund scheme names can be notoriously varied, and fetching their unique identifiers like ISINs (International Securities Identification Numbers) proved tricky. My primary source for official mutual fund data was the Association of Mutual Funds in India (AMFI) website. However, parsing data directly from AMFI, and ensuring that my internal scheme names mapped correctly to their official designations, was a labor-intensive task.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              This is where I brought in an LLM, specifically GPT-4.1 which excels at understanding and generating code. I leveraged its capabilities to:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-4 pl-4">
              <li>
                <strong>Generate Parser Scripts:</strong> GPT-4.1 helped in quickly drafting Python scripts designed to scrape and structure data from the AMFI website, extracting key information like scheme names and ISINs.
              </li>
              <li>
                <strong>Clean and Standardize Scheme Names:</strong> For schemes where direct ISIN fetching was challenging due to slight variations in naming conventions, GPT-4.1 was instrumental. I'd feed it a list of my local scheme names and the AMFI-provided names, and it would suggest the most accurate matches and help clean up my local data for better alignment.
              </li>
              <li>
                <strong>Fetch Missing ISINs:</strong> In cases where I had a scheme name but no ISIN, GPT-4.1 could often infer or search for the correct ISIN based on the provided scheme details, greatly streamlining the data collection process.
              </li>
            </ul>
          </section>

          {/* The API Integration: indianapi.in to the Rescue */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              When Direct Data Fetching Needed a Helping Hand: Enter indianapi.in
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              While GPT-4.1 was excellent for parsing and data cleaning, its ability to fetch real-time, comprehensive market data, including NAVs and historical returns, directly from web sources was limited. I needed a dedicated, reliable data feed. Fortunately, I had already subscribed to the <code>indianapi.in</code> Stock Market API, which promised detailed financial data for Indian markets.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              The challenge then became: how do I integrate this API effectively into my tracker, especially when working with an LLM that might not inherently "know" the API's structure?
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              This is where the iterative process with LLM truly shone. I provided it with:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-4 pl-4">
              <li>My <code>indianapi.in</code> API key.</li>
              <li>Relevant sections of the API documentation, highlighting endpoints for mutual fund data.</li>
              <li>Examples of <code>curl</code> requests and their corresponding JSON outputs, showing the expected data structure.</li>
            </ul>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              With this context, the LLM was able to understand the API's schema and helped me construct the correct API calls. It generated code snippets (again, primarily Python or Node.js for backend fetching) that successfully integrated with <code>indianapi.in</code>.
            </p>
          </section>

          {/* The Results: Getting the Key Metrics */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              The Breakthrough: Comprehensive Performance Metrics
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              The integration was a success! Using the scripts generated with the LLM's assistance and the power of the <code>indianapi.in</code> subscription, I was finally able to fetch crucial performance metrics for my mutual fund schemes:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-4 pl-4">
              <li><strong>Net Asset Value (NAV):</strong> The real-time value of each unit.</li>
              <li><strong>Scheme Rating:</strong> Important for quick assessment of a fund's quality.</li>
              <li><strong>1-Year Returns:</strong> Short-term performance insights.</li>
              <li><strong>3-Year Returns:</strong> Mid-term performance, indicating consistency.</li>
              <li><strong>5-Year Returns:</strong> Long-term performance, crucial for wealth creation goals.</li>
            </ul>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              This data, once disparate and hard to consolidate, now flows into my custom tracker, giving me an unparalleled view of my investments.
            </p>
          </section>

          {/* Technical Architecture */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Technical Architecture
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              The mutual fund tracker is designed as a robust data pipeline that consolidates information from multiple official and third-party sources. The architecture is modular and resilient to missing or inconsistent data.
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-4 pl-4">
              <li><strong>Data Sources:</strong> <br/>
                <ul className="list-disc list-inside ml-6">
                  <li><strong>AMFI:</strong> For NAV and AUM data, accessed via scraping or API.</li>
                  <li><strong>Individual Fund House Websites:</strong> For cross-verification of NAV and fund details.</li>
                </ul>
              </li>
              <li><strong>Data Collection Pipeline:</strong> <br/>
                <ul className="list-disc list-inside ml-6">
                  <li>Input: CSV file of mutual funds and schemes.</li>
                  <li>Scraping: <code>requests</code> and <code>beautifulsoup4</code> fetch and parse data from sources.</li>
                  <li>Fuzzy Matching: <code>fuzzywuzzy</code> aligns scheme names between sources.</li>
                  <li>Data Enrichment: Collects NAV, AUM, and category for each scheme (where possible).</li>
                  <li>Error Handling: Logs missing data, retries failed requests, and uses fallback sources.</li>
                  <li>Output: Enhanced CSV with all required columns for analysis.</li>
                </ul>
              </li>
              <li><strong>Implementation Details:</strong> <br/>
                <ul className="list-disc list-inside ml-6">
                  <li>Libraries: <code>requests</code>, <code>beautifulsoup4</code>, <code>pandas</code>, <code>fuzzywuzzy</code>, <code>time</code>, <code>logging</code>.</li>
                  <li>Rate Limiting: Adds delays between requests to avoid blocking by data providers.</li>
                  <li>Robustness: Includes retry logic, error logging, and fallback mechanisms for reliability.</li>
                  <li>Sample Structure:
                    <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto"><code>{`class MutualFundDataCollector:\n    def __init__(self, input_csv_path):\n        self.funds_df = pd.read_csv(input_csv_path)\n        self.setup_logging()\n    # ... methods for scraping, matching, and exporting`}</code></pre>
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          {/* Conclusion */}
          <section>
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Key Takeaways: A Synergy of AI and Specialized Data
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              My journey to build this mutual fund performance tracker highlights a powerful synergy: LLMs like GPT-4.1 are incredible for understanding complex instructions, generating code for data manipulation, and helping with data cleaning, while specialized APIs like <code>indianapi.in</code> are indispensable for providing real-time, comprehensive, and structured financial data.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              This project reinforced that while LLMs are powerful, they often work best when augmented with domain-specific tools and explicit guidance, especially when dealing with proprietary data sources. The combination has truly empowered me to take control of my financial data in a way that wouldn't have been feasible otherwise.
            </p>
          </section>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              API
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              LLM
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Mutual Funds
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Personal Finance
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Data Integration
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              GPT-4.1
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceUsingApiInAiCodeEditor;
