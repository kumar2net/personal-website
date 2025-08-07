import { motion } from 'framer-motion';
import { useState } from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AggregateStats from '../components/AggregateStats';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('realtime');

  const tabs = [
    { id: 'realtime', name: 'Real-time Analytics', component: AnalyticsDashboard },
    { id: 'aggregate', name: 'Aggregate Statistics', component: AggregateStats }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Website Analytics</h1>
          <p className="text-lg text-gray-600">
            Track your website performance and visitor behavior
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Active Tab Content */}
        <div className="mb-8">
          {ActiveComponent && <ActiveComponent />}
        </div>
        
        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Real-time Features</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Live visitor tracking</li>
              <li>• Current page views</li>
              <li>• Active sessions</li>
              <li>• Instant updates</li>
              <li>• Live geolocation</li>
              <li>• Device technology</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Aggregate Features</h3>
            <ul className="space-y-2 text-green-800">
              <li>• Historical trends</li>
              <li>• Growth analysis</li>
              <li>• Performance insights</li>
              <li>• Top pages ranking</li>
              <li>• Technology breakdown</li>
              <li>• Location analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics; 