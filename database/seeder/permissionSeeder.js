const mongoose = require('mongoose');
const Model = require('../../models/Model');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/inferno_cms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Insert a new user
async function createPermission(type,model_id) {
    try {
        const newModel = new Model({
            type,
            model_id
        });

        const savedPermission = await newModel.save();
        console.log('Permission created:', savedPermission);
    } catch (error) {
        console.error('Error creating permission:', error.message);
    } finally {
        mongoose.connection.close(); // Close the database connection
    }
}

createPermission();