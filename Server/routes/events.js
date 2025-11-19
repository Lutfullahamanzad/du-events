import express from 'express';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// GET /api/events
// Get all events, WITH optional category and search filters
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    // Add category to filter if it exists
    if (category) {
      filter.category = category;
    }

    // Add search to filter if it exists
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } }, // 'i' for case-insensitive
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Find events based on the filter
    const events = await Event.find(filter).sort({ date: 1 }); // Sort by date ascending
    console.log(`📅 Found ${events.length} events with filter:`, filter);
    if (events.length === 0) {
      console.log('⚠️  No events found in database. Make sure you have run the seed script.');
    }
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id
// Get a SINGLE event AND all its booked seats
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(4404).json({ message: 'Event not found' });
    }

    // Find all bookings for this event
    const bookings = await Booking.find({ event: req.params.id });

    // Combine all booked seats into one flat array
    const bookedSeats = bookings.reduce((acc, booking) => {
      return [...acc, ...booking.seatsBooked];
    }, []);

    // THIS IS THE CORRECT LINE:
    res.json({ event: event, bookedSeats: bookedSeats });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;