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

// Insert, update, or delete models based on the seeder
async function syncModels() {
    const seederModels = [
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
        { name: 'Advertisement', path: '../models/Advertisement' },
        { name: 'CustomField', path: '../models/CustomField' }
    ];

    try {
        // Step 1: Get all models from the database
        const dbModels = await Model.find();

        // Step 2: Loop through seeder data and either create or update models
        for (const modelData of seederModels) {
            const existingModel = dbModels.find(dbModel => dbModel.name === modelData.name);

            if (existingModel) {
                // If model exists in DB, update it with the seeder data
                await Model.updateOne({ _id: existingModel._id }, modelData);
                console.log(`Model updated: ${modelData.name}`);
            } else {
                // If model doesn't exist, create a new one
                const newModel = new Model(modelData);
                await newModel.save();
                console.log(`Model created: ${modelData.name}`);
            }
        }

        // Step 3: Delete any models in the DB that are not in the seeder
        const seederModelNames = seederModels.map(model => model.name);
        const modelsToDelete = dbModels.filter(dbModel => !seederModelNames.includes(dbModel.name));

        for (const modelToDelete of modelsToDelete) {
            await Model.deleteOne({ _id: modelToDelete._id });
            console.log(`Model deleted: ${modelToDelete.name}`);
        }

    } catch (error) {
        console.error('Error syncing models:', error.message);
    } finally {
        // Close the database connection after syncing
        await mongoose.connection.close();
console.log('Database connection closed.');
    }
}

(async () => {
    await connectDB();
    await syncModels();
})();
