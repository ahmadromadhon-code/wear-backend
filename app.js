require('dotenv').config(); // disarankan tetap load di sini juga

const express = require('express');
const app = express();
const connectDB = require('./db');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const path = require('path');

// Koneksi ke MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routing API
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});


// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

module.exports = app;
