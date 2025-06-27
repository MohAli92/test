const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  photo: String,
  ingredients: [String],
  allergies: [String],
  city: String,
  address: String,
  description: String,
  range: String,
  time: Date,
  reserved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);