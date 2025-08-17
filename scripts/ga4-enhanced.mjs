#!/usr/bin/env node

/**
 * Enhanced GA4 Data Extractor
 * 
 * This script extracts detailed GA4 data using only working API calls
 * to generate specific, actionable blog topic suggestions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { 
  GA4_CONFIG, 
  getPropertyPath, 
  getServiceAccountCredentials, 
  validateConfig,
  printConfig,
  getConfigSummary
} from './ga4-config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', GA4_CONFIG.output.directory);
const GA_DATA_FILE = path.join(OUTPUT_DIR, 'ga4-enhanced-data.json');
const TOPIC_SUGGESTIONS_FILE = path.join(OUTPUT_DIR, 'ga4-enhanced-topics.md');

/**
 * Get enhanced GA4 data using working API calls
 */
async function getEnhancedGA4Data() {
  try {
    console.log('🔐 Authenticating with Google Analytics Data API...');
    
    // Validate configuration
    validateConfig();
    printConfig();
    
    // Get service account credentials
    const credentials = getServiceAccountCredentials();
    
    // Initialize the Analytics Data client with credentials
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: credentials,
      projectId: credentials.project_id
    });
    
    console.log('✅ Connected to GA4 Data API successfully');
    
    // Get basic metrics (this works from our test)
    const basicMetricsResponse = await analyticsDataClient.runReport({
      property: getPropertyPath(),
      dateRanges: [GA4_CONFIG.dateRanges.last30Days],
      metrics: GA4_CONFIG.metrics.basic,
    });
    
    // Get users by day for the last 7 days
    const dailyUsersResponse = await analyticsDataClient.runReport({
      property: getPropertyPath(),
      dateRanges: [GA4_CONFIG.dateRanges.last7Days],
      dimensions: [
        { name: 'date' },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
      ],
    });
    
    // Get top pages (simplified - just page path)
    const topPagesResponse = await analyticsDataClient.runReport({
      property: getPropertyPath(),
      dateRanges: [GA4_CONFIG.dateRanges.last30Days],
      dimensions: [
        { name: 'pagePath' },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'uniquePageviews' },
      ],
      limit: 10,
      orderBys: [
        {
          metric: { metricName: 'screenPageViews' },
          desc: true,
        },
      ],
    });
    
    // Get traffic sources (simplified)
    const trafficSourcesResponse = await analyticsDataClient.runReport({
      property: getPropertyPath(),
      dateRanges: [GA4_CONFIG.dateRanges.last30Days],
      dimensions: [
        { name: 'sessionDefaultChannelGroup' },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
      ],
    });
    
    // Process basic metrics
    const basicMetrics = basicMetricsResponse[0].rows?.[0];
    const totalUsers = parseInt(basicMetrics?.metricValues?.[0]?.value || '0');
    const totalSessions = parseInt(basicMetrics?.metricValues?.[1]?.value || '0');
    const totalPageViews = parseInt(basicMetrics?.metricValues?.[2]?.value || '0');
    const avgSessionDuration = Math.round(parseFloat(basicMetrics?.metricValues?.[3]?.value || '0'));
    const bounceRate = parseFloat(basicMetrics?.metricValues?.[4]?.value || '0');
    
    // Process daily data
    const dailyData = dailyUsersResponse[0].rows?.map(row => ({
      date: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
      sessions: parseInt(row.metricValues[1].value)
    })) || [];
    
    // Process top pages
    const topPages = topPagesResponse[0].rows?.map(row => ({
      pagePath: row.dimensionValues[0].value,
      title: row.dimensionValues[0].value.split('/').pop() || 'Home',
      pageViews: parseInt(row.metricValues[0].value),
      uniquePageViews: parseInt(row.metricValues[1].value)
    })) || [];
    
    // Process traffic sources
    const trafficSources = trafficSourcesResponse[0].rows?.map(row => ({
      source: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
      users: parseInt(row.metricValues[1].value)
    })) || [];
    
    console.log('📊 Enhanced GA4 Data Retrieved:');
    console.log(`- Total Users (30 days): ${totalUsers}`);
    console.log(`- Total Sessions (30 days): ${totalSessions}`);
    console.log(`- Total Page Views (30 days): ${totalPageViews}`);
    console.log(`- Average Session Duration: ${avgSessionDuration}s`);
    console.log(`- Bounce Rate: ${(bounceRate * 100).toFixed(1)}%`);
    console.log(`- Daily data points: ${dailyData.length}`);
    console.log(`- Top pages analyzed: ${topPages.length}`);
    console.log(`- Traffic sources: ${trafficSources.length}`);
    
    // Calculate some insights
    const avgUsersPerDay = totalUsers / 30;
    const avgSessionsPerDay = totalSessions / 30;
    const pagesPerSession = totalPageViews / totalSessions;
    
    return {
      config: getConfigSummary(),
      summary: {
        totalUsers,
        totalSessions,
        totalPageViews,
        avgSessionDuration,
        bounceRate,
        avgUsersPerDay,
        avgSessionsPerDay,
        pagesPerSession
      },
      dailyData,
      topPages,
      trafficSources,
      insights: {
        engagementLevel: avgSessionDuration > 180 ? 'high' : avgSessionDuration > 60 ? 'medium' : 'low',
        trafficVolume: totalUsers > 1000 ? 'high' : totalUsers > 100 ? 'medium' : 'low',
        retentionRate: bounceRate < 0.4 ? 'good' : bounceRate < 0.6 ? 'average' : 'needs improvement'
      }
    };
    
  } catch (error) {
    console.error('❌ Error fetching GA4 data:', error.message);
    throw error;
  }
}

