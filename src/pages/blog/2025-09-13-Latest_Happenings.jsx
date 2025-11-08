import React from 'react';
import { motion } from 'framer-motion';

const LatestHappenings = () => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Happenings</h1>
          <div className="text-gray-600">
            <time>{today}</time>
          </div>
        </header>

        {/* Topic badges (shields.io) */}
        <div className="flex flex-wrap gap-2 mb-6">
          <img src="https://img.shields.io/badge/Security-111827?style=for-the-badge&labelColor=1F2937&color=111827" alt="Security" />
          <img src="https://img.shields.io/badge/WebAuthn-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="WebAuthn" />
          <img src="https://img.shields.io/badge/Passkeys-059669?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Passkeys" />
          <img src="https://img.shields.io/badge/Authentication-F97316?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Authentication" />
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>The End of Passwords, The HIRE Act Bombshell, and Investment Legends Who Changed Everything</h2>
          <p><em>3-minute read</em></p>
          <p>
            Let's dive into three fascinating topics that caught my attention this week – from the biggest security revolution happening right under our noses to a potential legislative earthquake that could reshape India's IT industry, plus some timeless investment wisdom that's worth revisiting.
          </p>

          <h3>🔐 Passkeys: When Tech Giants Actually Cooperate (Shocking, I Know!)</h3>
          <p>
            A concise visual of the WebAuthn passkey flow showing the challenge–response
            exchange between the client device and server. The private key never leaves the
            device; the server verifies using the public key.
          </p>
          <figure>
            <img src="/media/passkey.png" alt="Passkey authentication flow diagram" />
            <figcaption>Passkey-based authentication with WebAuthn.</figcaption>
          </figure>
          <p className="text-sm text-gray-600">Image source: Created for this post.</p>
          <p>
            Remember when you had to remember 47 different passwords, each with its own bizarre requirements? Well, those days might finally be numbered. Passkeys are here, and for once, Microsoft, Google, and Apple are playing nice together – which is about as rare as finding a unicorn in your backyard.
          </p>
          <p>
            Here's the beautiful thing about passkeys: they use SHA-256 cryptographic signatures, which means we're talking about 2²⁵⁶ possible combinations. To put that in perspective, that's a number with 77 digits. Even if every computer on Earth tried to crack one key simultaneously, we'd need more time than the universe has existed. That's what I call proper security!
          </p>
          <p>
            The magic happens when your device creates a unique cryptographic key pair – the private key stays locked in your device (secured by your fingerprint or face), while only the public key goes to the server. No shared secrets, no passwords floating around waiting to be stolen. It's like having a personal bodyguard for your digital identity.
          </p>
          <p>
            What makes this even more impressive is that this isn't just another tech fad. The FIDO (Fast IDentity Online) Alliance WebAuthn standard has united traditionally competing companies because the password problem had become too big to ignore. When was the last time you saw Apple, Google, and Microsoft agree on anything?
          </p>

          <h3>💥 The HIRE Act: India's IT Industry Faces Its Biggest Test</h3>
          <p>
            Now, let's talk about something that could completely reshape the global IT outsourcing landscape. Senator Bernie Moreno's HIRE Act isn't just another piece of legislation – it's a potential game-changer for India's $250 billion tech sector.
          </p>
          <p>Here's what's on the table:</p>
          <ul>
            <li><strong>The Tax Hammer</strong>: A brutal 25% excise tax plus elimination of tax deductions could increase outsourcing costs by up to 60% for US companies</li>
            <li><strong>Revenue at Risk</strong>: With 70% of India's IT exports going to the US, we're talking about $224 billion in potential impact</li>
            <li><strong>Giants in the Crosshairs</strong>: TCS, Infosys, Wipro, HCLTech, Tech Mahindra, and hundreds of Global Capability Centers face an existential challenge</li>
            <li><strong>Strategic Reset</strong>: The math is designed to make domestic hiring the obvious choice – forcing a complete rethink of the offshore model</li>
            <li><strong>Timeline Crunch</strong>: If passed by December 31, 2025, the new rules kick in from 2026</li>
          </ul>
          <p>
            The implications are staggering. This isn't just about higher costs – it's about fundamentally challenging the labor arbitrage model that built India's IT dominance. Companies will need to pivot hard toward AI, automation, premium consulting, and establishing substantial US operations. It's David vs. Goliath, except this time Goliath has legislative backing.
          </p>

          <h3>📈 Investment Wisdom from the Masters: Sharpe and Bernstein</h3>
          <p>
            <strong>William Sharpe's Genius</strong>: The Sharpe ratio is one of those rare financial concepts that's both elegant and practical. It's beautifully simple – take your investment returns, subtract the risk-free rate, and divide by volatility. What you get is the ultimate measure of risk-adjusted performance. Higher ratio = better bang for your risk buck. It's like having a universal translator for comparing completely different investments on equal footing. In India the return is compared with Nifty 50 index and we can use  S&P 500 in USA 
          </p>
          <p>
            <strong>Bernstein's Four Pillars</strong>: William Bernstein (the neurologist-turned-investment-guru) built his philosophy on four unshakeable pillars: theory, history, psychology, and business. His message is refreshingly anti-Wall Street: embrace wide diversification, stick with low-cost index funds, and hold for the long term. He understood that successful investing isn't about beating the market – it's about not beating yourself. The efficient market hypothesis suggests that all available information is already priced in, so why pay expensive fund managers when passive strategies often outperform?
          </p>
          <div className="bg-indigo-50 border-l-4 border-indigo-600 rounded-lg p-6 my-8">
            <h4 className="text-xl font-semibold text-indigo-800 mb-2">Your Turn</h4>
            <p className="text-gray-800">
              What do you think? Are we ready for a passwordless future? Will the HIRE Act actually pass? And are you following the Bernstein playbook with your investments?
            </p>
          </div>
          <figure className="my-8 text-center">
            <img src="/media/chitra_onestroke2.jpg" alt="Onestroke artwork placeholder" className="mx-auto rounded" />
            <figcaption className="text-sm text-gray-600 mt-2">Chirta's recent onestroke artistry</figcaption>
          </figure>
          <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg p-6 my-8">
            <h3 className="text-2xl font-bold text-yellow-800 mb-3">Key Takeaway</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Please enable Face id/ finger print auth for all your Bank, Payment apps in your mobile device  ASAP.
              </li>
              <li>
                Beware of Deepfakes. These days it is so easy to create audio, video - plausible ones mimicking our voice and images.
              </li>
            </ul>
          </div>
          <p>
            <strong>Tags:</strong> <code>#TechTrends</code> <code>#Cybersecurity</code> <code>#FinancialPolicy</code> <code>#InvestmentStrategy</code> <code>#PasswordlessAuth</code> <code>#IndianTech</code> <code>#RiskManagement</code> <code>#TechCollaboration</code>
          </p>
        </div>

      </article>
    </motion.div>
  );
};

export default LatestHappenings;


