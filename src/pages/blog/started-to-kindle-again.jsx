import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


import DisqusComments from '../../components/DisqusComments';const StartedToKindleAgain = () => {
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
      
      <h1 className="text-4xl font-bold mb-4">Started to Kindle Again</h1>
      
      <div className="bg-gray-50 border-l-4 border-blue-400 p-6 mb-6 rounded-r-lg">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-sm font-semibold text-blue-800">Reading Notes From:</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Dopamine Detox: A Short Guide to Remove Distractions and Get Your Brain to Do Hard Things
        </h2>
        <p className="text-gray-600 font-medium">by Thibaut Meurisse</p>
      </div>
      
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
        </svg>
        <span>July 11, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <p className="text-base sm:text-lg leading-relaxed mb-6">
            After few years of being in stale mode, I've rediscovered the simple joy 
            of reading on my Kindle app in my Pixel 6. What started as an attempt to reduce screen time has turned into a deeper 
            exploration of focus, productivity, and the science behind our attention spans. i took these notes while reading the book.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">The Problem - Good Point</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-4">
              <p className="text-base leading-relaxed">
                "today's society is designed to hijack your dopamine neurotransmitters. And, unfortunately, this is not designed in your best interest, it is designed to empty your wallet as effectively and thoroughly as possible. However, and more importantly, it dramatically erodes your ability to focus, making you feel restless and often bad about yourself. Overstimulated, you find yourself unable to do the difficult things that would have the greatest positive impact on your life and on the lives of people around you."
              </p>
            </div>
            <p className="text-sm text-gray-600 italic mb-4">Note: good point</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dopamine Detox Explained Well</h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-4">
              <p className="text-base leading-relaxed">
                "What is dopamine detox? Dopamine detox describes the following process: The reduction of stimulation to prevent overstimulation and put you in the proper state of mind to tackle major tasks. Quick disclaimer: Scientifically speaking, the term "dopamine detox" is incorrect as it seems to imply that you're releasing too much dopamine into your system. In truth, when you're overstimulated, you simply need more external stimuli for the same amount of dopamine to be released. A dopamine detox helps reduce stimulation, thereby allowing you to revert to a more natural state. When you need less stimulation, seemingly challenging, boring or tedious tasks will become more appealing—and easier to tackle."
              </p>
            </div>
            <p className="text-sm text-gray-600 italic mb-4">Note: DD explained well</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">DD Step 1 of Action Plan</h2>
            <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-4">
              <p className="text-base leading-relaxed">
                "If I stopped doing only one thing, which one would increase my focus and boost my productivity the most dramatically? What other activity do I need to avoid in order to help me increase my focus most significantly?"
              </p>
            </div>
            <p className="text-sm text-gray-600 italic mb-4">Note: DD Step 1 of action plan</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">This Hit the Nail on the Coffin</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-4">
              <p className="text-base leading-relaxed">
                "Finally, our never-ending search for stimulation is often an attempt to hide our fears. Being busy enables us to avoid having to face unpleasant feelings and scary truths about ourselves. Thus, if you notice certain disempowering thoughts or underlying fears, write them down too."
              </p>
            </div>
            <p className="text-sm text-gray-600 italic mb-4">Note: this hit the nail on the coffin</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Points</h2>
            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-4">
              <p className="text-base leading-relaxed">
                "The key to productivity can be summarized in three words: Focus, Consistency, and Impact."
              </p>
            </div>
            <p className="text-sm text-gray-600 italic mb-4">Note: key points</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Well Articulated Action Plan</h2>
            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 mb-4">
              <p className="text-base leading-relaxed">
                "To prevent overstimulation, cultivate the "here- and- now" neurotransmitters, which include endorphin, oxytocin, or serotonin. These neurotransmitters are the opposite of dopamine neurotransmitters in that they make you feel calmer and more present. To activate these neurotransmitters, incorporate activities that ground you in the present such as: Meditation. By meditating even for just a few minutes, you can practice being more "present in the moment". To do so, close your eyes and focus your attention on your breathing. You can also place your attention on one of your five senses. Then, switch to another sense, and another, and so on. There are no incorrect ways to meditate. Look for meditation books for beginners, search for meditation videos online, or simply experiment and see what works best for you. Stretching. When you stretch, you automatically relax your body and slow your breathing, which enables you to feel calmer and more present. Mindfulness. This means being aware of what's going inside you and around you. There are many ways to practice mindfulness. For example, you can eat slowly while noticing each flavor or texture. Or you can place your attention on your body and observe all the sensations you're experiencing from head to toe. You could also practice completing household or work- related chores, while trying to be as present as possible. Contemplative walking. How present are you when you go for a walk? Do you hear the birds singing? Do you feel the wind blowing on your face? Do you notice the shape of clouds? Often, people become stuck in their head thinking of their next task or worrying about problems in their life. Don't be like them. Next time you go for a walk, observe things around you as if you were seeing them for the first time. Focus on each of your senses. See things you've never seen before. Hear sounds you've never heard before. Smell aromas you've never smelled before. Experience bodily sensations you've never noticed before. Be present! Deep social interactions. Interacting with other human beings activates neurotransmitters such as oxytocin, which is sometimes called the "love hormone". The more present you are, the more you'll be able to connect and experience a pleasant sense of bonding. Therefore, make sure you spend enough time around the people you care about. Boredom. Practicing doing nothing is a good way to lower your level of stimulation. Our mind constantly wants to do things. For a moment, be okay with doing nothing. Sit down and observe things, eat in silence or walk with no specific intent or destination in mind. By incorporating some of the above activities, you'll be calmer and more present during your day. As a result, you will reduce the risk of becoming overstimulated."
              </p>
            </div>
            <p className="text-sm text-gray-600 italic mb-4">Note: well articulated action plan</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Conclusion - Nice Wrap Up</h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg my-8">
              <p className="text-base leading-relaxed mb-6">
                "You can choose to control your focus, or you can let someone else take it away from you. When you learn to avoid highly stimulating activities that destroy your ability to remain calm and focused, you'll find yourself capable of tackling your major tasks with more ease than ever before. Going through a dopamine detox will help you lower your level of stimulation and ensure you work on your major tasks. Remember that excitement and fulfillment aren't the same things. As you learn to eliminate external stimulations and immerse yourself in your work, hobbies, or relationships, you'll experience a deeper sense of fulfillment and will feel much better. You will also end up becoming far more productive and accomplishing many of your goals and dreams. So, stop letting your environment hijack your brain and regain control of it instead. This is the key to a healthy and productive life."
              </p>
              
              <div className="text-sm text-gray-600 italic text-center border-t pt-4">
                — Thibaut Meurisse, Dopamine Detox
              </div>
              
              <div className="mt-4 text-sm text-gray-600 italic">
                Note: Nice wrap up
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">My Takeaway</h3>
              <p className="text-base sm:text-lg leading-relaxed mb-6">
                I'm still working on building consistent habits around reduced stimulation, but the early results 
                are encouraging. When you need less external input to feel engaged, suddenly the world becomes 
                a much richer, more nuanced place. Books become portals again. Conversations become more meaningful. 
                Work becomes flow.
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                So here's to getting back to Kindle app in my Pixel, to choosing depth over breadth, to valuing our attention 
                as the precious resource it is. In an attention economy, the most rebellious thing you can do 
                might just be to read a book.
              </p>
            </div>
          </section>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Kindle
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Dopamine Detox
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Digital Wellness
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Focus
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Productivity
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Reading
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Mindfulness
            </span>
          </div>
        </div>
      </div>
    
      {/* Blog interactions */}
      <DisqusComments 
        postId="started-to-kindle-again"
        postUrl="https://kumarsite.netlify.app/blog/started-to-kindle-again"
        postTitle="Started to Kindle Again - Kumar's Blog"
      />
    </motion.div>
  );
};

export default StartedToKindleAgain; 