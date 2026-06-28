window.MODULE_RENDERERS = window.MODULE_RENDERERS || {};

window.MODULE_RENDERERS['errors'] = function render(container) {
  container.innerHTML = `
    <div class="panel">
      <p class="panel-title">Trigger an error on purpose</p>
      <p class="note" style="margin-bottom:14px;">These buttons call routes designed to fail in a specific
      way. Instead of crashing, the server's centralized error handler catches each one and returns a
      clean, predictable JSON response.</p>
      <div class="btn-row">
        <button class="btn secondary" data-code="400">400 Bad Request</button>
        <button class="btn secondary" data-code="404">404 Not Found</button>
        <button class="btn secondary" data-code="500">500 Server Error</button>
        <button class="btn secondary" id="validation-btn">Validation Error (missing price)</button>
        <button class="btn secondary" id="unknown-route-btn">Unknown Route</button>
      </div>
      <div id="error-result" style="margin-top:16px;"></div>
    </div>

    <div class="panel" style="margin-top:16px;">
      <p class="panel-title">How it works on the server</p>
      <pre class="code-block">// middleware/errorHandler.js — the LAST middleware in the chain
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  // ...maps Mongoose CastError / ValidationError / duplicate key
  // to clean 400/404 responses instead of a stack trace.
  res.status(statusCode).json({ success: false, message: err.message });
}</pre>
    </div>
  `;

  function showResult(status, message) {
    const cls = status >= 500 ? 'err' : status >= 400 ? 'warn' : 'ok';
    container.querySelector('#error-result').innerHTML = `
      <div class="panel" style="background:var(--bg-raised);">
        <span class="badge ${cls}">${status}</span>
        <p style="margin:10px 0 0;">${message}</p>
      </div>
    `;
  }

  container.querySelectorAll('[data-code]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const { status, data } = await API.get(`/api/demo/error/${btn.dataset.code}`);
      showResult(status, data.message);
    });
  });

  container.querySelector('#validation-btn').addEventListener('click', async () => {
    const { status, data } = await API.post('/api/products', { description: 'missing required fields' });
    showResult(status, data.message);
  });

  container.querySelector('#unknown-route-btn').addEventListener('click', async () => {
    const { status, data } = await API.get('/api/this-route-does-not-exist');
    showResult(status, data.message);
  });
};
