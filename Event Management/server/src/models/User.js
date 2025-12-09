const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: String,
  role: { type: String, enum: ['USER','ADMIN','ORGANIZER'], default: 'USER' },
  isVerified: { type: Boolean, default: false },
  emailVerifyToken: String,
  resetToken: String,
  resetTokenExp: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);
