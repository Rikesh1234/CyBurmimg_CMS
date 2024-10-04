
// const mongoose = require('mongoose');
// const Permission = require('../../models/Permission');
// const Model = require('../../models/Model');

// mongoose.connect('mongodb://localhost:27017/inferno_cms', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// async function createPermissionsForModel(modelName) {
//     try {
//         // Fetch the model from the database
//         const model = await Model.findOne({ name: modelName });
//         if (!model) throw new Error(`Model ${modelName} not found`);

//         // Create permissions for the model
//         const types = ['Create', 'Read', 'Update', 'Delete'];
//         for (const type of types) {
//             const permission = new Permission({
//                 type,
//                 model: model._id // Use the model's ObjectId
//             });
//             await permission.save();
//             console.log(`Permission created: ${type} for ${modelName}`);
//         }
//     } catch (error) {
//         console.error('Error creating permission:', error.message);
//     }
// }

// async function seedPermissions() {
//     try {
//         await createPermissionsForModel('Post');
//         await createPermissionsForModel('Category');
//         await createPermissionsForModel('Author');
//         await createPermissionsForModel('StaticPage');
//         await createPermissionsForModel('Slider');
//         await createPermissionsForModel('Team');
//         await createPermissionsForModel('TeamType');
//         await createPermissionsForModel('Testimonial');
//         await createPermissionsForModel('User');
//         await createPermissionsForModel('Role');
//         await createPermissionsForModel('Package');
//         await createPermissionsForModel('CustomField');
//     } finally {
//         mongoose.connection.close(); // Close the database connection
//     }
// }

// seedPermissions();

require('dotenv').config(); 
const mongoose = require('mongoose');
const Permission = require('../../models/Permission');
const Model = require('../../models/Model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err.message));

// Function to create permissions for a model
async function createPermissionsForModel(modelName) {
    try {
        // Fetch the model from the database
        const model = await Model.findOne({ name: modelName });
        if (!model) throw new Error(`Model ${modelName} not found`);

        // Create permissions for the model
        const types = ['Create', 'Read', 'Update', 'Delete'];
        for (const type of types) {
            const permission = new Permission({
                type,
                model: model._id // Use the model's ObjectId
            });
            await permission.save();
            console.log(`Permission created: ${type} for ${modelName}`);
        }
    } catch (error) {
        console.error('Error creating permission:', error.message);
    }
}

// Function to seed all permissions
async function seedPermissions() {
    try {
        await createPermissionsForModel('Post');
        await createPermissionsForModel('Category');
        await createPermissionsForModel('Author');
        await createPermissionsForModel('StaticPage');
        await createPermissionsForModel('Slider');
        await createPermissionsForModel('Team');
        await createPermissionsForModel('TeamType');
        await createPermissionsForModel('Testimonial');
        await createPermissionsForModel('User');
        await createPermissionsForModel('Role');
        await createPermissionsForModel('Package');
        await createPermissionsForModel('CustomField');
    } catch (error) {
        console.error('Error seeding permissions:', error.message);
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

// Run the seed function
seedPermissions();
