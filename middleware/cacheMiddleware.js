const redisClient = require('../config/redis');

// Caching middleware
const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl;

  try {
    // Check if Redis client is still connected
    if (!redisClient.isOpen) {
      console.log('Redis client is not open, skipping cache.');
      return next(); // Skip cache if Redis is not connected
    }

    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.send(JSON.parse(cachedData));  // Return cached data
    }

    // Intercept the response to cache it
    res.sendResponse = res.send;
    res.send = async (body) => {
      await redisClient.set(key, JSON.stringify(body), 'EX', 3600); // Cache for 1 hour
      res.sendResponse(body);
    };

    next();
  } catch (err) {
    console.error('Cache error:', err);
    next();
  }
};

module.exports = cacheMiddleware;
