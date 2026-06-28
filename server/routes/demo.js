const express = require('express');
const router = express.Router();
const { hello, routeInfo, protectedRoute, simulateError } = require('../controllers/demoController');
const authMiddleware = require('../middleware/auth');

router.get('/hello', hello);
router.get('/routes', routeInfo);
router.get('/error/:code', simulateError);

// authMiddleware runs BEFORE protectedRoute - this is the
// "Authentication Middleware" step shown in Module 5.
router.get('/protected', authMiddleware, protectedRoute);

module.exports = router;
