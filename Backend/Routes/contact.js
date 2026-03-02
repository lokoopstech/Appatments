// src/routes/contact.js
require('dotenv').config();
const express = require('express');
const router  = express.Router();
const Contact = require('../Models/Contact');
const { protect, adminOnly } = require('../MiddleWare/Auth');
const { sendInquiryReply, sendAdminInquiryAlert } = require('../utils/mailer');


// POST /api/contact — public (customer submits inquiry)
router.post('/', async (req, res) => {
  try {
    const inquiry = await Contact.create(req.body);

    // Notify admin immediately (non-blocking — won't fail the response if email errors)
    sendAdminInquiryAlert({
      name:    inquiry.name,
      email:   inquiry.email,
      phone:   inquiry.phone,
      subject: inquiry.subject,
      message: inquiry.message,
    }).catch(err => console.error('Admin alert email failed:', err.message));

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', data: inquiry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


// GET /api/contact — Admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Contact.find(filter).skip(skip).limit(Number(limit)).sort('-createdAt'),
      Contact.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// GET /api/contact/:id — Admin only
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const inquiry = await Contact.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// POST /api/contact/:id/reply — Admin only (send email reply to customer)
router.post('/:id/reply', protect, adminOnly, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message is required' });
    }

    const inquiry = await Contact.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    // Send reply email to the customer
    await sendInquiryReply({
      customerName:    inquiry.name,
      customerEmail:   inquiry.email,
      originalMessage: inquiry.message,
      subject:         inquiry.subject,
      replyMessage:    message.trim(),
    });

    // Mark inquiry as responded
    await Contact.findByIdAndUpdate(req.params.id, { status: 'responded' });

    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (err) {
    console.error('Reply error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send reply: ' + err.message });
  }
});


// PUT /api/contact/:id — Admin only (update status)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const inquiry = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, message: 'Inquiry updated', data: inquiry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


// DELETE /api/contact/:id — Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
