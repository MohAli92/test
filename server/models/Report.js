const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);