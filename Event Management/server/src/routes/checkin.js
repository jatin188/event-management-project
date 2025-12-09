const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

router.post('/validate', async (req,res) => {
  try {
    const { ticketId } = req.body;
    const reg = await Registration.findOne({ ticketId });
    if (!reg) return res.status(404).json({ valid:false, message:'Ticket not found' });
    if (reg.status === 'used') return res.json({ valid:false, message:'Ticket already used' });
    reg.status = 'used'; await reg.save();
    res.json({ valid:true, message:'Checked in' });
  } catch (e) { console.error(e); res.status(500).json({ message:'Server error' }); }
});

module.exports = router;
