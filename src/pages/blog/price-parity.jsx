import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import markdownContent from './compare.md?raw';


import DisqusComments from '../../components/DisqusComments';const lines = markdownContent.split('\n');
const title = lines[0].replace(/^#\s*/, '');
const date = lines[2].replace(/^\*\s*|\s*\*$/g, '');
const body = lines.slice(4).join('\n');

const PriceParity = () => {
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
      
      <h1 className="text-4xl font-bold mb-6">{title}</h1>
      
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{date}</span>
      </div>

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {body}
        </ReactMarkdown>
      </div>
    
      {/* Blog interactions */}
      <DisqusComments 
        postId="price-parity"
        postUrl="https://kumarsite.netlify.app/blog/price-parity"
        postTitle="{title} - Kumar's Blog"
      />
    </motion.div>
  );
};

export default PriceParity; 