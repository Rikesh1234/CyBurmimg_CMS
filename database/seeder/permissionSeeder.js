// const mongoose = require('mongoose');
// const Permission = require('../../models/Permission');

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/inferno_cms', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// // Insert a new permission
// async function createPermission(type,model_id) {
//     try {
//         const newModel = new Permission({
//             type,
//             model_id
//         });

//         const savedPermission = await newModel.save();
//         console.log('Permission created:', savedPermission);
//     } catch (error) {
//         console.error('Error creating permission:', error.message);
//     } finally {
//         mongoose.connection.close(); // Close the database connection
//     }
// }

// //Post
// createPermission('Create','66fc98c6f1cc1fc8572784b1');
// createPermission('Read','66fc98c6f1cc1fc8572784b1');
// createPermission('Edit','66fc98c6f1cc1fc8572784b1');
// createPermission('Delete','66fc98c6f1cc1fc8572784b1');

// //Categories
// createPermission('Create','66fc98c6f1cc1fc8572784b2');
// createPermission('Read','66fc98c6f1cc1fc8572784b2');
// createPermission('Edit','66fc98c6f1cc1fc8572784b2');
// createPermission('Delete','66fc98c6f1cc1fc8572784b2');

// //Static Page
// createPermission('Create','66fc98c6f1cc1fc8572784b3');
// createPermission('Read','66fc98c6f1cc1fc8572784b3');
// createPermission('Edit','66fc98c6f1cc1fc8572784b3');
// createPermission('Delete','66fc98c6f1cc1fc8572784b3');

// //Slider
// createPermission('Create','66fc98c6f1cc1fc8572784b4');
// createPermission('Read','66fc98c6f1cc1fc8572784b4');
// createPermission('Edit','66fc98c6f1cc1fc8572784b4');
// createPermission('Delete','66fc98c6f1cc1fc8572784b4');

// //Team
// createPermission('Create','66fc98c6f1cc1fc8572784b5');
// createPermission('Read','66fc98c6f1cc1fc8572784b5');
// createPermission('Edit','66fc98c6f1cc1fc8572784b5');
// createPermission('Delete','66fc98c6f1cc1fc8572784b5');

// //Team Type
// createPermission('Create','66fc98c6f1cc1fc8572784b6');
// createPermission('Read','66fc98c6f1cc1fc8572784b6');
// createPermission('Edit','66fc98c6f1cc1fc8572784b6');
// createPermission('Delete','66fc98c6f1cc1fc8572784b6');

// //Testimonial
// createPermission('Create','66fc98c6f1cc1fc8572784b7');
// createPermission('Read','66fc98c6f1cc1fc8572784b7');
// createPermission('Edit','66fc98c6f1cc1fc8572784b7');
// createPermission('Delete','66fc98c6f1cc1fc8572784b7');

// //User
// createPermission('Create','66fc98c6f1cc1fc8572784b8');
// createPermission('Read','66fc98c6f1cc1fc8572784b8');
// createPermission('Edit','66fc98c6f1cc1fc8572784b8');
// createPermission('Delete','66fc98c6f1cc1fc8572784b8');

// //Package
// createPermission('Create','66fc98c6f1cc1fc8572784b9');
// createPermission('Read','66fc98c6f1cc1fc8572784b9');
// createPermission('Edit','66fc98c6f1cc1fc8572784b9');
// createPermission('Delete','66fc98c6f1cc1fc8572784b9');

// //Custom Field
// createPermission('Create','66fc98c6f1cc1fc8572784ba');
// createPermission('Read','66fc98c6f1cc1fc8572784ba');
// createPermission('Edit','66fc98c6f1cc1fc8572784ba');
// createPermission('Delete','66fc98c6f1cc1fc8572784ba');


const mongoose = require('mongoose');
const Permission = require('../../models/Permission');
const Model = require('../../models/Model');

mongoose.connect('mongodb://localhost:27017/inferno_cms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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
    } finally {
        mongoose.connection.close(); // Close the database connection
    }
}

seedPermissions();
