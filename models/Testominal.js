// models/Testominal.js
const mongoose = require('mongoose');

// Team Schema
const testominalSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  designation: { type: String, required: [true, 'Designation is required'] },
  content: { type: String},
  published: { type: Boolean, default: false},
  published_date: { type: Date, default: Date.now},
  featured_image: { type: String, default: '/images/default.jpg'},
  createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Testominal', testominalSchema);