/**
 * Generate specific, actionable blog topic suggestions based on real GA4 data
 */
function generateEnhancedTopicSuggestions(gaData) {
  const suggestions = [];
  
  // 1. TOP PERFORMING CONTENT EXPANSION
  if (gaData.topPages && gaData.topPages.length > 0) {
    const topPage = gaData.topPages[0];
    const secondPage = gaData.topPages[1];
    
    // Expand on your most popular content
    suggestions.push({
      title: `"${topPage.title}": Advanced Techniques and Deep Dive`,
      category: "Content Expansion",
      rationale: `Your top page "${topPage.title}" gets ${topPage.pageViews} views`,
      priority: 'high',
      estimatedTraffic: 'high',
      keywords: ['advanced techniques', 'deep dive', 'tutorial'],
      specificData: `Based on ${topPage.pageViews} page views`
    });
    
    // Create a series from top content
    if (secondPage) {
      suggestions.push({
        title: `"${topPage.title}" vs "${secondPage.title}": Comprehensive Comparison`,
        category: "Content Series",
        rationale: `Compare your two top performers: ${topPage.pageViews} vs ${secondPage.pageViews} views`,
        priority: 'high',
        estimatedTraffic: 'high',
        keywords: ['comparison', 'analysis', 'versus'],
        specificData: `Top 2 pages: ${topPage.pageViews} and ${secondPage.pageViews} views respectively`
      });
    }
  }
  
  // 2. TRAFFIC SOURCE OPTIMIZATION
  if (gaData.trafficSources && gaData.trafficSources.length > 0) {
    const topSource = gaData.trafficSources[0];
    const googleSource = gaData.trafficSources.find(s => s.source.toLowerCase().includes('google'));
    
    if (googleSource) {
      suggestions.push({
        title: `SEO Mastery: How Google Drives ${googleSource.sessions} Sessions to Your Site`,
        category: "SEO & Marketing",
        rationale: `Google brings ${googleSource.sessions} sessions`,
        priority: 'high',
        estimatedTraffic: 'high',
        keywords: ['SEO', 'google traffic', 'search optimization'],
        specificData: `Google traffic: ${googleSource.sessions} sessions`
      });
    }
    
    if (topSource.source.toLowerCase().includes('direct')) {
      suggestions.push({
        title: `Building Direct Traffic: ${topSource.sessions} Sessions from Brand Recognition`,
        category: "Brand Building",
        rationale: `Direct traffic accounts for ${topSource.sessions} sessions`,
        priority: 'medium',
        estimatedTraffic: 'medium',
        keywords: ['brand building', 'direct traffic', 'loyalty'],
        specificData: `Direct traffic: ${topSource.sessions} sessions`
      });
    }
  }
  
  // 3. ENGAGEMENT-BASED SUGGESTIONS
  if (gaData.summary.avgSessionDuration > 600) {
    suggestions.push({
      title: `Creating ${Math.round(gaData.summary.avgSessionDuration / 60)}-Minute Engaging Content`,
      category: "Content Creation",
      rationale: `Your audience stays for ${gaData.summary.avgSessionDuration}s (${Math.round(gaData.summary.avgSessionDuration / 60)} minutes)`,
      priority: 'high',
      estimatedTraffic: 'high',
      keywords: ['long-form content', 'engagement', 'time on site'],
      specificData: `Average session duration: ${gaData.summary.avgSessionDuration}s`
    });
  }
  
  if (gaData.summary.pagesPerSession > 10) {
    suggestions.push({
      title: `Content Clusters That Drive ${gaData.summary.pagesPerSession.toFixed(0)} Page Views Per Session`,
      category: "Content Strategy",
      rationale: `Users view ${gaData.summary.pagesPerSession.toFixed(1)} pages per session`,
      priority: 'high',
      estimatedTraffic: 'high',
      keywords: ['content clusters', 'internal linking', 'user journey'],
      specificData: `Pages per session: ${gaData.summary.pagesPerSession.toFixed(1)}`
    });
  }
  
  // 4. PERFORMANCE IMPROVEMENT
  if (gaData.summary.bounceRate < 0.1) {
    suggestions.push({
      title: `Maintaining Your ${(gaData.summary.bounceRate * 100).toFixed(1)}% Bounce Rate: What's Working`,
      category: "Performance Analysis",
      rationale: `Exceptional ${(gaData.summary.bounceRate * 100).toFixed(1)}% bounce rate shows high engagement`,
      priority: 'medium',
      estimatedTraffic: 'medium',
      keywords: ['bounce rate', 'engagement', 'performance'],
      specificData: `Bounce rate: ${(gaData.summary.bounceRate * 100).toFixed(1)}%`
    });
  }
  
  // 5. GROWTH OPPORTUNITIES
  suggestions.push({
    title: `Scaling from ${gaData.summary.totalUsers} to 1000+ Monthly Users`,
    category: "Growth Strategy",
    rationale: `Current ${gaData.summary.totalUsers} users with ${gaData.summary.totalSessions} sessions`,
    priority: 'high',
    estimatedTraffic: 'high',
    keywords: ['growth strategy', 'user acquisition', 'scaling'],
    specificData: `Current: ${gaData.summary.totalUsers} users, ${gaData.summary.totalSessions} sessions`
  });
  
  return suggestions;
}

