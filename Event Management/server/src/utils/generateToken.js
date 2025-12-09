const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'devsecret';
module.exports = {
  sign(payload) { return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }); },
  verify(token) { return jwt.verify(token, secret); }
};
