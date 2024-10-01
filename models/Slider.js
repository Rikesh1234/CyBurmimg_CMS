// models/Slider.js
const mongoose = require('mongoose');

// Slider Schema
const sliderSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Name is required'] },
  subtitle: { type: String},
  published: { type: Boolean, default: false},
  published_date: { type: Date, default: Date.now},
  featured_image: { type: String, default: '/images/default.jpg'},
  createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Slider', sliderSchema);
