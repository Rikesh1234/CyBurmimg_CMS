require('dotenv').config();
require('module-alias/register'); //using alias
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const globalData = require('./middleware/globalData');
const cacheMiddleware = require('./middleware/cacheMiddleware');
const sessionMiddleware = require('./middleware/sessionMiddleware');

// Dynamically load specific routes based on the THEME environment variable
const themeRoutesPath = path.join(__dirname, 'routes', 'themeRoutes.js');
const themeRoutes = require(themeRoutesPath);

// Asynchronous function to connect to the MongoDB database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Exit the process with failure
    }
};

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Middleware to parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Use session middleware for managing sessions (with Redis)
app.use(sessionMiddleware);

// Cache middleware applied to all routes
app.use(cacheMiddleware);

// Use globalData middleware to make categories and pages available to all views
app.use(globalData);

// Set the view engine to EJS for rendering templates
app.set('view engine', 'ejs');

// Use application routes
// app.use('/', themeRoutes);
app.use('/', routes);




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
