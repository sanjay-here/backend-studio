/**
 * app.js
 * -------
 * Renders the dashboard of module cards, and handles switching
 * between the dashboard and an individual module's interactive view.
 * Each module's actual markup + logic lives in js/modules/*.js and
 * registers itself into the MODULES array below.
 */

const MODULES = [
  { id: 'client-server', title: 'Client & Server', tag: 'GET', desc: 'Watch a raw request travel from browser to server and back.' },
  { id: 'http-methods', title: 'HTTP Methods', tag: 'GET·POST·PUT·DELETE', desc: 'Trigger every CRUD verb against a real MongoDB-backed API.' },
  { id: 'router', title: 'Express Router', tag: 'ROUTING', desc: 'See how this project splits routes into separate files.' },
  { id: 'mvc', title: 'MVC Architecture', tag: 'ARCHITECTURE', desc: 'Trace a request as it passes Route → Controller → Model → DB.' },
  { id: 'middleware', title: 'Middleware', tag: 'AUTH', desc: 'Step through the logger and auth middleware chain live.' },
  { id: 'mongodb', title: 'MongoDB', tag: 'DATABASE', desc: 'A live products collection — create, read, update, delete.' },
  { id: 'request-response', title: 'Request & Response', tag: 'CYCLE', desc: 'Inspect method, body, status, and timing for any call.' },
  { id: 'errors', title: 'Error Handling', tag: '400·404·500', desc: 'Deliberately trigger errors and see clean JSON responses.' },
];

const root = document.getElementById('app-root');

function renderDashboard() {
  root.innerHTML = `
    <section class="hero">
      <p class="eyebrow">Interactive backend demonstration platform</p>
      <h1>Backend Explorer</h1>
      <p>Eight modules. Each one represents a real backend concept — Express routing, middleware,
      MongoDB, MVC, error handling — and every button you press triggers a genuine request to a
      genuine Node.js server. Open the inspector dock below to watch it happen.</p>
    </section>
    <div class="module-grid">
      ${MODULES.map(
        (m, i) => `
        <button class="module-card" data-module="${m.id}">
          <span class="index">MODULE ${String(i + 1).padStart(2, '0')}</span>
          <h3>${m.title}</h3>
          <p>${m.desc}</p>
          <span class="tag">${m.tag}</span>
        </button>`
      ).join('')}
    </div>
  `;

  root.querySelectorAll('.module-card').forEach((card) => {
    card.addEventListener('click', () => navigate(card.dataset.module));
  });
}

function renderModule(id) {
  const meta = MODULES.find((m) => m.id === id);
  const renderer = window.MODULE_RENDERERS && window.MODULE_RENDERERS[id];

  if (!renderer) {
    root.innerHTML = `<p class="note">Module not found.</p>`;
    return;
  }

  root.innerHTML = `
    <div class="module-view">
      <button class="back-btn" id="back-btn">← Back to dashboard</button>
      <div class="module-header">
        <h2>${meta.title}</h2>
        <p>${meta.desc}</p>
      </div>
      <div id="module-content"></div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => navigate(null));
  renderer(document.getElementById('module-content'));
}

function navigate(moduleId) {
  if (moduleId) {
    window.location.hash = moduleId;
  } else {
    window.location.hash = '';
  }
}

function route() {
  const id = window.location.hash.replace('#', '');
  if (id) {
    renderModule(id);
  } else {
    renderDashboard();
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', () => {
  route();
  checkServerHealth();
});

async function checkServerHealth() {
  const statusEl = document.getElementById('server-status');
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    statusEl.textContent = data.status === 'ok' ? 'server connected' : 'server unreachable';
  } catch {
    statusEl.textContent = 'server unreachable';
  }
}
