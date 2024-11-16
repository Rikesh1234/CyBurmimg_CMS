require('dotenv').config();  // Load environment variables from .env

const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');

// Create and configure the Redis client
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

// Handle Redis client connection readiness
redisClient.connect().then(() => {
    console.log('Redis client connected and ready');
}).catch((err) => {
    console.error('Redis connection error:', err);
});

// Session middleware configuration
const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset the expiration time on every request
    cookie: {
        secure: false, // Set true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 10 // Session will expire after 10 minutes of inactivity
    }
});


module.exports = sessionMiddleware;
