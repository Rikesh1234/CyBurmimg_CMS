const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
  url: 'redis://127.0.0.1:' + (process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD 
});

// Handle Redis connection events
client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('connect', () => {
  console.log('Redis client connected and ready');
});

// Auto-reconnect on disconnect
client.on('end', async () => {
  console.warn('Redis connection ended, attempting to reconnect...');
  try {
    await client.connect();
    console.log('Redis reconnected successfully');
  } catch (err) {
    console.error('Error reconnecting to Redis:', err);
  }
});

// Connect to Redis (only if not already connected)
(async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
      console.log('Redis connected successfully');
    }
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

module.exports = client;
