import { Link } from 'react-router-dom';

function ItsNotAboutYou() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/books"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Books
        </Link>
        <h1 className="text-4xl font-bold mb-4">
          It's Not About You: A Brief Guide to a Meaningful Life
        </h1>
        <p className="text-gray-600 text-lg mb-2">By Tom Rath</p>
        <p className="text-gray-600 text-sm mb-6">
          A powerful guide on finding meaning through service to others rather than self-focused pursuits
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            Self-Help
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Philosophy
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Meaning
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            Service
          </span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
            Life Purpose
          </span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-800">
            <strong>📖 Reading Notes:</strong> 16 Highlights (Yellow) | 5 Personal Notes | Verbatim excerpts with minimal paraphrasing
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🎯 Core Philosophy</h2>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 4:</strong> "Life is not about you. It's about what you do for others. The faster you are able to get over yourself, the more you can do for the people who matter most. Yet external forces keep pulling you toward self-centered pursuits. From books pushing 'happiness' to advertisements convincing you that consumption leads to adoration, these messages tempt you to focus inward. That is all a trap (and a load of crap)."
            </p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="italic text-gray-700">
              <strong>Page 4:</strong> "I have studied and written about well-being for twenty years, and the last thing I recommend is chasing your own happiness. It may even do more harm than good. The key to creating collective well-being is to start by improving the life of another person, not your own."
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">⏳ Legacy Over Life Span</h2>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 5:</strong> "Your life has an unknown expiration date. Your efforts and contributions to others do not. The time, energy, and resources you invest in people you care for and your community keep growing forever."
            </p>
            <p className="text-green-800 font-semibold">💭 My Note: Bulls eye</p>
          </div>
          <div className="bg-gray-50 border-l-4 border-purple-500 p-4 mb-4">
            <p className="italic text-gray-700">
              <strong>Page 5:</strong> "When you move past self, life is simpler and less stressful."
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🏥 Personal Journey with VHL Disease</h2>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-3">
              <strong>Page 6:</strong> "My doctor told me I had a catastrophic genetic mutation, one that essentially shuts off the body's most powerful tumor suppressor. As a result of this mutation, in addition to the large tumors already growing on my left eye, I was likely to have kidney cancer, pancreatic cancer, and tumors in my spine, brain, and adrenal glands. He also told me they could try to save my left eye, but after a few failed surgeries my vision in that eye was gone. If you decide to have kids, they may also have it."
            </p>
            <p className="italic text-gray-700">
              <strong>Page 7:</strong> "But in my case, I have a rare de novo mutation, meaning I am the first in my family with VHL. The geneticist explained how future generations would forever be affected if I ever wanted to start a family. I was the box at the top of her page—the one who my future kids and grandkids could point to as having started this whole sequence of events."
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🧭 Developing an Outward Focus</h2>
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 8:</strong> "It takes time to develop an outward focus. In far too many cases, people move into this mindset only when the end is in sight. It does not need to be that way. Anyone can learn about and develop an outward focus, starting early on in life. But, fair warning: you must put your mortality in clear view first. Acknowledging that all our stories have an end can be deeply beneficial. In my own experience, orienting my efforts to where I could make the greatest contributions, both during and beyond my lifetime, helped me to push through major challenges and made life far more meaningful."
            </p>
            <p className="text-orange-800 font-semibold">💭 My Note: Well said</p>
          </div>
          <div className="bg-teal-50 border-l-4 border-teal-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 9:</strong> "Life is about what you put back into the world, not what you take out of it."
            </p>
            <p className="text-teal-800 font-semibold">💭 My Note: Pearl</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🤝 Relationships and Response</h2>
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-3">
              <strong>Page 11:</strong> "You may not get to control how another person initiates your next interaction, but you always get to choose your response. Even when you're having a horrible day and someone says something rude to you without reason, you get to decide if you will dig in on the negative tone or try to turn things around. With that choice, you will likely set off a cascading process that will make your day progressively better—or progressively worse."
            </p>
            <p className="italic text-gray-700">
              <strong>Page 12:</strong> "You always have a choice of how to respond. Start by assuming the other person has positive intent."
            </p>
          </div>
          <div className="bg-pink-50 border-l-4 border-pink-400 p-4 mb-4">
            <p className="italic text-gray-700">
              <strong>Page 13:</strong> "I am increasingly convinced that even fifteen minutes of time spent listening to another person is one of the most valuable things you can do today. In this era of hyperdistraction, asking great questions and listening are two of the qualities we look for most in friends, partners, and colleagues."
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">💼 Career and Contribution</h2>
          <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-3">
              <strong>Page 15:</strong> "So often, people take on roles they don't want and stay in jobs that don't excite them, never exploring a wider set of possibilities about the types of contributions they could be making."
            </p>
            <p className="italic text-gray-700">
              <strong>Page 19:</strong> "When you see a rare opportunity, take it. Life is too brief for living with regrets."
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">📝 Additional Personal Notes</h2>
          <div className="bg-gray-100 border-l-4 border-gray-400 p-4">
            <p className="text-gray-700 mb-2"><strong>Page 22:</strong> Gallup strength finder. I had participated in it</p>
            <p className="text-gray-700"><strong>Page 33:</strong> Well said</p>
          </div>
        </section>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-800 mb-2">About the Author</h3>
          <p className="text-blue-700 text-sm mb-4">
            Tom Rath is a researcher, author, and consultant who has studied well-being for over twenty years. Despite facing significant health challenges due to a rare genetic condition, he continues to focus his work on helping others find meaning and purpose in their lives.
          </p>
          <p className="text-blue-700 text-sm">
            His approach combines personal experience with research-based insights, offering a unique perspective on what it means to live a meaningful life.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ItsNotAboutYou;
