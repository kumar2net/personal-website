import { Link } from 'react-router-dom';
import BookPageContainer from '../../components/BookPageContainer';

function HowToStopCaring() {
  return (
    <BookPageContainer>
      <div className="mb-8">
        <Link
          to="/books"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Books
        </Link>
        <h1 className="text-4xl font-bold mb-4">
          How to STOP Caring What People Think of You!
        </h1>
        <p className="text-gray-600 text-lg mb-2">By Russell Jamieson</p>
        <p className="text-gray-600 text-sm mb-6">
          The little book on how to stop caring what other people think of you and start living your life the way you want to live it
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            Self-Help
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Personal Development
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Confidence
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            Authenticity
          </span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
            Psychology
          </span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-800">
            <strong>📖 Reading Notes:</strong> 13 Highlights (Yellow) | 4 Personal Notes | Verbatim excerpts with minimal paraphrasing
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🎯 Core Principles</h2>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 10:</strong> "1 – When you are living your life based on others opinions of you, you're giving up your own authentic inner voice. You're not being your true self and not living to your potential. You won't be happy living a life dictated by other people. 2 – People who live by their inner voice are leaders. Those that don't are followers. Followers are never the first to do something of importance."
            </p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 10:</strong> "5 – When you're not putting your values first, you're not developing yourself or really doing any good. The world doesn't need more yes men. Pursue your own agenda. Go after your dreams and don't worry how it will be perceived. 6 – People who follow their inner voice are more interesting. You can tell who these people are because they have a genuine quality about them. Be genuine."
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🏆 Historical Examples of Authenticity</h2>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 11:</strong> "Need examples of outcasts and people who stood up for their beliefs even when everyone was against them? Galileo Galilei, Joan of Arc, Martin Luther, Robert Oppenheimer, Vincent VanGogh, and Edgar Allen Poe. 8 – It's empowering! When you are true to yourself, you feel like you can do anything. 9 – People will always judge you and there isn't a damn thing you can do about it."
            </p>
          </div>
          <div className="bg-gray-50 border-l-4 border-purple-500 p-4 mb-4">
            <p className="italic text-gray-700">
              <strong>Page 11:</strong> "10 – Most people don't care what you are doing anyway. They don't care because they are too wrapped up in their own drama. They are probably too worried imagining what people think of them. Want proof?"
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">💪 The Power of Self-Acceptance</h2>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 11:</strong> "11 – You don't need people to like you. If someone doesn't like you, it's not the end of the world. People will dislike you for absolutely no reason and for things that are beyond your control. You have to like you, that's what's important."
            </p>
            <p className="text-blue-800 font-semibold">💭 My Note: Well said</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🧭 Step 3: Grounding in Your Values</h2>
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 13:</strong> "Step 3 – Write down and become grounded in your values and morals. Find out how you really want to live your life. These are the characteristics that you believe are important like honesty, integrity, respect, positive attitude, kindness, love, generosity, etc. This will be your new moral compass. We may not be able to attain a level of perfection, but we can try each day and do the best we can in living our values. Making progress is enough."
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🛡️ Practical Strategies</h2>
          <div className="bg-teal-50 border-l-4 border-teal-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 15:</strong> "1 – Don't take things personally. I mentioned this earlier, but let's dive a little deeper. Look at things objectively and do not get defensive. If someone says something offensive to you, just let it bounce off of you or pass through you."
            </p>
          </div>
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 15:</strong> "Only you can give those words power by reacting to it. Ignoring someone's criticism is a stronger approach than reacting and feeding it."
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🎭 Killing Your Inner Critic</h2>
          <div className="bg-pink-50 border-l-4 border-pink-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-3">
              <strong>Page 16:</strong> "3 – Kill your inner critic. There is another little voice inside your head besides your authentic voice that can be a real jerk. I like to think of it as an audience in your head that is analyzing the things you do and say. If you don't get control of it, it can take over like a class full of rowdy kids. When it comes up and says, "you can't do that", just dismiss it and move on. Don't dwell on it or overthink what this insecure voice says, just squash it immediately and replace it with an empowering thought."
            </p>
            <p className="italic text-gray-700 mb-2">
              <strong>Page 16:</strong> "You have nothing to prove. Instead, focus on your inner circle of people who truly matter. On that note, let me stress that your inner circle should love you for who you are, and should accept your opinions, etc. If they don't love you for you, examine that relationship."
            </p>
            <p className="text-pink-800 font-semibold">💭 My Note: Absolutely</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🎪 Embracing Embarrassment</h2>
          <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 16:</strong> "6 – Do something that you consider embarrassing. This will help you to break the mentality that other people's opinions really matter. You will see that if you do something silly or embarrassing, and someone thinks you're stupid, it doesn't really matter. Their opinion will only affect you as much as you let it. Other people's opinions truly don't matter, and nothing shows that more powerfully than making a fool out of yourself on purpose."
            </p>
            <p className="text-cyan-800 font-semibold">💭 My Note: Hahaha like this</p>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 16:</strong> "7 – Learn to be comfortable in silence with another person."
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">😌 Comfort with Discomfort</h2>
          <div className="bg-gray-50 border-l-4 border-gray-500 p-4 mb-4">
            <p className="italic text-gray-700 mb-2">
              <strong>Page 18:</strong> "Learn to be comfortable with awkwardness. If you treat it like a game at first, it won't be so uncomfortable, so it's a great place to start. When you do it with intent, you feel in control, so it's a good stepping stone. Learn to be comfortable being uncomfortable."
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">📝 Additional Personal Notes</h2>
          <div className="bg-gray-100 border-l-4 border-gray-400 p-4">
            <p className="text-gray-700 mb-2"><strong>Page 22:</strong> Thats it. As simple ad that</p>
          </div>
        </section>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-800 mb-2">About the Author</h3>
          <p className="text-blue-700 text-sm mb-4">
            Russell Jamieson is the author of this concise guide to breaking free from the opinions of others. His straightforward approach cuts through the noise to deliver practical advice on living authentically.
          </p>
          <p className="text-blue-700 text-sm">
            The book offers a no-nonsense approach to developing self-confidence and living life on your own terms, with practical exercises and real-world examples.
          </p>
        </div>
      </div>
    </BookPageContainer>
  );
}

export default HowToStopCaring;
