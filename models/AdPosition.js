
// models/Field.js
const mongoose = require('mongoose');

const AdPositionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, 
    slug: { type: String, required: true },
    total_allowed: {type: Number, required: true}, 
    ad_type: { type: mongoose.Schema.Types.ObjectId, ref: 'AdType', required: [true, 'AdType is required'] },
  createdAt: { type: Date, default: Date.now}

});

module.exports = mongoose.model('AdPosition', AdPositionSchema);
