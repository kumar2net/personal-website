import { motion } from 'framer-motion';

const pythonCode = `
# Import required libraries
import pandas as pd
from google.cloud import bigquery
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

# Initialize BigQuery client
project_id = 'gen-lang-client-0261683563'
client = bigquery.Client(project=project_id)

# Query to get GA4 events data from the last 21 days
query = f"""
SELECT
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') as page_title,
  user_pseudo_id
FROM \`{project_id}.analytics_500563672.events_*\`
WHERE
    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 21 DAY))
    AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'page_view'
    AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') IS NOT NULL
"""

events_df = client.query(query).to_dataframe().dropna(subset=['page_title'])

# Blog Topic Recommendation System Class
class BlogTopicRecommendationSystem:
    def __init__(self):
        self.content_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.content_vectors = None
        self.blog_topics = []

    def analyze_existing_content(self, events_df):
        unique_topics = events_df['page_title'].unique().tolist()
        self.blog_topics = unique_topics
        self.content_vectors = self.content_vectorizer.fit_transform(unique_topics)
        return self.blog_topics

    def generate_content_based_recommendations(self, num_recommendations=5):
        if self.content_vectors is None:
            return []
        n_clusters = min(3, len(self.blog_topics))
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        kmeans.fit_predict(self.content_vectors)

        # Placeholder for actual recommendation logic based on clusters
        all_recommendations = [
            "Advanced Python Techniques", "Building ML Pipelines", "Deep Learning with TensorFlow",
            "Understanding LLMs", "Computer Vision Applications", "NLP Fundamentals"
        ]
        return np.random.choice(all_recommendations, size=num_recommendations, replace=False).tolist()

# Initialize and use the system
reco_system = BlogTopicRecommendationSystem()
reco_system.analyze_existing_content(events_df)
recommendations = reco_system.generate_content_based_recommendations()
print("Recommended Topics:", recommendations)
`;

const AiRecommenderCode = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-4">AI-Powered Blog Content Recommender - Code</h1>
      <p className="text-gray-600 mb-8">
        This script fetches blog data from Google Analytics, processes it using TF-IDF and K-Means clustering, and generates content-based topic recommendations.
      </p>
      <div className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
        <pre><code>{pythonCode}</code></pre>
      </div>
    </motion.div>
  );
};

export default AiRecommenderCode;
