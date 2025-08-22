# Content Badges System

This system automatically shows "NEW" and "UPDATED" badges on content based on system dates.

## How It Works

### NEW Badge (Red)
- Shows on content published within the last 7 days
- Automatically expires after 7 days
- Position: Top-right corner of content cards

### UPDATED Badge (Blue)
- Shows on content modified within the last 30 days (but older than 7 days)
- Only shows if `lastModified` date is different from `publishDate`
- Automatically expires after 30 days
- Position: Top-right corner of content cards

## Usage

### For Blog Posts
Add `lastModified` property to blog posts in `src/pages/Blog.jsx`:

```javascript
{
  title: 'Your Post Title',
  date: 'August 7, 2025',           // Publication date
  lastModified: 'August 8, 2025',   // Last update date (optional)
  // ... other properties
}
```

### For Books
Add ContentBadge component to book cards in `src/pages/Books.jsx`:

```jsx
<ContentBadge 
  publishDate="July 15, 2025"
  lastModified="July 15, 2025"  // Optional - defaults to publishDate
/>
```

### For Other Pages
Import and use the ContentBadge component:

```jsx
import ContentBadge from '../components/ContentBadge';

<ContentBadge 
  publishDate="Your publish date"
  lastModified="Your last modified date"
/>
```

## Date Format
Use the format: `"Month DD, YYYY"` (e.g., "August 8, 2025")

## Auto-Expiration
Badges automatically disappear based on system dates:
- No manual cleanup required
- Uses current system date for calculations
- Responsive to timezone changes

## Utility Functions
Import helper functions from `src/utils/contentDates.js`:

```javascript
import { 
  getCurrentDate, 
  shouldShowNewBadge, 
  shouldShowUpdatedBadge 
} from '../utils/contentDates';
```

## Examples

### New Content (shows red "NEW" badge)
```javascript
{
  date: 'August 22, 2025',        // Today or within last 7 days
  lastModified: 'August 22, 2025'
}
```

### Updated Content (shows blue "UPDATED" badge)
```javascript
{
  date: 'August 7, 2025',         // Older than 7 days
  lastModified: 'August 8, 2025'  // Within last 30 days
}
```

### Old Content (no badge)
```javascript
{
  date: 'July 1, 2025',           // Older than 7 days
  lastModified: 'July 1, 2025'    // Older than 30 days
}
```
