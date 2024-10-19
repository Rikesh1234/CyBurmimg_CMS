// models/Partner.js
const mongoose = require('mongoose');

// Partner Schema
const partnerSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  url: { type: String},
  published: { type: Boolean, default: false},
  published_date: { type: Date, default: Date.now},
  featured_image: { type: String, default: '/images/default.jpg'},
  createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Partner', partnerSchema);
