import React from 'react';
import { Helmet } from 'react-helmet-async';

const MyReminiscences = () => {
  return (
    <>
      <Helmet>
        <title>My Reminiscences - Kumar's Personal Website</title>
        <meta name="description" content="Personal reflections on family, technology, and life changes over the years" />
        <meta name="keywords" content="family, technology, mobile services, AI, cryptocurrency, data science, reminiscences" />
        <link rel="canonical" href="https://kumar.website/blog/my-reminiscences" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Reminiscences
            </h1>
            <p className="text-xl text-gray-600 italic">
              Reflections on family, technology, and the changing tides of life
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Published on October 24, 2025
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-l-4 border-blue-500">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Life has a way of bringing together moments that seem disconnected, yet when reflected upon, 
                  they paint a beautiful tapestry of growth, change, and resilience. These are my reminiscences 
                  from recent conversations and observations about the people I hold dear.
                </p>
              </div>

              {/* Section 1 */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Mobile Services and Changing Landscapes
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    First was with our boy working for the mobile service provider for whom I played a part in Nokia 
                    providing managed services to them. So interesting to hear him out dabbling around a bit in ML. 
                    Vodafone India is now majority owned by Government of India at almost 50%. How things changed - 
                    when they were British owned the folks from UK - the parent company used to come and demand so 
                    much for so little! But they were a lot nicer than the current Indian major mobile duos. These 
                    were absolute penny pinchers wrt paying vendors for products/services.
                  </p>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm italic">
                      💡 The telecom industry's transformation from foreign ownership to domestic control reflects 
                      broader economic shifts, yet the operational challenges remain remarkably consistent.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Financial Industry Evolution
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    It was pretty interesting to hear the other fam girl - she said 2 decades in Financial industry 
                    currently! They both seem to assume I know a lot in AI - but nice to talk to her about 
                    'disintermediation' happening thick and fast in her industry.
                  </p>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-green-800 text-sm italic">
                      🏦 Two decades in finance is a lifetime of witnessing transformation, and the current wave 
                      of disintermediation is reshaping the very foundations of traditional banking. These 2 kins of our Bhishma Pitamaha Sir are doing well in their respective fields.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Cryptocurrency and Regulatory Battles
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Bitcoin and Ethereum are my favourite subjects for quite some time now and I do track them while 
                    being aghast at all the regulatory mud/shade which is thrown at them. But the regulators are 
                    losing the battle thick and fast.
                  </p>
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <p className="text-yellow-800 text-sm italic">
                      ₿ The regulatory resistance to cryptocurrency is a fascinating study in how traditional 
                      systems respond to disruptive innovation - often with initial resistance, then gradual acceptance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  Data Science and Actionable Insights
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our Data Scientist boy in Birmingham is coming up with nice insights/actionable data in charts 
                    for his company sales, marketing team folks and dabbling around with ML algo's too which is very critical.
                  </p>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="text-purple-800 text-sm italic">
                      📊 The bridge between raw data and business strategy is where true value lies - turning 
                      numbers into narratives that drive decisions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                  Adapting to New Challenges
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Senior most boy is coming to terms with the vagaries of hostile valley life and I am sure he 
                    will fight it out. JK too trying to get paper work sorted out to restart her CPA work life 
                    adapting to the great country's accounting standard & practices.
                  </p>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-red-800 text-sm italic">
                      💪 Adaptation is the hallmark of resilience - whether it's navigating corporate challenges 
                      or mastering new professional standards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                  The Common Thread of Resilience
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    But the common theme I notice is - its tough life for each one of them and they all are fighting, 
                    working hard which is so pleasing to me when observing from afar.
                  </p>
                  <div className="bg-indigo-100 p-4 rounded-lg">
                    <p className="text-indigo-800 text-sm italic">
                      🌟 There's something profoundly beautiful about watching loved ones navigate life's challenges 
                      with determination and grace.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 7 */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                  Cultural Connections and Language
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Looking forward to sister come in the evening after her hard day at Ganga and tension which 
                    builds up are real - to speak the few malayalam words with correct pronunciation remain of course. 
                    LLM's are still far away from achieving my desired teaching levels. A Malayalee when they meet 
                    a fellow malayalee will never speak in any other language while when we 2 tamil's meet we speak 
                    in English. I don't know why!
                  </p>
                  <div className="bg-teal-100 p-4 rounded-lg">
                    <p className="text-teal-800 text-sm italic">
                      🗣️ Language is more than communication - it's identity, culture, and connection. The nuances 
                      of when and how we choose to speak reveal deep cultural patterns.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="mt-12 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-l-4 border-gray-400">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Reflections</h3>
                <p className="text-gray-700 leading-relaxed">
                  These reminiscences capture moments of connection, observation, and reflection. They remind us 
                  that life's beauty lies not just in the big moments, but in the quiet observations of how our 
                  loved ones navigate their journeys. Each story, each challenge, each adaptation tells a larger 
                  story of human resilience and the ever-changing landscape of our world.
                </p>
              </div>

            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Family</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Technology</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">AI & ML</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Cryptocurrency</span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Data Science</span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Personal Reflections</span>
          </div>

        </div>
      </div>
    </>
  );
};

export default MyReminiscences;
