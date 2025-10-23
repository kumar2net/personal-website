import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mermaid from 'mermaid';

const BitcoinDisintermediation = () => {
  const navigate = useNavigate();
  const articleRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      themeVariables: {
        fontSize: '18px',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        primaryColor: '#dbeafe',
        primaryTextColor: '#1e40af',
        primaryBorderColor: '#3b82f6',
        lineColor: '#6366f1',
        secondaryColor: '#fef3c7',
        tertiaryColor: '#d1fae5',
        background: '#ffffff',
        mainBkg: '#f0f9ff',
        nodeBorder: '#2563eb',
        clusterBkg: '#f8fafc',
        clusterBorder: '#64748b',
        titleColor: '#1e293b',
        edgeLabelBackground: '#ffffff',
        nodeTextColor: '#1e3a8a'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        padding: 20,
        nodeSpacing: 80,
        rankSpacing: 80,
        diagramPadding: 20
      }
    });
    mermaid.contentLoaded();
  }, []);

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
        Bitcoin and Disintermediation: Reimagining the Future of Finance
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
          />
        </svg>
        <span>October 23, 2025</span>
        <span className="mx-2">•</span>
        <span>15 min read</span>
      </div>

      {/* Topic badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          Bitcoin
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Finance
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Cryptocurrency
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          Blockchain
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
          Decentralization
        </span>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Economics
        </span>
      </div>

      <div className="space-y-8">
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              Exploring how Bitcoin challenges traditional financial intermediaries and paves the way 
              for a new era of peer-to-peer value transfer without trusted third parties
            </p>
          </header>

          {/* Technology badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <img
              loading="lazy"
              decoding="async"
              src="https://img.shields.io/badge/Bitcoin-Cryptocurrency-F7931A?style=for-the-badge&logo=bitcoin&logoColor=white"
              alt="Bitcoin"
            />
            <img
              loading="lazy"
              decoding="async"
              src="https://img.shields.io/badge/Blockchain-Distributed_Ledger-121D33?style=for-the-badge&logo=blockchain.com&logoColor=white"
              alt="Blockchain Technology"
            />
            <img
              loading="lazy"
              decoding="async"
              src="https://img.shields.io/badge/P2P-Peer_to_Peer-00D9FF?style=for-the-badge&logo=protocoldotio&logoColor=white"
              alt="Peer-to-Peer"
            />
            <img
              loading="lazy"
              decoding="async"
              src="https://img.shields.io/badge/Cryptography-Security-6F42C1?style=for-the-badge&logo=letsencrypt&logoColor=white"
              alt="Cryptography"
            />
          </div>

          {/* Hero Image */}
          <div className="mb-10">
            <img
              loading="lazy"
              decoding="async"
              src="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Bitcoin cryptocurrency concept with digital coins and financial technology"
              className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src =
                  'https://via.placeholder.com/1200x400/F7931A/ffffff?text=Bitcoin+and+Disintermediation';
              }}
            />
            <p className="text-sm text-gray-500 text-center mt-2">
              Photo by{' '}
              <a
                href="https://unsplash.com/@dmitry_demidko"
                className="underline hover:text-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dmitry Demidko
              </a>{' '}
              on{' '}
              <a
                href="https://unsplash.com"
                className="underline hover:text-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unsplash
              </a>
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Understanding the Current Financial System
            </h2>
            
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The modern financial system is built on a complex network of intermediaries. When you send money, 
              make a purchase, or invest, multiple trusted third parties facilitate these transactions. This 
              intermediated system has evolved over centuries to solve fundamental problems of trust and coordination 
              in economic exchanges.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              The Role of Financial Intermediaries
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Financial intermediaries serve several critical functions in our economy:
            </p>

            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-6 space-y-2">
              <li><strong>Trust Provision:</strong> Banks and payment processors verify identities and guarantee transactions</li>
              <li><strong>Record Keeping:</strong> Maintaining accurate ledgers of who owns what and who owes whom</li>
              <li><strong>Settlement:</strong> Ensuring that both sides of a transaction are completed</li>
              <li><strong>Risk Management:</strong> Providing insurance and fraud protection</li>
              <li><strong>Regulatory Compliance:</strong> Enforcing Anti-Money Laundering (AML) and Know Your Customer (KYC) requirements</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
              <h4 className="text-lg font-semibold mb-3 text-blue-800">
                💡 Traditional Transaction Flow
              </h4>
              <p className="text-blue-700">
                When Alice wants to send $100 to Bob, the money doesn't move directly. Instead, Alice's bank 
                debits her account, communicates with Bob's bank through the Automated Clearing House (ACH) network 
                or SWIFT system, and Bob's bank credits his account. This process can take days and involves 
                multiple intermediaries, each taking a fee.
              </p>
            </div>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              Traditional Financial System Architecture
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Here's how the current system operates when you make a simple payment:
            </p>

            <h4 className="text-2xl font-bold text-center text-blue-700 mb-4 mt-8">
              📊 Traditional Financial System Architecture
            </h4>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-3 border-blue-400 rounded-xl p-8 my-10 overflow-x-auto shadow-xl">
              <pre className="mermaid text-lg" style={{ minHeight: '500px' }}>
{`graph TB
    subgraph "Traditional Financial System"
    A[Alice - Sender] -->|1. Initiates Payment| B[Alice's Bank]
    B -->|2. Verifies Funds & Identity| C[Payment Processor]
    C -->|3. Routes Through Network| D[Central Clearinghouse]
    D -->|4. Settlement| E[SWIFT/ACH Network]
    E -->|5. Forwards Payment| F[Bob's Bank]
    F -->|6. Verifies & Credits| G[Bob - Receiver]
    
    H[Central Bank] -.->|Regulates| B
    H -.->|Regulates| F
    I[Government Regulators] -.->|Oversees| D
    I -.->|Compliance| E
    end
    
    style A fill:#e3f2fd
    style G fill:#c8e6c9
    style D fill:#fff3e0
    style H fill:#fce4ec
    style I fill:#f3e5f5`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              Costs of Intermediation
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              While intermediaries provide valuable services, they also impose significant costs:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-red-600">
                  ⚠️ Direct Costs
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Transaction fees (2-3% for credit cards)</li>
                  <li>• Wire transfer fees ($15-50 internationally)</li>
                  <li>• Currency conversion charges (3-5%)</li>
                  <li>• Account maintenance fees</li>
                  <li>• Overdraft and penalty fees</li>
                </ul>
              </div>

              <div className="bg-white border border-orange-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-orange-600">
                  ⏱️ Indirect Costs
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Settlement delays (1-5 business days)</li>
                  <li>• Limited operating hours (closed weekends)</li>
                  <li>• Geographic restrictions and sanctions</li>
                  <li>• Privacy concerns and data collection</li>
                  <li>• Censorship and account freezing risks</li>
                </ul>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              According to the World Bank, the global average cost of sending remittances was approximately 6.2% 
              in Q2 2024<sup><a href="#ref1" className="text-blue-600 hover:underline">[1]</a></sup>. For the 
              world's 281 million international migrants who sent $794 billion in remittances in 2023, these fees 
              represent tens of billions in lost value<sup><a href="#ref2" className="text-blue-600 hover:underline">[2]</a></sup>.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-8">
              <h4 className="text-lg font-semibold mb-3 text-yellow-800">
                🏦 The Unbanked Problem
              </h4>
              <p className="text-yellow-700 mb-3">
                As of 2021, approximately 1.4 billion adults globally remain unbanked—without access to formal 
                financial services<sup><a href="#ref3" className="text-blue-600 hover:underline">[3]</a></sup>. 
                Traditional intermediaries often find it unprofitable to serve remote areas, the poor, or people 
                in regions with unstable governments.
              </p>
              <p className="text-yellow-700">
                This exclusion from the financial system perpetuates poverty and limits economic opportunity for 
                billions of people worldwide.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              How Bitcoin Works: A Paradigm Shift
            </h2>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Bitcoin, introduced in 2008 by the pseudonymous Satoshi Nakamoto, represents a fundamental reimagining 
              of money and payment systems<sup><a href="#ref4" className="text-blue-600 hover:underline">[4]</a></sup>. 
              Rather than relying on trusted intermediaries, Bitcoin uses cryptographic proof and distributed consensus 
              to enable direct peer-to-peer transactions.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Core Innovations of Bitcoin
            </h3>

            <div className="space-y-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-xl font-semibold mb-3 text-gray-800">
                  1. Decentralized Ledger (Blockchain)
                </h4>
                <p className="text-gray-700 mb-3">
                  Instead of a single bank maintaining account balances, Bitcoin uses a distributed ledger—the 
                  blockchain—replicated across thousands of computers worldwide. Every transaction is recorded in 
                  a block, and blocks are cryptographically linked in a chain, making the history tamper-evident.
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <code>Block 1 → Block 2 → Block 3 → ... → Current Block</code>
                  <p className="mt-2 text-xs text-gray-600">
                    Each block contains transactions and a cryptographic hash of the previous block
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-xl font-semibold mb-3 text-gray-800">
                  2. Proof-of-Work Consensus
                </h4>
                <p className="text-gray-700 mb-3">
                  Bitcoin solves the "Byzantine Generals Problem"—how to achieve consensus in a distributed system 
                  without trusting any participant. Miners compete to solve computationally difficult puzzles, and 
                  the winner gets to add the next block. This process, called mining, secures the network and creates 
                  new bitcoins as a reward.
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                  Mining difficulty adjusts every 2,016 blocks (~2 weeks) to maintain an average block time of 10 minutes
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-xl font-semibold mb-3 text-gray-800">
                  3. Public-Private Key Cryptography
                </h4>
                <p className="text-gray-700 mb-3">
                  Users control their bitcoin through cryptographic keys. Your public key (or address) is like your 
                  account number—anyone can send bitcoin to it. Your private key is like your password—it proves 
                  ownership and authorizes transfers. Critically, <strong>you don't need anyone's permission</strong> 
                  to create a Bitcoin wallet.
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <code className="text-xs break-all">
                    Public Key: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa<br/>
                    Private Key: [Hidden - Never share!]
                  </code>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-xl font-semibold mb-3 text-gray-800">
                  4. Fixed Supply and Predictable Issuance
                </h4>
                <p className="text-gray-700 mb-3">
                  Unlike fiat currencies that can be printed at will, Bitcoin has a hard cap of 21 million coins. 
                  The issuance schedule is programmatically defined, with block rewards halving approximately every 
                  four years. This scarcity is enforced by mathematics and consensus, not by any central authority.
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                  Current circulating supply: ~19.5 million BTC (as of 2024)<br/>
                  Final bitcoin expected to be mined: ~2140
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              Bitcoin Transaction Flow
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Here's how a Bitcoin transaction works without intermediaries:
            </p>

            <h4 className="text-2xl font-bold text-center text-orange-600 mb-4 mt-8">
              ₿ Bitcoin Peer-to-Peer Network
            </h4>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-3 border-blue-400 rounded-xl p-8 my-10 overflow-x-auto shadow-xl">
              <pre className="mermaid text-lg" style={{ minHeight: '500px' }}>
{`graph TB
    subgraph "Bitcoin P2P Network"
    A[Alice - Sender] -->|1. Creates & Signs Transaction| B[Transaction Broadcast]
    B -->|2. Propagates to Network| C[Memory Pool - Mempool]
    C -->|3. Miners Select Transactions| D[Mining Nodes]
    D -->|4. Compete to Solve Puzzle| E[Proof-of-Work]
    E -->|5. Winner Adds Block| F[Blockchain]
    F -->|6. Block Propagates| G[All Network Nodes]
    G -->|7. Verify & Update| H[Bob Receives Payment]
    
    I[Thousands of Full Nodes] -.->|Validate| F
    I -.->|Store Complete History| F
    J[No Central Authority] -.->|Consensus Rules| D
    end
    
    style A fill:#e3f2fd
    style H fill:#c8e6c9
    style E fill:#fff3e0
    style F fill:#e1bee7
    style J fill:#ffccbc`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              Key Differences from Traditional Systems
            </h3>

            <div className="bg-white border-2 border-purple-200 rounded-lg p-6 my-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-purple-200">
                    <th className="py-3 px-4 font-semibold">Aspect</th>
                    <th className="py-3 px-4 font-semibold">Traditional System</th>
                    <th className="py-3 px-4 font-semibold">Bitcoin</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Trust Model</td>
                    <td className="py-3 px-4">Trust in intermediaries</td>
                    <td className="py-3 px-4 text-green-700">Trust in mathematics & consensus</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Permission</td>
                    <td className="py-3 px-4">Requires account approval</td>
                    <td className="py-3 px-4 text-green-700">Permissionless - anyone can participate</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Transaction Time</td>
                    <td className="py-3 px-4">1-5 business days</td>
                    <td className="py-3 px-4 text-green-700">~10-60 minutes (confirmation time)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Operating Hours</td>
                    <td className="py-3 px-4">Limited (weekdays, business hours)</td>
                    <td className="py-3 px-4 text-green-700">24/7/365 globally</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Censorship</td>
                    <td className="py-3 px-4">Accounts can be frozen</td>
                    <td className="py-3 px-4 text-green-700">Censorship-resistant transactions</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Supply</td>
                    <td className="py-3 px-4">Unlimited (inflationary)</td>
                    <td className="py-3 px-4 text-green-700">Fixed at 21 million (deflationary)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Transparency</td>
                    <td className="py-3 px-4">Private ledgers</td>
                    <td className="py-3 px-4 text-green-700">Public, auditable blockchain</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Single Point of Failure</td>
                    <td className="py-3 px-4">Yes (central systems)</td>
                    <td className="py-3 px-4 text-green-700">No (distributed network)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
              <h4 className="text-lg font-semibold mb-3 text-green-800">
                🔐 Security Through Decentralization
              </h4>
              <p className="text-green-700">
                To attack Bitcoin, an adversary would need to control 51% of the network's computational power—a 
                feat requiring billions of dollars in specialized hardware and energy. As of 2024, the Bitcoin network's 
                hash rate exceeds 400 exahashes per second (EH/s), making it the most secure computational network 
                ever created<sup><a href="#ref5" className="text-blue-600 hover:underline">[5]</a></sup>.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Bitcoin as a Disintermediating Force
            </h2>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              <strong>Disintermediation</strong> refers to the removal of intermediaries from a supply chain or process. 
              Bitcoin enables financial disintermediation by allowing individuals to transact directly without banks, 
              payment processors, or other middlemen. This has profound implications across multiple dimensions of 
              modern finance.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              1. Payment Systems and Remittances
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              One of Bitcoin's most immediate use cases is international value transfer. Consider a worker in the 
              United States sending money home to family in the Philippines:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-blue-600">
                  🏦 Traditional Remittance
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li><strong>Fee:</strong> 5-10% of transfer amount</li>
                  <li><strong>Time:</strong> 1-5 business days</li>
                  <li><strong>Process:</strong> Money transfer service → correspondent banks → local bank</li>
                  <li><strong>Requirements:</strong> ID verification, physical location, operating hours</li>
                  <li><strong>Access:</strong> Recipient needs bank account or pickup location</li>
                </ul>
              </div>

              <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-green-600">
                  ₿ Bitcoin Remittance
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li><strong>Fee:</strong> $1-5 regardless of amount</li>
                  <li><strong>Time:</strong> 10-60 minutes for confirmation</li>
                  <li><strong>Process:</strong> Sender → Bitcoin network → Recipient</li>
                  <li><strong>Requirements:</strong> Internet connection and wallet app</li>
                  <li><strong>Access:</strong> Anyone can receive, 24/7/365</li>
                </ul>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Countries like El Salvador and the Central African Republic have recognized Bitcoin as legal tender, 
              partly to reduce dependence on costly remittance services. El Salvador's adoption in 2021 aimed to save 
              its citizens approximately $400 million annually in remittance fees<sup><a href="#ref6" className="text-blue-600 hover:underline">[6]</a></sup>.
            </p>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              2. Store of Value and Protection from Debasement
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Central banks can increase money supply through quantitative easing and other monetary policies. While 
              these tools can be valuable for managing economies, they also dilute the purchasing power of existing 
              money holders. Bitcoin's fixed supply offers an alternative.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 my-8">
              <h4 className="text-lg font-semibold mb-3 text-orange-800">
                💸 Case Study: Hyperinflation
              </h4>
              <p className="text-orange-700 mb-3">
                In countries experiencing currency crises—such as Venezuela (inflation rate exceeded 1,000,000% in 2018), 
                Argentina, Lebanon, and Zimbabwe—citizens have increasingly turned to Bitcoin as a store of value. When 
                the intermediary (central bank) fails to maintain monetary stability, Bitcoin provides an opt-out mechanism.
              </p>
              <p className="text-orange-700 text-sm">
                Source: International Monetary Fund (IMF) World Economic Outlook<sup><a href="#ref7" className="text-blue-600 hover:underline">[7]</a></sup>
              </p>
            </div>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              3. Financial Inclusion
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              By removing the need for traditional banking infrastructure, Bitcoin can serve the unbanked and underbanked. 
              A person with just a smartphone and internet connection can:
            </p>

            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-6 space-y-2">
              <li>Create a Bitcoin wallet in minutes without approval</li>
              <li>Receive payments from anywhere in the world</li>
              <li>Store value without minimum balance requirements</li>
              <li>Access global markets and services</li>
              <li>Maintain financial privacy and security</li>
            </ul>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              This is particularly transformative in regions where traditional banks find it unprofitable to operate 
              or where governments restrict access to financial services.
            </p>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              4. Smart Contracts and Programmable Money
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              While Bitcoin's scripting language is intentionally limited for security reasons, it still enables basic 
              smart contracts—self-executing agreements with conditions written in code. More advanced platforms like 
              Ethereum extend this concept, but Bitcoin pioneered the idea of programmable money that can execute without 
              intermediary enforcement.
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 my-8">
              <h4 className="text-lg font-semibold mb-3 text-purple-800">
                🔮 Example: Multisignature Escrow
              </h4>
              <p className="text-purple-700 mb-3">
                Alice and Bob can create a 2-of-3 multisignature address with Charlie as an arbiter. Funds can only 
                be moved if two of the three parties sign. This creates an escrow system without trusting a traditional 
                escrow company—the security is enforced by cryptography, not by an intermediary's reputation.
              </p>
            </div>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              5. Resistance to Censorship and Seizure
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Traditional financial intermediaries can freeze accounts, reverse transactions, or block payments based 
              on regulatory requirements or political pressure. Bitcoin transactions, once confirmed, are irreversible 
              and censorship-resistant. While this can enable illicit activity (a common criticism), it also protects:
            </p>

            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-6 space-y-2">
              <li>Activists and journalists in authoritarian regimes</li>
              <li>Businesses and individuals facing unjust sanctions</li>
              <li>People whose accounts were frozen due to political beliefs</li>
              <li>Organizations like WikiLeaks that were "debanked" by payment processors</li>
            </ul>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
              <h4 className="text-lg font-semibold mb-3 text-red-800">
                ⚖️ The Double-Edged Sword
              </h4>
              <p className="text-red-700">
                Bitcoin's censorship resistance is both its strength and its challenge. While it protects legitimate 
                users from arbitrary control, it also makes law enforcement more difficult. This tension between 
                individual sovereignty and collective security is at the heart of debates about Bitcoin's role in 
                society. Regulatory frameworks are still evolving to address these concerns while preserving the 
                benefits of disintermediation.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Creating a New Financial System
            </h2>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Beyond simply removing intermediaries from existing financial processes, Bitcoin enables the creation 
              of entirely new financial systems and services. This emerging ecosystem—often called "Bitcoin-native" 
              or "crypto-native" finance—reimagines how financial services can operate.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              The Lightning Network: Scaling Bitcoin
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              One of Bitcoin's limitations is throughput—the base layer can process only about 7 transactions per second, 
              compared to Visa's 24,000 transactions per second capability. The Lightning Network solves this through 
              <strong> second-layer scaling</strong>: payment channels that allow users to conduct thousands of 
              near-instant, low-cost transactions off-chain, with the base blockchain serving as a settlement layer.
            </p>

            <h4 className="text-2xl font-bold text-center text-purple-600 mb-4 mt-8">
              ⚡ Lightning Network Architecture
            </h4>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-3 border-blue-400 rounded-xl p-8 my-10 overflow-x-auto shadow-xl">
              <pre className="mermaid text-lg" style={{ minHeight: '500px' }}>
{`graph TB
    subgraph "Lightning Network Architecture"
    A[Alice] -->|Opens Channel| B[Payment Channel]
    B -->|Off-chain Transactions| C[Lightning Network]
    C -->|Instant Payments| D[Payment Channel]
    D -->|Closes Channel| E[Bob]
    
    B -.->|Settlement Layer| F[Bitcoin Blockchain]
    D -.->|Settlement Layer| F
    
    G[Routing Nodes] -->|Forward Payments| C
    C -->|Multi-hop Routing| G
    
    H[Channel Opening TX] -.->|On-chain| F
    I[Channel Closing TX] -.->|On-chain| F
    end
    
    style A fill:#e3f2fd
    style E fill:#c8e6c9
    style C fill:#fff3e0
    style F fill:#e1bee7`}
              </pre>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
              <h4 className="text-lg font-semibold mb-3 text-blue-800">
                ⚡ Lightning Fast
              </h4>
              <p className="text-blue-700">
                Lightning Network transactions settle in milliseconds with fees of fractions of a cent, making 
                Bitcoin viable for micropayments like streaming money, paying for content, or tipping. As of 2024, 
                the Lightning Network has over 15,000 nodes and a capacity exceeding $200 million<sup><a href="#ref8" className="text-blue-600 hover:underline">[8]</a></sup>.
              </p>
            </div>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              Decentralized Finance (DeFi) Principles
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              While Ethereum has become the primary platform for Decentralized Finance (DeFi), Bitcoin pioneered 
              the underlying principles:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-xl font-semibold mb-3 text-gray-800">
                  Non-Custodial Services
                </h4>
                <p className="text-gray-700">
                  Users maintain control of their private keys and assets at all times. Services are built as protocols, 
                  not platforms—there's no company that can freeze your account or seize your funds.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-xl font-semibold mb-3 text-gray-800">
                  Composability and Interoperability
                </h4>
                <p className="text-gray-700">
                  Financial services built on open protocols can be combined like Lego blocks. A lending protocol 
                  can integrate with a trading protocol, which connects to a yield-farming strategy, all without 
                  requiring permission from any intermediary.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-xl font-semibold mb-3 text-gray-800">
                  Transparency and Auditability
                </h4>
                <p className="text-gray-700">
                  All transactions and smart contract code are publicly visible on the blockchain. Anyone can audit 
                  the system's rules and verify its state—a stark contrast to traditional finance's opaque ledgers 
                  and proprietary systems.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-xl font-semibold mb-3 text-gray-800">
                  Programmable Incentives
                </h4>
                <p className="text-gray-700">
                  Token economics and mining rewards create incentive structures that don't require trusted intermediaries 
                  to function. The system pays participants directly through the protocol, not through employment by 
                  a company.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              Emerging Financial Primitives
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Bitcoin and cryptocurrency networks enable new types of financial instruments:
            </p>

            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-6 space-y-2">
              <li><strong>Atomic Swaps:</strong> Direct cryptocurrency exchanges between different blockchains without intermediaries</li>
              <li><strong>Hash Time Locked Contracts (HTLCs):</strong> Conditional payments that execute automatically based on cryptographic proofs</li>
              <li><strong>Discreet Log Contracts (DLCs):</strong> Bitcoin-based smart contracts for financial derivatives without oracles</li>
              <li><strong>Coinjoins and Privacy Tools:</strong> Collaborative transactions that enhance privacy without trusted mixers</li>
              <li><strong>Taproot and Schnorr Signatures:</strong> Advanced scripting capabilities that enable more complex contracts with better privacy</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              Comparison: Old vs. New Financial System
            </h3>

            <h4 className="text-2xl font-bold text-center text-green-600 mb-4 mt-8">
              🔄 Hierarchical vs. Peer-to-Peer Financial Systems
            </h4>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-3 border-blue-400 rounded-xl p-8 my-10 overflow-x-auto shadow-xl">
              <pre className="mermaid text-lg" style={{ minHeight: '500px' }}>
{`graph LR
    subgraph "Old System - Hierarchical"
    A1[Central Bank] --> B1[Commercial Banks]
    B1 --> C1[Payment Processors]
    C1 --> D1[Merchants]
    D1 --> E1[Consumers]
    
    F1[Regulators] -.->|Control| A1
    F1 -.->|Oversight| B1
    F1 -.->|Compliance| C1
    end
    
    subgraph "New System - Peer-to-Peer"
    A2[User A] <--> B2[Bitcoin Network]
    C2[User B] <--> B2
    D2[User C] <--> B2
    E2[User D] <--> B2
    
    F2[Consensus Rules] -.->|Enforced by Code| B2
    G2[Miners/Validators] -.->|Secure| B2
    H2[Full Nodes] -.->|Verify| B2
    end
    
    style A1 fill:#fce4ec
    style B1 fill:#fff3e0
    style E1 fill:#e3f2fd
    style B2 fill:#c8e6c9
    style F2 fill:#e1bee7`}
              </pre>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-8">
              <h4 className="text-lg font-semibold mb-3 text-indigo-800">
                🏗️ Building on Bitcoin
              </h4>
              <p className="text-indigo-700 mb-3">
                Projects like <strong>Stacks</strong> bring smart contracts to Bitcoin, <strong>RGB</strong> enables 
                token issuance on Bitcoin, and <strong>Fedimint</strong> creates federated custodial solutions with 
                privacy. These second-layer innovations extend Bitcoin's capabilities while maintaining its security 
                and decentralization.
              </p>
              <p className="text-indigo-700 text-sm">
                The emerging "Bitcoin layers" ecosystem aims to create a full financial stack on top of Bitcoin's 
                security foundation.
              </p>
            </div>

            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
              Challenges and Limitations
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              While Bitcoin offers compelling advantages, building a new financial system on it faces significant challenges:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-yellow-600">
                  ⚠️ Technical Challenges
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Scalability limitations (even with Lightning)</li>
                  <li>• High energy consumption of mining</li>
                  <li>• Irreversible transactions (no chargebacks)</li>
                  <li>• Key management and loss of funds risks</li>
                  <li>• User experience complexity</li>
                </ul>
              </div>

              <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold mb-3 text-red-600">
                  ⚠️ Social & Regulatory Challenges
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Regulatory uncertainty and compliance</li>
                  <li>• Price volatility limiting adoption</li>
                  <li>• Use in illicit activities creating stigma</li>
                  <li>• Coordination of network upgrades</li>
                  <li>• Competition from central bank digital currencies (CBDCs)</li>
                </ul>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Environmental concerns around Bitcoin mining have sparked significant debate. While the network does 
              consume substantial energy (estimated at 0.5% of global electricity), proponents argue that:
            </p>

            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-6 space-y-2">
              <li>Increasingly, mining uses stranded or renewable energy sources (over 50% renewable as of 2023)<sup><a href="#ref9" className="text-blue-600 hover:underline">[9]</a></sup></li>
              <li>Energy consumption secures a global financial network serving millions</li>
              <li>Traditional financial infrastructure also has significant energy costs that are less transparent</li>
              <li>Newer consensus mechanisms (like Proof-of-Stake) offer alternatives with lower energy usage</li>
            </ul>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 my-8">
              <h4 className="text-lg font-semibold mb-3 text-teal-800">
                🌍 The Bigger Picture
              </h4>
              <p className="text-teal-700">
                The question isn't whether Bitcoin's energy use is "good" or "bad" in absolute terms, but whether 
                the benefits of a decentralized, disintermediated financial system justify the costs. This is 
                ultimately a societal choice that requires thoughtful debate and ongoing evaluation as the technology 
                and its impact evolve.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Conclusion: The Future of Disintermediation
            </h2>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Bitcoin represents more than just a new form of money—it's a proof of concept for disintermediated 
              systems. By removing the need for trusted third parties through cryptographic proof and distributed 
              consensus, Bitcoin demonstrates that financial intermediaries are not inevitable features of modern 
              economies, but rather design choices with tradeoffs.
            </p>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The future likely involves a hybrid landscape where:
            </p>

            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-6 space-y-2">
              <li>Traditional intermediated systems continue for those who value their protections and conveniences</li>
              <li>Disintermediated systems like Bitcoin serve those who prioritize sovereignty, privacy, and censorship resistance</li>
              <li>New intermediate solutions emerge that combine elements of both—regulated crypto custodians, semi-decentralized systems, and hybrid models</li>
              <li>Central Bank Digital Currencies (CBDCs) compete with cryptocurrencies, offering digital money with traditional trust models</li>
            </ul>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-8 my-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-800">
                🚀 Key Takeaways
              </h3>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 text-xl">•</span>
                  <span><strong>Trust Architecture:</strong> Bitcoin replaces trust in institutions with trust in mathematics and open-source code</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3 text-xl">•</span>
                  <span><strong>Accessibility:</strong> Permissionless systems enable financial inclusion for billions without bank access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">•</span>
                  <span><strong>Cost Reduction:</strong> Disintermediation can dramatically reduce fees, particularly for cross-border transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3 text-xl">•</span>
                  <span><strong>New Possibilities:</strong> Bitcoin enables entirely new financial primitives and business models</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">•</span>
                  <span><strong>Tradeoffs:</strong> Disintermediation brings challenges in scalability, regulation, and user responsibility</span>
                </li>
              </ul>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Whether Bitcoin itself becomes the dominant global financial system or simply serves as the catalyst 
              for broader disintermediation, its impact on how we think about money, trust, and financial infrastructure 
              is undeniable. By demonstrating that "trustless" systems can function at scale, Bitcoin has opened the 
              door to reimagining not just finance, but any domain where intermediaries currently extract value or 
              gatekeep access.
            </p>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The question is no longer whether disintermediation is possible, but rather: for which use cases, 
              under what circumstances, and with what tradeoffs is disintermediation the better choice? That's the 
              experiment we're collectively running, and the answer will shape the future of finance and beyond.
            </p>
          </section>

          <section className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">References</h3>
            <ol className="text-sm text-gray-700 space-y-2">
              <li id="ref1">
                [1] World Bank. (2024). "Remittance Prices Worldwide Quarterly." 
                <a href="https://remittanceprices.worldbank.org/" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://remittanceprices.worldbank.org/
                </a>
              </li>
              <li id="ref2">
                [2] World Bank. (2023). "Migration and Development Brief 39: Leveraging Diaspora Finances for Private Capital Mobilization." 
                <a href="https://www.worldbank.org/en/topic/migration" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://www.worldbank.org/en/topic/migration
                </a>
              </li>
              <li id="ref3">
                [3] World Bank. (2021). "The Global Findex Database 2021: Financial Inclusion, Digital Payments, and Resilience." 
                <a href="https://www.worldbank.org/en/publication/globalfindex" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://www.worldbank.org/en/publication/globalfindex
                </a>
              </li>
              <li id="ref4">
                [4] Nakamoto, S. (2008). "Bitcoin: A Peer-to-Peer Electronic Cash System." 
                <a href="https://bitcoin.org/bitcoin.pdf" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://bitcoin.org/bitcoin.pdf
                </a>
              </li>
              <li id="ref5">
                [5] Blockchain.com. (2024). "Bitcoin Hash Rate." 
                <a href="https://www.blockchain.com/charts/hash-rate" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://www.blockchain.com/charts/hash-rate
                </a>
              </li>
              <li id="ref6">
                [6] Reuters. (2021). "El Salvador becomes first country to adopt bitcoin as legal tender." 
                <a href="https://www.reuters.com/business/finance/el-salvador-approves-first-law-bitcoin-legal-tender-2021-06-09/" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://www.reuters.com/business/finance/
                </a>
              </li>
              <li id="ref7">
                [7] International Monetary Fund. (2024). "World Economic Outlook Database." 
                <a href="https://www.imf.org/en/Publications/WEO" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://www.imf.org/en/Publications/WEO
                </a>
              </li>
              <li id="ref8">
                [8] 1ML.com. (2024). "Lightning Network Statistics." 
                <a href="https://1ml.com/statistics" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://1ml.com/statistics
                </a>
              </li>
              <li id="ref9">
                [9] Bitcoin Mining Council. (2023). "Q4 2023 Bitcoin Mining Council Survey." 
                <a href="https://bitcoinminingcouncil.com/" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://bitcoinminingcouncil.com/
                </a>
              </li>
            </ol>
          </section>

          <section className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3 text-blue-800">Further Reading</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>
                • Andreas M. Antonopoulos. (2017). <em>Mastering Bitcoin: Programming the Open Blockchain</em>. O'Reilly Media.
              </li>
              <li>
                • Saifedean Ammous. (2018). <em>The Bitcoin Standard: The Decentralized Alternative to Central Banking</em>. Wiley.
              </li>
              <li>
                • Nic Carter & Hasu. (2018). "Visions of Bitcoin." 
                <a href="https://medium.com/@nic__carter/visions-of-bitcoin-4b7b7cbcd24c" className="underline ml-1" target="_blank" rel="noopener noreferrer">
                  Medium Article
                </a>
              </li>
              <li>
                • Jameson Lopp. "Bitcoin Resources." 
                <a href="https://www.lopp.net/bitcoin-information.html" className="underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://www.lopp.net/bitcoin-information.html
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Bitcoin
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Finance
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Cryptocurrency
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Blockchain
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              Decentralization
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              Economics
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              Financial Technology
            </span>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
              Disintermediation
            </span>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default BitcoinDisintermediation;

