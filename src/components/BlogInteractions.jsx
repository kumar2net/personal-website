import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Determine the correct API URL based on environment
const getApiUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:8888/.netlify/functions/blog-interactions';
  }
  return '/.netlify/functions/blog-interactions';
};

// Mock data for local development
const mockData = {
  likes: new Map(),
  comments: new Map()
};

// Mock API for local development
const mockApi = {
  getLikes: (postId) => {
    const likes = mockData.likes.get(postId) || { totalLikes: 0, likes: [] };
    return Promise.resolve({ totalLikes: likes.totalLikes, likes: likes.likes });
  },
  getComments: (postId) => {
    const comments = mockData.comments.get(postId) || [];
    return Promise.resolve({ comments, totalComments: comments.length });
  },
  like: (postId, userId) => {
    const likes = mockData.likes.get(postId) || { totalLikes: 0, likes: [] };
    if (!likes.likes.includes(userId)) {
      likes.likes.push(userId);
      likes.totalLikes = likes.likes.length;
      mockData.likes.set(postId, likes);
    }
    return Promise.resolve({ success: true, totalLikes: likes.totalLikes, isLiked: true });
  },
  unlike: (postId, userId) => {
    const likes = mockData.likes.get(postId) || { totalLikes: 0, likes: [] };
    likes.likes = likes.likes.filter(id => id !== userId);
    likes.totalLikes = likes.likes.length;
    mockData.likes.set(postId, likes);
    return Promise.resolve({ success: true, totalLikes: likes.totalLikes, isLiked: false });
  },
  addComment: (postId, content, author) => {
    const comments = mockData.comments.get(postId) || [];
    const newComment = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      author,
      content,
      timestamp: new Date().toISOString(),
      replies: []
    };
    comments.unshift(newComment);
    mockData.comments.set(postId, comments);
    return Promise.resolve({ success: true, comment: newComment, totalComments: comments.length });
  },
  deleteComment: (postId, commentId) => {
    const comments = mockData.comments.get(postId) || [];
    const filteredComments = comments.filter(c => c.id !== commentId);
    mockData.comments.set(postId, filteredComments);
    return Promise.resolve({ success: true, totalComments: filteredComments.length });
  }
};

const BlogInteractions = ({ postId }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadLikes = useCallback(async () => {
    try {
      if (import.meta.env.DEV) {
        // Use mock API in development
        const data = await mockApi.getLikes(postId);
        setLikes(data.totalLikes);
        if (typeof data.isLiked === 'boolean') setIsLiked(data.isLiked);
      } else {
        // Use real API in production
        const response = await fetch(getApiUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, action: 'get-likes' })
        });
        const data = await response.json();
        setLikes(data.totalLikes);
        if (typeof data.isLiked === 'boolean') setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  }, [postId]);

  const loadComments = useCallback(async () => {
    try {
      if (import.meta.env.DEV) {
        // Use mock API in development
        const data = await mockApi.getComments(postId);
        setComments(data.comments);
      } else {
        // Use real API in production
        const response = await fetch(getApiUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, action: 'get-comments' })
        });
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, [postId]);

  useEffect(() => {
    loadLikes();
    loadComments();
  }, [postId, loadLikes, loadComments]);

  const handleLike = async () => {
    setIsLoading(true);
    try {
      if (import.meta.env.DEV) {
        // Use mock API in development
        const userId = 'dev-user-' + Date.now();
        const action = isLiked ? 'unlike' : 'like';
        const data = action === 'like' 
          ? await mockApi.like(postId, userId)
          : await mockApi.unlike(postId, userId);
        
        if (data.success) {
          setLikes(data.totalLikes);
          setIsLiked(data.isLiked);
        }
      } else {
        // Use real API in production
        const action = isLiked ? 'unlike' : 'like';
        const response = await fetch(getApiUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, action })
        });
        const data = await response.json();
        
        if (data.success) {
          setLikes(data.totalLikes);
          setIsLiked(data.isLiked);
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    setIsLoading(true);
    try {
      if (import.meta.env.DEV) {
        // Use mock API in development
        const data = await mockApi.addComment(postId, newComment.trim(), author);
        
        if (data.success) {
          setComments([data.comment, ...comments]);
          setNewComment('');
          setShowComments(true);
        }
      } else {
        // Use real API in production
        const response = await fetch(getApiUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            postId, 
            action: 'add-comment', 
            content: newComment, 
            author 
          })
        });
        const data = await response.json();
        
        if (data.success) {
          setComments([data.comment, ...comments]);
          setNewComment('');
          setShowComments(true);
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      if (import.meta.env.DEV) {
        // Use mock API in development
        const data = await mockApi.deleteComment(postId, commentId);
        
        if (data.success) {
          setComments(comments.filter(c => c.id !== commentId));
        }
      } else {
        // Use real API in production
        const response = await fetch(getApiUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, action: 'delete-comment', commentId })
        });
        const data = await response.json();
        
        if (data.success) {
          setComments(comments.filter(c => c.id !== commentId));
        }
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-12 border-t pt-8">
      {/* Like Button */}
      <div className="flex items-center gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked 
              ? 'bg-red-100 text-red-600 border border-red-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          <svg 
            className={`w-5 h-5 ${isLiked ? 'fill-current' : 'stroke-current fill-none'}`} 
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="font-medium">Like</span>
          <span className="font-semibold text-sm bg-gray-200 px-2 py-1 rounded-full min-w-[1.5rem] text-center">
            {likes}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">Comment</span>
          <span className="font-semibold text-sm bg-gray-200 px-2 py-1 rounded-full min-w-[1.5rem] text-center">
            {comments.length}
          </span>
        </motion.button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Add Comment Form */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
              <form onSubmit={handleAddComment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Share your thoughts..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !newComment.trim() || !author.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
              {comments.length === 0 ? (
                <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
              ) : (
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                        <p className="text-sm text-gray-500">{formatDate(comment.timestamp)}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete comment"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogInteractions;
