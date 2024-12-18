const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')

require('dotenv').config();
const path = require('path');

// Initialize app
const app = express();

app.use(bodyParser.json())
// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors({
  origin: 'https://harmony-4all.vercel.app', // Exact origin without a trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Required if you use cookies or auth tokens
}));

app.options('*', cors()); // Handle preflight requests globally


// MongoDB Connection using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    console.log('MongoDB connected with Mongoose...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Connect to DB
connectDB();

// Routes
const userRoutes = require('./Routes/userroute');
app.use('/api', userRoutes);

app.get('/',(req, res) => {
  res.send('Welcome to the QR Code API!');
})
// Set up port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
