import React from 'react';
import { Helmet } from 'react-helmet-async';

const MigratingToVSCode = () => {
  return (
    <>
      <Helmet>
        <title>Migrating to VS Code - Kumar's Personal Website</title>
        <meta name="description" content="Reflections on transitioning to Visual Studio Code and its impact on productivity" />
        <meta name="keywords" content="VS Code, migration, productivity, development, tools" />
        <link rel="canonical" href="https://kumar.website/blog/migrating-to-vscode" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Migrating to VS Code
            </h1>
            <p className="text-xl text-gray-600 italic">
              Reflections on the transition to a new development environment
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Published on October 25, 2025
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-l-4 border-green-500">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Transitioning to a new development environment can be both exciting and daunting. As I made the switch to Visual Studio Code, I found myself reflecting on the changes it brought to my workflow and productivity.
                </p>
              </div>

              {/* Section 1 */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  The Initial Setup
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Setting up VS Code was surprisingly straightforward. The extensive marketplace of extensions allowed me to customize my environment to fit my needs perfectly. From themes to language support, the options were endless.
                  </p>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-green-800 text-sm italic">
                      🛠️ Customization is key - finding the right extensions can significantly enhance your coding experience.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Enhanced Productivity
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    One of the most noticeable changes was the boost in productivity. Features like IntelliSense and integrated terminal made coding more efficient. I found myself spending less time on syntax errors and more time on actual development.
                  </p>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm italic">
                      🚀 VS Code's features streamline the coding process, allowing developers to focus on what truly matters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Community and Support
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The community around VS Code is vibrant and supportive. I found numerous resources, tutorials, and forums that helped me troubleshoot issues and discover new tips and tricks.
                  </p>
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <p className="text-yellow-800 text-sm italic">
                      🌍 A strong community can make all the difference when learning a new tool or technology.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  Overcoming Challenges
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Of course, the transition wasn't without its challenges. I had to adapt to new shortcuts and workflows, but with time, these became second nature. The initial learning curve was steep, but ultimately rewarding.
                  </p>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="text-purple-800 text-sm italic">
                      📈 Every challenge is an opportunity for growth - embracing the learning process is essential.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                  Final Thoughts
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In conclusion, migrating to Visual Studio Code has been a transformative experience. It has not only improved my productivity but also reignited my passion for coding. I look forward to exploring more features and continuing to grow as a developer.
                  </p>
                  <div className="bg-teal-100 p-4 rounded-lg">
                    <p className="text-teal-800 text-sm italic">
                      🌟 Embrace change - it often leads to new opportunities and growth in unexpected ways.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MigratingToVSCode;