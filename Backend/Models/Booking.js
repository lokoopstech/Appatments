const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    guestFirstName: { type: String, required: [true, 'Guest frst name is required'] },
    guestLastName: { type: String, required: [true, 'Guest last name is required'] },
    guestEmail: { type: String, required: [true, 'Guest email is required'] },
    guestPhone: { type: String, required: [true, 'Guest phone is required'] },
    checkInDate: { type: Date, required: [true, 'Check-in date is required'] },
    checkOutDate: { type: Date, required: [true, 'Check-out date is required'] },
    numberOfGuests: { type: Number, default: 1 },
    totalPrice: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    specialRequests: { type: String },
  },
  { timestamps: true }
);

bookingSchema.index({ apartmentId: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ userId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
