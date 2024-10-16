// models/Gallery.js
const mongoose = require('mongoose');

// Gallery Schema
const gallerySchema = new mongoose.Schema({
  images: [{
    url: { type: String, required: [true, 'Image URL is required'] }, // URL of the image
    caption: { type: String, default: '' } // Optional caption for the image
  }],
  createdAt: { type: Date, default: Date.now } // Timestamp for gallery creation
});

// Export the Gallery model
module.exports = mongoose.model('Gallery', gallerySchema);
