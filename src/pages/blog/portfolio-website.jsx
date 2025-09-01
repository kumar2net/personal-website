import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const PortfolioWebsitePost = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <HiArrowLeft className="w-5 h-5 mr-2" />
        Back to Blog
      </button>

      <h1 className="text-4xl font-bold mb-6">
        Building My Personal Portfolio Website
      </h1>
      <p className="text-gray-600 text-sm mb-8">June 3, 2025</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="text-gray-700">
            I recently built my personal portfolio website using modern web
            technologies to showcase my projects, skills, and experience. This
            blog post will detail the technologies used, the challenges faced,
            and the lessons learned during the development process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <div className="space-y-4">
            <h3 className="font-medium">Frontend</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>React 18</li>
              <li>React Router v6</li>
              <li>Framer Motion for animations</li>
              <li>Tailwind CSS for styling</li>
              <li>Vite as build tool</li>
            </ul>

            <h3 className="font-medium">Development Tools</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>ESLint for code linting</li>
              <li>Prettier for code formatting</li>
              <li>Git for version control</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <div className="space-y-4">
            <h3 className="font-medium">Responsive Design</h3>
            <p className="text-gray-700">
              The website is fully responsive and works seamlessly across all
              devices - desktop, tablet, and mobile. Tailwind CSS's responsive
              utilities made it easy to create a consistent layout that adapts
              to different screen sizes.
            </p>

            <h3 className="font-medium">Smooth Animations</h3>
            <p className="text-gray-700">
              Framer Motion was used to add smooth animations throughout the
              site, including page transitions, hover effects, and loading
              animations. These animations enhance the user experience without
              sacrificing performance.
            </p>

            <h3 className="font-medium">Blog System</h3>
            <p className="text-gray-700">
              The blog section allows me to share my thoughts, projects, and
              technical insights. Each blog post is a React component that can
              be easily extended or modified as needed.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Challenges and Solutions
          </h2>
          <div className="space-y-4">
            <h3 className="font-medium">Performance Optimization</h3>
            <p className="text-gray-700">
              One of the main challenges was ensuring good performance while
              maintaining smooth animations. This was achieved by:
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Using React's built-in optimizations</li>
                <li>Lazy loading components with React Router</li>
                <li>Optimizing images and assets</li>
              </ul>
            </p>

            <h3 className="font-medium">Responsive Design</h3>
            <p className="text-gray-700">
              Creating a consistent mobile experience required careful attention
              to layout and navigation. Tailwind CSS's responsive utilities made
              it easier to handle different screen sizes and breakpoints.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Lessons Learned</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Consistent styling is key for a professional look</li>
            <li>Performance should be a priority from the start</li>
            <li>
              Testing across devices is crucial for a good user experience
            </li>
            <li>Documentation helps maintain code quality</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Future Enhancements</h2>
          <p className="text-gray-700">
            While the website is functional, there are several areas I plan to
            improve:
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Add a dark mode theme</li>
            <li>Implement SEO best practices</li>
            <li>Add more interactive elements</li>
            <li>Enhance the contact form functionality</li>
          </ul>
        </section>
      </div>

      {/* Blog interactions */}
          </motion.div>
  );
};

export default PortfolioWebsitePost;
