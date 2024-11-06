require('dotenv').config();
const mongoose = require('mongoose');
const Field = require('../../models/Fields');

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
async function createFields() {
    const fields = [
        { name: 'Text', slug: 'text' },
        { name: 'TextArea', slug: 'textarea' },
        { name: 'Direct Image Uploader', slug: 'directImageUploader' },
    ];

    try {
        for (const fieldData of fields) {
            const newModel = new Field(fieldData);
            const savedModel = await newModel.save();
            console.log('Field Created:', savedModel);
        }
    } catch (error) {
        console.error('Error creating field:', error.message);
    } finally {
        // Close the database connection without a callback
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

(async () => {
    await connectDB();
    await createFields();
})();
