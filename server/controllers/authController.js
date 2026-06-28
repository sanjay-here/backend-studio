const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

// @desc    Register a new demo user
// @route   POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Username and password are required');
  }

  const existing = await User.findOne({ username });
  if (existing) {
    res.status(400);
    throw new Error('That username is already taken');
  }

  const user = await User.create({ username, password });
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { username: user.username, token },
  });
});

// @desc    Login and receive a JWT
// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Username and password are required');
  }

  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid username or password');
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { username: user.username, token },
  });
});
