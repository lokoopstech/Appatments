const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Subscription = require('../Models/Subscription');
const { protect, adminOnly } = require('../MiddleWare/Auth');

// POST /api/subscriptions/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name, interests } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    let sub = await Subscription.findOne({ email });
    if (sub && sub.status === 'active') {
      return res.status(400).json({ success: false, message: 'Already subscribed' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    if (sub) {
      sub.status = 'active';
      sub.interests = interests || sub.interests;
      sub.verificationToken = verificationToken;
      sub.isVerified = false;
      sub.subscribedAt = new Date();
      await sub.save();
    } else {
      sub = await Subscription.create({
        email, name, interests,
        verificationToken,
        metadata: {
          source: req.body.source,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
      });
    }

    // In production: send verification email with token
    res.status(201).json({
      success: true,
      message: 'Subscription successful! Please check your email to verify.',
      data: { _id: sub._id, email: sub.email, isVerified: sub.isVerified, subscribedAt: sub.subscribedAt },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/subscriptions/verify
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const sub = await Subscription.findOne({ verificationToken: token });
    if (!sub) return res.status(400).json({ success: false, message: 'Invalid verification token' });
    sub.isVerified = true;
    sub.verificationToken = undefined;
    await sub.save();
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/subscriptions/unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const sub = await Subscription.findOne({ email });
    if (!sub) return res.status(404).json({ success: false, message: 'Subscriber not found' });
    sub.status = 'unsubscribed';
    sub.unsubscribedAt = new Date();
    await sub.save();
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/subscriptions/preferences
router.put('/preferences', async (req, res) => {
  try {
    const { email, interests } = req.body;
    const sub = await Subscription.findOneAndUpdate({ email }, { interests }, { new: true });
    if (!sub) return res.status(404).json({ success: false, message: 'Subscriber not found' });
    res.json({ success: true, message: 'Preferences updated', data: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/subscriptions/stats — Admin
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [total, active, unsubscribed, verified] = await Promise.all([
      Subscription.countDocuments(),
      Subscription.countDocuments({ status: 'active' }),
      Subscription.countDocuments({ status: 'unsubscribed' }),
      Subscription.countDocuments({ isVerified: true }),
    ]);
    res.json({ success: true, data: { total, active, unsubscribed, verified } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/subscriptions/export — Admin
router.get('/export', protect, adminOnly, async (req, res) => {
  try {
    const subs = await Subscription.find({ status: 'active', isVerified: true }).select('email name interests subscribedAt');
    const csv = ['Email,Name,Interests,Subscribed At',
      ...subs.map(s => `${s.email},${s.name || ''},${(s.interests || []).join('|')},${s.subscribedAt}`)
    ].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/subscriptions/send-newsletter — Admin
router.post('/send-newsletter', protect, adminOnly, async (req, res) => {
  try {
    const { subject, body } = req.body;
    const subs = await Subscription.find({ status: 'active', isVerified: true });
    // In production: loop and send via Nodemailer/SendGrid
    res.json({ success: true, message: `Newsletter queued for ${subs.length} subscribers`, recipients: subs.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/subscriptions — Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Subscription.find(filter).skip(skip).limit(Number(limit)).sort('-subscribedAt'),
      Subscription.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/subscriptions/:id — Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Subscriber deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
