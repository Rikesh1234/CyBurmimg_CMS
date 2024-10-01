// models/Permission.js
const mongoose = require('mongoose');

// Permission Schema
const permissionSchema = new mongoose.Schema({
  type: { type: String, required:true},
  model_id: { type: mongoose.Schema.Types.ObjectId, ref:'Model', required:true},
  createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Permission', permissionSchema);
