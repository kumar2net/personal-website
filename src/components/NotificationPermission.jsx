import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import pushNotificationService from '../services/pushNotificationService';

const NotificationPermission = () => {
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    setIsSupported(pushNotificationService.isPushNotificationSupported());
    
    if (isSupported) {
      // Check current permission status
      setPermission(pushNotificationService.getPermissionStatus());
      
      // Check if already subscribed
      pushNotificationService.isSubscribed().then(setIsSubscribed);
    }
  }, [isSupported]);

  const requestPermission = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await pushNotificationService.subscribe();
      setIsSubscribed(true);
      setPermission('granted');
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      setError(error.message);
    }
    
    setIsLoading(false);
  };

  const unsubscribe = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await pushNotificationService.unsubscribe();
      setIsSubscribed(false);
      setPermission('default');
    } catch (error) {
      console.error('Failed to disable notifications:', error);
      setError(error.message);
    }
    
    setIsLoading(false);
  };

  const sendTestNotification = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await pushNotificationService.sendTestNotification();
    } catch (error) {
      console.error('Failed to send test notification:', error);
      setError(error.message);
    }
    
    setIsLoading(false);
  };

  // Not supported
  if (!isSupported) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">
              Push notifications are not supported in this browser.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Already subscribed
  if (permission === 'granted' && isSubscribed) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Notifications enabled! You'll receive updates about new blog posts and comments.
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={sendTestNotification}
              disabled={isLoading}
              className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Test'}
            </button>
            <button
              onClick={unsubscribe}
              disabled={isLoading}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? 'Disabling...' : 'Disable'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Permission denied
  if (permission === 'denied') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-4"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">
              Notifications are blocked. Please enable them in your browser settings to receive updates.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default state - request permission
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-blue-800">
              Get notified about new blog posts and comments
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Stay updated with the latest content and discussions
            </p>
          </div>
        </div>
        <button
          onClick={requestPermission}
          disabled={isLoading}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Enabling...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span>Enable Notifications</span>
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationPermission;
