// models/Role.js
const mongoose = require('mongoose');

// Role Schema
const roleSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  slug: { type: String, required: [true, 'Slug is required'], unique: true },
  published: { type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Role', roleSchema);
