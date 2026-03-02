const express = require('express');
const router = express.Router();
const Booking = require('../Models/Booking');
const Apartment = require('../Models/Apartment');
const { protect, adminOnly } = require('../Middleware/Auth');
const { sendBookingConfirmation, sendBookingStatusUpdate } = require('../utils/mailer');

// POST /api/bookings/check-availability
router.post('/check-availability', async (req, res) => {
  try {
    const { apartmentId, checkInDate, checkOutDate } = req.body;
    const conflict = await Booking.findOne({
      apartmentId,
      status: { $nin: ['cancelled'] },
      $or: [
        { checkInDate: { $lt: new Date(checkOutDate), $gte: new Date(checkInDate) } },
        { checkOutDate: { $gt: new Date(checkInDate), $lte: new Date(checkOutDate) } },
        { checkInDate: { $lte: new Date(checkInDate) }, checkOutDate: { $gte: new Date(checkOutDate) } },
      ],
    });
    res.json({ success: true, available: !conflict });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/upcoming — authenticated users
router.get('/upcoming', protect, async (req, res) => {
  try {
    const filter = { checkInDate: { $gte: new Date() }, status: { $ne: 'cancelled' } };
    if (req.user.role !== 'admin') filter.userId = req.user._id;
    const bookings = await Booking.find(filter).populate('apartmentId', 'title location images').sort('checkInDate');
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/history
router.get('/history', protect, async (req, res) => {
  try {
    const filter = { checkOutDate: { $lt: new Date() } };
    if (req.user.role !== 'admin') filter.userId = req.user._id;
    const bookings = await Booking.find(filter).populate('apartmentId', 'title location images').sort('-checkOutDate');
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/user/:userId — Admin or same user
router.get('/user/:userId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const bookings = await Booking.find({ userId: req.params.userId }).populate('apartmentId', 'title location');
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { apartmentId, checkInDate, checkOutDate } = req.body;
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment || !apartment.isAvailable) {
      return res.status(400).json({ success: false, message: 'Apartment not available' });
    }
    // Calculate total price
    const days = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * apartment.price;
    const booking = await Booking.create({ ...req.body, totalPrice });

    // Send confirmation email to customer (non-blocking)
    sendBookingConfirmation({
      customerName:  `${booking.guestFirstName} ${booking.guestLastName}`,
      customerEmail:  booking.guestEmail,
      apartment:      apartment.title,
      checkIn:        booking.checkInDate,
      checkOut:       booking.checkOutDate,
      guests:         booking.numberOfGuests,
    }).catch(err => console.error('Booking confirmation email failed:', err.message));

    res.status(201).json({ success: true, message: 'Booking created', data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/bookings
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = {};
    if (req.user.role !== 'admin') filter.userId = req.user._id;
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Booking.find(filter).skip(skip).limit(Number(limit)).populate('apartmentId', 'title').sort('-createdAt'),
      Booking.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('apartmentId userId');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (req.user.role !== 'admin' && booking.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/bookings/:id — Admin only (status update)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('apartmentId', 'title');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Send status update email if status changed
    if (req.body.status) {
      sendBookingStatusUpdate({
        customerName:  `${booking.guestFirstName} ${booking.guestLastName}`,
        customerEmail:  booking.guestEmail,
        apartment:      booking.apartmentId?.title || 'your space',
        checkIn:        booking.checkInDate,
        checkOut:       booking.checkOutDate,
        status:         booking.status,
        bookingId:      booking._id.toString(),
      }).catch(err => console.error('Status update email failed:', err.message));
    }

    res.json({ success: true, message: 'Booking updated', data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/bookings/:id — Cancel
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (req.user.role !== 'admin' && booking.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
