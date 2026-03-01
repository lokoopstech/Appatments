const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Booking = require('../Models/Booking');
const Apartment = require('../Models/Apartment');
const Blog = require('../Models/Blog');
const Subscription = require('../Models/Subscription');
const Contact = require('../Models/Contact');
const { protect, adminOnly } = require('../Middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers, totalApartments, totalBookings,
      pendingBookings, totalBlogs, totalSubscribers,
      newContacts, revenue,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Apartment.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Blog.countDocuments({ published: true }),
      Subscription.countDocuments({ status: 'active', isVerified: true }),
      Contact.countDocuments({ status: 'new' }),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers, totalApartments, totalBookings, pendingBookings,
        totalBlogs, totalSubscribers, newContacts,
        totalRevenue: revenue[0]?.total || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      User.find(filter).skip(skip).limit(Number(limit)).sort('-createdAt'),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/users/:id — Update role
router.put('/users/:id', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User role updated', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/bookings/stats
router.get('/bookings/stats', async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
    ]);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/revenue
router.get('/revenue', async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
      { $group: { _id: { month: { $month: '$createdAt' } }, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      { $sort: { '_id.month': 1 } },
    ]);
    res.json({ success: true, data: revenue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
