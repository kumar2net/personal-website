import React from 'react';
import summary from '../data/blog-sentiment-summary.json';

const sentimentColors = {
  positive: 'bg-green-100 text-green-800',
  neutral: 'bg-yellow-100 text-yellow-800',
  negative: 'bg-red-100 text-red-800',
};

export default function BlogSentimentSummary() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span role="img" aria-label="ml">🤖</span> Blog Sentiment Analysis (ML Use Case)
        </h2>
      </div>
      <p className="text-gray-600 mb-6">
        This project demonstrates a simple Machine Learning use case: running sentiment analysis on all blog posts using a static analysis pipeline. Each post is scored and labeled as positive, neutral, or negative.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Post Title</th>
              <th className="py-2 px-4 text-center">Score</th>
              <th className="py-2 px-4 text-center">Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(({ title, score, label }, idx) => (
              <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                <td className="py-2 px-4 font-medium">{title}</td>
                <td className="py-2 px-4 text-center text-lg">{score}</td>
                <td className="py-2 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${sentimentColors[label]}`}
                  >
                    {label === 'positive' && '😊'}
                    {label === 'neutral' && '😐'}
                    {label === 'negative' && '😞'}
                    <span className="ml-2 capitalize">{label}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 