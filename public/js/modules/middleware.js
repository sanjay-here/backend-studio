window.MODULE_RENDERERS = window.MODULE_RENDERERS || {};

window.MODULE_RENDERERS['middleware'] = function render(container) {
  container.innerHTML = `
    <div class="grid-2">
      <div class="panel">
        <p class="panel-title">1. Try without logging in</p>
        <p class="note" style="margin-bottom:12px;">This hits a protected route directly. No token is sent,
        so the Authentication Middleware should block it before it ever reaches the controller.</p>
        <div class="btn-row">
          <button class="btn secondary" id="try-noauth-btn">Access Protected Route</button>
        </div>
      </div>
      <div class="panel">
        <p class="panel-title">2. Log in, then try again</p>
        <div class="field">
          <label>Username</label>
          <input type="text" id="mw-username" value="demo" />
        </div>
        <div class="field">
          <label>Password</label>
          <input type="password" id="mw-password" value="demo1234" />
        </div>
        <div class="btn-row">
          <button class="btn secondary" id="register-btn">Register</button>
          <button class="btn" id="login-btn">Login</button>
        </div>
        <p class="note" id="auth-status" style="margin-top:10px;">Not logged in.</p>
        <div class="btn-row" style="margin-top:10px;">
          <button class="btn" id="try-auth-btn" disabled>Access Protected Route (with token)</button>
        </div>
      </div>
    </div>

    <div class="panel" style="margin-top:16px;">
      <p class="panel-title">Middleware Chain</p>
      <div class="steps" id="mw-steps">
        <div class="step" data-step="0"><span class="num">1</span> Incoming Request</div>
        <div class="step" data-step="1"><span class="num">2</span> Logger Middleware</div>
        <div class="step" data-step="2"><span class="num">3</span> Authentication Middleware</div>
        <div class="step" data-step="3"><span class="num">4</span> Controller</div>
        <div class="step" data-step="4"><span class="num">5</span> Response</div>
      </div>
      <p class="note" id="mw-result" style="margin-top:14px;"></p>
    </div>
  `;

  let token = null;
  const steps = container.querySelectorAll('#mw-steps .step');

  function setSteps(activeUpTo) {
    steps.forEach((s, i) => s.classList.toggle('active', i <= activeUpTo));
  }

  container.querySelector('#register-btn').addEventListener('click', async () => {
    const username = container.querySelector('#mw-username').value.trim();
    const password = container.querySelector('#mw-password').value;
    const { ok, data } = await API.post('/api/auth/register', { username, password });
    container.querySelector('#auth-status').textContent = ok
      ? 'Registered. Now click Login.'
      : data.message;
  });

  container.querySelector('#login-btn').addEventListener('click', async () => {
    const username = container.querySelector('#mw-username').value.trim();
    const password = container.querySelector('#mw-password').value;
    const { ok, data } = await API.post('/api/auth/login', { username, password });

    if (ok) {
      token = data.data.token;
      container.querySelector('#auth-status').textContent = `Logged in as ${data.data.username}. Token stored in memory.`;
      container.querySelector('#try-auth-btn').disabled = false;
    } else {
      container.querySelector('#auth-status').textContent = data.message;
    }
  });

  container.querySelector('#try-noauth-btn').addEventListener('click', async () => {
    setSteps(-1);
    await sleep(250);
    setSteps(0);
    await sleep(250);
    setSteps(1);
    await sleep(300);

    const { data, status } = await API.get('/api/demo/protected');
    setSteps(2);
    container.querySelector('#mw-result').textContent =
      `${status} — ${data.message} The request never reached the controller.`;
  });

  container.querySelector('#try-auth-btn').addEventListener('click', async () => {
    setSteps(-1);
    await sleep(250);
    setSteps(0);
    await sleep(250);
    setSteps(1);
    await sleep(300);
    setSteps(2);
    await sleep(300);

    const { data, status } = await API.call('GET', '/api/demo/protected', undefined, {
      Authorization: `Bearer ${token}`,
    });

    setSteps(status === 200 ? 4 : 2);
    container.querySelector('#mw-result').textContent = `${status} — ${data.message}`;
  });
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
