// Alternative seed script that can work with local MongoDB or if you fix the connection
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/Event.js';

// Load environment variables
dotenv.config();

const events = [
  {
    name: 'Sankalan',
    description: 'The annual tech fest of the Computer Science department. Get ready for coding, gaming, and more.',
    date: new Date('2025-12-10'),
    time: '10:00 AM',
    venue: 'Main Auditorium',
    posterUrl: '/images/sankalan.jpg',
    category: 'Technology',
    seatRows: 10,
    seatCols: 12,
  },
  {
    name: 'Freshers Party',
    description: 'A warm welcome to all the new students. Music, dance, and fun await!',
    date: new Date('2025-11-20'),
    time: '6:00 PM',
    venue: 'College Lawns',
    posterUrl: '/images/Freshers.webp',
    category: 'Festivals',
    seatRows: 8,
    seatCols: 10,
  },
  {
    name: 'Farewell',
    description: 'Bidding adieu to the graduating batch. A night of memories and celebration.',
    date: new Date('2026-04-15'),
    time: '7:00 PM',
    venue: 'Main Auditorium',
    posterUrl: '/images/farewell.webp',
    category: 'Festivals',
    seatRows: 10,
    seatCols: 12,
  },
  {
    name: 'Diwali Night',
    description: 'Celebrate the festival of lights with the entire college. Fireworks, sweets, and cultural performances.',
    date: new Date('2025-11-01'),
    time: '6:30 PM',
    venue: 'Sports Ground',
    posterUrl: '/images/diwali.webp',
    category: 'Festivals',
    seatRows: 15,
    seatCols: 15,
  },
  {
    name: 'Graduation Party',
    description: 'The official graduation ceremony and celebration party. Don your caps!',
    date: new Date('2026-05-01'),
    time: '5:00 PM',
    venue: 'Main Auditorium',
    posterUrl: '/images/graduation.webp',
    category: 'Festivals',
    seatRows: 10,
    seatCols: 12,
  },
  {
    name: 'Annual Fest',
    description: 'The biggest event of the year! Star nights, competitions, and food stalls.',
    date: new Date('2026-02-14'),
    time: '12:00 PM',
    venue: 'Entire Campus',
    posterUrl: '/images/anuual.webp',
    category: 'Festivals',
    seatRows: 20,
    seatCols: 20,
  },
  {
    name: 'Talent Show',
    description: 'Showcase your hidden talents. Singing, dancing, magic, and more.',
    date: new Date('2025-12-01'),
    time: '4:00 PM',
    venue: 'Mini Auditorium',
    posterUrl: '/images/talent.webp',
    category: 'Talent',
    seatRows: 8,
    seatCols: 8,
  },
  {
    name: 'Alumni Meet',
    description: 'Reconnect with old friends and network with graduates from your college.',
    date: new Date('2026-01-10'),
    time: '11:00 AM',
    venue: 'Seminar Hall',
    posterUrl: '/images/alumni.webp',
    category: 'Talent',
    seatRows: 10,
    seatCols: 10,
  },
  {
    name: 'Inter-College Cricket',
    description: 'The final match of the inter-college cricket tournament. See the titans clash!',
    date: new Date('2026-01-20'),
    time: '9:00 AM',
    venue: 'Main Sports Ground',
    posterUrl: 'https://images.unsplash.com/photo-1595116743901-4b0d02b5454a?q=80&w=500',
    category: 'Sport',
    seatRows: 20,
    seatCols: 20,
  },
  {
    name: 'Hackathon 24H',
    description: 'A 24-hour non-stop coding competition. Build, innovate, and win!',
    date: new Date('2026-03-05'),
    time: '5:00 PM',
    venue: 'Computer Labs',
    posterUrl: 'https://images.unsplash.com/photo-1587620962725-4a7c17a25a92?q=80&w=500',
    category: 'Technology',
    seatRows: 15,
    seatCols: 10,
  },
  {
    name: 'Annual Sports Day',
    description: 'Track and field events, team relays, and more. Come cheer for your friends.',
    date: new Date('2026-02-01'),
    time: '8:00 AM',
    venue: 'Main Sports Ground',
    posterUrl: 'https://images.unsplash.com/photo-1517649763952-db247166895a?q=80&w=500',
    category: 'Sport',
    seatRows: 20,
    seatCols: 20,
  },
];

const seedDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not set in .env file');
      console.log('Trying local MongoDB: mongodb://localhost:27017/du-events');
      mongoUri = 'mongodb://localhost:27017/du-events';
    } else {
      // Add database name if not present
      if (!mongoUri.includes('/du-events') && !mongoUri.includes('?') && !mongoUri.includes('&')) {
        mongoUri = mongoUri.replace(/\/$/, '') + '/du-events';
      } else if (mongoUri.includes('?') && !mongoUri.includes('/du-events')) {
        mongoUri = mongoUri.replace('?', '/du-events?');
      }
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for seeding...');
    
    // Clear existing events
    const deleted = await Event.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing events.`);
    
    // Insert new events
    const result = await Event.insertMany(events);
    console.log(`✅ Successfully seeded ${result.length} events!`);
    console.log('\nEvents seeded:');
    result.forEach(event => {
      console.log(`  - ${event.name} (${event.category})`);
    });
    
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    if (err.message.includes('IP')) {
      console.error('\n⚠️  Your IP address might not be whitelisted in MongoDB Atlas.');
      console.error('Please add your current IP to the MongoDB Atlas whitelist.');
      console.error('Or use local MongoDB: mongodb://localhost:27017/du-events');
    } else if (err.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  Could not connect to MongoDB.');
      console.error('Make sure MongoDB is running locally or check your connection string.');
    }
  } finally {
    mongoose.connection.close();
    console.log('\nMongoDB connection closed.');
  }
};

seedDB();



