import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BitcoinRailsExplained = () => {
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

      <h1 className="text-4xl font-bold mb-6">
        Bitcoin Rails: Value Moves on Math, Not Promises
      </h1>

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
        <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="space-y-8 prose prose-lg max-w-none">
        {/* TL;DR Section */}
        <section>
          <h2 className="text-2xl font-bold">TL;DR</h2>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-lg font-medium text-gray-800">
              Bitcoin operates on mathematical rails where value moves through cryptographic verification, 
              not trust in intermediaries. The base layer provides slow but final settlement, while Lightning 
              Network enables instant micropayments that ultimately settle back to the blockchain.
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold">The Feynman Approach to Understanding Bitcoin</h2>
          <p>
            Richard Feynman once said, "If you can't explain it simply, you don't understand it well enough." 
            When it comes to Bitcoin, the complexity often obscures the elegant simplicity at its core. 
            Bitcoin is essentially a system of mathematical rails where value moves through cryptographic 
            verification rather than trust in promises.
          </p>
          <p>
            Think of Bitcoin like a railway system: the base layer (blockchain) is the main track that 
            provides slow but final settlement, while Lightning Network is the express track for small, 
            fast payments that ultimately connect back to the main line.
          </p>
        </section>

        {/* The Diagram */}
        <section>
          <h2 className="text-2xl font-bold">The Bitcoin Rails Diagram</h2>
          <p>
            Below is a Feynman-style diagram that visualizes how value flows through the Bitcoin network. 
            It shows the complete journey from sender to receiver, including both the base layer and 
            Lightning Network paths.
          </p>
          
          <div className="my-8 p-4 bg-gray-50 rounded-lg">
            <svg width="980" height="620" viewBox="0 0 980 620" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" className="w-full h-auto">
              <title id="title">Bitcoin Rails — Feynman-style Diagram</title>
              <desc id="desc">Shows value flow from sender wallet through nodes and miners to blockchain and receiver wallet; includes Lightning channel as an express track.</desc>
              <defs>
                {/* Arrowheads */}
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#333"/>
                </marker>
                {/* Subtle shadow */}
                <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity="0.2"/>
                </filter>
                {/* Box style */}
                <style>
                  {`.box{ fill:#fff; stroke:#333; stroke-width:1.5; rx:10; }
                  .title{ font:700 18px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; fill:#111;}
                  .text{ font:500 14px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; fill:#333;}
                  .muted{ fill:#666; font:12px ui-sans-serif, system-ui;}
                  .note{ fill:#0b6; font:600 12px ui-sans-serif, system-ui;}
                  .rail{ stroke:#555; stroke-width:3; stroke-dasharray:6 6; }
                  .arrow{ stroke:#333; stroke-width:2; fill:none; marker-end:url(#arrow);}
                  .hl{ fill:#f6ffef; stroke:#0b6; }
                  .chain{ fill:#f7f7ff; stroke:#4453ff; }
                  .pow{ fill:#fff7eb; stroke:#ff9900; }
                  .chip{ fill:#fafafa; stroke:#bbb; rx:6;}`}
                </style>
              </defs>

              {/* Header */}
              <text x="20" y="36" className="title">Bitcoin rails: value moves on math, not promises</text>
              <text x="20" y="58" className="muted">Base layer = slow but final settlement • Lightning = instant micropayments that settle back to base</text>

              {/* Base rail (dashed track) */}
              <line x1="40" y1="210" x2="940" y2="210" className="rail"/>
              <text x="45" y="198" className="muted">Base Layer (Bitcoin)</text>

              {/* Sender Wallet */}
              <g transform="translate(60,120)" filter="url(#softShadow)">
                <rect className="box" width="180" height="120"/>
                <text x="90" y="28" textAnchor="middle" className="title">Wallet (Sender)</text>
                <rect x="16" y="42" width="148" height="28" className="chip"/>
                <text x="90" y="61" textAnchor="middle" className="text">Private Key</text>
                <text x="90" y="94" textAnchor="middle" className="muted">Signs a transaction</text>
              </g>

              {/* Arrow to Nodes */}
              <path d="M 240 180 C 300 180, 320 180, 360 180" className="arrow"/>

              {/* Network Nodes */}
              <g transform="translate(360,110)" filter="url(#softShadow)">
                <rect className="box" width="210" height="140"/>
                <text x="105" y="28" textAnchor="middle" className="title">Full Nodes</text>
                <text x="105" y="52" textAnchor="middle" className="text">• Validate signature</text>
                <text x="105" y="72" textAnchor="middle" className="text">• Check UTXOs (you own it?)</text>
                <text x="105" y="92" textAnchor="middle" className="text">• Enforce consensus rules</text>
                <text x="105" y="114" textAnchor="middle" className="muted">If valid → relay to miners</text>
              </g>

              {/* Arrow to Miners */}
              <path d="M 570 180 C 610 180, 630 180, 660 180" className="arrow"/>

              {/* Miners / PoW */}
              <g transform="translate(660,110)" filter="url(#softShadow)">
                <rect className="box pow" width="220" height="140"/>
                <text x="110" y="28" textAnchor="middle" className="title">Miners (Proof-of-Work)</text>
                <text x="110" y="54" textAnchor="middle" className="text">• Pack valid txs into a block</text>
                <text x="110" y="76" textAnchor="middle" className="text">• Find nonce → lowest hash</text>
                <text x="110" y="98" textAnchor="middle" className="text">• Broadcast winning block</text>
                <text x="110" y="120" textAnchor="middle" className="muted">Security = expended energy</text>
              </g>

              {/* Down arrow to Blockchain */}
              <path d="M 770 250 L 770 310" className="arrow"/>

              {/* Blockchain Ledger */}
              <g transform="translate(610,310)" filter="url(#softShadow)">
                <rect className="box chain" width="320" height="150"/>
                <text x="160" y="28" textAnchor="middle" className="title">Blockchain (Public Ledger)</text>
                {/* Stylized blocks */}
                <rect x="20" y="50" width="80" height="30" className="chip"/>
                <rect x="110" y="50" width="80" height="30" className="chip"/>
                <rect x="200" y="50" width="80" height="30" className="chip"/>
                <text x="160" y="104" textAnchor="middle" className="text">Immutable history of transfers</text>
                <text x="160" y="126" textAnchor="middle" className="muted">Finality grows with confirmations</text>
              </g>

              {/* Arrow from chain to Receiver */}
              <path d="M 610 385 C 540 385, 520 385, 470 385" className="arrow"/>
              <path d="M 470 385 C 420 385, 380 320, 320 320" className="arrow"/>

              {/* Receiver Wallet */}
              <g transform="translate(120,320)" filter="url(#softShadow)">
                <rect className="box" width="200" height="140"/>
                <text x="100" y="28" textAnchor="middle" className="title">Wallet (Receiver)</text>
                <text x="100" y="58" textAnchor="middle" className="text">UTXO now controlled by</text>
                <text x="100" y="78" textAnchor="middle" className="text">receiver's public key</text>
                <text x="100" y="106" textAnchor="middle" className="muted">Spendable after confirmations</text>
              </g>

              {/* Lightning Section */}
              <g transform="translate(40,480)">
                <text x="0" y="-18" className="muted">Layer 2 (Lightning) — express track for small/fast payments</text>
                {/* Lightning rail */}
                <line x1="0" y1="0" x2="900" y2="0" className="rail" stroke="#0b6"/>
                {/* Channel box */}
                <g transform="translate(70,-70)" filter="url(#softShadow)">
                  <rect className="box hl" width="320" height="110"/>
                  <text x="160" y="24" textAnchor="middle" className="title">Payment Channel</text>
                  <text x="160" y="48" textAnchor="middle" className="text">Lock BTC on-chain ➜ trade IOUs off-chain</text>
                  <text x="160" y="70" textAnchor="middle" className="muted">Only open/close hit the blockchain</text>
                </g>
                {/* Hop nodes */}
                <g transform="translate(440,-38)" filter="url(#softShadow)">
                  <rect className="box" width="120" height="46"/>
                  <text x="60" y="28" textAnchor="middle" className="text">Routing Node</text>
                </g>
                <g transform="translate(590,-38)" filter="url(#softShadow)">
                  <rect className="box" width="120" height="46"/>
                  <text x="60" y="28" textAnchor="middle" className="text">Routing Node</text>
                </g>
                {/* Lightning arrows */}
                <path d="M 390 -15 L 440 -15" className="arrow" stroke="#0b6"/>
                <path d="M 560 -15 L 590 -15" className="arrow" stroke="#0b6"/>
                <path d="M 710 -15 L 860 -15" className="arrow" stroke="#0b6"/>
                {/* S/R labels */}
                <text x="30" y="-24" className="note">Sender</text>
                <text x="880" y="-24" className="note" textAnchor="end">Receiver</text>
                {/* Notes */}
                <text x="0" y="32" className="muted">• Instant, low-fee updates secured by HTLCs</text>
                <text x="0" y="52" className="muted">• Final settlement occurs when channels close on base layer</text>
              </g>

              {/* Legend */}
              <g transform="translate(20,78)">
                <rect x="0" y="0" width="14" height="14" className="box"/>
                <text x="24" y="12" className="muted">Component</text>
                <line x1="120" y1="7" x2="150" y2="7" className="arrow"/>
                <text x="158" y="12" className="muted">Flow of messages/value</text>
                <rect x="330" y="0" width="14" height="14" className="pow"/>
                <text x="350" y="12" className="muted">Proof-of-Work miner</text>
                <rect x="520" y="0" width="14" height="14" className="chain"/>
                <text x="540" y="12" className="muted">Blockchain (ledger)</text>
                <rect x="730" y="0" width="14" height="14" className="hl"/>
                <text x="750" y="12" className="muted">Lightning channel</text>
              </g>

              {/* Feynman-style takeaway */}
              <text x="20" y="600" className="text">Feynman takeaway: "If many strangers can verify it, you don't need to trust a middleman."</text>
            </svg>
          </div>
        </section>

        {/* Breaking Down the Components */}
        <section>
          <h2 className="text-2xl font-bold">Breaking Down the Components</h2>
          
          <h3 className="text-xl font-semibold">1. The Sender's Wallet</h3>
          <p>
            Every Bitcoin transaction begins with a private key. This cryptographic key is what proves 
            ownership and allows you to spend your Bitcoin. When you want to send Bitcoin, your wallet 
            uses this private key to create a digital signature that mathematically proves you own the 
            funds you're trying to spend.
          </p>

          <h3 className="text-xl font-semibold">2. Full Nodes: The Validators</h3>
          <p>
            Full nodes are the backbone of Bitcoin's security. They don't just relay transactions—they 
            validate every single one. They check:
          </p>
          <ul>
            <li><strong>Digital signatures:</strong> Is this transaction actually signed by the owner?</li>
            <li><strong>UTXO ownership:</strong> Does the sender actually own the Bitcoin they're trying to spend?</li>
            <li><strong>Consensus rules:</strong> Does this transaction follow all the network rules?</li>
          </ul>
          <p>
            If a transaction passes all these checks, the node relays it to miners. If not, it's rejected.
          </p>

          <h3 className="text-xl font-semibold">3. Miners: The Security Engine</h3>
          <p>
            Miners perform Proof-of-Work, which is Bitcoin's security mechanism. They:
          </p>
          <ul>
            <li>Collect valid transactions into blocks</li>
            <li>Solve a computationally difficult puzzle (finding a nonce that produces a hash below a target)</li>
            <li>Broadcast the winning block to the network</li>
          </ul>
          <p>
            The security comes from the energy expended—it's economically irrational to attack the network 
            because the cost would exceed any potential benefit.
          </p>

          <h3 className="text-xl font-semibold">4. The Blockchain: Immutable History</h3>
          <p>
            The blockchain is a public ledger that records every transaction in an immutable chain of blocks. 
            Each block contains a cryptographic hash of the previous block, creating an unbreakable chain. 
            The more confirmations a transaction has (blocks built on top of it), the more final it becomes.
          </p>
        </section>

        {/* Lightning Network */}
        <section>
          <h2 className="text-2xl font-bold">Lightning Network: The Express Track</h2>
          <p>
            While the base layer provides ultimate security and finality, it's not designed for high-frequency, 
            small-value transactions. That's where Lightning Network comes in—it's like an express track 
            that runs parallel to the main railway.
          </p>

          <h3 className="text-xl font-semibold">How Lightning Works</h3>
          <p>
            Lightning channels are essentially smart contracts that lock Bitcoin on the main chain, allowing 
            participants to trade IOUs off-chain. The key insight is that you only need to settle on the 
            blockchain when you open or close a channel—everything in between happens instantly and cheaply.
          </p>

          <h3 className="text-xl font-semibold">The Magic of HTLCs</h3>
          <p>
            Lightning uses Hash Time Locked Contracts (HTLCs) to ensure security. These cryptographic 
            constructs ensure that payments can only be claimed by the intended recipient and only within 
            a specific time window. This allows for trustless routing through multiple nodes.
          </p>
        </section>

        {/* The Feynman Takeaway */}
        <section>
          <h2 className="text-2xl font-bold">The Feynman Takeaway</h2>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg">
            "If many strangers can verify it, you don't need to trust a middleman."
          </blockquote>
          <p>
            This is the revolutionary insight of Bitcoin. Traditional financial systems require you to trust 
            banks, payment processors, and other intermediaries. Bitcoin eliminates this need by making 
            everything verifiable by anyone with a computer and internet connection.
          </p>
          <p>
            The mathematical rails of Bitcoin ensure that:
          </p>
          <ul>
            <li><strong>No one can counterfeit Bitcoin</strong> because the cryptographic signatures are unforgeable</li>
            <li><strong>No one can double-spend</strong> because the network consensus prevents it</li>
            <li><strong>No one can censor transactions</strong> because the network is decentralized</li>
            <li><strong>No one can inflate the supply</strong> because the issuance schedule is mathematically predetermined</li>
          </ul>
        </section>

        {/* Conclusion */}
        <section>
          <h2 className="text-2xl font-bold">Conclusion</h2>
          <p>
            Bitcoin represents a fundamental shift from trust-based to math-based money. The "rails" 
            metaphor helps us understand that Bitcoin isn't just a digital currency—it's an entire 
            infrastructure for moving value that operates on mathematical principles rather than promises.
          </p>
          <p>
            The base layer provides the security and finality that makes Bitcoin sound money, while 
            Lightning Network enables the speed and efficiency needed for everyday transactions. 
            Together, they create a complete monetary system that works for everyone, everywhere, 
            without requiring trust in any central authority.
          </p>
          <p>
            As Feynman would say: if you can verify it mathematically, you don't need to trust anyone's word.
          </p>
        </section>
      </div>

      {/* Tags */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Bitcoin</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Blockchain</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Lightning Network</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Cryptocurrency</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Education</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BitcoinRailsExplained;
