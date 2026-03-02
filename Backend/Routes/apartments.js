const express = require('express');
const router = express.Router();
const Apartment = require('../Models/Apartment');
const { protect, adminOnly } = require('../Middleware/Auth');

// GET /api/apartments/featured  (must be before /:id)
router.get('/featured', async (req, res) => {
  try {
    const apartments = await Apartment.find({ featured: true, isAvailable: true }).limit(10);
    res.json({ success: true, count: apartments.length, data: apartments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/apartments/search
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Query q is required' });
    const apartments = await Apartment.find({ $text: { $search: q } });
    res.json({ success: true, count: apartments.length, data: apartments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/apartments
router.get('/', async (req, res) => {
  try {
    const { type, city, minPrice, maxPrice, page = 1, limit = 10, isAvailable } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Apartment.find(filter).skip(skip).limit(Number(limit)).sort('-createdAt'),
      Apartment.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/apartments/:id
router.get('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ success: false, message: 'Apartment not found' });
    res.json({ success: true, data: apartment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/apartments — Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const apartment = await Apartment.create(req.body);
    res.status(201).json({ success: true, message: 'Apartment created', data: apartment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/apartments/:id — Admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!apartment) return res.status(404).json({ success: false, message: 'Apartment not found' });
    res.json({ success: true, message: 'Apartment updated', data: apartment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/apartments/:id — Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);
    if (!apartment) return res.status(404).json({ success: false, message: 'Apartment not found' });
    res.json({ success: true, message: 'Apartment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
