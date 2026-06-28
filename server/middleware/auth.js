const jwt = require('jsonwebtoken');

/**
 * authMiddleware
 * ---------------
 * Demonstrates the "Authentication Middleware" step in Module 5.
 * Expects a Bearer token in the Authorization header. If missing
 * or invalid, the request is rejected with 401 Unauthorized
 * BEFORE it ever reaches the controller.
 */
function authMiddleware(req, res, next) {
  req.middlewareTrail = req.middlewareTrail || [];

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    req.middlewareTrail.push('Authentication Middleware (failed - no token)');
    return res.status(401).json({
      success: false,
      message: '401 Unauthorized: No token provided. Login first to access this route.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.middlewareTrail.push('Authentication Middleware (passed)');
    next();
  } catch (err) {
    req.middlewareTrail.push('Authentication Middleware (failed - invalid token)');
    return res.status(401).json({
      success: false,
      message: '401 Unauthorized: Token is invalid or expired.',
    });
  }
}

module.exports = authMiddleware;
