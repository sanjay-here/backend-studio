window.MODULE_RENDERERS = window.MODULE_RENDERERS || {};

window.MODULE_RENDERERS['client-server'] = function render(container) {
  container.innerHTML = `
    <div class="panel">
      <p class="panel-title">Request Flow</p>
      <div class="flow" id="flow">
        <div class="flow-node" data-step="0">Browser</div>
        <div class="flow-arrow" data-arrow="0">→</div>
        <div class="flow-node" data-step="1">Request<br/><span style="color:var(--text-dim);font-size:11px;">GET /api/demo/hello</span></div>
        <div class="flow-arrow" data-arrow="1">→</div>
        <div class="flow-node" data-step="2">Express Server</div>
        <div class="flow-arrow" data-arrow="2">→</div>
        <div class="flow-node" data-step="3">Response</div>
        <div class="flow-arrow" data-arrow="3">→</div>
        <div class="flow-node" data-step="4">Browser</div>
      </div>
      <div class="btn-row">
        <button class="btn" id="send-btn">Send Request</button>
      </div>
    </div>
    <div class="panel" style="margin-top:16px;">
      <p class="panel-title">What just happened</p>
      <p class="note" id="explainer">Click "Send Request" to send a real GET request from your browser
      to the Express server running on this same machine, and watch its response come back.</p>
    </div>
  `;

  const nodes = container.querySelectorAll('.flow-node');
  const arrows = container.querySelectorAll('.flow-arrow');
  const explainer = container.querySelector('#explainer');

  function clearActive() {
    nodes.forEach((n) => n.classList.remove('active'));
    arrows.forEach((a) => a.classList.remove('active'));
  }

  function activateUpTo(step) {
    nodes.forEach((n) => {
      if (parseInt(n.dataset.step, 10) <= step) n.classList.add('active');
    });
    arrows.forEach((a) => {
      if (parseInt(a.dataset.arrow, 10) < step) a.classList.add('active');
    });
  }

  async function runDemo() {
    clearActive();
    const btn = container.querySelector('#send-btn');
    btn.disabled = true;

    activateUpTo(0);
    explainer.textContent = 'Step 1 — The browser prepares a GET request...';
    await sleep(400);

    activateUpTo(1);
    explainer.textContent = 'Step 2 — The request "GET /api/demo/hello" travels over HTTP to the server...';
    await sleep(500);

    activateUpTo(2);
    explainer.textContent = 'Step 3 — The Express server receives it, runs middleware, then a controller handles it...';

    const { data } = await API.get('/api/demo/hello');
    await sleep(400);

    activateUpTo(3);
    explainer.textContent = `Step 4 — The server sends back: "${data.message}"`;
    await sleep(400);

    activateUpTo(4);
    explainer.textContent = `Done. Total round trip took ${data._meta?.timeTakenMs ?? '?'}ms on the server. Check the Inspector dock below for the full raw request/response.`;

    btn.disabled = false;
  }

  container.querySelector('#send-btn').addEventListener('click', runDemo);
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
