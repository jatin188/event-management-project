const mongoose = require('mongoose');
const regSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending','confirmed','cancelled','used'], default: 'confirmed' },
  ticketId: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Registration', regSchema);
