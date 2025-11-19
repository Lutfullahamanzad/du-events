import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  // We'll just store seats for now.
  // In a real app, you'd link this to a User.
  seatsBooked: [
    {
      type: String,
      required: true,
    },
  ],
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'qr'],
    default: 'card',
  },
  bookingTime: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;