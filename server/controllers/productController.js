const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Product Controller
 * --------------------
 * This is the "Controller" layer in MVC. It contains the business
 * logic for each route: it receives the request (already passed
 * through any middleware), talks to the Model (Mongoose), and
 * sends back a Response. It never talks to the database directly
 * with raw queries - it always goes through the Product model.
 */

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc    Get a single product by id
// @route   GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error(`Product not found with id: ${req.params.id}`);
  }

  res.status(200).json({ success: true, data: product });
});

// @desc    Create a new product
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, price, description } = req.body;
  const product = await Product.create({ name, price, description });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

// @desc    Update an existing product
// @route   PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error(`Product not found with id: ${req.params.id}`);
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error(`Product not found with id: ${req.params.id}`);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: { id: req.params.id },
  });
});
