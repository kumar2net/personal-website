import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MicrosoftMaiDxIndia = () => {
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
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            BREAKING
          </div>
          <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-teal-600 text-white text-sm font-bold rounded-full flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            FEATURED
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-6">Hope this gets implemented sooner in India: Microsoft's MAI-DxO Revolution</h1>
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
        </svg>
        <span>January 3, 2024</span>
        <span className="mx-2">•</span>
        <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
          🏥 Medical AI
        </span>
        <span className="mx-2">•</span>
        <span className="text-sm font-medium text-blue-600">5 min read</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              Microsoft's MAI-DxO (Microsoft AI Diagnostic Orchestrator) achieves 85.5% diagnostic accuracy vs 20% for human doctors—a 4x improvement that could transform India's healthcare.
            </p>
          </header>

          {/* Executive Summary */}
          <section className="mb-8 bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              🔬 Key Highlights
            </h2>
            <ul className="text-base leading-relaxed space-y-2">
              <li><strong>🎯 85.5% vs 20%:</strong> 4x better diagnostic accuracy than experienced physicians on complex cases</li>
              <li><strong>🤖 Five AI Agents:</strong> Collaborative diagnostic process with human oversight</li>
              <li><strong>🏥 India Impact:</strong> Could reduce misdiagnosis rates from 15-20% to under 5%</li>
              <li><strong>⚖️ Human Control:</strong> Qualified doctors provide final approval for all diagnoses</li>
            </ul>
          </section>

          {/* What is MAI-DxO */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              What is Microsoft's MAI-DxO?
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Microsoft AI Diagnostic Orchestrator (MAI-DxO) uses five specialized AI agents working together to diagnose complex medical cases. Unlike traditional AI systems, it follows a sequential process that mirrors how human doctors work—asking questions, ordering tests, and building toward a diagnosis with unprecedented 85.5% accuracy.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-green-800 mb-2">📈 Key Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">85.5%</div>
                  <div>MAI-DxO Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">20%</div>
                  <div>Human Doctor Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">304</div>
                  <div>Complex NEJM Cases</div>
                  <div className="text-xs text-gray-500">(New England Journal of Medicine)</div>
                </div>
              </div>
            </div>
          </section>

          {/* The Five AI Agents Diagram */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              The Five-Agent Orchestration System
            </h2>
            <div className="my-8 p-4 sm:p-6 bg-gray-50 rounded-lg overflow-x-auto">
              <svg width="100%" height="600" viewBox="0 0 800 600" className="w-full min-w-[600px]">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
                  </marker>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000020"/>
                  </filter>
                </defs>

                {/* Central Coordination Hub */}
                <circle cx="400" cy="300" r="80" fill="#3B82F6" filter="url(#shadow)"/>
                <text x="400" y="290" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">MAI-DxO</text>
                <text x="400" y="310" textAnchor="middle" fill="white" fontSize="12">Orchestrator</text>

                {/* Dr. Hypothesis (Top) */}
                <circle cx="400" cy="120" r="60" fill="#10B981" filter="url(#shadow)"/>
                <text x="400" y="110" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Dr. Hypothesis</text>
                <text x="400" y="125" textAnchor="middle" fill="white" fontSize="10">Maintains differential</text>
                <text x="400" y="138" textAnchor="middle" fill="white" fontSize="10">diagnosis list</text>

                {/* Dr. Test-Chooser (Top Right) */}
                <circle cx="580" cy="200" r="60" fill="#F59E0B" filter="url(#shadow)"/>
                <text x="580" y="190" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Dr. Test-Chooser</text>
                <text x="580" y="205" textAnchor="middle" fill="white" fontSize="10">Selects diagnostic</text>
                <text x="580" y="218" textAnchor="middle" fill="white" fontSize="10">tests strategically</text>

                {/* Dr. Challenger (Bottom Right) */}
                <circle cx="580" cy="400" r="60" fill="#EF4444" filter="url(#shadow)"/>
                <text x="580" y="390" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Dr. Challenger</text>
                <text x="580" y="405" textAnchor="middle" fill="white" fontSize="10">Challenges assumptions</text>
                <text x="580" y="418" textAnchor="middle" fill="white" fontSize="10">prevents anchoring bias</text>

                {/* Dr. Cost-Conscious (Bottom Left) */}
                <circle cx="220" cy="400" r="60" fill="#8B5CF6" filter="url(#shadow)"/>
                <text x="220" y="390" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Dr. Cost-Conscious</text>
                <text x="220" y="405" textAnchor="middle" fill="white" fontSize="10">Enforces budget</text>
                <text x="220" y="418" textAnchor="middle" fill="white" fontSize="10">constraints</text>

                {/* Dr. Quality-Control (Top Left) */}
                <circle cx="220" cy="200" r="60" fill="#EC4899" filter="url(#shadow)"/>
                <text x="220" y="190" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Dr. Quality-Control</text>
                <text x="220" y="205" textAnchor="middle" fill="white" fontSize="10">Ensures diagnostic</text>
                <text x="220" y="218" textAnchor="middle" fill="white" fontSize="10">quality & safety</text>

                {/* Human Doctor (Bottom Center) */}
                <rect x="320" y="480" width="160" height="80" rx="15" fill="#1F2937" filter="url(#shadow)"/>
                <text x="400" y="505" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Qualified Doctor</text>
                <text x="400" y="525" textAnchor="middle" fill="white" fontSize="12">Final Approval</text>
                <text x="400" y="545" textAnchor="middle" fill="white" fontSize="10">Human Oversight & Accountability</text>

                {/* Connecting Lines */}
                {/* From center to all agents */}
                <line x1="400" y1="220" x2="400" y2="180" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="460" y1="260" x2="520" y2="220" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="460" y1="340" x2="520" y2="380" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="340" y1="340" x2="280" y2="380" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="340" y1="260" x2="280" y2="220" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>

                {/* From center to human doctor */}
                <line x1="400" y1="380" x2="400" y2="480" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)"/>

                {/* Inter-agent communication lines */}
                <line x1="460" y1="150" x2="520" y2="180" stroke="#94A3B8" strokeWidth="1" strokeDasharray="5,5"/>
                <line x1="520" y1="240" x2="520" y2="360" stroke="#94A3B8" strokeWidth="1" strokeDasharray="5,5"/>
                <line x1="520" y1="420" x2="340" y2="420" stroke="#94A3B8" strokeWidth="1" strokeDasharray="5,5"/>
                <line x1="280" y1="380" x2="280" y2="240" stroke="#94A3B8" strokeWidth="1" strokeDasharray="5,5"/>
                <line x1="280" y1="180" x2="340" y2="150" stroke="#94A3B8" strokeWidth="1" strokeDasharray="5,5"/>

                {/* Legend */}
                <rect x="20" y="20" width="200" height="100" fill="white" stroke="#E5E7EB" strokeWidth="1" rx="5"/>
                <text x="30" y="40" fontSize="12" fontWeight="bold">Legend:</text>
                <line x1="30" y1="55" x2="50" y2="55" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <text x="55" y="60" fontSize="10">Direct Communication</text>
                <line x1="30" y1="75" x2="50" y2="75" stroke="#94A3B8" strokeWidth="1" strokeDasharray="5,5"/>
                <text x="55" y="80" fontSize="10">Collaborative Input</text>
                <text x="30" y="100" fontSize="10" fill="#666">All agents work together in</text>
                <text x="30" y="112" fontSize="10" fill="#666">"chain of debate" methodology</text>
              </svg>
            </div>
            <p className="text-sm text-gray-600 italic text-center mt-4">
              Five specialized AI agents collaborate with human doctor oversight to achieve 4x better diagnostic accuracy.
            </p>
          </section>

          {/* Why India Needs This */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Why India Desperately Needs MAI-DxO
            </h2>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-bold text-orange-800 mb-2">🏥 Healthcare Crisis</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Doctor-to-patient ratio: 1:1,456 (WHO recommends 1:1,000)</li>
                  <li>• Only 30% of required specialists available in rural areas</li>
                  <li>• 15-20% misdiagnosis rate in urban areas</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">🚀 Potential Impact</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>4x improvement</strong> in diagnostic accuracy on complex cases</li>
                  <li>• <strong>Reduce misdiagnosis</strong> from 15-20% to potentially under 5%</li>
                  <li>• <strong>Expert-level diagnosis</strong> in underserved areas</li>
                  <li>• <strong>Standardized quality</strong> across all healthcare facilities</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Human-in-the-Loop */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Human Oversight Remains Critical
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              MAI-DxO is designed to augment, not replace, human doctors. Qualified physicians review and approve all diagnoses, ensuring safety and maintaining medical accountability.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-2">🔒 Safety First</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Only qualified doctors can approve diagnoses</li>
                <li>• Full audit trail of AI decision-making</li>
                <li>• Human doctors remain legally responsible</li>
              </ul>
            </div>
          </section>

          {/* Conclusion */}
          <section>
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Conclusion
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Microsoft's MAI-DxO could be transformative for India's healthcare system. With 85.5% diagnostic accuracy—4x better than experienced physicians—this technology could save countless lives and reduce suffering from misdiagnosis.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Realistically, this technology will probably get adopted quickly in the USA first, where regulatory frameworks and healthcare infrastructure can support rapid implementation. The question is: how long will it take to see this in action in India?
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-green-800 mb-2">🚀 The Path Forward</h3>
              <p className="text-sm text-green-700 mb-2">
                We need progressive-minded medical professionals in India to champion this technology once it proves successful in the USA. Early adopters and medical leaders can:
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Advocate for pilot programs in leading Indian hospitals</li>
                <li>• Build partnerships with Microsoft for India-specific trials</li>
                <li>• Work with regulatory bodies to fast-track approval processes</li>
                <li>• Champion evidence-based adoption after US validation</li>
              </ul>
            </div>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              The five-agent system with human oversight strikes the right balance between AI capability and medical accountability. For a country facing massive healthcare challenges, this technology can't come soon enough—but it will need medical pioneers to make it happen.
            </p>
            <div className="bg-blue-100 p-6 rounded-lg text-center">
              <p className="text-lg font-bold text-blue-800">
                "Hope this gets implemented sooner in India" isn't just wishful thinking—it's a call to action for progressive medical professionals to lead the change once MAI-DxO proves itself globally.
              </p>
            </div>
          </section>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Microsoft AI
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              MAI-DxO
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Medical AI
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Healthcare India
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Diagnostic AI
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Human-in-Loop
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MicrosoftMaiDxIndia;