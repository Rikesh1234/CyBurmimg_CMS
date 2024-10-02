const mongoose = require('mongoose');
const Role = require('../../models/Role');
const Permission = require('../../models/Permission');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/inferno_cms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function createAdminRole() {
    try {
        // Fetch all permissions
        const allPermissions = await Permission.find();
        const allPermissionIds = allPermissions.map(permission => permission._id);

        // Create the Admin role
        const adminRole = new Role({
            name: 'Admin',
            slug: 'admin',
            permissions: allPermissionIds,
            published: true
        });

        const savedAdminRole = await adminRole.save();
        console.log('Admin Role created:', savedAdminRole);
        return savedAdminRole._id;
    } catch (error) {
        console.error('Error creating Admin role:', error.message);
    } finally {
        mongoose.connection.close(); // Close the database connection
    }
}

createAdminRole();
