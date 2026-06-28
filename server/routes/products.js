const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

/**
 * Product Routes
 * ----------------
 * This is the "Express Router" piece of Module 3. Notice the
 * router only maps URLs + HTTP methods to controller functions -
 * it contains NO business logic itself. That logic lives in
 * productController.js, and the data shape lives in models/Product.js.
 */

router.route('/').get(getProducts).post(createProduct);

router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;
