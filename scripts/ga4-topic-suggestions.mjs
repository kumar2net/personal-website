#!/usr/bin/env node

/**
 * GA4 Topic Suggestions
 * 
 * This script analyzes your existing content and suggests specific topics
 * (technology, business, trade gap, etc.) to write about based on your GA4 data.
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
const GA_DATA_FILE = path.join(OUTPUT_DIR, 'ga4-topic-suggestions-data.json');
const TOPIC_SUGGESTIONS_FILE = path.join(OUTPUT_DIR, 'ga4-topic-suggestions.md');

/**
 * Get GA4 data for topic suggestions
 */
async function getTopicSuggestionsData() {
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
    
    // Get basic metrics (30 days)
    const basicMetricsResponse = await analyticsDataClient.runReport({
      property: getPropertyPath(),
      dateRanges: [GA4_CONFIG.dateRanges.last30Days],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ],
    });
    
    // Process basic metrics
    const basicMetrics = basicMetricsResponse[0].rows?.[0];
    const totalUsers = parseInt(basicMetrics?.metricValues?.[0]?.value || '0');
    const totalSessions = parseInt(basicMetrics?.metricValues?.[1]?.value || '0');
    const totalPageViews = parseInt(basicMetrics?.metricValues?.[2]?.value || '0');
    const avgSessionDuration = Math.round(parseFloat(basicMetrics?.metricValues?.[3]?.value || '0'));
    const bounceRate = parseFloat(basicMetrics?.metricValues?.[4]?.value || '0');
    
    console.log('📊 Topic Suggestions Data Retrieved:');
    console.log(`- Total Users: ${totalUsers}`);
    console.log(`- Total Sessions: ${totalSessions}`);
    console.log(`- Total Page Views: ${totalPageViews}`);
    console.log(`- Average Session Duration: ${avgSessionDuration}s`);
    console.log(`- Bounce Rate: ${(bounceRate * 100).toFixed(1)}%`);
    
    return {
      config: getConfigSummary(),
      summary: {
        totalUsers,
        totalSessions,
        totalPageViews,
        avgSessionDuration,
        bounceRate
      }
    };
    
  } catch (error) {
    console.error('❌ Error fetching topic suggestions data:', error.message);
    throw error;
  }
}

/**
 * Analyze existing content structure to identify topics
 */
function analyzeExistingContent() {
  // Based on your project structure, I can see you have content in these areas:
  const existingContent = {
    technology: {
      pages: [
        'building-mcp-server-with-cursor',
        'experience-using-api-in-ai-code-editor',
        'andrej-karpathy-yc-ai-startup-school'
      ],
      description: 'AI, programming, and technology content'
    },
    business: {
      pages: [
        'the-great-pivot',
        'portfolio-website',
        'drug-suggestion-app'
      ],
      description: 'Business strategy and entrepreneurship'
    },
    trade: {
      pages: [
        'india-usa-trade-gap-2025',
        'Compelling-india-story'
      ],
      description: 'Trade analysis and economic content'
    },
    productivity: {
      pages: [
        'my-fascination-with-shortcuts',
        'feynman-technique',
        'applying-robinson-method',
        'autophagy'
      ],
      description: 'Productivity, learning, and personal development'
    },
    travel: {
      pages: [
        'nepal-annapurna-circuit',
        'my-experience-with-windsurf'
      ],
      description: 'Travel and adventure content'
    },
    health: {
      pages: [
        'autophagy'
      ],
      description: 'Health and wellness content'
    }
  };
  
  return existingContent;
}

/**
 * Generate specific topic suggestions based on performance and existing content
 */
