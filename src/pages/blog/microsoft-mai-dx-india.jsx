import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MicrosoftMaiDxIndia = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← Back to Blog
        </button>
      </div>
      
      <h1 className="text-4xl font-bold mb-6 text-red-500">
        TEST: Microsoft MAI-DxO Blog Post
      </h1>
      
      <p className="text-lg text-gray-700">
        If you can see this text, the routing is working! The blank page issue was likely due to a complex JSX structure.
      </p>
      
      <div className="mt-8 p-4 bg-blue-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Simple Test Content</h2>
        <p>This is a simplified version to test if the component renders correctly.</p>
      </div>
    </div>
  );
};

export default MicrosoftMaiDxIndia;