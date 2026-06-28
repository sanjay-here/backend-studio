/**
 * inspector.js
 * -------------
 * Controls the bottom "Inspector" dock - the signature UI element
 * of this app. It mirrors what a browser's DevTools Network tab
 * shows, but for OUR own backend, reinforcing Module 7 (Request &
 * Response Cycle) on every single page, not just its own module.
 */

const Inspector = {
  el: null,
  bar: null,

  init() {
    this.el = document.getElementById('inspector');
    this.bar = document.getElementById('inspector-bar');
    this.bar.addEventListener('click', () => this.toggle());
  },

  toggle() {
    this.el.classList.toggle('open');
  },

  open() {
    this.el.classList.add('open');
  },

  log({ method, path, requestBody, status, statusText, time, response }) {
    document.getElementById('insp-method').textContent = method;
    document.getElementById('insp-path').textContent = path;
    document.getElementById('insp-time').textContent = `${time}ms`;

    const statusEl = document.getElementById('insp-status');
    statusEl.style.display = 'inline-block';
    statusEl.textContent = status || 'ERR';
    statusEl.className = 'badge ' + (status >= 200 && status < 300 ? 'ok' : status >= 400 && status < 500 ? 'warn' : 'err');

    document.getElementById('insp-request').textContent = requestBody
      ? JSON.stringify(requestBody, null, 2)
      : '(no request body)';

    document.getElementById('insp-response').textContent = JSON.stringify(response, null, 2);
  },
};

document.addEventListener('DOMContentLoaded', () => Inspector.init());
