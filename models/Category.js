// models/Category.js
const mongoose = require('mongoose');
const Post = require('./Post'); 



// Category Schema
const categorySchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  slug: { type: String, required: [true, 'Slug is required'], unique: true },
  tag_line: { type: String },
  content: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  featured_image: { type: String, default: '/uploads/category/default.jpg' },
  createdAt: { type: Date, default: Date.now },
  order: { type: Number, default: 999 }, 

});

// Condtion to check to if category is assigned or not
categorySchema.pre('remove', async function (next) {
    const categoryId = this._id;
    
    // Check if this category is used in any post
    const postCount = await Post.countDocuments({ category: categoryId });
    if (postCount > 0) {
      next(new Error('Cannot delete category as it is assigned to one or more posts.'));
    } else {
      next();
    }
  });

module.exports = mongoose.model('Category', categorySchema);
