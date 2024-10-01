const mongoose = require('mongoose');
const User = require('../../models/user');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/inferno_cms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Insert a new user
async function createDummyUser() {
    try {
        const newUser = new User({
            username: 'CyBurning',
            email: 'support@cyburning.com',
            password: '#!ogin@123', // This will be hashed automatically
            role: 'admin',
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