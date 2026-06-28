window.MODULE_RENDERERS = window.MODULE_RENDERERS || {};

window.MODULE_RENDERERS['mongodb'] = function render(container) {
  container.innerHTML = `
    <div class="panel">
      <p class="panel-title">products collection (live)</p>
      <p class="note" style="margin-bottom:14px;">This table reads directly from your MongoDB Atlas cluster
      via Mongoose. Every action below immediately changes a real document.</p>
      <div class="btn-row" style="margin-bottom:14px;">
        <button class="btn" id="refresh-btn">Refresh from MongoDB</button>
      </div>
      <table>
        <thead><tr><th>_id</th><th>Name</th><th>Price</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody id="mongo-rows"><tr class="empty-row"><td colspan="5">Loading…</td></tr></tbody>
      </table>
    </div>
  `;

  async function load() {
    const { data } = await API.get('/api/products');
    const rows = container.querySelector('#mongo-rows');

    if (!data.data || data.data.length === 0) {
      rows.innerHTML = `<tr class="empty-row"><td colspan="5">Collection is empty. Add products in the "HTTP Methods" module.</td></tr>`;
      return;
    }

    rows.innerHTML = data.data
      .map(
        (p) => `
        <tr>
          <td class="mono" style="font-size:11.5px;color:var(--text-dim);">${p._id}</td>
          <td>${p.name}</td>
          <td>$${Number(p.price).toFixed(2)}</td>
          <td class="mono" style="font-size:11.5px;color:var(--text-dim);">${new Date(p.createdAt).toLocaleString()}</td>
          <td><button class="icon-btn del" data-id="${p._id}">Delete</button></td>
        </tr>`
      )
      .join('');

    rows.querySelectorAll('.del').forEach((btn) =>
      btn.addEventListener('click', async () => {
        await API.del(`/api/products/${btn.dataset.id}`);
        load();
      })
    );
  }

  container.querySelector('#refresh-btn').addEventListener('click', load);
  load();
};
