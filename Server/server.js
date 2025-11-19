import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import Routes
import eventRoutes from './routes/events.js';
import bookingRoutes from './routes/bookings.js';
import authRoutes from './routes/auth.js';

// Config
dotenv.config();
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows requests from our React frontend
app.use(express.json()); // Allows us to parse JSON in request bodies

// --- DATABASE CONNECTION (Hardcoded to fix "123" error) ---
mongoose
  .connect('mongodb+srv://zzuhaib449_db_user:CollegeProject2025@cluster0.izzw4ky.mongodb.net/du_project?appName=Cluster0')
  .then(() => console.log('✅ MongoDB Connected...'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});