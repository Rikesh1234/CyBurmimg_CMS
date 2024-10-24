// models/CustomFieldValue.js
const mongoose = require("mongoose");

const customFieldValueSchema = new mongoose.Schema({
  customField: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomField",
    required: true,
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Model",
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  fieldName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CustomFieldValue", customFieldValueSchema);
