const express = require('express');
const router = express.Router();
const Gallery = require('../Models/Gallery');
const { protect, adminOnly } = require('../Middleware/auth');

// GET /api/gallery/featured
router.get('/featured', async (req, res) => {
  try {
    const data = await Gallery.find({ isFeatured: true, isPublished: true }).sort('order');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gallery/recent
router.get('/recent', async (req, res) => {
  try {
    const data = await Gallery.find({ isPublished: true }).sort('-createdAt').limit(12);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gallery/events
router.get('/events', async (req, res) => {
  try {
    const data = await Gallery.find({ type: 'event', isPublished: true }).sort('-eventDetails.eventDate');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gallery/events/:eventId
router.get('/events/:eventId', async (req, res) => {
  try {
    const item = await Gallery.findOne({ _id: req.params.eventId, type: 'event' });
    if (!item) return res.status(404).json({ success: false, message: 'Event gallery not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gallery/type/:type
router.get('/type/:type', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const data = await Gallery.find({ type: req.params.type, isPublished: true })
      .skip(skip).limit(Number(limit)).sort('order');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gallery
router.get('/', async (req, res) => {
  try {
    const { type, featured, page = 1, limit = 12 } = req.query;
    const filter = { isPublished: true };
    if (type) filter.type = type;
    if (featured) filter.isFeatured = featured === 'true';
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Gallery.find(filter).skip(skip).limit(Number(limit)).sort('order'),
      Gallery.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gallery/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gallery — Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json({ success: true, message: 'Gallery item created', data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/gallery/:id — Admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json({ success: true, message: 'Gallery item updated', data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/gallery/:id/increment-view
router.put('/:id/increment-view', async (req, res) => {
  try {
    await Gallery.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/gallery/:id — Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
