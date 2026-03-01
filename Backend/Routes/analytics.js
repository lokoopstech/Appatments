const express = require('express');
const router = express.Router();
const Booking = require('../Models/Booking');
const Apartment = require('../Models/Apartment');
const User = require('../Models/User');
const { protect, adminOnly } = require('../Middleware/auth');

router.use(protect, adminOnly);

// GET /api/analytics/overview
router.get('/overview', async (req, res) => {
  try {
    const [bookings, revenue, users, apartments] = await Promise.all([
      Booking.countDocuments(),
      Booking.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      User.countDocuments({ role: 'user' }),
      Apartment.countDocuments({ isAvailable: true }),
    ]);
    res.json({ success: true, data: { bookings, revenue: revenue[0]?.total || 0, users, availableApartments: apartments } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/bookings?startDate=&endDate=&groupBy=month
router.get('/bookings', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const groupId = groupBy === 'day'
      ? { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } }
      : { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };

    const data = await Booking.aggregate([
      { $match: match },
      { $group: { _id: groupId, count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/apartments
router.get('/apartments', async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $group: { _id: '$apartmentId', bookings: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
      { $sort: { bookings: -1 } },
      { $lookup: { from: 'apartments', localField: '_id', foreignField: '_id', as: 'apartment' } },
      { $unwind: '$apartment' },
      { $project: { title: '$apartment.title', type: '$apartment.type', bookings: 1, revenue: 1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/revenue
router.get('/revenue', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;
    const match = { paymentStatus: 'paid' };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }
    const data = await Booking.aggregate([
      { $match: match },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/popular-apartments
router.get('/popular-apartments', async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $group: { _id: '$apartmentId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'apartments', localField: '_id', foreignField: '_id', as: 'apartment' } },
      { $unwind: '$apartment' },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/users
router.get('/users', async (req, res) => {
  try {
    const data = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
