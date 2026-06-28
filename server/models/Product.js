const mongoose = require('mongoose');

/**
 * Product Schema
 * ---------------
 * This is the "Model" layer in MVC. It defines the shape of the data
 * stored in MongoDB and is the ONLY part of the app that talks
 * directly to the database collection ("products").
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model('Product', productSchema);
