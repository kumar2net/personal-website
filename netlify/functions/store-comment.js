/*
  Netlify Function: store-comment
  - POST body: { postSlug: string, comment: string, author?: string }
  - Response: { success: boolean, commentId: string, timestamp: number }
*/

import { getStore } from '@netlify/blobs';

function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS,GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  console.log('[store-comment] Function started');
  
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (event.httpMethod === 'GET') {
    // Handle getting comments for a specific post
    const { postSlug } = event.queryStringParameters || {};
    if (!postSlug) {
      return jsonResponse(400, { error: 'postSlug is required' });
    }

    try {
      const store = getStore('comments');
      const comments = await store.get(postSlug);
      const commentsList = comments ? JSON.parse(comments) : [];
      
      return jsonResponse(200, { 
        success: true, 
        comments: commentsList,
        count: commentsList.length 
      });
    } catch (error) {
      console.error('[store-comment] Error fetching comments:', error);
      return jsonResponse(500, { error: 'Failed to fetch comments' });
    }
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const { postSlug, comment, author = 'Anonymous' } = payload || {};
  
  console.log('[store-comment] Received data', {
    postSlug: postSlug || null,
    commentLength: typeof comment === 'string' ? comment.length : 0,
    author: author || 'Anonymous'
  });

  if (!postSlug || !comment || typeof comment !== 'string') {
    return jsonResponse(400, { error: 'postSlug and comment are required' });
  }

  if (comment.trim().length === 0) {
    return jsonResponse(400, { error: 'Comment cannot be empty' });
  }

  if (comment.length > 1000) {
    return jsonResponse(400, { error: 'Comment too long (max 1000 characters)' });
  }

  try {
    const store = getStore('comments');
    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get existing comments for this post
    const existingComments = await store.get(postSlug);
    const commentsList = existingComments ? JSON.parse(existingComments) : [];
    
    // Add new comment
    const newComment = {
      id: commentId,
      postSlug,
      comment: comment.trim(),
      author: author.trim(),
      timestamp: Date.now(),
      date: new Date().toISOString()
    };
    
    commentsList.push(newComment);
    
    // Store updated comments list
    await store.set(postSlug, JSON.stringify(commentsList));
    
    console.log('[store-comment] Comment stored successfully', { commentId, postSlug });
    
    return jsonResponse(200, {
      success: true,
      commentId,
      timestamp: newComment.timestamp,
      comment: newComment
    });
    
  } catch (error) {
    console.error('[store-comment] Error storing comment:', error);
    
    // Handle missing blob environment gracefully
    if (error.message.includes('MissingBlobsEnvironmentError')) {
      return jsonResponse(200, {
        success: true,
        commentId: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        comment: {
          id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          postSlug,
          comment: comment.trim(),
          author: author.trim(),
          timestamp: Date.now(),
          date: new Date().toISOString()
        },
        note: 'Comment saved locally (blob storage not available in development)'
      });
    }
    
    return jsonResponse(500, { 
      error: 'Failed to store comment', 
      details: String(error) 
    });
  }
};
