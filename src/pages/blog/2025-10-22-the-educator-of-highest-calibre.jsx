import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TheEducatorOfHighestCalibre = () => {
  const navigate = useNavigate();
  const publishedDate = new Date('2025-10-22T00:00:00Z');
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Back button */}
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

      {/* Title */}
      <h1 className="text-4xl font-bold mb-3">The Educator of Highest Calibre</h1>

      {/* Date */}
      <div className="flex items-center text-gray-600 mb-6">
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
        <span>{formattedDate}</span>
      </div>

      {/* Shields.io badges */}
      <div className="flex flex-wrap gap-3 mb-8">
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/Andrej_Karpathy-1F2937?style=for-the-badge&labelColor=111827&color=1F2937"
          alt="Andrej Karpathy"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/Dwarkesh_Patel-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Dwarkesh Patel"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/LLM_SLOPs-059669?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="LLM SLOPs"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/Reinforcement_Learning-7C3AED?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Reinforcement Learning"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/AWS_US_East_1-F97316?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="AWS US-East-1"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/DNS_Operations-10B981?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="DNS Operations"
        />
      </div>

      <div className="space-y-10 prose prose-lg max-w-none">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Andrej Karpathy the Teacher
          </h2>
          <p className="text-lg leading-relaxed">
            I was so impressed by Andrej Karpathy&apos;s podcast with Dwarkesh Patel. The 2 hours 45 minutes
            interview is one of the best I have listened to.
          </p>
          
          <div className="my-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6 shadow-sm">
            <p className="text-blue-900 font-medium mb-3">
              🎧 Listen to the full podcast:
            </p>
            <a 
              href="https://www.dwarkesh.com/p/andrej-karpathy?utm_campaign=post&utm_medium=web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium break-all"
            >
              Andrej Karpathy on Dwarkesh Podcast
            </a>
          </div>

          <p className="leading-relaxed">
            He just shreds things — <strong>LLM SLOPs</strong>, <strong>Reinforcement Learning pitfalls</strong> — so much that he covered. If 
            there&apos;s one thing you will listen to this week, this is it.
          </p>
          <p className="text-gray-700 italic leading-relaxed">
            The full 2 hours 25 minutes masterclass from an educator par excellence.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">AWS Outage Flashbacks</h2>
          <p className="leading-relaxed">
            And then the <strong>AWS-US-East1 outage</strong> which brought almost half of the internet down reminded me of stuff we
            used to face during my days working for a private Indian Internet Service Provider. DNS issue it seems
            is the root cause.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 my-6 shadow-sm">
            <p className="mb-4 text-amber-900 leading-relaxed">
              It was the same scramble feeling — the phone calls, the <em>why-is-DNS-like-this</em> question hanging in the
              air — just like in those private Indian Internet Service Provider days.
            </p>
            <blockquote className="text-amber-900 font-semibold italic border-l-2 border-amber-400 pl-4">
              &ldquo;Same chaos, different decade. AWS status page instead of our knock-on-doors style updates.&rdquo;
            </blockquote>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Bare Metal Memories</h2>
          <p className="leading-relaxed">
            In those early days, hosting our applications and scripts in <strong>RedHat</strong> or <strong>CentOS</strong> bare metal servers used
            to be an adventure — taking half a working day, before we moved to the cloud.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mt-4 text-gray-700">
            <p className="text-sm font-mono">
              💻 The days of SSH-ing into physical servers, manually deploying code, and hoping nothing breaks.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dogfooding the Blog</h2>
          <p className="leading-relaxed">
            Now I need to eat my own dog food, so that I can crib to him when he calls about his company products. 
            Checking out their daily pulse and connectors (for agentic workflow experimentation).
          </p>
          <p className="leading-relaxed">
            To retain the attention span of the young folks in my family is difficult these days. I need to be relevant 
            and on the buzzer with topics and careers of interest to them. Talking to them in their language and not mine.
          </p>
          <div className="bg-gradient-to-r from-sky-50 to-cyan-50 border-l-4 border-sky-500 rounded-xl p-6 shadow-sm mt-4">
            <p className="font-medium text-sky-900 leading-relaxed">
              💡 Staying relevant means understanding their world — from daily standups to AI agent workflows.
            </p>
          </div>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
              #PodcastNotes
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
              #LLMs
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors">
              #AWSOutage
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
              #DNSOps
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors">
              #BareMetalDays
            </span>
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium hover:bg-pink-200 transition-colors">
              #FamilyConversations
            </span>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default TheEducatorOfHighestCalibre;
