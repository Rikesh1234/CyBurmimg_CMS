const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

// Handle Redis connection events
client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('connect', () => {
  console.log('Redis client connected and ready');
});

// Connect to Redis (this step is essential)
(async () => {
  try {
    await client.connect();
    console.log('Redis connected successfully');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

module.exports = client;
