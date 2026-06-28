/**
 * api.js
 * -------
 * A single fetch wrapper used by every module. It measures the
 * round-trip time on the client side too, and forwards everything
 * to the Inspector dock so the user can see EVERY request/response
 * that happens, no matter which module triggered it.
 */

const API = {
  async call(method, path, body, extraHeaders) {
    const headers = { 'Content-Type': 'application/json', ...(extraHeaders || {}) };
    const start = performance.now();

    let res, data;
    try {
      res = await fetch(path, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      data = await res.json().catch(() => ({}));
    } catch (networkErr) {
      const clientTime = Math.round(performance.now() - start);
      Inspector.log({
        method,
        path,
        requestBody: body,
        status: 0,
        statusText: 'Network Error',
        time: clientTime,
        response: { error: networkErr.message },
      });
      throw networkErr;
    }

    const clientTime = Math.round(performance.now() - start);

    Inspector.log({
      method,
      path,
      requestBody: body,
      status: res.status,
      statusText: res.statusText,
      time: clientTime,
      response: data,
    });

    return { ok: res.ok, status: res.status, data };
  },

  get(path) {
    return this.call('GET', path);
  },
  post(path, body, headers) {
    return this.call('POST', path, body, headers);
  },
  put(path, body, headers) {
    return this.call('PUT', path, body, headers);
  },
  del(path, headers) {
    return this.call('DELETE', path, undefined, headers);
  },
};
