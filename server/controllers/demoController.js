const asyncHandler = require('../middleware/asyncHandler');

/**
 * Demo Controller
 * -----------------
 * Powers the smaller, purely-illustrative modules:
 *  - Module 1: Client & Server (hello)
 *  - Module 3: Express Router (routeInfo)
 *  - Module 5: Middleware (protectedRoute)
 *  - Module 8: Error Handling (simulateError)
 */

// @desc    Basic request/response round trip
// @route   GET /api/demo/hello
exports.hello = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hello from Express Server',
    receivedAt: new Date().toISOString(),
  });
});

// @desc    Returns a static description of the route files in this project
// @route   GET /api/demo/routes
exports.routeInfo = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      {
        file: 'routes/products.js',
        mountedAt: '/api/products',
        description: 'Handles all CRUD operations for products (GET, POST, PUT, DELETE).',
      },
      {
        file: 'routes/auth.js',
        mountedAt: '/api/auth',
        description: 'Handles user registration and login, issuing JWT tokens.',
      },
      {
        file: 'routes/demo.js',
        mountedAt: '/api/demo',
        description: 'Powers the interactive demo modules (client-server, middleware, errors, etc).',
      },
    ],
  });
});

// @desc    A route protected by authMiddleware - only reachable with a valid JWT
// @route   GET /api/demo/protected
exports.protectedRoute = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: `Access granted! Welcome, ${req.user.username}. You passed through the Authentication Middleware.`,
  });
});

// @desc    Deliberately triggers a specific HTTP error so the frontend can show it
// @route   GET /api/demo/error/:code
exports.simulateError = asyncHandler(async (req, res) => {
  const code = parseInt(req.params.code, 10);

  const messages = {
    400: 'Bad Request: The server could not understand the request due to invalid syntax.',
    404: 'Not Found: The requested resource could not be located on the server.',
    500: 'Internal Server Error: Something went wrong on the server while processing the request.',
  };

  if (!messages[code]) {
    res.status(400);
    throw new Error(`Unsupported demo error code: ${req.params.code}. Try 400, 404, or 500.`);
  }

  res.status(code);
  throw new Error(messages[code]);
});
