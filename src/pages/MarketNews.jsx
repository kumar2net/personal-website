import { useEffect, useState } from 'react';
import LatestMarketNews from '../components/latest_market_news.jsx';

// Using a public news API as fallback
const _NEWS_URL =
  'https://newsapi.org/v2/top-headlines?country=in&apiKey=YOUR_NEWSAPI_KEY';
// Note: You'll need to sign up at https://newsapi.org/ to get a free API key
// For now, we'll use a placeholder that will show sample data in development

export default function MarketNews() {
  const [newsList, setNewsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchTime, setFetchTime] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using sample data since we don't have a working API key
        const sampleData = {
          articles: [
            {
              title: 'Sample Market News 1',
              description:
                'This is a sample news article. In a real app, this would be fetched from a news API.',
              url: '#',
              publishedAt: new Date().toISOString(),
            },
            {
              title: 'Sample Market News 2',
              description:
                'Another sample news article. Sign up for a free API key at newsapi.org to get real news.',
              url: '#',
              publishedAt: new Date().toISOString(),
            },
          ],
        };

        console.log('Using sample data');
        setNewsList(sampleData.articles);
        setFetchTime(new Date());
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load news. Using sample data instead.');

        // Set sample data even on error
        const sampleData = {
          articles: [
            {
              title: 'Sample Market News (Offline Mode)',
              description:
                'This is sample data shown because the news API could not be reached.',
              url: '#',
              publishedAt: new Date().toISOString(),
            },
          ],
        };
        setNewsList(sampleData.articles);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-2 py-10 sm:px-4 sm:py-16">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Market News</h1>
          <p className="text-gray-500">Loading latest market news...</p>
        </div>
      </div>
    );
  }

  if (error || !Array.isArray(newsList)) {
    // Fallback to static component if error or invalid data
    return <LatestMarketNews />;
  }

  return (
    <div className="max-w-2xl mx-auto px-2 py-10 sm:px-4 sm:py-16">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
          Market News
        </h1>
        <p className="text-gray-500 mb-4 text-sm sm:text-base">
          Last updated: {fetchTime ? fetchTime.toLocaleString() : '--'}
        </p>
        <div>
          {newsList.length === 0 ? (
            <p className="text-gray-500">No news available.</p>
          ) : (
            newsList.map((news, idx) => (
              <div
                key={idx}
                className="mb-5 sm:mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-sm flex flex-col gap-2"
              >
                <div className="news-title font-semibold text-base sm:text-lg text-gray-900 mb-1">
                  {news.title}
                </div>

                {news.summary && (
                  <div className="news-summary text-gray-700 text-sm sm:text-base mb-1">
                    {news.summary}
                  </div>
                )}
                {news.url && (
                  <a
                    href={news.url}
                    className="text-blue-600 underline font-medium text-sm sm:text-base hover:text-blue-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Read more about ${news.title}`}
                  >
                    Read more
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
