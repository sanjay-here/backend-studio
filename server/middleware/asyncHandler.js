/**
 * asyncHandler
 * -------------
 * Small wrapper so controllers can be written as plain async
 * functions without needing a try/catch in every single one.
 * Any rejected promise / thrown error is automatically forwarded
 * to next(err), which lands in our centralized errorHandler.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
