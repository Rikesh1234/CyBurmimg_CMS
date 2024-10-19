
// models/Model.js
const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, 
    path: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now}

});

const Model = mongoose.model('Model', modelSchema);
module.exports = Model;
