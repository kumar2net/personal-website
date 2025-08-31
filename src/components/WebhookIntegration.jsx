import { useEffect, useState } from 'react';
import analyticsConfig from '../config/analytics';
import webhookService from '../services/webhookService';

const WebhookIntegration = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: ['page_view'],
    secret: '',
    description: '',
  });

  // Load webhooks and health status
  useEffect(() => {
    loadWebhooks();
    checkHealth();
  }, [checkHealth, loadWebhooks]);

  const loadWebhooks = async () => {
    try {
      setLoading(true);
      const webhookList = await webhookService.listWebhooks();
      setWebhooks(webhookList);
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const healthStatus = await webhookService.checkHealth();
      setHealth(healthStatus);
    } catch (error) {
      console.error('Failed to check health:', error);
    }
  };

  const handleRegisterWebhook = async (e) => {
    e.preventDefault();

    if (!newWebhook.url) {
      alert('Please enter a webhook URL');
      return;
    }

    try {
      setLoading(true);
      await webhookService.registerWebhook(newWebhook);
      setNewWebhook({
        url: '',
        events: ['page_view'],
        secret: '',
        description: '',
      });
      loadWebhooks();
    } catch (error) {
      console.error('Failed to register webhook:', error);
      alert(`Failed to register webhook: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregisterWebhook = async (webhookId) => {
    if (!confirm('Are you sure you want to unregister this webhook?')) {
      return;
    }

    try {
      setLoading(true);
      await webhookService.unregisterWebhook(webhookId);
      loadWebhooks();
    } catch (error) {
      console.error('Failed to unregister webhook:', error);
      alert(`Failed to unregister webhook: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (event) => {
    const { value, checked } = event.target;
    setNewWebhook((prev) => ({
      ...prev,
      events: checked
        ? [...prev.events, value]
        : prev.events.filter((e) => e !== value),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Webhook Integration</h2>

      {/* Health Status */}
      {health && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">System Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  health.status === 'healthy'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {health.status}
              </span>
            </div>
            <div>
              <span className="font-medium">Total Webhooks:</span>
              <span className="ml-2">
                {health.details?.total_webhooks || 0}
              </span>
            </div>
            <div>
              <span className="font-medium">Active:</span>
              <span className="ml-2">
                {health.details?.active_webhooks || 0}
              </span>
            </div>
            <div>
              <span className="font-medium">Failed:</span>
              <span className="ml-2">
                {health.details?.failed_webhooks || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Register New Webhook */}
      <div className="mb-8 p-6 bg-white border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Register New Webhook</h3>
        <form onSubmit={handleRegisterWebhook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Webhook URL *
            </label>
            <input
              type="url"
              value={newWebhook.url}
              onChange={(e) =>
                setNewWebhook((prev) => ({ ...prev, url: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://your-webhook-endpoint.com/webhook"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Events to Subscribe
            </label>
            <div className="space-y-2">
              {[
                'page_view',
                'event',
                'session_start',
                'high_traffic',
                'error_rate',
                'new_visitor',
              ].map((event) => (
                <label key={event} className="flex items-center">
                  <input
                    type="checkbox"
                    value={event}
                    checked={newWebhook.events.includes(event)}
                    onChange={handleEventChange}
                    className="mr-2"
                  />
                  <span className="text-sm capitalize">
                    {event.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Secret (Optional)
            </label>
            <input
              type="password"
              value={newWebhook.secret}
              onChange={(e) =>
                setNewWebhook((prev) => ({ ...prev, secret: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Webhook secret for signature verification"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={newWebhook.description}
              onChange={(e) =>
                setNewWebhook((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description of this webhook"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Webhook'}
          </button>
        </form>
      </div>

      {/* Webhooks List */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Registered Webhooks</h3>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : webhooks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No webhooks registered
          </div>
        ) : (
          <div className="divide-y">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{webhook.url}</h4>
                    {webhook.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {webhook.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        webhook.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {webhook.status}
                    </span>
                    <button
                      onClick={() => handleUnregisterWebhook(webhook.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Events:</span>
                    <div className="mt-1">
                      {webhook.events.map((event) => (
                        <span
                          key={event}
                          className="inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-1 mb-1"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(webhook.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Last Triggered:</span>
                    <span className="ml-2 text-gray-600">
                      {webhook.last_triggered
                        ? new Date(webhook.last_triggered).toLocaleDateString()
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configuration Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Configuration</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>API Endpoint:</strong> {analyticsConfig.apiUrl}
          </p>
          <p>
            <strong>Webhook Endpoint:</strong> {webhookService.webhookUrl}
          </p>
          <p>
            <strong>Debug Mode:</strong>{' '}
            {analyticsConfig.debug ? 'Enabled' : 'Disabled'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebhookIntegration;