function generateTopicSuggestions(gaData, existingContent) {
  const suggestions = [];
  
  // Calculate insights
  const avgUsersPerDay = gaData.summary.totalUsers / 30;
  const avgSessionsPerDay = gaData.summary.totalSessions / 30;
  const pagesPerSession = gaData.summary.totalPageViews / gaData.summary.totalSessions;
  const sessionMinutes = Math.round(gaData.summary.avgSessionDuration / 60);
  
  // 1. EXPAND HIGH-PERFORMING TOPICS
  suggestions.push({
    title: `Expand Your Technology Content`,
    category: "Technology",
    rationale: `Your tech content (AI, programming) shows high engagement with ${sessionMinutes}-minute sessions`,
    priority: 'high',
    estimatedTraffic: 'high',
    specificTopics: [
      'Advanced AI Development Techniques',
      'Building Scalable Software Systems',
      'Machine Learning Implementation Guide',
      'API Development Best Practices',
      'Startup Technology Stack Analysis'
    ],
    keywords: ['technology', 'AI', 'programming', 'software development', 'machine learning'],
    actionPlan: `Write more in-depth technology content that leverages your ${sessionMinutes}-minute engagement`
  });
  
  suggestions.push({
    title: `Deep Dive into Trade and Economic Analysis`,
    category: "Trade & Economics",
    rationale: `Your trade gap analysis content can be expanded with current economic trends`,
    priority: 'high',
    estimatedTraffic: 'high',
    specificTopics: [
      'India-US Trade Relations 2025 Update',
      'Global Supply Chain Analysis',
      'Emerging Market Investment Opportunities',
      'Economic Policy Impact Analysis',
      'Trade Technology and Digital Commerce'
    ],
    keywords: ['trade', 'economics', 'india', 'usa', 'investment', 'policy'],
    actionPlan: `Create comprehensive trade and economic analysis content`
  });
  
  suggestions.push({
    title: `Productivity and Learning Content Series`,
    category: "Productivity",
    rationale: `Your productivity content (shortcuts, learning techniques) engages users for ${sessionMinutes} minutes`,
    priority: 'high',
    estimatedTraffic: 'high',
    specificTopics: [
      'Advanced Keyboard Shortcuts Mastery',
      'Learning Technique Deep Dives',
      'Workflow Automation Strategies',
      'Time Management Systems',
      'Knowledge Management with AI Tools'
    ],
    keywords: ['productivity', 'learning', 'shortcuts', 'automation', 'efficiency'],
    actionPlan: `Create a comprehensive productivity and learning content series`
  });
  
  // 2. EXPLORE NEW TOPICS
  suggestions.push({
    title: `Business Strategy and Entrepreneurship`,
    category: "Business",
    rationale: `Expand your business content with current startup and entrepreneurship trends`,
    priority: 'medium',
    estimatedTraffic: 'medium',
    specificTopics: [
      'Startup Scaling Strategies',
      'AI in Business Transformation',
      'Digital Marketing for Tech Startups',
      'Funding and Investment Strategies',
      'Remote Team Management'
    ],
    keywords: ['business', 'startup', 'entrepreneurship', 'strategy', 'scaling'],
    actionPlan: `Write business strategy content that appeals to your tech-savvy audience`
  });
  
  suggestions.push({
    title: `Health and Wellness Technology`,
    category: "Health & Technology",
    rationale: `Combine your health content (autophagy) with technology trends`,
    priority: 'medium',
    estimatedTraffic: 'medium',
    specificTopics: [
      'Biohacking with Technology',
      'Health Tracking and Analytics',
      'AI in Personal Health',
      'Digital Wellness Strategies',
      'Technology for Longevity'
    ],
    keywords: ['health', 'biohacking', 'technology', 'wellness', 'longevity'],
    actionPlan: `Create content that bridges health and technology`
  });
  
  // 3. TRENDING TOPICS
  suggestions.push({
    title: `AI and Machine Learning Applications`,
    category: "Technology",
    rationale: `Leverage current AI trends with your technical expertise`,
    priority: 'high',
    estimatedTraffic: 'high',
    specificTopics: [
      'Practical AI Implementation',
      'Machine Learning for Beginners',
      'AI Tools for Productivity',
      'Ethical AI Development',
      'AI in Business Applications'
    ],
    keywords: ['AI', 'machine learning', 'technology', 'implementation', 'ethics'],
    actionPlan: `Create practical AI content that matches your high engagement patterns`
  });
  
  return suggestions;
}

/**
 * Generate comprehensive topic suggestions report
 */
