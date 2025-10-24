import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import NotificationPermission from '../components/NotificationPermission';
import pushNotificationService from '../services/pushNotificationService';

const Notifications = () => {
  const [settings, setSettings] = useState({
    blogPosts: true,
    comments: true,
    contactForm: false,
    weeklyDigest: true
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState('default');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Check subscription status
    pushNotificationService.isSubscribed().then(setIsSubscribed);
    setPermission(pushNotificationService.getPermissionStatus());
    
    // Get subscription stats (if available)
    pushNotificationService.getSubscriptionStats()
      .then(setStats)
      .catch(error => {
        console.warn('Could not load subscription stats:', error);
        // Don't set stats if there's an error, let it remain null
      });
  }, []);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Here you would typically save the settings to the server
    // For now, we'll just update local state
    console.log('Settings updated:', { ...settings, [setting]: value });
  };

  const sendTestNotification = async () => {
    try {
      await pushNotificationService.sendTestNotification();
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Notification Settings - Kumar's Portfolio</title>
        <meta name="description" content="Manage your push notification preferences for blog updates, comments, and more." />
        <link rel="canonical" href="/notifications" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Notification Settings
            </h1>
            <p className="text-gray-600">
              Stay updated with the latest blog posts, comments, and important updates.
            </p>
          </div>
          
          {/* Notification Permission Component */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Push Notifications
            </h2>
            <NotificationPermission />
          </div>

          {/* Notification Preferences */}
          {isSubscribed && permission === 'granted' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">New Blog Posts</h3>
                    <p className="text-sm text-gray-600">Get notified when new blog posts are published</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.blogPosts}
                      onChange={(e) => handleSettingChange('blogPosts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">New Comments</h3>
                    <p className="text-sm text-gray-600">Get notified when new comments are posted on blog posts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.comments}
                      onChange={(e) => handleSettingChange('comments', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Contact Form Submissions</h3>
                    <p className="text-sm text-gray-600">Get notified when someone submits the contact form (admin only)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.contactForm}
                      onChange={(e) => handleSettingChange('contactForm', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Weekly Digest</h3>
                    <p className="text-sm text-gray-600">Receive a weekly summary of popular posts and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.weeklyDigest}
                      onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Test Notifications */}
          {isSubscribed && permission === 'granted' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Test Notifications
              </h2>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-3">
                  Send a test notification to verify everything is working correctly.
                </p>
                <button
                  onClick={sendTestNotification}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Send Test Notification
                </button>
              </div>
            </div>
          )}

          {/* Statistics */}
          {stats && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Notification Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.totalSubscriptions || 0}</div>
                  <div className="text-sm text-green-800">Total Subscribers</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.activeSubscriptions || 0}</div>
                  <div className="text-sm text-blue-800">Active Subscriptions</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.notificationsSent || 0}</div>
                  <div className="text-sm text-purple-800">Notifications Sent</div>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Need Help?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>How do push notifications work?</strong><br />
                Push notifications allow websites to send you updates even when you're not actively browsing the site. You'll receive notifications on your device when new content is published.
              </p>
              <p>
                <strong>Can I disable notifications later?</strong><br />
                Yes, you can disable notifications at any time by clicking the "Disable" button above or by changing your browser's notification settings.
              </p>
              <p>
                <strong>What if I don't receive notifications?</strong><br />
                Make sure notifications are enabled in your browser settings and that you're not in "Do Not Disturb" mode on your device.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;
