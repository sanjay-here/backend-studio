window.MODULE_RENDERERS = window.MODULE_RENDERERS || {};

window.MODULE_RENDERERS['request-response'] = function render(container) {
  container.innerHTML = `
    <div class="panel">
      <p class="panel-title">Fire requests, inspect the cycle</p>
      <p class="note" style="margin-bottom:14px;">Every request anywhere in this app updates the Inspector
      dock at the bottom of the screen. Try a few below, then open the dock to see method, URL, request body,
      status code, response, and time taken for each one.</p>
      <div class="btn-row">
        <button class="btn secondary" data-call="get-hello">GET /api/demo/hello</button>
        <button class="btn secondary" data-call="get-products">GET /api/products</button>
        <button class="btn secondary" data-call="post-product">POST /api/products</button>
        <button class="btn secondary" data-call="bad-id">GET /api/products/invalid-id</button>
      </div>
    </div>

    <div class="panel" style="margin-top:16px;">
      <p class="panel-title">Anatomy of a response</p>
      <pre class="code-block">{
  "success": true,
  "data": { ... },
  "_meta": {
    "method": "GET",
    "path": "/api/products",
    "statusCode": 200,
    "timeTakenMs": 8,
    "middlewareTrail": ["Logger Middleware"]
  }
}</pre>
      <p class="note" style="margin-top:10px;">The <span class="mono">_meta</span> block is added automatically
      by <span class="mono">responseTime</span> middleware on the server — it wraps every <span class="mono">res.json()</span>
      call, so you get this for free on every route.</p>
    </div>
  `;

  container.querySelectorAll('[data-call]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      Inspector.open();
      switch (btn.dataset.call) {
        case 'get-hello':
          await API.get('/api/demo/hello');
          break;
        case 'get-products':
          await API.get('/api/products');
          break;
        case 'post-product':
          await API.post('/api/products', { name: 'Inspector Test Item', price: 1.5 });
          break;
        case 'bad-id':
          await API.get('/api/products/invalid-id');
          break;
      }
    });
  });
};
