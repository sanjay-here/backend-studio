/**
 * Error Handling Middleware (Module 8)
 * --------------------------------------
 * notFound    -> catches any request to a route that doesn't exist (404)
 * errorHandler -> the final middleware in the chain. Any time a controller
 *                 calls next(err), or throws inside an async handler that's
 *                 wrapped in asyncHandler, execution lands here instead of
 *                 crashing the server.
 */

function notFound(req, res, next) {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Priority: an explicit err.statusCode (set by notFound, or manually) wins.
  // Otherwise, fall back to whatever res.status(...) was already set to by
  // the controller before it threw (e.g. `res.status(404); throw new Error(...)`).
  // Only default to 500 if neither was ever set (res.statusCode still 200).
  let statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId (CastError) -> treat as 404
  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found with id: ${err.value}`;
  }

  // Mongoose validation error -> treat as 400
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose duplicate key error -> treat as 400
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field: ${field}`;
  }

  console.error(`[ERROR] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = { notFound, errorHandler };
