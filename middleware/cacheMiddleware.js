const redisClient = require("../config/redis");

// Cache middleware function
const cacheMiddleware = async (req, res, next) => {
  // Define cacheable routes
  // const cacheableRoutes = ["/cms/post", "/cms/category"];
  const cacheableRoutes = []

  // Check if environment is development
  if (process.env.NODE_ENV === "development") {
    return next(); // Skip cache in development
  }

  // Check if the current route is in cacheable routes
  if (!cacheableRoutes.includes(req.originalUrl)) {
    return next(); // Skip cache if route is not cacheable
  }

  const key = req.originalUrl; // Cache key based on URL

  try {
    // Check if Redis client is still connected
    if (!redisClient.isOpen) {
      console.log("Redis client is not open, skipping cache.");
      return next(); // Skip cache if Redis is not connected
    }

    // Check for cache
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log(`Cache hit for ${key}`);
      return res.send(JSON.parse(cachedData)); // Return cached response
    }

    console.log(`Cache miss for ${key}`);

    // Intercept response to cache the data
    res.sendResponse = res.send;
    res.send = async (body) => {
      try {
        // Only cache non-error responses (status code 200)
        if (res.statusCode === 200) {
          await redisClient.set(key, JSON.stringify(body), { EX: 3600 }); // Cache for 1 hour
        }
      } catch (err) {
        console.error("Error caching data:", err);
      }
      res.sendResponse(body);
    };

    next();
  } catch (err) {
    console.error("Cache error:", err);
    next();
  }
};

module.exports = cacheMiddleware;
