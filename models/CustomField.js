// models/usomField.js
const mongoose = require('mongoose');



// CustomField Schema
const customFieldSchema = new mongoose.Schema({
  title: { type: String, default: null },
  model: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: [true, 'Model is required'] }],
  target_type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Field', default: null }],
  label_name: { type: [String], default: null },
  field_name: { type: [String], default: null },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomField', default: null },
  staticId: { type: mongoose.Schema.Types.ObjectId, ref: 'StaticPage', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomField', customFieldSchema);
