const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,       // URL gambar dari Cloudinary
  public_id: String,   // ID unik dari Cloudinary untuk hapus gambar
  sizes: [String]
});

module.exports = mongoose.model('Product', productSchema);
