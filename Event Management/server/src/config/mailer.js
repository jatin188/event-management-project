const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMail(opts) {
  try {
    return transporter.sendMail(opts);
  } catch (e) {
    console.warn('sendMail failed:', e.message);
    throw e;
  }
}

module.exports = { sendMail };
