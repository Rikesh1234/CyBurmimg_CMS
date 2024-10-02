
// models/Model.js
const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // E.g., 'Post', 'User'
    path: { type: String, required: true }, // Path to the model file or controller
  createdAt: { type: Date, default: Date.now}

});

module.exports = mongoose.model('Model', modelSchema);
