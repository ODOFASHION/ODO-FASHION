import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

(() => {
  const SUPABASE_URL = 'https://gqlcxvukyezqpdftjdeo.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8';
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const WISHLIST_KEY = 'odoWishlist';
  const wishlist = new Set(JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'));

  const esc = (value) => String(value ?? '').replace(/[&<>\"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  }[c]));
  const money = (value) => `NPR ${Number(value || 0).toLocaleString('en-NP')}`;

  function saveWishlist() { localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist])); }
  function productUrl(sku) { return `${location.origin}${location.pathname}#product-${encodeURIComponent(sku)}`; }

  function toast(text) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = text; el.classList.add('show'); clearTimeout(window.odoEngagementToast);
    window.odoEngagementToast = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function styles() {
    if (document.getElementById('odoEngagementStyles')) return;
    const style = document.createElement('style'); style.id = 'odoEngagementStyles';
    style.textContent = `
      .odo-product-actions{display:flex;gap:7px;align-items:center;margin-top:10px;flex-wrap:wrap}
      .odo-product-actions button{background:transparent;border:1px solid rgba(245,241,232,.16);color:#d9d2c4;padding:7px 9px;font:inherit;font-size:.5rem;letter-spacing:.08em;cursor:pointer}
      .odo-product-actions button:hover{border-color:rgba(200,165,96,.55);color:#e5c982}
      .odo-product-like.is-liked{border-color:rgba(200,165,96,.65)!important;color:#e5c982!important}
      .odo-wishlist-panel{position:fixed;right:20px;top:78px;width:min(360px,calc(100vw - 32px));max-height:70vh;overflow:auto;z-index:260;background:#0b0b0a;border:1px solid rgba(200,165,96,.35);padding:18px;display:none;box-shadow:0 20px 60px rgba(0,0,0,.5)}
      .odo-wishlist-panel.open{display:block}.odo-wishlist-panel h3{margin:0 0 12px}.odo-wish-row{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid rgba(245,241,232,.08)}
      .odo-wish-row span{font-size:.62rem;color:#ccc}.odo-wish-row button{background:none;border:0;color:#c8a560;cursor:pointer;font-size:.5rem}
      .odo-wishlist-launcher{position:fixed;right:20px;top:20px;z-index:261;background:#0d0d0c;color:#f5f1e8;border:1px solid rgba(200,165,96,.4);padding:9px 12px;font-size:.55rem;letter-spacing:.08em;cursor:pointer}
      .odo-live-catalog-generated{display:block}
      @media(max-width:600px){.odo-wishlist-launcher{right:12px;top:12px}.odo-wishlist-panel{right:12px;top:58px}}
    `;
    document.head.appendChild(style);
  }

  async function shareProduct(product) {
    const url = productUrl(product.sku);
    const shareData = { title: `ODOFASHION — ${product.name}`, text: `Check out ${product.name} from ODOFASHION. See Beyond.`, url };
    try {
      if (navigator.share) { await navigator.share(shareData); return; }
    } catch (e) { if (e?.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(url); toast('Product link copied'); }
    catch { window.prompt('Copy this product link:', url); }
  }

  function mountWishlist() {
    if (document.getElementById('odoWishlistLauncher')) return;
    const launcher = document.createElement('button'); launcher.id = 'odoWishlistLauncher'; launcher.className = 'odo-wishlist-launcher'; launcher.textContent = '♡ WISHLIST';
    document.body.appendChild(launcher);
    const panel = document.createElement('aside'); panel.id = 'odoWishlistPanel'; panel.className = 'odo-wishlist-panel'; panel.innerHTML = '<h3>MY WISHLIST.</h3><div data-wishlist-body></div>';
    document.body.appendChild(panel);
    launcher.addEventListener('click', () => { panel.classList.toggle('open'); renderWishlistBody(); });
    panel.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-remove-wish]'); if (!btn) return;
      wishlist.delete(btn.dataset.removeWish); saveWishlist(); updateLikeButtons();
    });
    renderWishlistBody();
  }

  function renderWishlistBody() {
    const panel = document.getElementById('odoWishlistPanel'); if (!panel) return;
    const body = panel.querySelector('[data-wishlist-body]');
    const cards = [...document.querySelectorAll('[data-odo-product]')];
    const saved = cards.filter((card) => wishlist.has(card.dataset.odoSku));
    body.innerHTML = saved.map((card) => `<div class="odo-wish-row"><span>${esc(card.dataset.odoName)}</span><button data-remove-wish="${esc(card.dataset.odoSku)}">REMOVE</button></div>`).join('') || '<p style="color:#777;font-size:.62rem">Your wishlist is empty.</p>';
  }

  function updateLikeButtons() {
    document.querySelectorAll('.odo-product-like').forEach((button) => {
      const liked = wishlist.has(button.dataset.sku); button.classList.toggle('is-liked', liked); button.textContent = liked ? '♥ SAVED' : '♡ SAVE';
    });
    renderWishlistBody();
  }

  function addDynamicCart(product, size) {
    const cart = JSON.parse(localStorage.getItem('odoCart') || '[]');
    const existing = cart.find((item) => item.name === product.name && item.size === size);
    if (existing) existing.qty += 1;
    else cart.push({ name: product.name, size, qty: 1, price: Number(product.price || 0), sku: product.sku });
    localStorage.setItem('odoCart', JSON.stringify(cart));
    document.getElementById('cartOpen')?.click();
    toast(`${product.name} — ${size} added`);
  }

  function cardHtml(product) {
    const sizes = Array.isArray(product.sizes) && product.sizes.length ? product.sizes : ['ONE SIZE'];
    return `<article class="product reveal odo-live-catalog-generated" id="product-${esc(product.sku)}" data-odo-product data-odo-sku="${esc(product.sku)}" data-odo-name="${esc(product.name)}">
      <div class="product-art product-photo-wrap">${product.image_url ? `<img class="product-photo" src="${esc(product.image_url)}" alt="${esc(product.name)}" loading="lazy">` : ''}</div>
      <div class="product-meta"><div><p class="product-number">${esc(product.sku)} / ${esc(product.category)}</p><h3>${esc(product.name)}</h3><p class="price">${money(product.price)}</p></div><span class="status">LIVE</span></div>
      <p class="product-desc">${esc(product.description || '')}</p>
      <div class="product-controls"><label>Size <select class="size-select">${sizes.map((s) => `<option>${esc(s)}</option>`).join('')}</select></label><button class="add-btn odo-dynamic-add">ADD TO CART</button></div>
      <div class="odo-product-actions"><button class="odo-product-like" data-sku="${esc(product.sku)}">♡ SAVE</button><button class="odo-product-share" data-sku="${esc(product.sku)}">SHARE ↗</button></div>
    </article>`;
  }

  function bindDynamicCards(products) {
    document.querySelectorAll('.odo-live-catalog-generated').forEach((card) => {
      const sku = card.dataset.odoSku; const product = products.find((p) => String(p.sku) === String(sku));
      if (!product || card.dataset.bound === '1') return;
      card.dataset.bound = '1';
      card.querySelector('.odo-dynamic-add')?.addEventListener('click', () => addDynamicCart(product, card.querySelector('.size-select')?.value || 'ONE SIZE'));
      card.querySelector('.odo-product-like')?.addEventListener('click', () => {
        if (wishlist.has(product.sku)) { wishlist.delete(product.sku); toast(`${product.name} removed from wishlist`); }
        else { wishlist.add(product.sku); toast(`${product.name} saved`); }
        saveWishlist(); updateLikeButtons();
      });
      card.querySelector('.odo-product-share')?.addEventListener('click', () => shareProduct(product));
    });
    updateLikeButtons();
  }

  async function renderCatalog() {
    const { data: products, error } = await sb.from('products').select('*').eq('active', true).order('created_at', { ascending: true });
    if (error || !products?.length) return;

    const streetwearGrid = document.querySelector('#streetwear .streetwear-products');
    if (streetwearGrid) {
      streetwearGrid.innerHTML = products.filter((p) => p.category === 'STREETWEAR' || p.category === 'OUTERWEAR').map(cardHtml).join('');
      bindDynamicCards(products);
    }

    let live = document.getElementById('odoDynamicCatalog');
    if (!live) {
      live = document.createElement('section'); live.id = 'odoDynamicCatalog'; live.className = 'section';
      const about = document.getElementById('about'); about?.parentNode.insertBefore(live, about);
    }
    const nonStreet = products.filter((p) => p.category !== 'STREETWEAR' && p.category !== 'OUTERWEAR');
    live.innerHTML = `<div class="section-top"><div><p class="eyebrow">03 / ACCESSORIES + NEW DROPS</p><h2>NEW FROM <em>ODO.</em></h2></div><p class="section-intro">Products added from the ODO admin dashboard appear here automatically.</p></div><div class="products streetwear-products">${nonStreet.map(cardHtml).join('')}</div>`;
    bindDynamicCards(products);

    document.querySelectorAll('section').forEach((section) => {
      if (section !== live && section.id !== 'streetwear' && /NEW FROM\s*ODO/i.test(section.textContent || '')) section.remove();
    });
  }

  function jumpToHash() {
    const raw = location.hash.match(/^#product-(.+)$/)?.[1]; if (!raw) return;
    const sku = decodeURIComponent(raw); document.querySelector(`[data-odo-sku="${CSS.escape(sku)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function boot() { styles(); mountWishlist(); await renderCatalog(); jumpToHash(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('hashchange', jumpToHash); setTimeout(boot, 1200);
})();
