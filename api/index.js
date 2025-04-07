require('dotenv').config();

const app = require('../app');

// Jangan pakai app.listen, cukup export app-nya
module.exports = app;

