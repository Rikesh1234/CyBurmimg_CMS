const mongoose= require('mongoose');

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;