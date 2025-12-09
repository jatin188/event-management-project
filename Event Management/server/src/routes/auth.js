const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/User');
const Invitation = require('../models/Invitation');
const { sign } = require('../utils/generateToken');
const { sendMail } = require('../config/mailer');

router.post('/signup', async (req,res) => {
  try {
    const { name, email, password, inviteToken } = req.body;
    if (!email || !password) return res.status(400).json({ message:'Email+password required' });
    let role = 'USER';
    if (inviteToken) {
      const inv = await Invitation.findOne({ token: inviteToken, used:false });
      if (inv) { role = inv.role === 'ORGANIZER' ? 'ORGANIZER' : 'USER'; inv.used=true; await inv.save(); }
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message:'Email used' });
    const passwordHash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, passwordHash, role, isVerified:false });
    const token = crypto.randomBytes(32).toString('hex');
    u.emailVerifyToken = token; await u.save();
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}&id=${u._id}`;
    try { await sendMail({ to: u.email, from: process.env.EMAIL_USER, subject:'Verify email', html:`Click <a href="${verifyLink}">here</a>` }); } catch(e){ console.warn('Email send failed', e.message); }
    const jwt = sign({ id: u._id, role: u.role });
    res.json({ token: jwt, user: { id: u._id, email: u.email, name: u.name, role: u.role } });
  } catch (e) { console.error(e); res.status(500).json({ message:'Server error' }); }
});

router.post('/verify-email', async (req,res) => {
  try {
    const { id, token } = req.body;
    const u = await User.findById(id);
    if (!u || u.emailVerifyToken !== token) return res.status(400).json({ message:'Invalid' });
    u.isVerified=true; u.emailVerifyToken=undefined; await u.save(); res.json({ ok:true });
  } catch (e) { res.status(500).json({ message:'Server error' }); }
});

router.post('/login', async (req,res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message:'Missing' });
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ message:'Invalid credentials' });
    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(400).json({ message:'Invalid credentials' });
    const token = sign({ id: u._id, role: u.role });
    res.json({ token, user: { id: u._id, name: u.name, email: u.email, role: u.role, isVerified: u.isVerified } });
  } catch (e) { res.status(500).json({ message:'Server error' }); }
});

router.post('/forgot-password', async (req,res) => {
  try {
    const { email } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.json({ ok:true });
    const token = crypto.randomBytes(32).toString('hex');
    u.resetToken = token; u.resetTokenExp = Date.now() + 3600000; await u.save();
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}&id=${u._id}`;
    try { await sendMail({ to: u.email, from: process.env.EMAIL_USER, subject:'Reset password', html:`Click <a href="${link}">here</a>` }); } catch(e){ console.warn('mail fail', e.message); }
    res.json({ ok:true });
  } catch (e) { res.status(500).json({ message:'Server error' }); }
});

router.post('/reset-password', async (req,res) => {
  try {
    const { id, token, newPassword } = req.body;
    const u = await User.findById(id);
    if (!u || !u.resetToken || u.resetToken !== token || Date.now() > u.resetTokenExp) return res.status(400).json({ message:'Invalid or expired' });
    u.passwordHash = await bcrypt.hash(newPassword, 10); u.resetToken=undefined; u.resetTokenExp=undefined; await u.save();
    res.json({ ok:true });
  } catch (e) { res.status(500).json({ message:'Server error' }); }
});

module.exports = router;
