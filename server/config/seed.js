require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  { name: 'Mechanical Keyboard', price: 89.99, description: 'Hot-swappable switches, tactile feel.' },
  { name: 'Wireless Mouse', price: 29.5, description: 'Ergonomic, 2.4GHz wireless.' },
  { name: '27" Monitor', price: 219.0, description: '1440p IPS display, 144Hz.' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);

    console.log(`[Seed] Inserted ${sampleProducts.length} sample products`);
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error:', err.message);
    process.exit(1);
  }
}

seed();
