const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: { type: String },
    type: {
      type: String,
      enum: ['conference', 'residential', 'event', 'guest-house', 'premium-suite'],
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    location: {
      address: String,
      city: String,
      Estate: String,
      zipCode: String,
    },
    amenities: [String],
    images: [String],
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number },
    isAvailable: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text search index
apartmentSchema.index({ title: 'text', description: 'text', 'location.city': 'text' });
apartmentSchema.index({ 'location.city': 1, type: 1, price: 1 });

module.exports = mongoose.model('Apartment', apartmentSchema);
