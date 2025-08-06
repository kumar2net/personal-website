import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AcronymSoup = () => {
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
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </button>
      </div>
      
      <h1 className="text-4xl font-bold mb-6">Acronym Soup: The Evolution of Tech's Most Influential Companies</h1>
      
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>June 18, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              From FANG to MAAMA: How tech's most influential companies shape our digital world
            </p>
          </header>

          <section className="mb-8">
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The world of technology is constantly evolving, and with it, the way we refer to the dominant players. 
              Over the last decade, we've seen the rise and evolution of catchy acronyms to represent the most influential 
              tech companies. From the early days of <strong>FANG</strong> to the now prevalent <strong>MAAMA</strong>, these 
              abbreviations offer a snapshot of the industry's shifting landscape. Let's dive into this "acronym soup" and 
              explore the companies that have shaped our digital lives since 2010.
            </p>

            <div className="my-12 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-center mb-6">The MAAMA Companies</h3>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {/* Microsoft */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 flex items-center justify-center mb-2">
                    <div className="grid grid-cols-2 gap-1 w-16 h-16">
                      <div className="bg-red-500"></div>
                      <div className="bg-green-500"></div>
                      <div className="bg-blue-500"></div>
                      <div className="bg-yellow-500"></div>
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium">Microsoft</span>
                </div>
                
                {/* Apple */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Apple</span>
                </div>
                
                {/* Alphabet */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-2">
                    <span className="text-red-500 text-3xl font-bold">G</span>
                  </div>
                  <span className="text-gray-700 font-medium">Alphabet</span>
                </div>
                
                {/* Meta */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white text-2xl font-bold">f</span>
                  </div>
                  <span className="text-gray-700 font-medium">Meta</span>
                </div>
                
                {/* Amazon */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-2">
                    <span className="text-black text-2xl font-bold">a</span>
                  </div>
                  <span className="text-gray-700 font-medium">Amazon</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              From FANG to FAANG: The Giants Emerge
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The acronym <strong>FANG</strong> first gained popularity to represent four incredibly influential tech 
              companies that were driving significant growth and innovation:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>F</strong>acebook (now Meta Platforms)</li>
              <li><strong>A</strong>pple</li>
              <li><strong>N</strong>etflix</li>
              <li><strong>G</strong>oogle (now Alphabet)</li>
            </ul>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              These companies revolutionized social media, personal computing, entertainment streaming, and internet search, 
              respectively. Their impact on our daily lives was undeniable.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              As the tech landscape continued to mature and Amazon's influence grew even more pronounced, the acronym evolved 
              to <strong>FAANG</strong> with the addition of:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-6 space-y-2">
              <li><strong>A</strong>mazon</li>
            </ul>
            <p className="text-base sm:text-lg leading-relaxed">
              The inclusion of Amazon acknowledged its dominance in e-commerce, cloud computing, and digital streaming, 
              solidifying the FAANG companies as the undisputed titans of the tech industry for a significant period.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              The Rise of MAAMA: A New Era?
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              More recently, a new acronym has emerged – <strong>MAAMA</strong> – which seeks to better represent the 
              current power dynamics and focus within the technology sector:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>M</strong>icrosoft</li>
              <li><strong>A</strong>pple</li>
              <li><strong>A</strong>lphabet</li>
              <li><strong>M</strong>eta Platforms</li>
              <li><strong>A</strong>mazon</li>
            </ul>
            <p className="text-base sm:text-lg leading-relaxed">
              While the core players remain largely the same, the subtle shift in the acronym highlights the continued 
              prominence of these five companies and their broad influence across various tech domains.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Generative AI: The New Battleground
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              In the rapidly evolving landscape of artificial intelligence, MAAMA companies are leading the charge in 
              generative AI, developing groundbreaking tools and platforms that are transforming how we create and interact 
              with digital content:
            </p>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Microsoft</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Copilot</strong>: AI-powered coding assistant integrated into GitHub and Microsoft 365</li>
                  <li><strong>Azure OpenAI Service</strong>: Enterprise access to powerful models like GPT-4</li>
                  <li><strong>Bing Chat</strong>: AI-powered search with conversational capabilities</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Apple</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Apple Intelligence</strong>: On-device AI features across iOS, iPadOS, and macOS</li>
                  <li><strong>MLX</strong>: Machine learning framework for Apple Silicon</li>
                  <li><strong>Core ML</strong>: Framework for integrating ML models into Apple apps</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Alphabet (Google)</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Gemini</strong>: Multimodal AI model powering various Google services</li>
                  <li><strong>Bard</strong>: Conversational AI assistant (now powered by Gemini)</li>
                  <li><strong>Vertex AI</strong>: Machine learning platform for building and deploying AI models</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Meta</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Llama</strong>: Open-weight large language model series</li>
                  <li><strong>AI Studio</strong>: Platform for building AI experiences across Meta's apps</li>
                  <li><strong>Code Llama</strong>: Specialized LLM for coding tasks</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Amazon</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Bedrock</strong>: Service for building generative AI applications</li>
                  <li><strong>Codewhisperer</strong>: AI coding companion for developers</li>
                  <li><strong>Titan</strong>: Foundational models for various AI applications</li>
                </ul>
              </div>
            </div>
            <p className="text-base sm:text-lg leading-relaxed mt-6">
              These generative AI offerings demonstrate how MAAMA companies are not just adapting to the AI revolution but 
              actively shaping its direction. Their investments in AI research, infrastructure, and applications are setting 
              the stage for the next wave of technological innovation across industries.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              The Collective Network: Intertwined Influence
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              It's crucial to understand that these MAAMA companies don't operate in silos. They form a complex and 
              interconnected network that influences almost every aspect of our digital lives. Their platforms and services 
              are often interdependent, and their strategic decisions can have ripple effects across the entire tech ecosystem.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Cloud Infrastructure</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Companies like Amazon (AWS) and Microsoft (Azure) provide the backbone for countless other online services, 
                  including those offered by Meta, Apple, and Alphabet.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Operating Systems and Devices</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Apple's iOS and macOS, Google's Android, and Microsoft's Windows are the dominant operating systems 
                  powering our smartphones, tablets, and computers.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">App Ecosystems</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  The app stores controlled by Apple (App Store) and Google (Play Store) are the primary distribution 
                  channels for software, including the apps developed by Meta, Microsoft, and even Amazon.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Advertising and Data</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Alphabet (Google) and Meta are giants in the digital advertising space, and their data collection 
                  practices influence how businesses reach consumers online.
                </p>
              </div>
            </div>
            <p className="text-base sm:text-lg leading-relaxed mt-6">
              This interconnectedness highlights the significant power these companies wield and the importance of 
              understanding their collective impact.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Key Products and Services: A Glimpse into Their Empires
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Products and Services</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Meta Platforms</td>
                    <td className="px-6 py-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Facebook</li>
                        <li>Instagram</li>
                        <li>WhatsApp</li>
                        <li>Messenger</li>
                        <li>Oculus (VR)</li>
                        <li>Advertising platforms</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Apple</td>
                    <td className="px-6 py-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>iPhones</li>
                        <li>iPads</li>
                        <li>Macs</li>
                        <li>Apple Watch</li>
                        <li>AirPods</li>
                        <li>Apple Music</li>
                        <li>Apple TV+</li>
                        <li>iCloud</li>
                        <li>App Store</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Alphabet</td>
                    <td className="px-6 py-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Google Search</li>
                        <li>Android</li>
                        <li>Chrome</li>
                        <li>YouTube</li>
                        <li>Gmail</li>
                        <li>Google Maps</li>
                        <li>Google Drive</li>
                        <li>Google Cloud</li>
                        <li>Google Ads</li>
                        <li>Pixel devices</li>
                        <li>Waymo (autonomous driving)</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Microsoft</td>
                    <td className="px-6 py-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Windows operating system</li>
                        <li>Microsoft Office Suite (Word, Excel, PowerPoint)</li>
                        <li>Azure cloud services</li>
                        <li>Xbox gaming</li>
                        <li>LinkedIn</li>
                        <li>Microsoft Teams</li>
                        <li>Bing search</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">Amazon</td>
                    <td className="px-6 py-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Amazon.com (e-commerce)</li>
                        <li>Amazon Prime</li>
                        <li>Amazon Web Services (AWS)</li>
                        <li>Alexa voice assistant</li>
                        <li>Kindle e-readers</li>
                        <li>Fire TV</li>
                        <li>Streaming services (Prime Video)</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-base sm:text-lg leading-relaxed mt-6">
              This table only scratches the surface of the vast array of products and services offered by these companies. 
              Their continuous innovation and expansion into new markets ensure their continued relevance in the years to come.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Conclusion: Navigating the Tech Landscape
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              The evolution of these tech acronyms reflects the dynamic nature of the industry. While the specific letters 
              may change, the underlying theme remains: a handful of powerful companies continue to shape our technological 
              present and future. In recent years, we've seen the meteoric rise of NVIDIA, whose GPUs have become the backbone 
              of the AI revolution, powering everything from data centers to self-driving cars. Their influence in AI and 
              accelerated computing positions them as a strong contender for inclusion in future iterations of tech acronyms.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mt-4">
              Understanding the individual strengths, interconnectedness, and impact of these tech giants is crucial for 
              navigating the ever-evolving tech landscape. As artificial intelligence, quantum computing, and other emerging 
              technologies mature, we may see further shifts in the balance of power. What the next iteration of this acronym 
              soup will be remains to be seen, but one thing is certain: the technology innovations that impact our lives 
              will continue to be fascinating to observe and participate in.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default AcronymSoup;
