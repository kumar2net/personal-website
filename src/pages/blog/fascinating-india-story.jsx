import React from 'react';

const FascinatingIndiaStory = () => (
  <div className="max-w-2xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold mb-4">Fascinating India Story: How Millennials Are Powering the SIP Revolution</h1>
    <p className="mb-6">
      Let's talk about something quietly amazing happening in India right now. No, it's not cricket (for once!)—it's the way young Indians are changing the game when it comes to investing.
    </p>
    <h2 className="text-2xl font-semibold mb-2">SIPs: The New Cool</h2>
    <p className="mb-4">
      If you're a millennial, chances are you've heard of SIPs (Systematic Investment Plans). Maybe you're already investing through one. If not, you probably know someone who is. SIPs have become the go-to way for young Indians to invest in mutual funds—think of it as the "set it and forget it" approach to building wealth.
    </p>
    <p className="mb-4">
      And the numbers? They're mind-blowing. As of <b>May 2025</b>, monthly SIP inflows hit a record high of <b>₹26,688 crore</b>. That's over ₹26,000 crore pouring in every month, mostly from regular folks like you and me, steadily investing a bit from every paycheck. Just look at the growth over the last three years:
    </p>
    <h3 className="text-xl font-semibold mt-6 mb-2">SIP Inflows & Contributing Accounts (May, last 3 years)</h3>
    <table className="mb-6 w-full border border-gray-200 rounded">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-3 text-left">Year</th>
          <th className="py-2 px-3 text-left">SIP Inflow (₹ crore)</th>
          <th className="py-2 px-3 text-left">Contributing SIP Accounts (crore)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-3">2023</td>
          <td className="py-2 px-3">14,749</td>
          <td className="py-2 px-3">6.58</td>
        </tr>
        <tr>
          <td className="py-2 px-3">2024</td>
          <td className="py-2 px-3">20,904</td>
          <td className="py-2 px-3">8.38</td>
        </tr>
        <tr>
          <td className="py-2 px-3">2025</td>
          <td className="py-2 px-3">26,688</td>
          <td className="py-2 px-3">8.56</td>
        </tr>
      </tbody>
    </table>
    <div className="flex justify-center mb-8">
      <svg width="420" height="220" viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="60" width="50" height="120" fill="#60a5fa"/>
        <rect x="170" y="20" width="50" height="160" fill="#34d399"/>
        <rect x="280" y="0" width="50" height="180" fill="#f59e42"/>
        <text x="85" y="195" fontSize="14" textAnchor="middle">2023</text>
        <text x="195" y="195" fontSize="14" textAnchor="middle">2024</text>
        <text x="305" y="195" fontSize="14" textAnchor="middle">2025</text>
        <text x="85" y="55" fontSize="12" textAnchor="middle">₹14,749</text>
        <text x="195" y="15" fontSize="12" textAnchor="middle">₹20,904</text>
        <text x="305" y="-5" fontSize="12" textAnchor="middle">₹26,688</text>
        <text x="210" y="215" fontSize="16" textAnchor="middle" fontWeight="bold">SIP Inflows (₹ crore, May)</text>
        <line x1="40" y1="0" x2="40" y2="180" stroke="#888" strokeWidth="2"/>
        <text x="35" y="180" fontSize="12" textAnchor="end">0</text>
        <text x="35" y="120" fontSize="12" textAnchor="end">8k</text>
        <text x="35" y="60" fontSize="12" textAnchor="end">16k</text>
        <text x="35" y="0" fontSize="12" textAnchor="end">24k+</text>
      </svg>
    </div>
    <h2 className="text-2xl font-semibold mb-2">Why Are SIPs So Popular?</h2>
    <p className="mb-4">
      It's simple: SIPs make investing easy and automatic. You don't need to time the market or worry about big lumps of money. Just pick an amount, set up the SIP, and let compounding do its magic. Plus, with mobile apps and UPI, starting a SIP is as easy as ordering a pizza or dosa.
    </p>
    <h2 className="text-2xl font-semibold mb-2">The XIRR Metric: What's That?</h2>
    <p className="mb-4">
      Now, if you've peeked at your mutual fund statement, you might have seen something called "XIRR." Sounds fancy, right? Here's the lowdown:
      <ul className="list-disc ml-6 mt-2">
        <li><b>XIRR</b> stands for "Extended Internal Rate of Return."</li>
        <li>It's a way to measure your actual returns, especially when you're investing at different times (like with SIPs).</li>
        <li>Unlike simple returns, XIRR takes into account the timing and amount of each investment, giving you a true picture of how your money is growing.</li>
      </ul>
      Think of it as your investment's personal report card—one that actually understands how you've been putting in money bit by bit.
    </p>
    <h3 className="text-xl font-semibold mt-6 mb-2">XIRR vs CAGR: What's the Difference?</h3>
    <table className="mb-8 w-full border border-gray-200 rounded">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-3 text-left">Feature</th>
          <th className="py-2 px-3 text-left">XIRR (Extended Internal Rate of Return)</th>
          <th className="py-2 px-3 text-left">CAGR (Compound Annual Growth Rate)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-3">Definition</td>
          <td className="py-2 px-3">Measures annualized returns for irregular cash flows (multiple investments/withdrawals at different times)</td>
          <td className="py-2 px-3">Measures annualized return for a single investment over a period (lump sum in, lump sum out)</td>
        </tr>
        <tr>
          <td className="py-2 px-3">Use Case</td>
          <td className="py-2 px-3">SIPs, SWPs, multiple investments/redemptions</td>
          <td className="py-2 px-3">Lump sum investments</td>
        </tr>
        <tr>
          <td className="py-2 px-3">Cash Flow Timing</td>
          <td className="py-2 px-3">Considers timing and amount of each cash flow</td>
          <td className="py-2 px-3">Assumes only two cash flows: start and end</td>
        </tr>
        <tr>
          <td className="py-2 px-3">Formula</td>
          <td className="py-2 px-3">Solves for rate where NPV of all cash flows = 0</td>
          <td className="py-2 px-3">((End Value / Start Value)<sup>1/n</sup>) - 1</td>
        </tr>
        <tr>
          <td className="py-2 px-3">Accuracy</td>
          <td className="py-2 px-3">More accurate for real-world investments with multiple transactions</td>
          <td className="py-2 px-3">Accurate only for single, uninterrupted investments</td>
        </tr>
        <tr>
          <td className="py-2 px-3">Typical Application</td>
          <td className="py-2 px-3">Mutual funds (SIP/STP/SWP), real estate, private equity</td>
          <td className="py-2 px-3">Stocks, FDs, mutual funds (lump sum)</td>
        </tr>
        <tr>
          <td className="py-2 px-3">Excel Function</td>
          <td className="py-2 px-3">=XIRR(values, dates)</td>
          <td className="py-2 px-3">=CAGR(start, end, years) or manual</td>
        </tr>
      </tbody>
    </table>
    <h2 className="text-2xl font-semibold mb-2">The Big Picture</h2>
    <p className="mb-4">
      What's really fascinating is how this SIP wave is making India's financial future more resilient. Millennials are leading the charge, turning regular investing into a habit. It's not about chasing quick gains—it's about building wealth, one month at a time.
    </p>
    <p className="mb-4">
      So, if you're already on the SIP train, give yourself a pat on the back. If not, maybe it's time to hop on. The journey's just getting started, and the numbers show it's a ride worth taking.
    </p>
  </div>
);

export default FascinatingIndiaStory; 