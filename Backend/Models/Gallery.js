const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
    },
    type: {
      type: String,
      enum: ['event', 'apartment', 'amenity', 'community', 'neighborhood', 'renovation', 'testimonial'],
      required: true,
    },
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
    },
    eventDetails: {
      eventName: String,
      eventDate: Date,
      location: String,
      attendees: Number,
    },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

gallerySchema.index({ type: 1, isFeatured: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);
