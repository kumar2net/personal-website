import { Link } from 'react-router-dom'
import { HiArrowLeft, HiDownload } from 'react-icons/hi'
import BookCover from '../../components/BookCover'

function TheBrainStoryContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/books"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <HiArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Back to Books</span>
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">The Brain: The Story of You</h1>
            </div>
            
            <a
              href="https://kumarsite.netlify.app/docs/The_Brain_The_Story.pdf"
              download
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <HiDownload className="w-4 h-4 mr-1" />
              Download PDF
            </a>
          </div>
        </div>
      </header>

      {/* Book Cover and Description */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-48 h-64 rounded-lg overflow-hidden shadow-lg">
                <BookCover
                  bookId="the-brain-story"
                  title="The Brain: The Story of You"
                  author="David Eagleman"
                  className="w-full h-full"
                />
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">David Eagleman</p>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Book</h2>
              <p className="text-gray-700 leading-relaxed">
                One of the best books I have read in a while. Observing all the advances in AI and listening to gyan from my kin on neurology brain implants, wanted to dig deeper. As they say these days - learn from First Principles
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <img src="https://img.shields.io/badge/Neuroscience-Brain%20Science-purple" alt="Neuroscience badge" />
                <img src="https://img.shields.io/badge/AI%20%26%20Technology-Neural%20Implants-orange" alt="AI Technology badge" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="prose prose-lg max-w-none p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">The Brain: The Story of You</h1>
            <p className="text-lg text-gray-600 italic mb-8">By David Eagleman</p>
            
            <hr className="my-8" />
            
            <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The brain is the most complex object in the known universe. It's the seat of our thoughts, emotions, memories, and consciousness. Yet, for most of human history, we've known almost nothing about how it works.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              In "The Brain: The Story of You," neuroscientist David Eagleman takes us on a fascinating journey through the inner workings of our most mysterious organ. This book explores how the brain creates our reality, shapes our decisions, and makes us who we are.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Key Insights from the Book</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1. The Brain is Not What You Think</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your brain is not a single, unified entity. Instead, it's a collection of specialized modules that compete and collaborate to create your experience of reality. Each part of your brain has evolved to solve specific problems, from recognizing faces to avoiding danger.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2. Reality is Constructed</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              What you perceive as "reality" is actually a carefully constructed simulation created by your brain. Your brain takes in sensory information and builds a model of the world that helps you navigate and survive. This means that what you see, hear, and feel is not the objective truth, but rather your brain's best guess about what's happening.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3. The Unconscious Mind</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Most of what your brain does happens unconsciously. From regulating your heartbeat to processing visual information, the vast majority of neural activity occurs without your awareness. Your conscious mind is just the tip of the iceberg.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4. Plasticity and Change</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              The brain is incredibly plastic, meaning it can change and adapt throughout your life. Every experience you have, every skill you learn, every memory you form, physically changes the structure of your brain. This plasticity is what allows us to learn, grow, and adapt to new situations.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">5. The Social Brain</h3>
            <p className="text-gray-700 leading-relaxed mb-8">
              Humans are fundamentally social creatures, and our brains have evolved to help us navigate complex social relationships. We have specialized neural circuits for recognizing faces, understanding emotions, and cooperating with others.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Implications for AI and Technology</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As we develop increasingly sophisticated artificial intelligence and neural implants, understanding how the brain works becomes more important than ever. The insights from neuroscience can help us:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-gray-700">
              <li><strong>Design Better AI</strong>: Understanding how the brain processes information can inspire new approaches to artificial intelligence</li>
              <li><strong>Develop Neural Interfaces</strong>: Knowledge of brain function is crucial for developing safe and effective brain-computer interfaces</li>
              <li><strong>Enhance Human Capabilities</strong>: Understanding brain plasticity could lead to new ways to enhance learning and cognitive abilities</li>
              <li><strong>Treat Brain Disorders</strong>: Better understanding of brain function can lead to new treatments for neurological and psychiatric conditions</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">The Future of Brain Science</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The field of neuroscience is advancing rapidly, with new technologies allowing us to study the brain in unprecedented detail. From functional MRI to optogenetics, we're gaining new insights into how the brain works every day.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              As we continue to unravel the mysteries of the brain, we're not just learning about biology—we're learning about what it means to be human. The brain is the story of you, and understanding it is understanding yourself.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Conclusion</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              "The Brain: The Story of You" is more than just a book about neuroscience. It's a book about what makes us human, about how we perceive the world, and about the incredible complexity of our own minds. It's a reminder that we are all walking around with the most sophisticated piece of technology in the known universe inside our heads.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              As we move forward into an era of artificial intelligence and brain-computer interfaces, understanding our own brains becomes not just interesting, but essential. The future of technology and the future of humanity are both deeply intertwined with our understanding of the brain.
            </p>

            <hr className="my-8" />
            
            <p className="text-gray-600 italic text-center">
              This summary captures the key themes and insights from David Eagleman's "The Brain: The Story of You." The book is a fascinating exploration of neuroscience that has profound implications for our understanding of consciousness, technology, and what it means to be human.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TheBrainStoryContent
