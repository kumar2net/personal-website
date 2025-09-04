# GA4 Analytics System Documentation

**Last Updated:** September 4, 2025
**Project:** Personal Website Analytics
**GA4 Property ID:** 500563672

## 📊 Current Analytics Status

### ✅ **CONFIGURED AND WORKING**
- **Google Analytics 4:** ✅ Active and tracking
- **Global Site Tag:** ✅ Implemented in `index.html`
- **SPA Tracking:** ✅ Manual page_view events on route changes
- **Service Account:** ✅ Authenticated and working
- **API Access:** ✅ Google Analytics Data API v1 enabled

### 📈 **Current Performance Metrics (Last 30 Days)**
- **Total Users:** 36
- **Total Sessions:** 103
- **Total Page Views:** 2,280
- **Average Session Duration:** 848s (14 minutes)
- **Bounce Rate:** 6.8%
- **Pages Per Session:** 22.1

## 🎯 **Content Topic Recommendations**

### **High Priority Topics to Write About:**

#### **1. TECHNOLOGY** 
**Specific Topics:**
1. Advanced AI Development Techniques
2. Building Scalable Software Systems
3. Machine Learning Implementation Guide
4. API Development Best Practices
5. Startup Technology Stack Analysis

#### **2. TRADE & ECONOMICS**
**Specific Topics:**
1. India-US Trade Relations 2025 Update
2. Global Supply Chain Analysis
3. Emerging Market Investment Opportunities
4. Economic Policy Impact Analysis
5. Trade Technology and Digital Commerce

#### **3. PRODUCTIVITY & LEARNING**
**Specific Topics:**
1. Advanced Keyboard Shortcuts Mastery
2. Learning Technique Deep Dives
3. Workflow Automation Strategies
4. Time Management Systems
5. Knowledge Management with AI Tools

## 🔧 **Technical Implementation**

### **Files and Scripts**

#### **Core Configuration:**
- `scripts/ga4-config.mjs` - Centralized GA4 configuration
- `scripts/show-ga4-config.mjs` - Display configuration details
- `scripts/test-ga4-connection.mjs` - Test API connectivity

#### **Analytics Scripts:**
- `scripts/ga4-topic-suggestions.mjs` - Generate topic suggestions (RECOMMENDED)
- `scripts/ga4-specific-topics.mjs` - Generate specific blog post titles
- `scripts/ga4-actionable-topics.mjs` - Generate actionable content strategy
- `scripts/ga4-minimal.mjs` - Basic GA4 data extraction
- `scripts/ga-blog-topic-generator.mjs` - General topic suggestions

#### **NPM Scripts:**
```bash
npm run ga:topic-suggestions    # Generate topic suggestions (MAIN)
npm run ga:specific            # Generate specific blog titles
npm run ga:actionable          # Generate actionable strategy
npm run ga:config              # Show configuration
npm run ga:test                # Test API connection
npm run ga:all                 # Run all analytics
```

### **Output Files:**
- `docs/ga4-topic-suggestions.md` - **MAIN RECOMMENDATIONS** (Current)
- `docs/ga4-specific-topics.md` - Specific blog post titles
- `docs/ga4-actionable-topics.md` - Actionable content strategy
- `docs/ga4-minimal-topics.md` - Basic topic suggestions

## 🚀 **Recommended Workflow**

### **1. Generate Topic Suggestions (Primary)**
```bash
npm run ga:topic-suggestions
```
This generates specific topics/subjects to write about based on your GA4 data.

### **2. Generate Specific Blog Titles**
```bash
npm run ga:specific
```
This creates concrete blog post titles you can write about.

### **3. View Configuration**
```bash
npm run ga:config
```
This shows your current GA4 configuration and settings.

## 📋 **Configuration Details**

### **GA4 Property:**
- **ID:** 500563672
- **Name:** Personal Website Analytics
- **URL:** https://analytics.google.com/analytics/web/#/p500563672/reports/intelligenthome

### Verification (Tag Assistant)
- Tag Assistant connected successfully on September 3, 2025 using Connect. GTM preview links are not applicable since the site does not use a GTM container.

### GA4 → BigQuery Export Status (Sep 4, 2025)
- Dataset `analytics_12010944378` (US) exists; billing enabled.  
- Streaming + Daily export enabled for Web stream `G-HWQM1TCFWQ`.  
- Intraday tables not yet created; active monitor checks every 2 minutes.  
- If no tables after re-link + traffic, escalate to Google per support ticket template.

### **Google Cloud Project:**
- **ID:** my-project-74001686249
- **Name:** Personal Website Project

### **Service Account:**
- **Email:** kumarsemantic@my-project-74001686249.iam.gserviceaccount.com
- **API:** Google Analytics Data API v1
- **Scopes:** https://www.googleapis.com/auth/analytics.readonly

## 🔄 **Monthly Maintenance**

### **Recommended Monthly Tasks:**
1. **Run topic suggestions:** `npm run ga:topic-suggestions`
2. **Review performance metrics** in the generated reports
3. **Update content strategy** based on new data
4. **Test API connectivity:** `npm run ga:test`

### **Data Retention:**
- **Analysis Period:** Last 30 days (configurable)
- **Metrics:** Users, sessions, page views, engagement, bounce rate
- **Output:** Markdown reports with actionable insights

## 📚 **Related Documentation**

- `ANALYTICS_SYSTEM_DOCUMENTATION.md` - Detailed technical documentation
- `ANALYTICS_SETUP_GUIDE.md` - Setup instructions
- `ANALYTICS_PRODUCTION_SETUP.md` - Production deployment guide

## ✅ **Status Confirmation**

### **✅ Working Components:**
- [x] GA4 tracking implementation
- [x] Service account authentication
- [x] API data extraction
- [x] Topic suggestion generation
- [x] Specific blog title generation
- [x] Configuration management
- [x] Documentation

### **✅ Current Recommendations:**
- [x] Technology content expansion
- [x] Trade & economics analysis
- [x] Productivity & learning series
- [x] AI & machine learning applications
- [x] Business strategy content

---

**Last Updated:** September 3, 2025
**Status:** ✅ Fully Operational
**Next Review:** Monthly
