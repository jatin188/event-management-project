const mongoose = require('mongoose');
const invitationSchema = new mongoose.Schema({
  email: String,
  role: { type: String, enum: ['ORGANIZER','ADMIN'], default: 'ORGANIZER' },
  token: String,
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Invitation', invitationSchema);

