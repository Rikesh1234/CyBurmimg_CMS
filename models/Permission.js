// models/Permission.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const permissionSchema = new Schema({
    type: { type: String, required: true, enum: ['Create', 'Read', 'Update', 'Delete'] },
    model: { type: Schema.Types.ObjectId, ref: 'Model', required: true }, 
    createdAt: { type: Date, default: Date.now}


});

module.exports = mongoose.model('Permission', permissionSchema);
