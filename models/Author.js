// models/Author.js
const mongoose = require('mongoose');
const Post = require('./Post');

// Author Schema
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
  },
  content: { type: String },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  featured_image: {
    type: String,
    default: '/uploads/author/default.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to prevent deletion if author is assigned to any post
authorSchema.pre('remove', async function (next) {
  try {
    const postCount = await Post.countDocuments({ author: this._id });
    if (postCount > 0) {
      next(new Error('Cannot delete author as they are assigned to one or more posts.'));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Author', authorSchema);
