// Netlify Function: Fetch and normalize WordPress.com RSS feed
// GET /.netlify/functions/wp-feed

import { XMLParser } from 'fast-xml-parser';

const FEED_URL = 'https://kumar2net.wordpress.com/feed/';

export const handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    };
  }

  try {
    const res = await fetch(FEED_URL, { 
      headers: { 'User-Agent': 'wp-feed-function' },
      timeout: 10000 // 10 second timeout
    });
    
    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ 
          error: 'Failed to fetch feed',
          status: res.status,
          posts: [] // Ensure posts array is always present
        })
      };
    }

    const xml = await res.text();
    
    // Check if we got HTML instead of XML (common error case)
    if (xml.trim().startsWith('<!DOCTYPE') || xml.trim().startsWith('<html')) {
      console.error('Received HTML instead of XML feed:', xml.substring(0, 200));
              return {
          statusCode: 200,
          headers: {
            'content-type': 'application/json',
            'cache-control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
          body: JSON.stringify({
            title: 'WordPress Feed',
            link: 'https://kumar2net.wordpress.com/',
            description: 'WordPress blog feed',
            lastBuildDate: new Date().toISOString(),
            posts: [], // Return empty posts array instead of error
            error: 'Feed temporarily unavailable'
          })
        };
    }

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const data = parser.parse(xml);

    const channel = (data && data.rss && data.rss.channel) || {};
    const items = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];

    const posts = items.map((it) => ({
      title: it.title || 'Untitled',
      link: it.link || '#',
      pubDate: it.pubDate || new Date().toISOString(),
      guid: typeof it.guid === 'object' ? it.guid['#text'] || it.guid : it.guid || '',
      categories: (Array.isArray(it.category) ? it.category : it.category ? [it.category] : []).filter(Boolean),
      excerpt: it['content:encoded'] ? String(it['content:encoded']).replace(/<[^>]*>/g, '').slice(0, 240) : it.description || '',
    }));

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=900',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        title: channel.title || 'WordPress Feed',
        link: channel.link || 'https://kumar2net.wordpress.com/',
        description: channel.description || 'WordPress blog feed',
        lastBuildDate: channel.lastBuildDate || new Date().toISOString(),
        posts,
      }),
    };
  } catch (err) {
    console.error('wp-feed error:', err);
    return {
      statusCode: 200, // Return 200 to avoid breaking the frontend
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        error: 'Feed temporarily unavailable',
        details: String((err && err.message) || err),
        posts: [] // Always return posts array
      })
    };
  }
};


