// const mongoose = require('mongoose');
// const Role = require('../../models/Role');
// const Permission = require('../../models/Permission');

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/inferno_cms', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// async function createAdminRole() {
//     try {
//         // Fetch all permissions
//         const allPermissions = await Permission.find();
//         const allPermissionIds = allPermissions.map(permission => permission._id);

//         // Create the Admin role
//         const adminRole = new Role({
//             name: 'Admin',
//             slug: 'admin',
//             permissions: allPermissionIds,
//             published: true
//         });

//         const savedAdminRole = await adminRole.save();
//         console.log('Admin Role created:', savedAdminRole);
//         return savedAdminRole._id;
//     } catch (error) {
//         console.error('Error creating Admin role:', error.message);
//     } finally {
//         mongoose.connection.close();
//     }
// }

// createAdminRole();

require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../../models/Role');
const Permission = require('../../models/Permission');

// Connect to MongoDB using connection string from environment variables
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err.message));

async function createOrUpdateAdminRole() {
    try {
        // Fetch all permissions
        const allPermissions = await Permission.find();
        const allPermissionIds = allPermissions.map(permission => permission._id);

        // Check if the Admin role already exists
        let adminRole = await Role.findOne({ slug: 'admin' });

        if (adminRole) {
            // If the role exists, update its permissions
            adminRole.permissions = allPermissionIds;
            const updatedAdminRole = await adminRole.save();
            console.log('Admin Role updated:', updatedAdminRole);
            return updatedAdminRole._id;
        } else {
            // Create the Admin role if it does not exist
            adminRole = new Role({
                name: 'Admin',
                slug: 'admin',
                permissions: allPermissionIds,
                published: true
            });
            const savedAdminRole = await adminRole.save();
            console.log('Admin Role created:', savedAdminRole);
            return savedAdminRole._id;
        }
    } catch (error) {
        console.error('Error creating/updating Admin role:', error.message);
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

createOrUpdateAdminRole();
