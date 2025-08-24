import fs from 'fs';
import path from 'path';

// Simple file-based storage for persistence
const DATA_FILE = '/tmp/blog-interactions.json';

// Ensure data file exists
function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({ likes: {}, comments: {} }));
    }
  } catch (error) {
    console.error('Error ensuring data file:', error);
  }
}

// Read data from file
function readData() {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { likes: {}, comments: {} };
  }
}

// Write data to file
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
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
  return btoa(ip + userAgent).substring(0, 16);
}

export const handler = async (event) => {
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
        return await getLikes(postId);
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
  const data = readData();
  
  if (!data.likes[postId]) {
    data.likes[postId] = { users: [], totalLikes: 0 };
  }

  if (!data.likes[postId].users.includes(userId)) {
    data.likes[postId].users.push(userId);
    data.likes[postId].totalLikes = data.likes[postId].users.length;
    writeData(data);
  }

  return jsonResponse(200, { 
    success: true, 
    totalLikes: data.likes[postId].totalLikes,
    isLiked: true 
  });
}

async function handleUnlike(postId, userId) {
  const data = readData();
  
  if (!data.likes[postId]) {
    return jsonResponse(200, { 
      success: true, 
      totalLikes: 0,
      isLiked: false 
    });
  }

  data.likes[postId].users = data.likes[postId].users.filter(id => id !== userId);
  data.likes[postId].totalLikes = data.likes[postId].users.length;
  writeData(data);

  return jsonResponse(200, { 
    success: true, 
    totalLikes: data.likes[postId].totalLikes,
    isLiked: false 
  });
}

async function getLikes(postId) {
  const data = readData();
  const postLikes = data.likes[postId];
  
  return jsonResponse(200, { 
    totalLikes: postLikes?.totalLikes || 0,
    likes: postLikes?.users || []
  });
}

async function addComment(postId, content, author) {
  if (!content || content.trim().length === 0) {
    return jsonResponse(400, { error: 'Comment content is required' });
  }

  const data = readData();
  
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
  writeData(data);

  return jsonResponse(200, { 
    success: true, 
    comment: newComment,
    totalComments: data.comments[postId].length
  });
}

async function getComments(postId) {
  const data = readData();
  const comments = data.comments[postId] || [];
  
  return jsonResponse(200, { 
    comments: comments,
    totalComments: comments.length
  });
}

async function deleteComment(postId, commentId, userId) {
  const data = readData();
  
  if (!data.comments[postId]) {
    return jsonResponse(404, { error: 'Comments not found' });
  }

  const commentIndex = data.comments[postId].findIndex(c => c.id === commentId);
  if (commentIndex === -1) {
    return jsonResponse(404, { error: 'Comment not found' });
  }

  data.comments[postId].splice(commentIndex, 1);
  writeData(data);

  return jsonResponse(200, { 
    success: true,
    totalComments: data.comments[postId].length
  });
}
