// models/Post.js
const mongoose = require('mongoose');

const CustomFieldValue = require('./CustomFieldValue');

// Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  slug: { type: String, required: [true, 'Slug is required'], unique: true },
  tag_line: { type: String, default: '' }, // Optional field
  summary: { type: String, default: '' }, // Optional field
  content: { type: String, required: [true, 'Content is required'] },
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category is required'] }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  tags: { type: [String] },
  photo_gallery: { type: Boolean, default: false }, // Indicates if there is a photo gallery
  gallery: { type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' }, // Reference to Gallery schema
  published: { type: Boolean, default: false },
  published_date: { type: Date, default: Date.now },
  featured_image: { type: String, default: null },
}, { timestamps: true }); 

// Middleware to delete associated CustomFieldValue entries when a post is deleted
postSchema.pre("findOneAndDelete", async function (next) {
  try {
    // Get the ID of the post to be deleted
    const postId = this.getQuery()["_id"];

    // Delete all CustomFieldValue documents associated with this post
    await CustomFieldValue.deleteMany({ entityId: postId });

    next();
  } catch (error) {
    console.error("Error deleting associated CustomFieldValues:", error);
    next(error);
  }
});

// Export the Post model
module.exports = mongoose.model('Post', postSchema);
