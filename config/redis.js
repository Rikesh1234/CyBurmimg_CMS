const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
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

// Connect to Redis
(async () => {
  try {
    await client.connect();
    console.log('Redis connected successfully');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

module.exports = client;