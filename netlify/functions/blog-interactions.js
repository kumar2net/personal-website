const { getStore } = require('@netlify/blobs');

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

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  const store = getStore('blog-interactions');
  const { postId, action, commentId, content, author } = JSON.parse(event.body || '{}');

  if (!postId) {
    return jsonResponse(400, { error: 'postId is required' });
  }

  try {
    switch (action) {
      case 'like':
        return await handleLike(store, postId, getUserId(event));
      case 'unlike':
        return await handleUnlike(store, postId, getUserId(event));
      case 'get-likes':
        return await getLikes(store, postId);
      case 'add-comment':
        return await addComment(store, postId, content, author || 'Anonymous');
      case 'get-comments':
        return await getComments(store, postId);
      case 'delete-comment':
        return await deleteComment(store, postId, commentId, getUserId(event));
      default:
        return jsonResponse(400, { error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};

async function handleLike(store, postId, userId) {
  const key = `likes-${postId}`;
  let likesData = await store.get(key);
  
  if (!likesData) {
    likesData = { postId, likes: [], totalLikes: 0 };
  }

  if (!likesData.likes.includes(userId)) {
    likesData.likes.push(userId);
    likesData.totalLikes = likesData.likes.length;
    await store.set(key, likesData);
  }

  return jsonResponse(200, { 
    success: true, 
    totalLikes: likesData.totalLikes,
    isLiked: true 
  });
}

async function handleUnlike(store, postId, userId) {
  const key = `likes-${postId}`;
  let likesData = await store.get(key);
  
  if (!likesData) {
    return jsonResponse(200, { 
      success: true, 
      totalLikes: 0,
      isLiked: false 
    });
  }

  likesData.likes = likesData.likes.filter(id => id !== userId);
  likesData.totalLikes = likesData.likes.length;
  await store.set(key, likesData);

  return jsonResponse(200, { 
    success: true, 
    totalLikes: likesData.totalLikes,
    isLiked: false 
  });
}

async function getLikes(store, postId) {
  const key = `likes-${postId}`;
  const likesData = await store.get(key);
  
  return jsonResponse(200, { 
    totalLikes: likesData?.totalLikes || 0,
    likes: likesData?.likes || []
  });
}

async function addComment(store, postId, content, author) {
  if (!content || content.trim().length === 0) {
    return jsonResponse(400, { error: 'Comment content is required' });
  }

  const key = `comments-${postId}`;
  let commentsData = await store.get(key);
  
  if (!commentsData) {
    commentsData = { postId, comments: [] };
  }

  const newComment = {
    id: generateId(),
    author,
    content: content.trim(),
    timestamp: new Date().toISOString(),
    replies: []
  };

  commentsData.comments.unshift(newComment); // Add to beginning
  await store.set(key, commentsData);

  return jsonResponse(200, { 
    success: true, 
    comment: newComment,
    totalComments: commentsData.comments.length
  });
}

async function getComments(store, postId) {
  const key = `comments-${postId}`;
  const commentsData = await store.get(key);
  
  return jsonResponse(200, { 
    comments: commentsData?.comments || [],
    totalComments: commentsData?.comments?.length || 0
  });
}

async function deleteComment(store, postId, commentId, userId) {
  const key = `comments-${postId}`;
  let commentsData = await store.get(key);
  
  if (!commentsData) {
    return jsonResponse(404, { error: 'Comments not found' });
  }

  // Find and remove the comment
  const commentIndex = commentsData.comments.findIndex(c => c.id === commentId);
  if (commentIndex === -1) {
    return jsonResponse(404, { error: 'Comment not found' });
  }

  // For now, allow deletion by anyone (you can add proper auth later)
  commentsData.comments.splice(commentIndex, 1);
  await store.set(key, commentsData);

  return jsonResponse(200, { 
    success: true,
    totalComments: commentsData.comments.length
  });
}
