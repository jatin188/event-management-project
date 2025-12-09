const express = require('express');
const router = express.Router();

// Simple mock recommendations or server-side Gemini call point
router.post('/gemini', async (req,res) => {
  try {
    const { userInterests } = req.body;
    // TODO: call Gemini API here with server-side key.
    // For now return simple mock list
    res.json({ recs: [
      { id: 'mock1', title: 'AI Workshop', category: 'Technology' },
      { id: 'mock2', title: 'Startup Meetup', category: 'Business' }
    ]});
  } catch (e) { res.status(500).json({ message:'Server error' }); }
});

module.exports = router;
