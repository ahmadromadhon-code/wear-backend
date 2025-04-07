require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routing API
app.use('/api/products', productRoutes);

// Serve frontend statis
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Global Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

module.exports = app;
