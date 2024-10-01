const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  includes: {
    type: [String], 
    required: [true, 'Includes field is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Package', PackageSchema);
