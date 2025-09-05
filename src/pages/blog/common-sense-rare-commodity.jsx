import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CommonSenseRareCommodity = () => {
  const navigate = useNavigate();
  const articleRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [localComments, setLocalComments] = useState([]);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleShareThoughts = () => {
    setShowCommentForm(!showCommentForm);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !name.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Try Netlify Forms first
      const formData = new FormData();
      formData.append('form-name', 'blog-comments');
      formData.append('post-slug', 'common-sense-rare-commodity');
      formData.append('name', name.trim());
      formData.append('comment', comment.trim());
      formData.append('timestamp', new Date().toISOString());

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setComment('');
        setName('');
        // Keep form open for a moment to show success message
        setTimeout(() => {
          setShowCommentForm(false);
        }, 2000);
      } else {
        // Fallback to localStorage if Netlify Forms fails
        const commentData = {
          id: Date.now(),
          name: name.trim(),
          comment: comment.trim(),
          postSlug: 'common-sense-rare-commodity',
          timestamp: new Date().toISOString(),
        };

        const existingComments = JSON.parse(localStorage.getItem('blog-comments') || '[]');
        existingComments.push(commentData);
        localStorage.setItem('blog-comments', JSON.stringify(existingComments));

        // Update local comments state
        setLocalComments(prev => [...prev, commentData]);

        setSubmitStatus('success');
        setComment('');
        setName('');
        setTimeout(() => {
          setShowCommentForm(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Fallback to localStorage
      const commentData = {
        id: Date.now(),
        name: name.trim(),
        comment: comment.trim(),
        postSlug: 'common-sense-rare-commodity',
        timestamp: new Date().toISOString(),
      };

      const existingComments = JSON.parse(localStorage.getItem('blog-comments') || '[]');
      existingComments.push(commentData);
      localStorage.setItem('blog-comments', JSON.stringify(existingComments));

      // Update local comments state
      setLocalComments(prev => [...prev, commentData]);

      setSubmitStatus('success');
      setComment('');
      setName('');
      setTimeout(() => {
        setShowCommentForm(false);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <h1 className="text-4xl font-bold mb-6">
        🧠 Common Sense is a Rare Commodity
      </h1>

      <div className="flex items-center text-gray-600 mb-8">
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
        <span>Date: {new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Trade Relations
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          International Politics
        </span>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Economic Policy
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          Global Governance
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
          Common Sense
        </span>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          Social Commentary
        </span>
      </div>

      <div className="space-y-8">
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-8 italic">
            With all this rhetoric about tariffs from both sides—the great country and ours—where are we heading to? 
            Unnecessary tension and so much management time wasted. Political rhetoric at the expense of common sense.
          </p>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-lg border-l-4 border-yellow-500 mb-8">
            <h3 className="text-2xl font-bold mb-4 text-yellow-800">
              🤔 The Core Question
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              Why not consider the big picture and go to the root of the issue? Ultimately, the less privileged population—the majority poor in India—is the one who suffers.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            The Tariff Tug-of-War: A Visual Representation
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            The complexity of India-US trade relations can be overwhelming. This word cloud captures the intricate web of concepts, 
            policies, and consequences that surround the ongoing tariff disputes:
          </p>

          {/* Tag Cloud Image */}
          <div className="mt-8 mb-8 text-center">
            <img
              src="/media/tandtTagcloud.png"
              alt="India-US Trade Relations Word Cloud - showing key concepts like tariffs, exports, economic impact, and various industries affected"
              className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
            />
            <p className="text-sm text-gray-500 mt-4 italic max-w-3xl mx-auto">
              This word cloud visualizes the complex landscape of India-US trade relations, highlighting key concepts, 
              affected industries, and the broader economic implications of current tariff policies.
            </p>
          </div>

          {/* GST Rationalization Impact - Prominent Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-lg border-l-4 border-orange-500 mb-8 mt-8">
            <h3 className="text-2xl font-bold mb-4 text-orange-800">
              🏛️ The GST Rationalization Question
            </h3>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-200">
              <p className="text-lg text-gray-800 font-medium mb-4">
                <strong>Of course, all this GST slab rationalization happened because of this imbroglio, but not sure of its overall impact.</strong>
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">🤔 The Uncertainty</h4>
                  <p className="text-sm text-gray-700">
                    While GST rationalization was implemented as a response to trade tensions, 
                    the long-term economic impact remains unclear. Did it actually help or create 
                    additional complexity for businesses and consumers?
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">📊 The Broader Question</h4>
                  <p className="text-sm text-gray-700">
                    This highlights a fundamental issue: policy changes made in response to 
                    international pressure may not always serve domestic economic interests. 
                    Common sense would suggest evaluating impact before implementation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            The Multilateral Institution Paradox
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            All these 'U' prefix organizations of the world—UN (United Nations), WTO (World Trade Organization), 
            IMF (International Monetary Fund), World Bank—never helped solve such fundamental issues. They are dictated by who is the majority funder!
          </p>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-lg border-l-4 border-red-500 mb-8">
            <h3 className="text-2xl font-bold mb-4 text-red-800">
              💰 The Funding Reality
            </h3>
            <p className="text-base text-gray-700 mb-6">
              The disproportionate influence of major funders in multilateral institutions creates a system where 
              economic power translates directly into political control. Here's the stark reality:
            </p>
            
            {/* Vethathiri Maharishi vs Osho: Approaches to World Order */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left font-semibold text-gray-800">
                      Aspect
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold text-gray-800">
                      Vethathiri Maharishi
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold text-gray-800">
                      Osho
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3 font-semibold text-blue-800">
                      Core Vision
                    </td>
                    <td className="border border-gray-300 p-3">
                      Supreme World Government for lasting peace
                    </td>
                    <td className="border border-gray-300 p-3">
                      Spiritual awakening as path to harmony
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold text-blue-800">
                      Pathway
                    </td>
                    <td className="border border-gray-300 p-3">
                      Self-realization, restructure of UNO, world governance
                    </td>
                    <td className="border border-gray-300 p-3">
                      Individual freedom and consciousness
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 font-semibold text-blue-800">
                      Unity Principle
                    </td>
                    <td className="border border-gray-300 p-3">
                      Oneness of all via universal consciousness
                    </td>
                    <td className="border border-gray-300 p-3">
                      Spontaneous natural order through freedom
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold text-blue-800">
                      Role of Spirituality
                    </td>
                    <td className="border border-gray-300 p-3">
                      Fundamental to social and global change
                    </td>
                    <td className="border border-gray-300 p-3">
                      Fundamental to authentic creative living
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 font-semibold text-blue-800">
                      Approach to Order
                    </td>
                    <td className="border border-gray-300 p-3">
                      Structured, democratic political and spiritual framework
                    </td>
                    <td className="border border-gray-300 p-3">
                      Anti-structure, emphasis on personal liberty
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold text-blue-800">
                      Ultimate Goal
                    </td>
                    <td className="border border-gray-300 p-3">
                      World peace through global unity and governance
                    </td>
                    <td className="border border-gray-300 p-3">
                      Individual spiritual freedom and transformation
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">🔍 Key Insight</h4>
              <p className="text-sm text-yellow-700">
                Vethathiri Maharishi's vision of restructuring the UNO (United Nations Organization) represents a structured 
                approach to global governance through self-realization and democratic frameworks. In contrast, Osho's 
                philosophy emphasizes individual transformation as the path to harmony, suggesting that true world order 
                emerges from personal spiritual freedom rather than institutional restructuring. Both approaches highlight 
                the fundamental question: Can common sense prevail through structural reform or individual awakening?
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            The Quest for a Common World Order
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            Who all thought about a common world order? Let's explore the key concepts and their evolution:
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              📚 Key Concepts in Global Governance
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">1. Liberal International Order (LIO)</h4>
                <p className="text-gray-600">
                  Post-WWII system emphasizing democracy, free trade, and multilateral cooperation. 
                  Led by the US and Western allies, it established institutions like the UN, IMF, and WTO.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">2. Multipolar World Order</h4>
                <p className="text-gray-600">
                  Emerging system where power is distributed among multiple nations (US, China, EU, India, Russia), 
                  rather than dominated by a single superpower.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">3. Rules-Based International System</h4>
                <p className="text-gray-600">
                  Framework where nations agree to follow established rules and norms, 
                  with mechanisms for dispute resolution and collective action.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">4. Global Commons Governance</h4>
                <p className="text-gray-600">
                  Management of shared resources like climate, oceans, cyberspace, and outer space 
                  through international cooperation and treaties.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            The Reality Check: Why Common Sense Fails
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-800">
                🎯 What Common Sense Would Dictate
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Focus on mutual economic benefits</li>
                <li>• Address root causes, not symptoms</li>
                <li>• Consider impact on vulnerable populations</li>
                <li>• Use data-driven decision making</li>
                <li>• Prioritize long-term stability over short-term gains</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-red-800">
                ⚡ What Actually Happens
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Political posturing and rhetoric</li>
                <li>• Knee-jerk reactions to complex issues</li>
                <li>• Disproportionate impact on the poor</li>
                <li>• Emotion-driven policy decisions</li>
                <li>• Short-term political gains prioritized</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            The Path Forward: A Call for Rational Discourse
          </h2>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-lg border-l-4 border-green-500 mb-8">
            <h3 className="text-2xl font-bold mb-4 text-green-800">
              🌱 Towards a More Equitable World Order
            </h3>
            <div className="space-y-4">
              <p className="text-base text-gray-700">
                <strong>1. Reform Multilateral Institutions:</strong> Address the funding imbalance and voting power disparities 
                that give undue influence to major contributors.
              </p>
              <p className="text-base text-gray-700">
                <strong>2. Evidence-Based Policy Making:</strong> Base decisions on comprehensive data analysis rather than 
                political expediency or emotional responses.
              </p>
              <p className="text-base text-gray-700">
                <strong>3. Inclusive Decision Making:</strong> Ensure that the voices of developing nations and vulnerable 
                populations are heard in global governance structures.
              </p>
              <p className="text-base text-gray-700">
                <strong>4. Long-Term Thinking:</strong> Prioritize sustainable solutions that address root causes rather 
                than quick fixes that create new problems.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-lg mt-12 border-l-4 border-purple-500">
            <h3 className="text-2xl font-bold mb-4 text-purple-800">
              💭 Final Thoughts
            </h3>
            <p className="text-base text-gray-700 leading-relaxed font-medium">
              The current state of international relations, particularly in trade and economic policy, reveals a fundamental 
              disconnect between what common sense would dictate and what actually occurs. The disproportionate influence 
              of major funders in multilateral institutions, combined with short-term political thinking, creates a system 
              where the most vulnerable populations bear the brunt of policy decisions made far from their reality.
            </p>
            <p className="text-base text-gray-700 leading-relaxed mt-4">
              Perhaps it's time to step back from the rhetoric and ask: What would a truly equitable world order look like? 
              How can we create institutions that serve all humanity, not just the powerful few? The answers to these 
              questions might just be the common sense solutions we've been missing all along.
            </p>
          </div>

          {/* Call to Action */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              What's Your Take?
            </h3>
            <p className="text-gray-600 mb-4">
              Do you think common sense can prevail in international relations? Share your thoughts on how we can 
              create a more equitable global order.
            </p>
            <div className="flex justify-center space-x-4 mb-6">
              <button 
                onClick={handleLike}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  isLiked 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{isLiked ? 'Liked' : 'Like this post'}</span>
                {likeCount > 0 && <span>({likeCount})</span>}
              </button>
              <button 
                onClick={handleShareThoughts}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {showCommentForm ? 'Cancel' : 'Share your thoughts'}
              </button>
            </div>


            {/* Comment Form */}
            {showCommentForm && (
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  {/* Hidden fields for Netlify Forms */}
                  <input type="hidden" name="form-name" value="blog-comments" />
                  <input type="hidden" name="post-slug" value="common-sense-rare-commodity" />
                  <div style={{ display: 'none' }}>
                    <label>
                      Don't fill this out if you're human: <input name="bot-field" />
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="comment-name" className="sr-only">
                      Your name
                    </label>
                    <input
                      id="comment-name"
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      aria-describedby="name-help"
                    />
                    <div id="name-help" className="sr-only">
                      Enter your name for the comment
                    </div>
                  </div>
                  <div>
                    <label htmlFor="comment-text" className="sr-only">
                      Your comment
                    </label>
                    <textarea
                      id="comment-text"
                      name="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts on common sense in international relations..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows="4"
                      required
                      aria-describedby="comment-help"
                    />
                    <div id="comment-help" className="sr-only">
                      Share your thoughts about the blog post
                    </div>
                  </div>
                  
                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div 
                      className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg"
                      role="status"
                      aria-live="polite"
                    >
                      Thank you for your comment! It has been submitted successfully.
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div 
                      className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg"
                      role="alert"
                      aria-live="assertive"
                    >
                      Sorry, there was an error submitting your comment. Please try again.
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCommentForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      disabled={isSubmitting}
                      aria-label="Cancel comment submission"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!comment.trim() || !name.trim() || isSubmitting}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      aria-label={isSubmitting ? "Submitting comment" : "Submit comment"}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true"></div>
                          Submitting...
                        </>
                      ) : (
                        'Post Comment'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Local Comments Display */}
            {localComments.length > 0 && (
              <div className="max-w-2xl mx-auto mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments ({localComments.length})</h3>
                <div className="space-y-4">
                  {localComments
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800">{comment.name}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Comment Info */}
            <div className="max-w-4xl mx-auto mt-8 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">
                  💬 Share Your Thoughts
                </h4>
                <p className="text-blue-700">
                  Comments are stored locally in your browser and will appear immediately after submission. 
                  Your thoughts help create meaningful discussions about these important topics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommonSenseRareCommodity;
