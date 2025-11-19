import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  
  // --- CORRECTED SECTION ---
  // Seat layout
  seatRows: {
    type: Number,
    required: true,
    default: 10,
  },
  seatCols: {
    type: Number,
    required: true,
    default: 12,
  },
  // --- END CORRECTION ---
});

const Event = mongoose.model('Event', eventSchema);
export default Event;