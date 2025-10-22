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
          <h2 className="text-2xl font-semibold text-gray-900">
            Andrej Karpathy the teacher
          </h2>
          <p>
            I was so impressed by Andrej Karpathy&apos;s podcast with Dwarkesh Patel. The 2 hours 45 minutes
            interview is one of the best I have listened to.
          </p>
          <p>
            He just shred things — LLM SLOPs, Reinforcement Learning pitfalls — so much that he covered. If at
            all one thing you will listen to, this is it this week.
          </p>
          <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Takeaways I scribbled while listening</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-200">
              <li>LLM SLOPs, the way he shred things live.</li>
              <li>Reinforcement Learning pitfalls that he kept calling out.</li>
              <li>The full 2 hours 45 minutes masterclass vibe.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">AWS outage flashbacks</h2>
          <p>
            And then the AWS-US-East1 outage which brought almost half of internet down reminded me of stuff we
            used to face during my days working for Private Indian Internet Service Provider. DNS issue it seems
            is the root cause.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
            <p className="mb-3">
              It was the same scramble feeling — the phone calls, the why-is-DNS-like-this question hanging in the
              air — just like in those Private Indian Internet Service Provider days.
            </p>
            <blockquote className="text-amber-900 font-medium italic">
              &ldquo;Same chaos, different decade. AWS status page instead of our knock-on-doors style updates.&rdquo;
            </blockquote>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">Bare metal memories</h2>
          <p>
            In those early days hosting our applications and scripts in Redhat or CentOS bare metal servers used
            to be an adventure, before we moved to cloud.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900">Dogfooding the blog</h2>
          <p>
            This is my first blog post eating my dog food! Just getting my feet wet. While I learn this is also an
            opportunity to crib to boy about his company product. At least it will keep the conversation going with
            him.
          </p>
          <p>
            To retain the attention span of my young folks in family is difficult these days. I need to be relevant
            to them.
          </p>
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 shadow-sm">
            <p className="font-medium text-sky-900">
              At least it will keep the conversation going with him and maybe the young folks will see why I need to
              be relevant to them.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900">Tags</h3>
          <p className="space-x-2">
            <code>#PodcastNotes</code>
            <code>#LLMs</code>
            <code>#AWSOutage</code>
            <code>#DNSOps</code>
            <code>#BareMetalDays</code>
            <code>#FamilyConversations</code>
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default TheEducatorOfHighestCalibre;
