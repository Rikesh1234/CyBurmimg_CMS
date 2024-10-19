// models/Team.js
const mongoose = require('mongoose');

// Team Schema
const teamSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  designation: { type: String, required: [true, 'Designation is required'] },
  category: { type: [String], required: [true, 'Category is required'] },
  email: { type: String, required: [true, 'Email is required']},
  facebook: { type: String},
  instagram: { type: String},
  twitter: { type: String},
  linkedin: { type: String},
  content: { type: String},
  published: { type: Boolean, default: false},
  published_date: { type: Date, default: Date.now},
  featured_image: { type: String, default: '/images/default.jpg'},
  createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Team', teamSchema);
