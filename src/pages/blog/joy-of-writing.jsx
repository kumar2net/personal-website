import React from 'react';
import { Link } from 'react-router-dom';
import ContentBadge from '../../components/ContentBadge';
import DisqusComments from '../../components/DisqusComments';

const JoyOfWriting = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 relative">
        {/* NEW/UPDATED badge */}
        <ContentBadge publishDate="August 26, 2025" lastModified="August 26, 2025" />
        <Link to="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">joy of writing</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">Date: August 26, 2025</span>
          <span className="mr-4">By: kumar2net</span>
        </div>

        {/* Shields.io badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <img src="https://img.shields.io/badge/Writing-111827?style=for-the-badge&labelColor=1F2937&color=111827" alt="Writing" />
          <img src="https://img.shields.io/badge/Natural_Speech_UI-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Natural Speech UI" />
          <img src="https://img.shields.io/badge/UX-7C3AED?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="UX" />
          <img src="https://img.shields.io/badge/AI-059669?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="AI" />
          <img src="https://img.shields.io/badge/Voice_Agents-F97316?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Voice Agents" />
        </div>

        {/* Tag badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Writing</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Productivity</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Natural Language</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">AI</span>
          <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">UX</span>
        </div>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: `
<figure class="wp-block-pullquote"><blockquote><p>What do you enjoy most about writing?</p></blockquote></figure>

<p>it helps to gather &amp; organise my thoughts in a cohesive manner. Ofcourse there is a lag from the thinking in brain and the time i express it in writing using fingers. The auto complete does interrupt the flow a bit. That’s why I am using all smallcase here as I don’t want to be interrupted, following 7 rules of capitalisation</p>

<h2>next big thing</h2>

<p>now that chatgpt and gemini are proven to be good for text summarization. The next feature has to be natural spoken language interface. The UI/UX which we use now on screens should get deprecated. We will use our own individual conversation style voices to interact with assistants and get stuff done agentically..</p>

<figure class="wp-block-pullquote"><blockquote><p>I want to eat masala dosa now, find the best restaurant nearby and order one for me within a budget of 15O Rupees. I want it delivered in 15 to 30 minutes</p></blockquote></figure>

<p>Hah ‘if wishes were horses …’</p>

<p>ciao</p>
` }}
        />
      </div>

      <DisqusComments 
        postId="joy-of-writing"
        postUrl="https://kumarsite.netlify.app/blog/joy-of-writing"
        postTitle="Joy of Writing - Kumar's Blog"
      />

      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link to="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to Blog
          </Link>
          <div className="text-sm text-gray-500">
            Originally published on <a href="https://kumar2net.wordpress.com/2025/08/26/joy-of-writing/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">WordPress</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoyOfWriting;


