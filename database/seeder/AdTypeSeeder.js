

require('dotenv').config();
const mongoose = require('mongoose');
const AdType = require('../../models/AdType.js');

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
async function createAdType() {
    const adType = [
        { name: 'Header Ads', slug: 'header-ads' },
        { name: 'Home Ads', slug: 'home-ads' },
        { name: 'Inner Ads', slug: 'inner-ads' },
        { name: 'Sidebar Ads', slug: 'sidebar-ads' },
    ];

    try {
        for (const fieldData of adType) {
            const newModel = new AdType(fieldData);
            const savedModel = await newModel.save();
            console.log('Field Created:', savedModel);
        }
    } catch (error) {
        console.error('Error creating field:', error.message);
    } finally {
        // Close the database connection once all models are created
        await mongoose.connection.close();
console.log('Database connection closed.');
    }
}

(async () => {
    await connectDB();
    await createAdType();
})();
