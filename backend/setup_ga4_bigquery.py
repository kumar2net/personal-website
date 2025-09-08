#!/usr/bin/env python3
"""
Automated setup script to connect GA4 to BigQuery and fetch real recommendations
"""

import os
import json
import time
from datetime import datetime, timedelta
from google.cloud import bigquery
from google.oauth2 import service_account
from google.auth.exceptions import DefaultCredentialsError
import google.auth

# GA4 Configuration from your setup
GA4_PROPERTY_ID = "12124606870"  # Your Stream ID
GA4_MEASUREMENT_ID = "G-PZ37S6E5BL"
SITE_URL = "https://kumarsite.netlify.app/"

# BigQuery Configuration
PROJECT_ID = "my-project-74001686249"  # From your backend/.env
DATASET_ID = f"analytics_{GA4_PROPERTY_ID}"  # Standard GA4 naming

def check_credentials():
    """Check if Google Cloud credentials are available"""
    try:
        # Try to get default credentials
        credentials, project = google.auth.default()
        print(f"✅ Found default credentials for project: {project}")
        return credentials, project
    except DefaultCredentialsError:
        print("❌ No default credentials found")
        print("\nTo authenticate, you need to:")
        print("1. Create a service account in Google Cloud Console")
        print("2. Download the JSON key file")
        print("3. Set GOOGLE_APPLICATION_CREDENTIALS environment variable")
        print("\nOr use: gcloud auth application-default login")
        return None, None

def check_ga4_bigquery_export(client, dataset_id):
    """Check if GA4 is exporting to BigQuery"""
    try:
        dataset_ref = client.dataset(dataset_id)
        dataset = client.get_dataset(dataset_ref)
        print(f"✅ Found BigQuery dataset: {dataset_id}")
        
        # List tables in the dataset
        tables = list(client.list_tables(dataset_id))
        
        if tables:
            print(f"📊 Found {len(tables)} tables in dataset:")
            for table in tables[:5]:  # Show first 5 tables
                print(f"   - {table.table_id}")
            
            # Check for events tables
            events_tables = [t for t in tables if 'events' in t.table_id]
            if events_tables:
                print(f"\n✅ GA4 is exporting data! Found {len(events_tables)} events tables")
                return True
            else:
                print("\n⚠️ No events tables found. GA4 export might not be configured yet.")
                return False
        else:
            print("⚠️ Dataset exists but has no tables. GA4 export might not be configured.")
            return False
            
    except Exception as e:
        print(f"❌ Dataset not found: {dataset_id}")
        print(f"   Error: {str(e)}")
        return False

def get_recent_page_views(client, dataset_id):
    """Get recent page views from GA4 BigQuery export"""
    try:
        # Query for page views in the last 7 days
        query = f"""
        SELECT
            (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_url,
            COUNT(*) as page_views,
            COUNT(DISTINCT user_pseudo_id) as unique_users,
            AVG(engagement_time_msec) / 1000 as avg_engagement_time_sec
        FROM
            `{PROJECT_ID}.{dataset_id}.events_*`
        WHERE
            _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
            AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
            AND event_name = 'page_view'
        GROUP BY
            page_url
        HAVING
            page_url IS NOT NULL
        ORDER BY
            page_views DESC
        LIMIT 20
        """
        
        print("\n📊 Querying recent page views...")
        query_job = client.query(query)
        results = query_job.result()
        
        page_data = []
        for row in results:
            page_data.append({
                'url': row.page_url,
                'views': row.page_views,
                'users': row.unique_users,
                'avg_time': round(row.avg_engagement_time_sec, 2) if row.avg_engagement_time_sec else 0
            })
        
        if page_data:
            print(f"\n✅ Found data for {len(page_data)} pages!")
            print("\n🔥 Top 5 Most Viewed Pages (Last 7 Days):")
            for i, page in enumerate(page_data[:5], 1):
                # Extract path from URL
                path = page['url'].replace(SITE_URL, '/') if page['url'].startswith(SITE_URL) else page['url']
                print(f"\n{i}. {path}")
                print(f"   Views: {page['views']} | Users: {page['users']} | Avg Time: {page['avg_time']}s")
            
            return page_data
        else:
            print("⚠️ No page view data found in the last 7 days")
            return []
            
    except Exception as e:
        print(f"❌ Error querying BigQuery: {str(e)}")
        return []

