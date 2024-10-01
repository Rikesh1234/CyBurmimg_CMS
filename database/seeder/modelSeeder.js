const mongoose = require('mongoose');
const Model = require('../../models/Model');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/inferno_cms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Insert a new user
async function createModel(name,path) {
    try {
        const newModel = new Model({
            name,
            path
        });

        const savedModel = await newModel.save();
        console.log('Model created:', savedModel);
    } catch (error) {
        console.error('Error creating model:', error.message);
    } finally {
        mongoose.connection.close(); // Close the database connection
    }
}

createModel();