"""
Google Analytics Integration for Neural Graph Recommender
Integrates GA4 data to enhance recommendation quality with user behavior signals
"""

import os
import json
import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from collections import defaultdict
import asyncio
from google.cloud import bigquery
from google.oauth2 import service_account
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GA4BehaviorAnalyzer:
    """Analyzes user behavior from GA4 data to improve recommendations"""
    
    def __init__(self, project_id: str = None, dataset_id: str = None):
        """
        Initialize GA4 behavior analyzer
        
        Args:
            project_id: GCP project ID
            dataset_id: BigQuery dataset ID for GA4 data
        """
        self.project_id = project_id or os.getenv('GCP_PROJECT_ID', 'my-project-74001686249')
        self.dataset_id = dataset_id or os.getenv('GA4_DATASET', 'analytics_12010944378')
        self.client = None
        self._initialize_client()
        
    def _initialize_client(self):
        """Initialize BigQuery client"""
        try:
            # Check for service account credentials
            credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            if credentials_path and os.path.exists(credentials_path):
                credentials = service_account.Credentials.from_service_account_file(
                    credentials_path
                )
                self.client = bigquery.Client(
                    credentials=credentials,
                    project=self.project_id
                )
            else:
                # Use default credentials
                self.client = bigquery.Client(project=self.project_id)
            logger.info("BigQuery client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize BigQuery client: {e}")
            self.client = None
    
    async def get_page_engagement_metrics(self, days: int = 7) -> Dict[str, float]:
        """
        Get page engagement metrics from GA4
        
        Args:
            days: Number of days to look back
            
        Returns:
            Dictionary of page paths to engagement scores
        """
        if not self.client:
            logger.warning("BigQuery client not initialized")
            return {}
            
        try:
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            query = f"""
            SELECT
                page_location,
                COUNT(DISTINCT user_pseudo_id) as unique_users,
                COUNT(*) as page_views,
                AVG(engagement_time_msec) / 1000 as avg_engagement_time_sec,
                SUM(CASE WHEN event_name = 'scroll' THEN 1 ELSE 0 END) as scroll_events,
                SUM(CASE WHEN event_name = 'click' THEN 1 ELSE 0 END) as click_events
            FROM
                `{self.project_id}.{self.dataset_id}.events_*`
            WHERE
                _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL {days} DAY))
                AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
                AND event_name IN ('page_view', 'scroll', 'click', 'user_engagement')
            GROUP BY
                page_location
            ORDER BY
                page_views DESC
            LIMIT 100
            """
            
            # Execute query
            query_job = self.client.query(query)
            results = query_job.result()
            
            # Calculate engagement scores
            engagement_scores = {}
            for row in results:
                # Extract path from URL
                page_path = self._extract_path_from_url(row.page_location)
                
                # Calculate composite engagement score
                score = self._calculate_engagement_score(
                    unique_users=row.unique_users,
                    page_views=row.page_views,
                    avg_engagement_time=row.avg_engagement_time_sec or 0,
                    scroll_events=row.scroll_events or 0,
                    click_events=row.click_events or 0
                )
                
                engagement_scores[page_path] = score
                
            logger.info(f"Retrieved engagement metrics for {len(engagement_scores)} pages")
            return engagement_scores
            
        except Exception as e:
            logger.error(f"Error fetching GA4 engagement metrics: {e}")
            return {}
    
    async def get_user_journey_patterns(self, days: int = 7) -> Dict[str, List[str]]:
        """
        Analyze user journey patterns to understand content flow
        
        Args:
            days: Number of days to analyze
            
        Returns:
            Dictionary of page paths to commonly visited next pages
        """
        if not self.client:
            logger.warning("BigQuery client not initialized")
            return {}
            
        try:
            query = f"""
            WITH user_sessions AS (
                SELECT
                    user_pseudo_id,
                    page_location,
                    event_timestamp,
                    LAG(page_location) OVER (
                        PARTITION BY user_pseudo_id 
                        ORDER BY event_timestamp
                    ) as previous_page
                FROM
                    `{self.project_id}.{self.dataset_id}.events_*`
                WHERE
                    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL {days} DAY))
                    AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
                    AND event_name = 'page_view'
            )
            SELECT
                previous_page,
                page_location as next_page,
                COUNT(*) as transition_count
            FROM
                user_sessions
            WHERE
                previous_page IS NOT NULL
                AND previous_page != page_location
            GROUP BY
                previous_page, next_page
            HAVING
                transition_count > 2
            ORDER BY
                previous_page, transition_count DESC
            """
            
            query_job = self.client.query(query)
            results = query_job.result()
            
            # Organize journey patterns
            journey_patterns = defaultdict(list)
            for row in results:
                from_path = self._extract_path_from_url(row.previous_page)
                to_path = self._extract_path_from_url(row.next_page)
                
                if from_path and to_path:
                    journey_patterns[from_path].append({
                        'next_page': to_path,
                        'count': row.transition_count
                    })
            
            # Keep only top 5 destinations for each page
            for page in journey_patterns:
                journey_patterns[page] = sorted(
                    journey_patterns[page], 
                    key=lambda x: x['count'], 
                    reverse=True
                )[:5]
                
            logger.info(f"Analyzed journey patterns for {len(journey_patterns)} pages")
            return dict(journey_patterns)
            
        except Exception as e:
            logger.error(f"Error analyzing user journeys: {e}")
            return {}
    
    async def get_trending_topics(self, days: int = 7, limit: int = 10) -> List[Dict]:
        """
        Get trending topics based on recent user interest
        
        Args:
            days: Number of days to analyze
            limit: Maximum number of trending topics
            
        Returns:
            List of trending topics with scores
        """
        if not self.client:
            logger.warning("BigQuery client not initialized")
            return []
            
        try:
            query = f"""
            WITH recent_activity AS (
                SELECT
                    page_location,
                    COUNT(DISTINCT user_pseudo_id) as unique_users,
                    COUNT(*) as total_events,
                    MAX(event_timestamp) as last_activity
                FROM
                    `{self.project_id}.{self.dataset_id}.events_*`
                WHERE
                    _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL {days} DAY))
                    AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
                    AND event_name IN ('page_view', 'scroll', 'user_engagement')
                GROUP BY
                    page_location
            ),
            trending_score AS (
                SELECT
                    page_location,
                    unique_users,
                    total_events,
                    -- Calculate trending score based on recency and engagement
                    (unique_users * 2 + total_events) * 
                    EXP(-DATE_DIFF(CURRENT_DATE(), DATE(TIMESTAMP_MICROS(last_activity)), DAY) / 3.0) as trend_score
                FROM
                    recent_activity
            )
            SELECT
                page_location,
                unique_users,
                total_events,
                trend_score
            FROM
                trending_score
            ORDER BY
                trend_score DESC
            LIMIT {limit}
            """
            
            query_job = self.client.query(query)
            results = query_job.result()
            
            trending_topics = []
            for row in results:
                page_path = self._extract_path_from_url(row.page_location)
                if page_path and '/blog/' in page_path:
                    trending_topics.append({
                        'path': page_path,
                        'unique_users': row.unique_users,
                        'total_events': row.total_events,
                        'trend_score': float(row.trend_score)
                    })
            
            logger.info(f"Found {len(trending_topics)} trending topics")
            return trending_topics
            
        except Exception as e:
            logger.error(f"Error getting trending topics: {e}")
            return []
    
    def _extract_path_from_url(self, url: str) -> str:
        """Extract path from full URL"""
        if not url:
            return ""
        
        # Remove protocol and domain
        if '://' in url:
            url = url.split('://', 1)[1]
        if '/' in url:
            path = '/' + url.split('/', 1)[1]
        else:
            path = '/'
            
        # Remove query parameters and fragments
        path = path.split('?')[0].split('#')[0]
        
        return path
    
    def _calculate_engagement_score(
        self, 
        unique_users: int,
        page_views: int,
        avg_engagement_time: float,
        scroll_events: int,
        click_events: int
    ) -> float:
        """
        Calculate composite engagement score
        
        Args:
            unique_users: Number of unique users
            page_views: Total page views
            avg_engagement_time: Average engagement time in seconds
            scroll_events: Number of scroll events
            click_events: Number of click events
            
        Returns:
            Engagement score (0-100)
        """
        # Normalize metrics
        user_score = min(unique_users / 100, 1.0) * 25
        view_score = min(page_views / 500, 1.0) * 20
        time_score = min(avg_engagement_time / 120, 1.0) * 25  # 2 minutes as benchmark
        scroll_score = min(scroll_events / page_views if page_views > 0 else 0, 1.0) * 15
        click_score = min(click_events / page_views if page_views > 0 else 0, 1.0) * 15
        
        total_score = user_score + view_score + time_score + scroll_score + click_score
        
        return round(total_score, 2)


