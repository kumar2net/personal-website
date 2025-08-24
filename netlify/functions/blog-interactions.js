// Simple in-memory storage for demo (in production, use a proper database)
const storage = new Map();

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
  const key = `likes-${postId}`;
  let likesData = storage.get(key);
  
  if (!likesData) {
    likesData = { postId, likes: [], totalLikes: 0 };
  }

  if (!likesData.likes.includes(userId)) {
    likesData.likes.push(userId);
    likesData.totalLikes = likesData.likes.length;
    storage.set(key, likesData);
  }

  return jsonResponse(200, { 
    success: true, 
    totalLikes: likesData.totalLikes,
    isLiked: true 
  });
}

async function handleUnlike(postId, userId) {
  const key = `likes-${postId}`;
  let likesData = storage.get(key);
  
  if (!likesData) {
    return jsonResponse(200, { 
      success: true, 
      totalLikes: 0,
      isLiked: false 
    });
  }

  likesData.likes = likesData.likes.filter(id => id !== userId);
  likesData.totalLikes = likesData.likes.length;
  storage.set(key, likesData);

  return jsonResponse(200, { 
    success: true, 
    totalLikes: likesData.totalLikes,
    isLiked: false 
  });
}

async function getLikes(postId) {
  const key = `likes-${postId}`;
  const likesData = storage.get(key);
  
  return jsonResponse(200, { 
    totalLikes: likesData?.totalLikes || 0,
    likes: likesData?.likes || []
  });
}

async function addComment(postId, content, author) {
  if (!content || content.trim().length === 0) {
    return jsonResponse(400, { error: 'Comment content is required' });
  }

  const key = `comments-${postId}`;
  let commentsData = storage.get(key);
  
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
  storage.set(key, commentsData);

  return jsonResponse(200, { 
    success: true, 
    comment: newComment,
    totalComments: commentsData.comments.length
  });
}

async function getComments(postId) {
  const key = `comments-${postId}`;
  const commentsData = storage.get(key);
  
  return jsonResponse(200, { 
    comments: commentsData?.comments || [],
    totalComments: commentsData?.comments?.length || 0
  });
}

async function deleteComment(postId, commentId, userId) {
  const key = `comments-${postId}`;
  let commentsData = storage.get(key);
  
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
  storage.set(key, commentsData);

  return jsonResponse(200, { 
    success: true,
    totalComments: commentsData.comments.length
  });
}
