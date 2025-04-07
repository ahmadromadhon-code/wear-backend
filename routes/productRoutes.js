const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { upload, cloudinary } = require('../config/cloudinary');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil produk' });
  }
});

// POST new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, sizes } = req.body;
    const image = req.file?.path;
    const public_id = req.file?.filename;

    const newProduct = new Product({
      name,
      price,
      description,
      image,
      public_id,
      sizes: sizes.split(',').map(size => size.trim())
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menambah produk' });
  }
});

// PUT update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, sizes } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' });

    // Jika ada gambar baru, hapus gambar lama dari Cloudinary
    if (req.file && product.public_id) {
      await cloudinary.uploader.destroy(product.public_id);
    }

    const updateData = {
      name,
      price,
      description,
      sizes: sizes.split(',').map(size => size.trim())
    };

    if (req.file) {
      updateData.image = req.file.path;
      updateData.public_id = req.file.filename;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal update produk' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' });

    // Hapus gambar dari Cloudinary
    if (product.public_id) {
      await cloudinary.uploader.destroy(product.public_id);
    }

    await product.deleteOne();
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus produk' });
  }
});

module.exports = router;