def get_user_journeys(client, dataset_id):
    """Get user journey patterns from GA4 data"""
    try:
        query = f"""
        WITH user_sessions AS (
            SELECT
                user_pseudo_id,
                (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_url,
                event_timestamp,
                LAG((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location')) 
                    OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp) as previous_page
            FROM
                `{PROJECT_ID}.{dataset_id}.events_*`
            WHERE
                _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
                AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
                AND event_name = 'page_view'
        )
        SELECT
            previous_page,
            page_url as next_page,
            COUNT(*) as transition_count
        FROM
            user_sessions
        WHERE
            previous_page IS NOT NULL
            AND page_url IS NOT NULL
            AND previous_page != page_url
        GROUP BY
            previous_page, next_page
        HAVING
            transition_count > 1
        ORDER BY
            transition_count DESC
        LIMIT 20
        """
        
        print("\n🔄 Analyzing user journey patterns...")
        query_job = client.query(query)
        results = query_job.result()
        
        journeys = []
        for row in results:
            journeys.append({
                'from': row.previous_page,
                'to': row.next_page,
                'count': row.transition_count
            })
        
        if journeys:
            print(f"\n✅ Found {len(journeys)} journey patterns!")
            print("\n🚶 Top User Journeys:")
            for j in journeys[:5]:
                from_path = j['from'].replace(SITE_URL, '/') if j['from'].startswith(SITE_URL) else j['from']
                to_path = j['to'].replace(SITE_URL, '/') if j['to'].startswith(SITE_URL) else j['to']
                print(f"   {from_path} → {to_path} ({j['count']} users)")
        
        return journeys
    except Exception as e:
        print(f"❌ Error analyzing journeys: {str(e)}")
        return []

def generate_recommendations(page_data, journeys):
    """Generate recommendations based on real GA4 data"""
    print("\n🧠 Generating AI-Powered Recommendations...")
    
    recommendations = {}
    
    # Create recommendations based on user journeys
    for journey in journeys:
        from_page = journey['from'].replace(SITE_URL, '/')
        to_page = journey['to'].replace(SITE_URL, '/')
        
        if '/blog/' in from_page and '/blog/' in to_page:
            if from_page not in recommendations:
                recommendations[from_page] = []
            
            # Find page data for the recommendation
            page_info = next((p for p in page_data if to_page in p['url']), None)
            
            recommendations[from_page].append({
                'url': to_page,
                'score': journey['count'] / 100.0,  # Normalize score
                'reason': f"{journey['count']} users navigated here",
                'engagement': page_info['avg_time'] if page_info else 0
            })
    
    # Sort recommendations by score
    for page in recommendations:
        recommendations[page] = sorted(
            recommendations[page], 
            key=lambda x: x['score'], 
            reverse=True
        )[:5]  # Top 5 recommendations
    
    return recommendations

