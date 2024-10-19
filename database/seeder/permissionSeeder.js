require('dotenv').config(); 
const mongoose = require('mongoose');
const Permission = require('../../models/Permission');
const Model = require('../../models/Model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err.message));

// Function to create or update permissions for a model
async function createOrUpdatePermissionsForModel(modelName) {
    try {
        // Fetch the model from the database
        const model = await Model.findOne({ name: modelName });
        if (!model) throw new Error(`Model ${modelName} not found`);

        // Define the permission types
        const types = ['Create', 'Read', 'Update', 'Delete'];
        for (const type of types) {
            // Check if the permission already exists
            const existingPermission = await Permission.findOne({ type, model: model._id });

            if (existingPermission) {
                console.log(`Permission already exists: ${type} for ${modelName}, skipping...`);
            } else {
                // Create a new permission if it doesn't exist
                const permission = new Permission({
                    type,
                    model: model._id // Use the model's ObjectId
                });
                await permission.save();
                console.log(`Permission created: ${type} for ${modelName}`);
            }
        }
    } catch (error) {
        console.error('Error creating/updating permission:', error.message);
    }
}

// Function to sync permissions
async function syncPermissions() {
    try {
        // The list of models in the seeder
        const modelNames = [
            'Post', 'Category', 'StaticPage', 'Slider', 'Team',
            'TeamType', 'Testimonial', 'User', 'Role', 'Package', 'CustomField',
            'Advertisement'
        ];

        // Fetch all models that are in the seeder
        const modelDocs = await Model.find({ name: { $in: modelNames } });

        // Create or update permissions for models in the seeder
        for (const modelName of modelNames) {
            await createOrUpdatePermissionsForModel(modelName);
        }

        // Fetch all existing permissions in the database
        const existingPermissions = await Permission.find();

        // Build a list of valid model ObjectIds based on the seeder
        const validModelIds = modelDocs.map(model => model._id.toString());

        // Delete permissions whose model is not in the valid models list
        for (const permission of existingPermissions) {
            const permissionModelId = permission.model.toString();
            if (!validModelIds.includes(permissionModelId)) {
                await Permission.deleteOne({ _id: permission._id });
                console.log(`Deleted permission: ${permission.type} for model ID ${permissionModelId}`);
            }
        }

    } catch (error) {
        console.error('Error syncing permissions:', error.message);
    } finally {
        // Properly close the database connection
        try {
            await mongoose.connection.close();
            console.log('Database connection closed.');
        } catch (closeError) {
            console.error('Error closing the database connection:', closeError.message);
        }
    }
}

// Run the sync function
syncPermissions();
