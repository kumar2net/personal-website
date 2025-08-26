import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import BlogInteractions from '../../components/BlogInteractions';

const Kumblogtipsaug3 = () => {
  const navigate = useNavigate();
  const articleRef = useRef(null);
  
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
      
      <h1 className="text-4xl font-bold mb-6">Untitled</h1>
      
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Date: Unknown Date</span>
        <span className="mx-2">•</span>
        <span>By Kumar</span>
      </div>

      

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        
      </div>

      <div className="space-y-8">
        <div ref={articleRef} className="prose prose-lg max-w-none">
          
          
          <div dangerouslySetInnerHTML={{ __html: `Da vinci xi robot in a local hospital ad i read in newspaper and did dig and found its specs and price 

T&T - headline grabbing news in the last 3 days. Does it really matter. Per capita GDP of massive percentage of India population calculated per day is 420 odd rupees ( few odd USD so low). Compare with neighbour counties similar tariffs imposed. You bargain and he will bring it down. Headline hogging that's it.period. not to have a hard view of anything and non judgemental to remain stress free

One more youngster contributing as a co author and made me happy

Tamil paper cutting ramble about massive need of gig watt power plants and ecosystem damage - hydro project 

Correct the YouTube music album link in /music to this month and update url

Update drugReco to medicinechk in /project and say sent personal interaction to 2 of family. It will update data with backend databases. Redact and show results nC2 being used
Last updated: 2025-08-11
` }} />
        </div>
        
        <BlogInteractions articleRef={articleRef} />
      </div>
    </motion.div>
  );
};

export default Kumblogtipsaug3;
