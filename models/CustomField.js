// models/usomField.js
const mongoose = require('mongoose');

// CustomField Schema
const customFieldSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  model: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: [true, 'Model is required'] }],
  target_type: { type: [String],required: [true, 'target_type is required'] },
  label_name: { type: [String],required: [true, 'label_name is required'] },
  field_name: { type: [String], required: [true, 'field_name is required'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomField', customFieldSchema);
