
// models/Role.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
    name: { type: String, required: true, unique: true }, // E.g., 'Admin', 'Editor', 'User'
    slug: { type: String, required: [true, 'Slug is required'], unique: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }] ,// Array of permission references
    published: { type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Role', roleSchema);
