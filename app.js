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
app.use('/api/products', productRoutes);

// Serve frontend statis
app.use(express.static(path.join(__dirname, '../frontend')));

// Redirect root ke index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
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
