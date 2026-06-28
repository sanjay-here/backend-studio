window.MODULE_RENDERERS = window.MODULE_RENDERERS || {};

window.MODULE_RENDERERS['http-methods'] = function render(container) {
  container.innerHTML = `
    <div class="panel">
      <p class="panel-title">GET — Load Products</p>
      <div class="btn-row">
        <button class="btn" id="load-btn">GET /api/products</button>
      </div>
      <div style="margin-top:14px;">
        <table>
          <thead><tr><th>Name</th><th>Price</th><th>Actions</th></tr></thead>
          <tbody id="product-rows"><tr class="empty-row"><td colspan="3">Click "Load Products" to fetch from MongoDB.</td></tr></tbody>
        </table>
      </div>
    </div>

    <div class="grid-2" style="margin-top:16px;">
      <div class="panel">
        <p class="panel-title">POST — Create Product</p>
        <div class="field">
          <label>Name</label>
          <input type="text" id="new-name" placeholder="e.g. Mechanical Keyboard" />
        </div>
        <div class="field">
          <label>Price</label>
          <input type="number" id="new-price" placeholder="e.g. 49.99" />
        </div>
        <div class="btn-row">
          <button class="btn" id="create-btn">POST /api/products</button>
        </div>
        <p class="note" id="create-msg" style="margin-top:10px;"></p>
      </div>

      <div class="panel">
        <p class="panel-title">PUT — Edit Product</p>
        <p class="note" style="margin-bottom:10px;">Click "Edit" next to any product above, change the price, and save.</p>
        <div class="field">
          <label>Selected Product</label>
          <input type="text" id="edit-name" disabled placeholder="No product selected" />
        </div>
        <div class="field">
          <label>New Price</label>
          <input type="number" id="edit-price" disabled />
        </div>
        <div class="btn-row">
          <button class="btn" id="save-edit-btn" disabled>PUT /api/products/:id</button>
        </div>
      </div>
    </div>
  `;

  let editingId = null;

  async function loadProducts() {
    const { data } = await API.get('/api/products');
    const rows = container.querySelector('#product-rows');

    if (!data.data || data.data.length === 0) {
      rows.innerHTML = `<tr class="empty-row"><td colspan="3">No products yet — create one on the right.</td></tr>`;
      return;
    }

    rows.innerHTML = data.data
      .map(
        (p) => `
        <tr>
          <td>${escapeHtml(p.name)}</td>
          <td>$${Number(p.price).toFixed(2)}</td>
          <td class="row-actions">
            <button class="icon-btn edit-btn" data-id="${p._id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}">Edit</button>
            <button class="icon-btn del del-btn" data-id="${p._id}">Delete</button>
          </td>
        </tr>`
      )
      .join('');

    rows.querySelectorAll('.edit-btn').forEach((btn) =>
      btn.addEventListener('click', () => selectForEdit(btn.dataset.id, btn.dataset.name, btn.dataset.price))
    );
    rows.querySelectorAll('.del-btn').forEach((btn) =>
      btn.addEventListener('click', () => deleteProduct(btn.dataset.id))
    );
  }

  function selectForEdit(id, name, price) {
    editingId = id;
    container.querySelector('#edit-name').disabled = false;
    container.querySelector('#edit-name').value = name;
    container.querySelector('#edit-price').disabled = false;
    container.querySelector('#edit-price').value = price;
    container.querySelector('#save-edit-btn').disabled = false;
  }

  async function deleteProduct(id) {
    await API.del(`/api/products/${id}`);
    loadProducts();
  }

  container.querySelector('#load-btn').addEventListener('click', loadProducts);

  container.querySelector('#create-btn').addEventListener('click', async () => {
    const name = container.querySelector('#new-name').value.trim();
    const price = parseFloat(container.querySelector('#new-price').value);
    const msg = container.querySelector('#create-msg');

    if (!name || isNaN(price)) {
      msg.textContent = 'Enter a valid name and price.';
      return;
    }

    const { ok, data } = await API.post('/api/products', { name, price });
    msg.textContent = ok ? `Created "${data.data.name}" successfully.` : data.message;
    if (ok) {
      container.querySelector('#new-name').value = '';
      container.querySelector('#new-price').value = '';
      loadProducts();
    }
  });

  container.querySelector('#save-edit-btn').addEventListener('click', async () => {
    if (!editingId) return;
    const price = parseFloat(container.querySelector('#edit-price').value);
    await API.put(`/api/products/${editingId}`, { price });
    editingId = null;
    container.querySelector('#edit-name').value = '';
    container.querySelector('#edit-name').disabled = true;
    container.querySelector('#edit-price').value = '';
    container.querySelector('#edit-price').disabled = true;
    container.querySelector('#save-edit-btn').disabled = true;
    loadProducts();
  });

  loadProducts();
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
