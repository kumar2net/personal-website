import { motion } from 'framer-motion';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const Analytics = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Website Analytics</h1>
          <p className="text-lg text-gray-600">
            Track your website performance and visitor behavior
          </p>
        </div>
        
        <AnalyticsDashboard />
        
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Analytics Features</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Real-time visitor tracking</li>
            <li>• Page view analytics</li>
            <li>• Time on page metrics</li>
            <li>• Top performing pages</li>
            <li>• Daily visitor trends</li>
            <li>• Session tracking</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics; 