require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const responseTime = require('./middleware/responseTime');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const demoRoutes = require('./routes/demo');

const app = express();

// ---------------------------------------------------------------
// 1. Connect to MongoDB (the only thing you need a .env for)
// ---------------------------------------------------------------
connectDB();

// ---------------------------------------------------------------
// 2. Global Middleware
//    Every request flows through these, in this exact order,
//    before reaching any route. This is the chain visualised
//    in Module 5 (Middleware) and Module 4 (MVC).
// ---------------------------------------------------------------
app.use(cors());
app.use(express.json()); // parses JSON request bodies -> req.body
app.use(logger); // logs every incoming request
app.use(responseTime); // stamps every response with timing info

// ---------------------------------------------------------------
// 3. Serve the static frontend (HTML/CSS/JS dashboard)
// ---------------------------------------------------------------
app.use(express.static(path.join(__dirname, '..', 'public')));

// ---------------------------------------------------------------
// 4. API Routes (mounted via Express Router - Module 3)
// ---------------------------------------------------------------
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/demo', demoRoutes);

// Simple health check endpoint - useful for deployment platforms
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', uptime: process.uptime() });
});

// Fallback: any unmatched /api/* route is a clean 404, not a crash
app.use('/api', notFound);

// For any other (non-API) route, serve the frontend's index.html
// so the dashboard works correctly even with deep links.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ---------------------------------------------------------------
// 5. Centralized Error Handler (Module 8) - always LAST
// ---------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------
// 6. Start the server
// ---------------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n  Backend Explorer is running`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Mode:    ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
