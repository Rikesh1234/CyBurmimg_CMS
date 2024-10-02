const mongoose = require('mongoose');
const User = require('../../models/user');
const Role = require('../../models/Role');

// Connect to MongoDB
const uri = 'mongodb://localhost:27017/inferno_cms';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Insert a new user
async function createDummyUser() {
    try {
        // Fetch the Admin role by slug 
        const adminRole = await Role.findOne({ slug: 'admin' });

        // If no Admin role is found, throw an error
        if (!adminRole) {
            throw new Error('Admin role not found. Please ensure you have seeded the Admin role.');
        }

        // Create the new user with the role's ObjectId
        const newUser = new User({
            username: 'CyBurning',
            email: 'support@cyburning.com',
            password: '#!ogin@123', // This will be hashed automatically
            role: adminRole._id, // Assign the Admin role's ObjectId
            status: 'active'
        });

        const savedUser = await newUser.save();
        console.log('User created:', savedUser);
    } catch (error) {
        console.error('Error creating user:', error.message);
    } finally {
        mongoose.connection.close(); // Close the database connection
    }
}

createDummyUser();
