import { getStore } from '@netlify/blobs';

// Use Netlify Blobs for persistent storage
const STORE_NAME = 'blog-interactions';
const SITE_ID = process.env.NETLIFY_SITE_ID;
const BLOBS_TOKEN = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

// Initialize the blob store
async function getBlobStore() {
  // Prefer explicit credentials if provided via env; otherwise rely on implicit Netlify Functions context
  if (SITE_ID && BLOBS_TOKEN) {
    return getStore({ name: STORE_NAME, siteID: SITE_ID, token: BLOBS_TOKEN });
  }
  return getStore({ name: STORE_NAME });
}

// Read data from blob storage
async function readData() {
  try {
    const store = await getBlobStore();
    const data = await store.get('data', { type: 'json' });
    
    // Return default structure if no data exists
    if (!data) {
      return { likes: {}, comments: {} };
    }
    
    return data;
  } catch (error) {
    console.error('Error reading data from blob storage:', error);
    return { likes: {}, comments: {} };
  }
}

// Write data to blob storage
async function writeData(data) {
  try {
    const store = await getBlobStore();
    await store.setJSON('data', data);
    return true;
  } catch (error) {
    console.error('Error writing data to blob storage:', error);
    return false;
  }
}

function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

// Generate unique ID for comments
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get user identifier (you can enhance this with actual auth)
function getUserId(event) {
  // For now, use IP + User-Agent as a simple identifier
  // In production, implement proper authentication
  const ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
  const userAgent = event.headers['user-agent'] || 'unknown';
  try {
    return Buffer.from(ip + userAgent).toString('base64').substring(0, 16);
  } catch (_e) {
    return `${(ip + userAgent).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
  }
}

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  const { postId, action, commentId, content, author } = JSON.parse(event.body || '{}');

  if (!postId) {
    return jsonResponse(400, { error: 'postId is required' });
  }

  try {
    switch (action) {
      case 'like':
        return await handleLike(postId, getUserId(event));
      case 'unlike':
        return await handleUnlike(postId, getUserId(event));
      case 'get-likes':
        return await getLikes(postId, getUserId(event));
      case 'add-comment':
        return await addComment(postId, content, author || 'Anonymous');
      case 'get-comments':
        return await getComments(postId);
      case 'delete-comment':
        return await deleteComment(postId, commentId, getUserId(event));
      default:
        return jsonResponse(400, { error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

async function handleLike(postId, userId) {
  const data = await readData();
  
  if (!data.likes[postId]) {
    data.likes[postId] = { users: [], totalLikes: 0 };
  }

  if (!data.likes[postId].users.includes(userId)) {
    data.likes[postId].users.push(userId);
    data.likes[postId].totalLikes = data.likes[postId].users.length;
    const ok = await writeData(data);
    if (!ok) {
      return jsonResponse(500, { error: 'Failed to persist like' });
    }
  }

  return jsonResponse(200, { 
    success: true, 
    totalLikes: data.likes[postId].totalLikes,
    isLiked: true 
  });
}

async function handleUnlike(postId, userId) {
  const data = await readData();
  
  if (!data.likes[postId]) {
    return jsonResponse(200, { 
      success: true, 
      totalLikes: 0,
      isLiked: false 
    });
  }

  data.likes[postId].users = data.likes[postId].users.filter(id => id !== userId);
  data.likes[postId].totalLikes = data.likes[postId].users.length;
  const ok = await writeData(data);
  if (!ok) {
    return jsonResponse(500, { error: 'Failed to persist unlike' });
  }

  return jsonResponse(200, { 
    success: true, 
    totalLikes: data.likes[postId].totalLikes,
    isLiked: false 
  });
}

async function getLikes(postId, userId) {
  const data = await readData();
  const postLikes = data.likes[postId];
  const users = postLikes?.users || [];

  return jsonResponse(200, { 
    totalLikes: postLikes?.totalLikes || users.length,
    likes: users,
    isLiked: users.includes(userId)
  });
}

async function addComment(postId, content, author) {
  if (!content || content.trim().length === 0) {
    return jsonResponse(400, { error: 'Comment content is required' });
  }

  const data = await readData();
  
  if (!data.comments[postId]) {
    data.comments[postId] = [];
  }

  const newComment = {
    id: generateId(),
    author,
    content: content.trim(),
    timestamp: new Date().toISOString(),
    replies: []
  };

  data.comments[postId].unshift(newComment);
  const ok = await writeData(data);
  if (!ok) {
    return jsonResponse(500, { error: 'Failed to persist comment' });
  }

  return jsonResponse(200, { 
    success: true, 
    comment: newComment,
    totalComments: data.comments[postId].length
  });
}

async function getComments(postId) {
  const data = await readData();
  const comments = data.comments[postId] || [];
  
  return jsonResponse(200, { 
    comments: comments,
    totalComments: comments.length
  });
}

async function deleteComment(postId, commentId, userId) {
  const data = await readData();
  
  if (!data.comments[postId]) {
    return jsonResponse(404, { error: 'Comments not found' });
  }

  const commentIndex = data.comments[postId].findIndex(c => c.id === commentId);
  if (commentIndex === -1) {
    return jsonResponse(404, { error: 'Comment not found' });
  }

  data.comments[postId].splice(commentIndex, 1);
  const ok = await writeData(data);
  if (!ok) {
    return jsonResponse(500, { error: 'Failed to persist delete' });
  }

  return jsonResponse(200, { 
    success: true,
    totalComments: data.comments[postId].length
  });
}