/**
 * Generate comprehensive report
 */
function generateEnhancedReport(gaData, suggestions) {
  let report = `# Enhanced GA4 Data Analysis - Actionable Blog Topics

**Generated:** ${new Date().toLocaleDateString()}
**Data Source:** Google Analytics 4 (Property: ${GA4_CONFIG.property.id})
**Analysis Period:** Last 30 days

## Executive Summary

This report provides **specific, actionable blog topic suggestions** based on real Google Analytics 4 data from your website.

## 📊 Key Performance Metrics

### Overall Performance (30 Days)
- **Total Users:** ${gaData.summary.totalUsers}
- **Total Sessions:** ${gaData.summary.totalSessions}
- **Total Page Views:** ${gaData.summary.totalPageViews}
- **Average Session Duration:** ${gaData.summary.avgSessionDuration}s (${Math.round(gaData.summary.avgSessionDuration / 60)} minutes)
- **Bounce Rate:** ${(gaData.summary.bounceRate * 100).toFixed(1)}%
- **Pages Per Session:** ${gaData.summary.pagesPerSession.toFixed(1)}

### Daily Averages
- **Average Users Per Day:** ${gaData.summary.avgUsersPerDay.toFixed(1)}
- **Average Sessions Per Day:** ${gaData.summary.avgSessionsPerDay.toFixed(1)}

## 🎯 Top Performing Content

${gaData.topPages && gaData.topPages.length > 0 ? gaData.topPages.slice(0, 5).map((page, index) => 
  `${index + 1}. **${page.title}** (${page.pageViews} views, ${page.uniquePageViews} unique views)`
).join('\n') : 'No page data available'}

## 📱 Traffic Sources

${gaData.trafficSources && gaData.trafficSources.length > 0 ? gaData.trafficSources.map(source => 
  `- **${source.source}:** ${source.sessions} sessions, ${source.users} users`
).join('\n') : 'No traffic source data available'}

## 📅 Daily Trends (Last 7 Days)

${gaData.dailyData.map(day => 
  `- **${day.date}:** ${day.users} users, ${day.sessions} sessions`
).join('\n')}

## 🎯 SPECIFIC BLOG TOPIC SUGGESTIONS

### High Priority Topics (Write These First)

${suggestions.filter(s => s.priority === 'high').map((suggestion, index) => `
#### ${index + 1}. ${suggestion.title}

**Category:** ${suggestion.category}  
**Estimated Traffic:** ${suggestion.estimatedTraffic}  
**Data-Driven Rationale:** ${suggestion.rationale}  
**Specific Metrics:** ${suggestion.specificData}  
**Target Keywords:** ${suggestion.keywords.join(', ')}

**Why Write This:** ${suggestion.rationale}

`).join('')}

### Medium Priority Topics (Plan for Later)

${suggestions.filter(s => s.priority === 'medium').map((suggestion, index) => `
#### ${index + 1}. ${suggestion.title}

**Category:** ${suggestion.category}  
**Estimated Traffic:** ${suggestion.estimatedTraffic}  
**Data-Driven Rationale:** ${suggestion.rationale}  
**Specific Metrics:** ${suggestion.specificData}  
**Target Keywords:** ${suggestion.keywords.join(', ')}

**Why Write This:** ${suggestion.rationale}

`).join('')}

## 📈 Content Strategy Recommendations

### Immediate Actions (Next 30 Days)
1. **Write about your top-performing content** - Expand on what's already working
2. **Optimize for your primary traffic source** - Focus on ${gaData.trafficSources && gaData.trafficSources[0] ? gaData.trafficSources[0].source : 'your main traffic source'}
3. **Create content that matches your engagement patterns** - ${Math.round(gaData.summary.avgSessionDuration / 60)}-minute reading time

### Content Creation Guidelines
- **Length:** Aim for ${Math.round(gaData.summary.avgSessionDuration / 60)}-minute reading time (matches your ${gaData.summary.avgSessionDuration}s session duration)
- **Depth:** Create content that encourages ${gaData.summary.pagesPerSession.toFixed(0)}+ page views per session
- **Engagement:** Maintain your exceptional ${(gaData.summary.bounceRate * 100).toFixed(1)}% bounce rate

### SEO Opportunities
- Target keywords related to your top-performing pages
- Create content clusters around your most successful topics
- Optimize for your primary traffic source patterns

## 🎯 Next Steps

1. **Choose 3 high-priority topics** from the suggestions above
2. **Create a content calendar** for the next 30 days
3. **Track performance** of new content against these metrics
4. **Run this analysis monthly** to get fresh topic suggestions

---

*This report is based on real GA4 data from your website. Each topic suggestion is backed by specific metrics and user behavior data.*
`;

  return report;
}

/**
 * Main execution function
 */
async function main() {
  console.log('📊 Extracting enhanced Google Analytics 4 data...');
  
  try {
    // Get enhanced GA4 data
    const gaData = await getEnhancedGA4Data();
    
    // Generate topic suggestions
    const suggestions = generateEnhancedTopicSuggestions(gaData);
    
    // Generate report
    const report = generateEnhancedReport(gaData, suggestions);
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Save GA4 data
    fs.writeFileSync(GA_DATA_FILE, JSON.stringify(gaData, null, 2), 'utf8');
    
    // Save topic suggestions report
    fs.writeFileSync(TOPIC_SUGGESTIONS_FILE, report, 'utf8');
    
    console.log(`\n✅ Enhanced GA4 data analysis completed!`);
    console.log(`📄 GA4 data saved to: ${GA_DATA_FILE}`);
    console.log(`📄 Topic suggestions saved to: ${TOPIC_SUGGESTIONS_FILE}`);
    
    console.log(`\n🎯 Top 3 Data-Driven Suggestions:`);
    suggestions.slice(0, 3).forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.title}`);
    });
    
  } catch (error) {
    console.error('❌ Error in main execution:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { getEnhancedGA4Data, generateEnhancedTopicSuggestions, generateEnhancedReport };
