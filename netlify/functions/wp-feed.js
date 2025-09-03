// Netlify Function: Fetch and normalize WordPress.com RSS feed
// GET /.netlify/functions/wp-feed

import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

const FEED_URL = 'https://kumar2net.wordpress.com/feed/';

export const handler = async () => {
  try {
    const res = await fetch(FEED_URL, { headers: { 'User-Agent': 'wp-feed-function' } });
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: 'Failed to fetch feed' }) };
    }

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const data = parser.parse(xml);

    const channel = data?.rss?.channel || {};
    const items = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];

    const posts = items.map((it) => ({
      title: it.title,
      link: it.link,
      pubDate: it.pubDate,
      guid: typeof it.guid === 'object' ? it.guid['#text'] || it.guid : it.guid,
      categories: (Array.isArray(it.category) ? it.category : it.category ? [it.category] : []).filter(Boolean),
      excerpt: it['content:encoded'] ? String(it['content:encoded']).replace(/<[^>]*>/g, '').slice(0, 240) : it.description,
    }));

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=900',
      },
      body: JSON.stringify({
        title: channel.title,
        link: channel.link,
        description: channel.description,
        lastBuildDate: channel.lastBuildDate,
        posts,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected error', details: String(err?.message || err) }) };
  }
};