def update_recommendation_service(page_data, recommendations):
    """Update the frontend recommendation service with real data"""
    
    # Create enhanced data for the frontend
    enhanced_data = {
        'timestamp': datetime.now().isoformat(),
        'source': 'GA4_BigQuery',
        'trending_posts': [],
        'recommendations': recommendations,
        'engagement_metrics': {}
    }
    
    # Add trending posts based on real views
    for page in page_data[:10]:  # Top 10 trending
        path = page['url'].replace(SITE_URL, '/')
        if '/blog/' in path:
            post_id = path.replace('/blog/', '').replace('/', '')
            enhanced_data['trending_posts'].append({
                'id': post_id,
                'path': path,
                'views': page['views'],
                'users': page['users'],
                'engagement_time': page['avg_time'],
                'trend_score': page['views'] * 0.7 + page['users'] * 0.3
            })
    
    # Add engagement metrics
    for page in page_data:
        path = page['url'].replace(SITE_URL, '/')
        enhanced_data['engagement_metrics'][path] = {
            'views': page['views'],
            'users': page['users'],
            'avg_time': page['avg_time']
        }
    
    # Save to JSON file for the frontend to use
    output_file = '/workspace/src/data/ga4-recommendations.json'
    with open(output_file, 'w') as f:
        json.dump(enhanced_data, f, indent=2)
    
    print(f"\n✅ Saved GA4 recommendations to: {output_file}")
    print(f"   - {len(enhanced_data['trending_posts'])} trending posts")
    print(f"   - {len(recommendations)} pages with recommendations")
    print(f"   - {len(enhanced_data['engagement_metrics'])} pages with metrics")
    
    return enhanced_data

def main():
    """Main execution flow"""
    print("=" * 60)
    print("🚀 GA4 to BigQuery Real Recommendations Setup")
    print("=" * 60)
    
    # Step 1: Check credentials
    credentials, project = check_credentials()
    if not credentials:
        print("\n⚠️ Please set up authentication first")
        return
    
    # Use the project from credentials or our configured one
    project_id = project or PROJECT_ID
    
    # Step 2: Initialize BigQuery client
    try:
        client = bigquery.Client(project=project_id, credentials=credentials)
        print(f"\n✅ Connected to BigQuery project: {project_id}")
    except Exception as e:
        print(f"❌ Failed to connect to BigQuery: {str(e)}")
        return
    
    # Step 3: Check GA4 BigQuery export
    dataset_id = DATASET_ID
    export_exists = check_ga4_bigquery_export(client, dataset_id)
    
    if not export_exists:
        print("\n📝 GA4 BigQuery Export Setup Required:")
        print("1. Go to GA4 Admin → BigQuery Links")
        print(f"2. Link to project: {project_id}")
        print(f"3. Your GA4 Property ID: {GA4_PROPERTY_ID}")
        print(f"4. Measurement ID: {GA4_MEASUREMENT_ID}")
        print("5. Choose 'Daily' export (free tier)")
        print("\n⏰ Note: First data export happens within 24 hours")
        
        # Try alternative dataset names
        alt_dataset = f"analytics_{GA4_MEASUREMENT_ID.replace('G-', '').lower()}"
        print(f"\n🔍 Checking alternative dataset name: {alt_dataset}")
        if check_ga4_bigquery_export(client, alt_dataset):
            dataset_id = alt_dataset
            export_exists = True
    
    if export_exists:
        # Step 4: Get real page view data
        page_data = get_recent_page_views(client, dataset_id)
        
        # Step 5: Get user journey patterns
        journeys = get_user_journeys(client, dataset_id)
        
        # Step 6: Generate recommendations
        if page_data:
            recommendations = generate_recommendations(page_data, journeys)
            
            # Step 7: Update frontend service
            enhanced_data = update_recommendation_service(page_data, recommendations)
            
            print("\n" + "=" * 60)
            print("🎉 SUCCESS! Real GA4 data integrated!")
            print("=" * 60)
            print("\n📊 Summary:")
            print(f"   - Analyzed {len(page_data)} pages")
            print(f"   - Found {len(journeys)} user journey patterns")
            print(f"   - Generated recommendations for {len(recommendations)} pages")
            print("\n🚀 Next Steps:")
            print("1. The /reco page will now show REAL trending data")
            print("2. Recommendations based on ACTUAL user behavior")
            print("3. Data updates daily from GA4")
        else:
            print("\n⚠️ No data available yet. This could mean:")
            print("1. GA4 export was just set up (wait 24 hours)")
            print("2. No traffic in the last 7 days")
            print("3. Data is still processing")
    
    print("\n✨ Setup complete!")

if __name__ == "__main__":
    main()