// models/Model.js
const mongoose = require('mongoose');

// Model Schema
const modelSchema = new mongoose.Schema({
  name: { type: String},
  path: { type: String,},
  createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Model', modelSchema);
