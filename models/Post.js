// models/Post.js
const mongoose = require('mongoose');

// Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  slug: { type: String, required: [true, 'Slug is required'], unique: true },
  tag_line: { type: String },
  summary: { type: String },
  content: { type: String, required: [true, 'Content is required'] },
  category: { type: [String], required: [true, 'Category is required'] },
  author: { type: String, required: [true, 'Author is required'] },
  tags: { type: [String] },
  photo_gallery: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  published_date: { type: Date, default: Date.now },
  featured_image: { type: String, default: '/images/default.jpg' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
