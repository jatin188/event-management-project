const mongoose = require('mongoose');
const scheduleItem = new mongoose.Schema({ time: String, activity: String }, { _id:false });
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  venueId: String,
  category: String,
  tags: [String],
  capacity: Number,
  registeredCount: { type: Number, default: 0 },
  price: Number,
  imageUrl: String,
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  schedule: [scheduleItem],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Event', eventSchema);
