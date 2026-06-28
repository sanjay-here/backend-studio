/**
 * responseTime middleware
 * ------------------------
 * Wraps res.json so that every API response automatically includes
 * how long the server took to process the request. This powers
 * Module 7 (Request & Response Cycle), where the frontend displays
 * method, URL, status code, response body, and time taken for
 * every single API call.
 */
function responseTime(req, res, next) {
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    const duration = req.startTime ? Date.now() - req.startTime : null;
    res.set('X-Response-Time', `${duration}ms`);

    // Attach meta info without breaking the existing response shape
    const enriched = {
      ...body,
      _meta: {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        timeTakenMs: duration,
        middlewareTrail: req.middlewareTrail || [],
      },
    };

    return originalJson(enriched);
  };

  next();
}

module.exports = responseTime;
