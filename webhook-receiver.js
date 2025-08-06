#!/usr/bin/env node

/**
 * Simple Webhook Receiver for Testing
 * 
 * Usage:
 * 1. Run: node webhook-receiver.js
 * 2. Register webhook with: http://localhost:3002/webhook
 * 3. Monitor incoming webhooks in the console
 */

import express from 'express';
import crypto from 'crypto';

const app = express();
const PORT = 3002;

// Store received webhooks
const receivedWebhooks = [];

// Middleware
app.use(express.json({ limit: '10mb' }));

// Verify webhook signature
function verifySignature(payload, signature, secret) {
  if (!secret) return true; // No secret provided, skip verification
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Webhook endpoint
app.post('/webhook', (req, res) => {
  const { event_type, data, source, timestamp } = req.body;
  const signature = req.headers['x-webhook-signature'];
  
  console.log('\n🔔 Webhook Received!');
  console.log('='.repeat(50));
  console.log(`📅 Time: ${new Date().toLocaleString()}`);
  console.log(`🎯 Event: ${event_type}`);
  console.log(`📡 Source: ${source}`);
  console.log(`🔐 Signature: ${signature ? 'Present' : 'None'}`);
  console.log('\n📊 Data:');
  console.log(JSON.stringify(data, null, 2));
  console.log('='.repeat(50));
  
  // Store webhook
  const webhook = {
    id: Date.now(),
    timestamp: new Date(),
    event_type,
    data,
    source,
    signature: signature ? 'Present' : 'None'
  };
  
  receivedWebhooks.unshift(webhook);
  
  // Keep only last 50 webhooks
  if (receivedWebhooks.length > 50) {
    receivedWebhooks.splice(50);
  }
  
  res.status(200).json({
    success: true,
    message: 'Webhook received successfully',
    received_at: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    webhooks_received: receivedWebhooks.length,
    timestamp: new Date().toISOString()
  });
});

// List received webhooks
app.get('/webhooks', (req, res) => {
  res.json({
    total: receivedWebhooks.length,
    webhooks: receivedWebhooks
  });
});

// Clear webhooks
app.delete('/webhooks', (req, res) => {
  receivedWebhooks.length = 0;
  res.json({
    success: true,
    message: 'All webhooks cleared'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Webhook Receiver running on http://localhost:${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Webhooks list: http://localhost:${PORT}/webhooks`);
  console.log(`🗑️  Clear webhooks: DELETE http://localhost:${PORT}/webhooks`);
  console.log('\n💡 To register this webhook with your analytics system:');
  console.log('   URL: http://localhost:3002/webhook');
  console.log('   Events: page_view, event, session_start, etc.');
  console.log('\n📝 Monitoring webhooks...\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down webhook receiver...');
  process.exit(0);
});

export default app; 