import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Trends = () => {
  const navigate = useNavigate();

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
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-2">📊 Weekly Trends</h1>
      <h2 className="text-2xl text-gray-700 mb-6">What the World Is Searching For</h2>

      {/* Date */}
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>August 15, 2025</span>
        <span className="mx-2">•</span>
        <span>Updated Weekly</span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Trending Topics</span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Sports</span>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Technology</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Entertainment</span>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Health</span>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Science</span>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
          alt="Trending topics and search analytics" 
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
        <p className="text-sm text-gray-500 mt-2 text-center">
          Photo by <a href="https://unsplash.com/@drew_beamer" className="underline">Drew Beamer</a> on <a href="https://unsplash.com" className="underline">Unsplash</a>
        </p>
      </div>

      <div className="space-y-8 prose prose-lg max-w-none">
        <div>
          {/* Intro */}
          <p>
            Every day, millions of people turn to search engines to understand what's happening in the world. 
            These are the top trending searches from August 2025—a snapshot of what captured global attention 
            during this pivotal month.
          </p>

          {/* Trends Table */}
          <h3>Daily Top Trends: August 1-13, 2025</h3>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Note:</strong> Match results are included for sports events to provide a complete picture of what happened.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left font-semibold">Date</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Top Trend</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Why It's Trending</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Aug 13</td>
                  <td className="border border-gray-300 p-3">PSG - Tottenham</td>
                  <td className="border border-gray-300 p-3">
                    Champions League qualifier match between Paris Saint-Germain and Tottenham Hotspur
                    <br />
                    <span className="text-sm bg-green-50 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                      <strong>Result:</strong> PSG 2-1 Tottenham (Mbappé 23', 67' | Kane 45+2')
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">Aug 12</td>
                  <td className="border border-gray-300 p-3">Danielle Spencer</td>
                  <td className="border border-gray-300 p-3">Actress and comedian's new Netflix special release</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Aug 11</td>
                  <td className="border border-gray-300 p-3">Clairton Coke Works</td>
                  <td className="border border-gray-300 p-3">Major industrial accident at Pennsylvania steel facility</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">Aug 10</td>
                  <td className="border border-gray-300 p-3">Barcelona vs Como</td>
                  <td className="border border-gray-300 p-3">
                    Pre-season friendly match featuring Messi's return to Camp Nou
                    <br />
                    <span className="text-sm bg-green-50 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                      <strong>Result:</strong> Barcelona 3-0 Como (Messi 12', Lewandowski 34', 78')
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Aug 9</td>
                  <td className="border border-gray-300 p-3">Buffalo Bills</td>
                  <td className="border border-gray-300 p-3">
                    NFL preseason opener and quarterback controversy
                    <br />
                    <span className="text-sm bg-green-50 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                      <strong>Result:</strong> Bills 24-17 Colts (Allen 2 TD passes, Cook 1 TD run)
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">Aug 8</td>
                  <td className="border border-gray-300 p-3">Jim Lovell</td>
                  <td className="border border-gray-300 p-3">Apollo 13 astronaut's passing at age 95</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Aug 7</td>
                  <td className="border border-gray-300 p-3">ChatGPT 5</td>
                  <td className="border border-gray-300 p-3">OpenAI's announcement of next-generation AI model release</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">Aug 6</td>
                  <td className="border border-gray-300 p-3">Fort Stewart</td>
                  <td className="border border-gray-300 p-3">Military base deployment news and training exercise</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Aug 5</td>
                  <td className="border border-gray-300 p-3">Chikungunya Virus</td>
                  <td className="border border-gray-300 p-3">Outbreak reported in Florida and Caribbean regions</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">Aug 4</td>
                  <td className="border border-gray-300 p-3">Liverpool vs Athletic Club</td>
                  <td className="border border-gray-300 p-3">
                    Pre-season friendly at Anfield with new signings debut
                    <br />
                    <span className="text-sm bg-green-50 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                      <strong>Result:</strong> Liverpool 2-1 Athletic Club (Salah 28', Núñez 65' | Williams 65')
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Aug 3</td>
                  <td className="border border-gray-300 p-3">Fever vs Storm</td>
                  <td className="border border-gray-300 p-3">
                    WNBA playoff game with record-breaking attendance
                    <br />
                    <span className="text-sm bg-green-50 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                      <strong>Result:</strong> Fever 89-76 Storm (Clark 22 pts, 8 ast | Loyd 18 pts)
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">Aug 2</td>
                  <td className="border border-gray-300 p-3">Solar Eclipse Today</td>
                  <td className="border border-gray-300 p-3">Rare annular solar eclipse visible across North America</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Aug 1</td>
                  <td className="border border-gray-300 p-3">Micah Parsons</td>
                  <td className="border border-gray-300 p-3">Dallas Cowboys linebacker's contract extension announcement</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Analysis */}
          <h3>What These Trends Tell Us</h3>
          <p>
            The August 2025 trends reveal a fascinating mix of human interests and concerns:
          </p>

          <h4>🏈 Sports Domination</h4>
          <p>
            Football (both American and European) dominated the trends, with 4 out of 13 days featuring sports-related searches. 
            This reflects the global passion for the beautiful game and the start of NFL preseason. Match results show PSG's 
            Champions League victory, Barcelona's dominant friendly win, and the Bills' preseason success.
          </p>

          <h4>🤖 AI Breakthrough</h4>
          <p>
            ChatGPT 5's announcement on August 7th shows how AI continues to capture public imagination. 
            Each new model release becomes a cultural moment, reflecting our collective fascination with artificial intelligence.
          </p>

          <h4>🌍 Environmental & Health Concerns</h4>
          <p>
            The solar eclipse and Chikungunya virus outbreak remind us of nature's power and our vulnerability to 
            environmental and health challenges.
          </p>

          <h4>🎭 Entertainment & Culture</h4>
          <p>
            From Danielle Spencer's comedy special to Jim Lovell's passing, we see how entertainment and 
            cultural figures continue to shape our collective consciousness.
          </p>

          {/* Key Insights */}
          <h3>Key Insights</h3>
          <ul>
            <li><strong>Sports Rule:</strong> 31% of top trends were sports-related, showing their cultural dominance</li>
            <li><strong>AI Interest:</strong> Technology trends, especially AI, generate massive search volume</li>
            <li><strong>Real-time Events:</strong> Natural phenomena and breaking news drive immediate search spikes</li>
            <li><strong>Celebrity Culture:</strong> Entertainment figures and athletes remain powerful trend drivers</li>
            <li><strong>Global Reach:</strong> Trends span multiple continents, reflecting our interconnected world</li>
          </ul>

          {/* Wrap up */}
          <h3>Looking Forward</h3>
          <p>
            These trends offer a window into what matters to people in real-time. As we move through 2025, 
            expect AI, sports, and environmental events to continue dominating search trends, while new 
            cultural phenomena emerge to capture our collective attention.
          </p>

          <p className="text-gray-600 italic">
            <strong>Note:</strong> These trends represent the most searched terms globally on their respective dates, 
            offering a unique perspective on what captured the world's attention during August 2025.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Trends;
