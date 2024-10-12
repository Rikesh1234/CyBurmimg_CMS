
// models/Field.js
const mongoose = require('mongoose');

const AdTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, 
    slug: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now}

});

module.exports = mongoose.model('AdType', AdTypeSchema);
