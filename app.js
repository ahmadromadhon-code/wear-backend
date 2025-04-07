// Tetap taruh paling atas
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (optimized for serverless)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error:', err);
  }
}

// Middleware untuk koneksi sebelum setiap request (optional, tapi aman)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Routing
app.use('/api/products', productRoutes);

// Serve frontend (jika ada)
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 404 & Error Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

module.exports = app;
