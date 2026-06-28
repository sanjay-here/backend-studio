window.MODULE_RENDERERS = window.MODULE_RENDERERS || {};

window.MODULE_RENDERERS['mvc'] = function render(container) {
  container.innerHTML = `
    <div class="panel">
      <p class="panel-title">MVC Request Trace</p>
      <p class="note" style="margin-bottom:16px;">Press the button to create a product. Watch each layer
      light up in order as the request actually passes through it.</p>
      <div class="steps" id="mvc-steps">
        <div class="step" data-step="0"><span class="num">1</span> Browser sends POST /api/products</div>
        <div class="step" data-step="1"><span class="num">2</span> Route — routes/products.js maps the URL to a controller</div>
        <div class="step" data-step="2"><span class="num">3</span> Controller — productController.createProduct() runs the logic</div>
        <div class="step" data-step="3"><span class="num">4</span> Model — Product.create() validates &amp; talks to MongoDB</div>
        <div class="step" data-step="4"><span class="num">5</span> MongoDB — document is written to the products collection</div>
        <div class="step" data-step="5"><span class="num">6</span> Response — JSON sent back to the browser</div>
      </div>
      <div class="btn-row" style="margin-top:16px;">
        <button class="btn" id="mvc-run-btn">Create a sample product through the MVC chain</button>
      </div>
      <p class="note" id="mvc-result" style="margin-top:14px;"></p>
    </div>
  `;

  const stepEls = container.querySelectorAll('.step');

  async function runTrace() {
    const btn = container.querySelector('#mvc-run-btn');
    btn.disabled = true;
    stepEls.forEach((s) => s.classList.remove('active'));

    for (let i = 0; i <= 2; i++) {
      stepEls[i].classList.add('active');
      await sleep(350);
    }

    const sampleName = `Sample Item ${Math.floor(Math.random() * 1000)}`;
    const { data } = await API.post('/api/products', { name: sampleName, price: 9.99 });

    for (let i = 3; i <= 5; i++) {
      stepEls[i].classList.add('active');
      await sleep(350);
    }

    container.querySelector('#mvc-result').textContent =
      `Done. Product "${data.data?.name}" now exists in MongoDB with id ${data.data?._id}. ` +
      `Every layer (Route → Controller → Model → DB) you saw light up actually ran on the server.`;

    btn.disabled = false;
  }

  container.querySelector('#mvc-run-btn').addEventListener('click', runTrace);
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
