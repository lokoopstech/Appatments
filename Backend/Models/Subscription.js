const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: { type: String, trim: true },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active',
  },
  interests: {
    type: [String],
    enum: ['events', 'new-apartments', 'blog-updates', 'promotions'],
  },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
  lastEmailSent: { type: Date },
  metadata: {
    source: { type: String, enum: ['footer', 'popup', 'checkout'] },
    ipAddress: String,
    userAgent: String,
  },
});


module.exports = mongoose.model('Subscription', subscriptionSchema);
