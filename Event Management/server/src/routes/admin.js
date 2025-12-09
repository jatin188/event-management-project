const express = require('express');
const router = express.Router();
const Invitation = require('../models/Invitation');
const Registration = require('../models/Registration');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const crypto = require('crypto');
const { sendMail } = require('../config/mailer');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { Parser } = require('json2csv');
const upload = multer({ dest: 'tmp/' });

router.post('/invite', requireAuth, requireRole('ADMIN'), async (req,res) => {
  try {
    const { email, role } = req.body;
    const token = crypto.randomBytes(20).toString('hex');
    const inv = await Invitation.create({ email, role: role || 'ORGANIZER', token });
    const link = `${process.env.FRONTEND_URL}/signup?invite=${token}`;
    try { await sendMail({ to: email, from: process.env.EMAIL_USER, subject: 'You are invited', html: `Join: <a href="${link}">Sign up</a>` }); } catch(e){ console.warn(e.message); }
    res.json({ ok:true });
  } catch (e) { console.error(e); res.status(500).json({ message:'Server error' }); }
});

router.post('/import-events', requireAuth, requireRole('ADMIN'), upload.single('file'), async (req,res) => {
  try {
    const path = req.file.path; const results = [];
    fs.createReadStream(path).pipe(csv()).on('data', data => results.push(data)).on('end', async () => {
      fs.unlinkSync(path);
      // NOTE: simple import - transform as needed
      res.json({ imported: results.length });
    });
  } catch (e) { console.error(e); res.status(500).json({ message:'Server error' }); }
});

router.get('/export-registrations', requireAuth, requireRole('ADMIN'), async (req,res) => {
  try {
    const regs = await Registration.find({}).populate('eventId').populate('userId');
    const rows = regs.map(r => ({ ticketId: r.ticketId, event: r.eventId?.title || '', user: r.userId?.email || '', status: r.status, createdAt: r.createdAt }));
    const parser = new Parser(); const csvData = parser.parse(rows);
    res.header('Content-Type','text/csv'); res.attachment('registrations.csv'); res.send(csvData);
  } catch (e) { console.error(e); res.status(500).json({ message:'Server error' }); }
});

module.exports = router;
