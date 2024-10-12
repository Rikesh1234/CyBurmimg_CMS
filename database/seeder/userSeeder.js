// const mongoose = require('mongoose');
// const User = require('../../models/user');
// const Role = require('../../models/Role');

// // Connect to MongoDB
// const uri = 'mongodb://localhost:27017/inferno_cms';
// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
    
// // Insert a new user
// async function createDummyUser() {
//     try {
//         // Fetch the Admin role by slug 
//         const adminRole = await Role.findOne({ slug: 'admin' });

//         // If no Admin role is found, throw an error
//         if (!adminRole) {
//             throw new Error('Admin role not found. Please ensure you have seeded the Admin role.');
//         }

//         // Create the new user with the role's ObjectId
//         const newUser = new User({
//             username: 'CyBurning',
//             email: 'support@cyburning.com',
//             password: '#!ogin@123', // This will be hashed automatically
//             role: adminRole._id, // Assign the Admin role's ObjectId
//             status: 'active'
//         });

//         const savedUser = await newUser.save();
//         console.log('User created:', savedUser);
//     } catch (error) {
//         console.error('Error creating user:', error.message);
//     } finally {
//         mongoose.connection.close(); // Close the database connection
//     }
// }

// createDummyUser();
require('dotenv').config(); 

const mongoose = require('mongoose');
const User = require('../../models/user');
const Role = require('../../models/Role');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err.message));

// Insert or Update a user
async function createOrUpdateDummyUser() {
    try {
        // Fetch the Admin role by slug 
        const adminRole = await Role.findOne({ slug: 'admin' });

        // If no Admin role is found, throw an error
        if (!adminRole) {
            throw new Error('Admin role not found. Please ensure you have seeded the Admin role.');
        }

        // Check if the user already exists (based on a unique field, e.g., email)
        const existingUser = await User.findOne({ email: 'support@cyburning.com' });

        if (existingUser) {
            // If the user exists, update its fields (except password unless specified)
            existingUser.username = 'CyBurning';
            existingUser.role = adminRole._id; // Update the role to Admin role
            existingUser.status = 'active';

            const updatedUser = await existingUser.save();
            console.log('User updated:', updatedUser);
        } else {
            // If the user does not exist, create a new user
            const newUser = new User({
                username: 'CyBurning',
                email: 'support@cyburning.com',
                password: '#!ogin@123', // Ensure password is hashed in your schema
                role: adminRole._id, // Assign the Admin role's ObjectId
                status: 'active'
            });

            const savedUser = await newUser.save();
            console.log('User created:', savedUser);
        }
    } catch (error) {
        console.error('Error creating/updating user:', error.message);
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

createOrUpdateDummyUser();
