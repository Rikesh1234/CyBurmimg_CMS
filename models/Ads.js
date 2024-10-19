const mongoose = require('mongoose');

// Define the Ad Schema
const adsSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the ad
  AdPosition: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AdPosition' }], // Relational key reference to AdPosition, allows multiple entries (array)
  startDate: { type: Date, required: true }, // Start date for the ad
  expiredDate: { type: Date, required: true }, // Expiration date for the ad
  publishedDate: { type: Date, default: Date.now }, // Published date, defaults to current date
  featuredImage: { type: String, default: null }, // URL or path to the featured image
  published: { type: Boolean, default: false },
});

module.exports = mongoose.model('Ads', adsSchema);
