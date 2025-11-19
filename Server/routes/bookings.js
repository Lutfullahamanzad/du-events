import express from 'express';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

const router = express.Router();

// POST /api/bookings
// Create a new booking
router.post('/', async (req, res) => {
  const { eventId, seatsBooked, paymentMethod } = req.body;

  if (!eventId || !seatsBooked || seatsBooked.length === 0) {
    return res.status(400).json({ message: 'Missing eventId or seatsBooked' });
  }

  try {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if any of these seats are already booked
    const existingBookings = await Booking.find({ event: eventId });
    const allBookedSeats = existingBookings.reduce((acc, booking) => {
      return [...acc, ...booking.seatsBooked];
    }, []);
    
    const conflictingSeats = seatsBooked.filter(seat => allBookedSeats.includes(seat));
    if (conflictingSeats.length > 0) {
      return res.status(409).json({ message: `Seats ${conflictingSeats.join(', ')} are already booked.` });
    }
    
    // Create new booking
    const newBooking = new Booking({
      event: eventId,
      seatsBooked: seatsBooked,
      paymentMethod: paymentMethod || 'card',
    });

    const savedBooking = await newBooking.save();
    res.status(201).json({ 
      message: 'Booking successful',
      booking: savedBooking 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;