class EnhancedGraphRecommender:
    """Enhanced graph recommender with GA4 integration"""
    
    def __init__(self, base_recommender, ga4_analyzer: GA4BehaviorAnalyzer):
        """
        Initialize enhanced recommender
        
        Args:
            base_recommender: Base NeuralGraphRecommenderMVP instance
            ga4_analyzer: GA4BehaviorAnalyzer instance
        """
        self.base_recommender = base_recommender
        self.ga4_analyzer = ga4_analyzer
        self.engagement_cache = {}
        self.journey_cache = {}
        self.trending_cache = []
        self.cache_timestamp = None
        self.cache_ttl = 3600  # 1 hour cache
        
    async def update_behavior_signals(self):
        """Update behavior signals from GA4"""
        try:
            # Fetch latest data from GA4
            self.engagement_cache = await self.ga4_analyzer.get_page_engagement_metrics()
            self.journey_cache = await self.ga4_analyzer.get_user_journey_patterns()
            self.trending_cache = await self.ga4_analyzer.get_trending_topics()
            self.cache_timestamp = datetime.now()
            
            logger.info("Updated behavior signals from GA4")
            
        except Exception as e:
            logger.error(f"Error updating behavior signals: {e}")
    
    def _is_cache_valid(self) -> bool:
        """Check if cache is still valid"""
        if not self.cache_timestamp:
            return False
        
        age = (datetime.now() - self.cache_timestamp).total_seconds()
        return age < self.cache_ttl
    
    async def get_enhanced_recommendations(
        self, 
        post_id: str, 
        num_recommendations: int = 5
    ) -> List[Dict]:
        """
        Get enhanced recommendations with GA4 signals
        
        Args:
            post_id: Current post ID
            num_recommendations: Number of recommendations
            
        Returns:
            List of enhanced recommendations
        """
        # Update cache if needed
        if not self._is_cache_valid():
            await self.update_behavior_signals()
        
        # Get base recommendations
        base_recs = self.base_recommender.get_recommendations(post_id, num_recommendations * 2)
        
        if not base_recs:
            return []
        
        # Enhance recommendations with GA4 data
        enhanced_recs = []
        for rec in base_recs:
            enhanced_rec = rec.copy()
            
            # Get post path
            post_path = f"/blog/{rec.get('id', '')}"
            
            # Add engagement score
            engagement_score = self.engagement_cache.get(post_path, 0)
            enhanced_rec['engagement_score'] = engagement_score
            
            # Check if it's trending
            is_trending = any(t['path'] == post_path for t in self.trending_cache)
            enhanced_rec['is_trending'] = is_trending
            
            # Check journey patterns
            if post_id in self.journey_cache:
                journey_relevance = any(
                    j['next_page'] == post_path 
                    for j in self.journey_cache.get(f"/blog/{post_id}", [])
                )
                enhanced_rec['journey_relevance'] = journey_relevance
            else:
                enhanced_rec['journey_relevance'] = False
            
            # Calculate final score
            base_score = rec.get('score', 0.5)
            engagement_boost = engagement_score / 100 * 0.3
            trending_boost = 0.2 if is_trending else 0
            journey_boost = 0.1 if enhanced_rec.get('journey_relevance') else 0
            
            enhanced_rec['final_score'] = min(
                base_score + engagement_boost + trending_boost + journey_boost,
                1.0
            )
            
            enhanced_recs.append(enhanced_rec)
        
        # Sort by final score and return top N
        enhanced_recs.sort(key=lambda x: x['final_score'], reverse=True)
        
        return enhanced_recs[:num_recommendations]
    
    async def get_trending_recommendations(self, limit: int = 5) -> List[Dict]:
        """
        Get trending content recommendations
        
        Args:
            limit: Number of recommendations
            
        Returns:
            List of trending recommendations
        """
        if not self._is_cache_valid():
            await self.update_behavior_signals()
        
        recommendations = []
        for topic in self.trending_cache[:limit]:
            # Extract post ID from path
            post_id = topic['path'].replace('/blog/', '').replace('/', '')
            
            # Get post details from base recommender
            post_details = self.base_recommender.get_post_details(post_id)
            
            if post_details:
                rec = {
                    'id': post_id,
                    'title': post_details.get('title', ''),
                    'excerpt': post_details.get('excerpt', ''),
                    'trend_score': topic['trend_score'],
                    'unique_users': topic['unique_users'],
                    'is_trending': True
                }
                recommendations.append(rec)
        
        return recommendations