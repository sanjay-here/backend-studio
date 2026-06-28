/**
 * logger middleware
 * ------------------
 * The first stop for every incoming request. Logs the method,
 * URL, and timestamp to the console, and stamps the request
 * with a startTime so later middleware (responseTime) can
 * calculate how long the request took.
 *
 * This is also surfaced to the frontend so users can SEE that
 * middleware runs before the controller (Module 5: Middleware).
 */
function logger(req, res, next) {
  req.startTime = Date.now();
  req.middlewareTrail = req.middlewareTrail || [];
  req.middlewareTrail.push('Logger Middleware');

  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);

  next(); // pass control to the next middleware/controller
}

module.exports = logger;