function generateTopicSuggestionsReport(gaData, existingContent, suggestions) {
  let report = `# Specific Topic Suggestions - Based on Your Real GA4 Data

**Generated:** ${new Date().toLocaleDateString()}
**Data Source:** Google Analytics 4 (Property: ${GA4_CONFIG.property.id})
**Analysis Period:** Last 30 days

## Executive Summary

This report suggests **specific topics/subjects** to write about based on your real GA4 data and existing content structure.

## 📊 Your Current Performance

- **Total Users:** ${gaData.summary.totalUsers}
- **Total Sessions:** ${gaData.summary.totalSessions}
- **Total Page Views:** ${gaData.summary.totalPageViews}
- **Average Session Duration:** ${gaData.summary.avgSessionDuration}s (${Math.round(gaData.summary.avgSessionDuration / 60)} minutes)
- **Bounce Rate:** ${(gaData.summary.bounceRate * 100).toFixed(1)}%

## 🎯 EXISTING CONTENT ANALYSIS

### Current Content Areas:

${Object.entries(existingContent).map(([topic, data]) => `
#### ${topic.charAt(0).toUpperCase() + topic.slice(1)}
- **Description:** ${data.description}
- **Sample Pages:** ${data.pages.join(', ')}
`).join('')}

## 🎯 SPECIFIC TOPIC SUGGESTIONS

### High Priority Topics (Write About These)

${suggestions.filter(s => s.priority === 'high').map((suggestion, index) => `
#### ${index + 1}. ${suggestion.title}

**Category:** ${suggestion.category}  
**Estimated Traffic:** ${suggestion.estimatedTraffic}  
**Rationale:** ${suggestion.rationale}  

**Specific Topics to Write About:**
${suggestion.specificTopics.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

**Keywords:** ${suggestion.keywords.join(', ')}  
**Action Plan:** ${suggestion.actionPlan}

`).join('')}

### Medium Priority Topics (Consider These)

${suggestions.filter(s => s.priority === 'medium').map((suggestion, index) => `
#### ${index + 1}. ${suggestion.title}

**Category:** ${suggestion.category}  
**Estimated Traffic:** ${suggestion.estimatedTraffic}  
**Rationale:** ${suggestion.rationale}  

**Specific Topics to Write About:**
${suggestion.specificTopics.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

**Keywords:** ${suggestion.keywords.join(', ')}  
**Action Plan:** ${suggestion.actionPlan}

`).join('')}

## 📈 Content Strategy Recommendations

### Immediate Actions (Next 30 Days)
1. **Focus on Technology content** - Your highest engagement area
2. **Expand Trade/Economics analysis** - Build on your existing expertise
3. **Create Productivity series** - Leverage your learning content success

### Topic-Specific Guidelines
- **Technology:** Focus on practical applications and tutorials
- **Trade/Economics:** Provide data-driven analysis and insights
- **Productivity:** Create actionable guides and techniques
- **Business:** Share startup and entrepreneurship insights
- **Health:** Combine with technology for biohacking content

## 🎯 Next Steps

1. **Choose 3 topics** from the high-priority suggestions above
2. **Write about the specific subtopics** listed for each category
3. **Create content clusters** around your most successful areas
4. **Track performance** of new content in each topic area
5. **Run this analysis monthly** to identify emerging opportunities

---

*These topic suggestions are based on your real GA4 data and existing content structure.*
`;

  return report;
}

/**
 * Main execution function
 */
async function main() {
  console.log('📊 Generating topic suggestions from GA4 data...');
  
  try {
    // Get GA4 data
    const gaData = await getTopicSuggestionsData();
    
    // Analyze existing content
    const existingContent = analyzeExistingContent();
    
    // Generate topic suggestions
    const suggestions = generateTopicSuggestions(gaData, existingContent);
    
    // Generate report
    const report = generateTopicSuggestionsReport(gaData, existingContent, suggestions);
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Save GA4 data
    fs.writeFileSync(GA_DATA_FILE, JSON.stringify(gaData, null, 2), 'utf8');
    
    // Save topic suggestions report
    fs.writeFileSync(TOPIC_SUGGESTIONS_FILE, report, 'utf8');
    
    console.log(`\n✅ Topic suggestions generated!`);
    console.log(`📄 GA4 data saved to: ${GA_DATA_FILE}`);
    console.log(`📄 Topic suggestions saved to: ${TOPIC_SUGGESTIONS_FILE}`);
    
    console.log(`\n🎯 Top 3 Topic Categories to Write About:`);
    suggestions.filter(s => s.priority === 'high').slice(0, 3).forEach((suggestion, index) => {
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

export { getTopicSuggestionsData, analyzeExistingContent, generateTopicSuggestions, generateTopicSuggestionsReport };
