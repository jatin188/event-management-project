const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// GET /api/events
router.get('/', async (req,res) => {
  try {
    const { q, category, tags, from, to, page=1, limit=20, sort } = req.query;
    const filter = {};
    if (q) filter.$or = [{ title: new RegExp(q,'i') }, { description: new RegExp(q,'i') }, { location: new RegExp(q,'i') }];
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(',') };
    if (from || to) filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
    let query = Event.find(filter);
    if (sort === 'popular') query = query.sort({ registeredCount: -1 });
    else query = query.sort({ date: 1 });
    const total = await Event.countDocuments(filter);
    const pageNum = Math.max(1, Number(page));
    const docs = await query.skip((pageNum-1)*limit).limit(Number(limit)).exec();
    res.json({ total, page: pageNum, events: docs });
  } catch (e) { console.error(e); res.status(500).json({ message:'Server error' }); }
});

// POST create (admin/organizer)
router.post('/', requireAuth, requireRole('ADMIN','ORGANIZER'), async (req,res) => {
  try {
    const data = req.body;
    data.organizerId = req.user._id;
    if (!data.title) return res.status(400).json({ message:'title required' });
    const ev = await Event.create(data);
    res.json(ev);
  } catch (e) { console.error(e); res.status(500).json({ message:'Server error' }); }
});

router.get('/:id', async (req,res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message:'Not found' });
    res.json(ev);
  } catch (e) { res.status(500).json({ message:'Server error' }); }
});

router.post('/:id/register', requireAuth, async (req,res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message:'No event' });
    if (event.registeredCount >= event.capacity) return res.status(400).json({ message:'Event full' });
    const existing = await Registration.findOne({ eventId: event._id, userId: req.user._id, status:'confirmed' });
    if (existing) return res.status(400).json({ message:'Already registered' });
    const reg = await Registration.create({ eventId: event._id, userId: req.user._id, ticketId: `T-${Date.now().toString(36)}-${Math.floor(Math.random()*10000)}` });
    event.registeredCount += 1; await event.save();
    res.json({ ok:true, registrationId: reg._id, ticketId: reg.ticketId });
  } catch (e) { console.error(e); res.status(500).json({ message:'Server error' }); }
});

module.exports = router;
