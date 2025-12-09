const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const { generateTicketPDF } = require('../utils/pdfTicket');
const { sendMail } = require('../config/mailer');

router.get('/:regId/pdf', async (req,res) => {
  try {
    const reg = await Registration.findById(req.params.regId);
    if (!reg) return res.status(404).json({ message:'No reg' });
    const ev = await Event.findById(reg.eventId);
    const user = await User.findById(reg.userId);
    const buf = await generateTicketPDF(reg, ev, user);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${reg.ticketId}.pdf`);
    res.send(buf);
  } catch (e) { console.error(e); res.status(500).json({ message:'Server error' }); }
});

router.post('/:regId/send', async (req,res) => {
  try {
    const reg = await Registration.findById(req.params.regId);
    const ev = await Event.findById(reg.eventId);
    const user = await User.findById(reg.userId);
    const pdfBuf = await generateTicketPDF(reg, ev, user);
    try {
      await sendMail({ to: user.email, from: process.env.EMAIL_USER, subject: `Your ticket for ${ev.title}`, text: `Attached is your ticket.`, attachments: [{ filename:'ticket.pdf', content: pdfBuf }] });
    } catch(e) { console.warn('mail send fail', e.message); }
    res.json({ ok:true });
  } catch (e) { console.error(e); res.status(500).json({ message:'Server error' }); }
});

module.exports = router;
