// models/Role_Permission.js
const mongoose = require('mongoose');

// Role_Permission Schema
const permissionSchema = new mongoose.Schema({
    
  role_id: { type: mongoose.Schema.Types.ObjectId, ref:'Role', required:true},  
  permission_id: { type: mongoose.Schema.Types.ObjectId, ref:'Permission', required:true},
  createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Permission', permissionSchema);
