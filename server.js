require('dotenv').config();

const path = require('path');
const csrf = require('csurf');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const sessionMiddleware = require('./middleware/sessionMiddleware');

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

// Middleware to parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS for rendering templates
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use session middleware for managing sessions (with Redis)
app.use(sessionMiddleware);

// Use application routes
app.use('/', routes);




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
