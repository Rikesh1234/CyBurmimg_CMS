// models/StaticPage.js
const mongoose = require('mongoose');

const staticPageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  featured_image: {
    type: String,
    default: '/uploads/pages/default.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StaticPage', staticPageSchema);
    