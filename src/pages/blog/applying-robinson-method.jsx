import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ApplyingRobinsonMethod = () => {
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
      
      <h1 className="text-4xl font-bold mb-6">Applying the Robinson Method: A Guide to Using Active Reading and Mastering Lifelong Learning</h1>
      
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>July 26, 2025</span>
      </div>

      <div className="flex gap-2 mb-8">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Learning</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">SQ3R Method</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Active Reading</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Study Techniques</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Education</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Book Notes</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              Notes from "Applying the Robinson Method: A Guide to Using Active Reading and Mastering the Lifelong Learning" by Andréia Ramos
            </p>
          </header>

          <section className="mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400 mb-6">
              <p className="text-base sm:text-lg leading-relaxed">
                <strong>Citation (Chicago Style):</strong> Ramos, Andréia. <em>Applying the Robinson Method : A Guide to Using Active Reading and Mastering the Lifelong Learning</em>. 2024. Kindle edition.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Introduction to the SQ3R Method
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              SQ3R is an active reading method developed by educational psychologist Francis P. Robinson in 1946. The acronym SQ3R represents the five essential steps of this learning process: <strong>Survey, Question, Read, Recite, and Review</strong>.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mb-6">
              <p className="text-base sm:text-lg leading-relaxed">
                <strong>Note:</strong> Never heard this before, only about 3R
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              The Power of Active Reading
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The larger the volume of material to be studied, the more we can benefit from techniques and strategies like SQ3R. Additionally, you can use it in conjunction with other methods, such as the Feynman Technique, smart notes, summaries, and mind maps, all of which can further facilitate your study process.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 mb-6">
              <p className="text-base sm:text-lg leading-relaxed">
                <strong>Note:</strong> Valid point.
              </p>
            </div>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              It is important to understand that active reading is crucial because it enhances comprehension and information retention. When we read passively, we tend to quickly forget what was read. However, by engaging with the text, the mind creates associations and connections, which facilitates memorization and practical application of the acquired knowledge.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 mb-6">
              <p className="text-base sm:text-lg leading-relaxed">
                <strong>Note:</strong> Yes agree
              </p>
            </div>
            <p className="text-base sm:text-lg leading-relaxed">
              Questioning and reflecting are fundamental for the formation of our knowledge!
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              In Search of Knowledge Using SQ3R
            </h2>
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400 mb-6">
              <h3 className="text-xl font-semibold mb-4">The Five Stages of SQ3R:</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-base sm:text-lg leading-relaxed">
                    <strong>Stage 1:</strong> The initial exploration of the text prepares your mind for detailed reading, helping to identify the structure and main points of the material.
                  </p>
                </div>
                <div>
                  <p className="text-base sm:text-lg leading-relaxed">
                    <strong>Stage 2:</strong> Formulating questions stimulates curiosity and directs your focus during reading, making the process more interactive and engaging.
                  </p>
                </div>
                <div>
                  <p className="text-base sm:text-lg leading-relaxed">
                    <strong>Stage 3:</strong> Active reading, guided by the formulated questions, improves comprehension and retention of the content.
                  </p>
                </div>
                <div>
                  <p className="text-base sm:text-lg leading-relaxed">
                    <strong>Stage 4:</strong> Reproducing the material, whether verbally, in writing, or using graphic elements, consolidates knowledge and helps identify areas that need more attention.
                  </p>
                </div>
                <div>
                  <p className="text-base sm:text-lg leading-relaxed">
                    <strong>Stage 5:</strong> Periodic and systematic review reinforces long-term memory and ensures that knowledge is retained and easily recalled.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mb-6">
              <p className="text-base sm:text-lg leading-relaxed">
                <strong>Note:</strong> Assimilate This
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Practical Application and Benefits
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The final benefit I want to highlight about the SQ3R method is that it not only aids in theoretical understanding but also in the practical application of knowledge. By applying summarization and review steps, you can include activities like reflection and exercises where you translate information into your own words, making it easier to use the knowledge in real-life contexts.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mb-6">
              <p className="text-base sm:text-lg leading-relaxed">
                <strong>Note:</strong> Icing in the cake
              </p>
            </div>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The SQ3R method can be extremely useful when applied to the reading of textbooks, scientific articles, study materials for exams, technical reports, and other types of texts where the primary goal is informational or educational.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 mb-6">
              <p className="text-base sm:text-lg leading-relaxed">
                <strong>Note:</strong> Agree
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Conclusion: A Journey of Discovery
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The journey with the SQ3R method is one of discovery, learning, and growth. By incorporating these strategies into your study and reading routine, you are investing in your own intellectual and professional development. Active reading is not just a skill, but a powerful tool that can open doors to new opportunities in your quest for knowledge.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <p className="text-base sm:text-lg leading-relaxed">
                <strong>Note:</strong> Indeed
              </p>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplyingRobinsonMethod; 