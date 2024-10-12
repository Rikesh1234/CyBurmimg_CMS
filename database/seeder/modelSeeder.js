

require('dotenv').config();
const mongoose = require('mongoose');
const Model = require('../../models/Model');

// Connect to MongoDB using the connection string from the .env file
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

// Insert multiple models in sequence
async function createModels() {
    const models = [
        { name: 'Post', path: '../models/Post' },
        { name: 'Category', path: '../models/Category' },
        { name: 'Author', path: '../models/Author' },
        { name: 'StaticPage', path: '../models/StaticPage' },
        { name: 'Slider', path: '../models/Slider' },
        { name: 'Team', path: '../models/Team' },
        { name: 'TeamType', path: '../models/TeamType' },
        { name: 'Testimonial', path: '../models/Testimonial' },
        { name: 'User', path: '../models/user' },
        { name: 'Role', path: '../models/Role' },
        { name: 'Package', path: '../models/Package' },
    ];

    try {
        for (const modelData of models) {
            const newModel = new Model(modelData);
            const savedModel = await newModel.save();
            console.log('Model created:', savedModel);
        }
    } catch (error) {
        console.error('Error creating model:', error.message);
    } finally {
        // Close the database connection once all models are created
        mongoose.connection.close(() => {
            console.log('Database connection closed.');
        });
    }
}

(async () => {
    await connectDB();
    await createModels();
})();
