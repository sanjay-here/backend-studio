window.MODULE_RENDERERS = window.MODULE_RENDERERS || {};

window.MODULE_RENDERERS['router'] = function render(container) {
  container.innerHTML = `
    <div class="panel">
      <p class="panel-title">Project Route Files</p>
      <p class="note" style="margin-bottom:14px;">Express lets you split routes into separate files instead of
      defining everything in one giant server.js. This server mounts three routers. Click one to fetch
      its live description from the server itself.</p>
      <div class="btn-row" id="route-buttons"></div>
      <div id="route-detail" style="margin-top:16px;"></div>
    </div>

    <div class="panel" style="margin-top:16px;">
      <p class="panel-title">How mounting works</p>
      <pre class="code-block">// server.js
app.use('/api/products', require('./routes/products'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/demo',     require('./routes/demo'));

// routes/products.js
const router = express.Router();
router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);
module.exports = router;</pre>
    </div>
  `;

  async function loadRoutes() {
    const { data } = await API.get('/api/demo/routes');
    const buttons = container.querySelector('#route-buttons');
    buttons.innerHTML = data.data
      .map((r) => `<button class="btn secondary" data-mount="${r.mountedAt}">${r.mountedAt}</button>`)
      .join('');

    buttons.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const route = data.data.find((r) => r.mountedAt === btn.dataset.mount);
        container.querySelector('#route-detail').innerHTML = `
          <div class="panel" style="background:var(--bg-raised);">
            <p style="margin:0 0 6px;"><strong class="mono">${route.file}</strong> → mounted at <span class="mono" style="color:var(--accent);">${route.mountedAt}</span></p>
            <p class="note" style="margin:0;">${route.description}</p>
          </div>
        `;
      });
    });
  }

  loadRoutes();
};
