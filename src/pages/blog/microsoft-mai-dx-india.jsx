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
      <h1 className="text-4xl font-bold mb-6">Hope this gets implemented sooner in India: Microsoft's MAI-DxO Revolution</h1>
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
        </svg>
        <span>January 3, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              Microsoft's MAI-DxO achieves 85.5% diagnostic accuracy compared to 20% for human doctors, while reducing costs by 20%. Here's why India needs this breakthrough technology now.
            </p>
          </header>

          {/* Executive Summary */}
          <section className="mb-8 bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              🔬 Executive Summary
            </h2>
            <ul className="text-base leading-relaxed space-y-2">
              <li><strong>🎯 Accuracy:</strong> MAI-DxO achieved 85.5% diagnostic accuracy vs 20% for experienced physicians on complex NEJM cases</li>
              <li><strong>💰 Cost Reduction:</strong> 20% reduction in diagnostic costs through intelligent test selection</li>
              <li><strong>🤖 AI Orchestration:</strong> Five specialized AI agents working collaboratively with human oversight</li>
              <li><strong>🏥 Healthcare Impact:</strong> Potential to address India's doctor shortage and improve diagnostic accuracy</li>
              <li><strong>⚖️ Human-in-Loop:</strong> Qualified doctors provide final approval, ensuring safety and accountability</li>
            </ul>
          </section>

          {/* What is MAI-DxO */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              What is Microsoft's MAI-DxO?
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Microsoft AI Diagnostic Orchestrator (MAI-DxO) represents a paradigm shift in medical AI. Unlike traditional 
              systems that analyze complete case information at once, MAI-DxO follows a sequential process that mirrors 
              how human doctors actually work—starting with limited patient information, asking targeted questions, 
              ordering specific tests, and gradually building toward a diagnosis.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              As Mustafa Suleyman, CEO of Microsoft AI, noted: <em>"This is a real step towards medical superintelligence. 
              AI models have aced multiple choice medical exams – but real patients don't come with ABC answer options."</em>
            </p>
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
              The MAI-DxO system orchestrates five specialized AI agents in a collaborative diagnostic process, 
              with a qualified human doctor providing final oversight and approval.
            </p>
          </section>



          {/* Why India Needs This */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Why India Desperately Needs MAI-DxO
            </h2>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-bold text-orange-800 mb-2">🏥 Healthcare Crisis Numbers</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Doctor-to-patient ratio: 1:1,456 (WHO recommends 1:1,000)</li>
                  <li>• Rural healthcare access: Only 30% of required specialists available</li>
                  <li>• Diagnostic errors: Estimated 15-20% misdiagnosis rate in urban areas</li>
                  <li>• Healthcare spending: 60% out-of-pocket, causing financial hardship</li>
                </ul>
              </div>
              
              <p className="text-base sm:text-lg leading-relaxed">
                With over 1.4 billion people and a severe shortage of qualified doctors, India faces a healthcare crisis 
                that technology like MAI-DxO could help address. The system's ability to provide expert-level diagnostic 
                support while reducing costs aligns perfectly with India's healthcare needs.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">🚀 Potential Impact in India</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Augment existing doctors with AI diagnostic support</li>
                  <li>• Improve diagnostic accuracy in Tier 2 and Tier 3 cities</li>
                  <li>• Reduce unnecessary tests and procedures, lowering costs</li>
                  <li>• Enable telemedicine with expert-level diagnostic capabilities</li>
                  <li>• Support medical education and training programs</li>
                </ul>
              </div>
            </div>
          </section>



          {/* Human-in-the-Loop */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              The Critical Role of Human Oversight
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              While MAI-DxO shows remarkable capabilities, Microsoft emphasizes that this is designed to augment, not replace, 
              human doctors. The system includes mandatory human oversight where qualified physicians review and approve all 
              diagnoses before implementation.
            </p>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-3">🔒 Safety Mechanisms</h3>
              <ul className="text-base leading-relaxed space-y-2">
                <li><strong>Final Approval:</strong> Only qualified doctors can approve and implement diagnoses</li>
                <li><strong>Transparency:</strong> Full audit trail of AI decision-making process</li>
                <li><strong>Continuous Learning:</strong> Human feedback improves system performance</li>
                <li><strong>Fail-safes:</strong> System flags uncertain cases for additional human review</li>
                <li><strong>Accountability:</strong> Human doctors remain legally responsible for patient care</li>
              </ul>
            </div>
          </section>



          {/* Conclusion */}
          <section>
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Conclusion: A New Era of Medical Intelligence
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Microsoft's MAI-DxO represents more than just a technological advancement—it's a potential solution to one of 
              humanity's most pressing challenges: providing quality healthcare to everyone, everywhere. The system's ability 
              to achieve 85.5% diagnostic accuracy while reducing costs by 20% could be transformative for India's healthcare system.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              The five-agent orchestration model, combined with mandatory human oversight, strikes the right balance between 
              AI capability and human accountability. This isn't about replacing doctors—it's about giving them superhuman 
              diagnostic support.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              As Mustafa Suleyman noted, we're witnessing "a real step towards medical superintelligence." For a country like 
              India, with its massive population and healthcare challenges, this technology can't come soon enough. The question 
              isn't whether MAI-DxO will transform healthcare—it's how quickly we can make it happen responsibly and equitably.
            </p>
            <div className="bg-blue-100 p-6 rounded-lg text-center">
              <p className="text-lg font-bold text-blue-800">
                "Hope this gets implemented sooner in India" isn't just wishful thinking—it's an urgent necessity for 
                the millions who deserve better healthcare outcomes.
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