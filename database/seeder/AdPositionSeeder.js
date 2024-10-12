require('dotenv').config();
const mongoose = require('mongoose');
const AdPosition = require('../../models/AdPosition');
const AdType = require('../../models/AdType');

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

// Create and save AdPositions
async function createAdPosition() {
    try {
        // Fetch AdTypes from the database
        const headerAdsType = await AdType.findOne({ slug: 'header-ads' });
        const homeAdsType = await AdType.findOne({ slug: 'home-ads' });
        const innerAdsType = await AdType.findOne({ slug: 'inner-ads' });
        const sidebarAdsType = await AdType.findOne({ slug: 'sidebar-ads' });

        if (!headerAdsType || !homeAdsType || !innerAdsType || !sidebarAdsType) {
            throw new Error('One or more AdTypes were not found in the database');
        }

        // Define ad positions to insert
        const adPositions = [
            { 
                name: 'Jacket Ad', 
                slug: 'jacket-ad', 
                total_allowed: 1, 
                ad_type: [headerAdsType._id] 
            },
            { 
                name: 'Header Ad', 
                slug: 'header-ad', 
                total_allowed: 1, 
                ad_type: [headerAdsType._id] 
            },
            { 
                name: 'Home Page', 
                slug: 'home-page', 
                total_allowed: 10, 
                ad_type: [homeAdsType._id] 
            },
            { 
                name: 'Inner Content', 
                slug: 'inner-content', 
                total_allowed: 7, 
                ad_type: [innerAdsType._id] 
            },
            { 
                name: 'Sidebar Section', 
                slug: 'sidebar-section', 
                total_allowed: 4, 
                ad_type: [sidebarAdsType._id] 
            }
        ];

        // Insert each ad position into the database
        for (const positionData of adPositions) {
            const newPosition = new AdPosition(positionData);
            const savedPosition = await newPosition.save();
            console.log('AdPosition created:', savedPosition);
        }
    } catch (error) {
        console.error('Error creating AdPosition:', error.message);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
console.log('Database connection closed.');
    }
}

// Run the seeder
(async () => {
    await connectDB();
    await createAdPosition();
})();
