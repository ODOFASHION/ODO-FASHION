(() => {
  const PRODUCT_INFO = [
    { sku: '001', name: 'Laija Mero Maya T-Shirt' },
    { sku: '002', name: 'Sapana Energy T-Shirt' },
    { sku: '003', name: 'Kathmandu T-Shirt' },
    { sku: '004', name: 'Zero to Hero Hoodie' },
    { sku: '005', name: 'Budi Aajhai T-Shirt' },
  ];

  const WISHLIST_KEY = 'odoWishlist';
  const wishlist = new Set(JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'));

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>\"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  }[c]));

  function saveWishlist() {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist]));
  }

  function productUrl(sku) {
    return `${location.origin}${location.pathname}#product-${sku}`;
  }

  function showToast(text) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(window.odoEngagementToast);
    window.odoEngagementToast = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function addStyles() {
    if (document.getElementById('odoEngagementStyles')) return;
    const style = document.createElement('style');
    style.id = 'odoEngagementStyles';
    style.textContent = `
      .odo-product-actions{display:flex;gap:7px;align-items:center;margin-top:10px}
      .odo-product-actions button{background:transparent;border:1px solid rgba(245,241,232,.16);color:#d9d2c4;padding:7px 9px;font:inherit;font-size:.5rem;letter-spacing:.08em;cursor:pointer}
      .odo-product-actions button:hover{border-color:rgba(200,165,96,.55);color:#e5c982}
      .odo-product-like.is-liked{border-color:rgba(200,165,96,.65)!important;color:#e5c982!important}
      .odo-wishlist-panel{position:fixed;right:20px;top:78px;width:min(360px,calc(100vw - 32px));max-height:70vh;overflow:auto;z-index:260;background:#0b0b0a;border:1px solid rgba(200,165,96,.35);padding:18px;display:none;box-shadow:0 20px 60px rgba(0,0,0,.5)}
      .odo-wishlist-panel.open{display:block}.odo-wishlist-panel h3{margin:0 0 12px}.odo-wish-row{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid rgba(245,241,232,.08)}
      .odo-wish-row span{font-size:.62rem;color:#ccc}.odo-wish-row button{background:none;border:0;color:#c8a560;cursor:pointer;font-size:.5rem}
      .odo-wishlist-launcher{position:fixed;right:20px;top:20px;z-index:261;background:#0d0d0c;color:#f5f1e8;border:1px solid rgba(200,165,96,.4);padding:9px 12px;font-size:.55rem;letter-spacing:.08em;cursor:pointer}
      @media(max-width:600px){.odo-wishlist-launcher{right:12px;top:12px}.odo-wishlist-panel{right:12px;top:58px}}
    `;
    document.head.appendChild(style);
  }

  async function shareProduct(sku, name) {
    const url = productUrl(sku);
    const shareData = { title: `ODOFASHION — ${name}`, text: `Check out ${name} from ODOFASHION. See Beyond.`, url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast('Product link copied');
    } catch {
      window.prompt('Copy this product link:', url);
    }
  }

  function openWishlist() {
    const panel = document.getElementById('odoWishlistPanel');
    if (!panel) return;
    const body = panel.querySelector('[data-wishlist-body]');
    body.innerHTML = PRODUCT_INFO.filter((p) => wishlist.has(p.sku)).map((p) => `
      <div class="odo-wish-row">
        <span>${escapeHtml(p.name)}</span>
        <button data-remove-wish="${p.sku}">REMOVE</button>
      </div>
    `).join('') || '<p style="color:#777;font-size:.62rem">Your wishlist is empty.</p>';
    panel.classList.toggle('open');
  }

  function mountWishlist() {
    if (document.getElementById('odoWishlistLauncher')) return;
    const launcher = document.createElement('button');
    launcher.id = 'odoWishlistLauncher';
    launcher.className = 'odo-wishlist-launcher';
    launcher.textContent = '♡ WISHLIST';
    document.body.appendChild(launcher);

    const panel = document.createElement('aside');
    panel.id = 'odoWishlistPanel';
    panel.className = 'odo-wishlist-panel';
    panel.innerHTML = '<h3>MY WISHLIST.</h3><div data-wishlist-body></div>';
    document.body.appendChild(panel);

    launcher.addEventListener('click', openWishlist);
    panel.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-remove-wish]');
      if (!btn) return;
      wishlist.delete(btn.dataset.removeWish);
      saveWishlist();
      updateLikeButtons();
      openWishlist();
    });
  }

  function updateLikeButtons() {
    document.querySelectorAll('.odo-product-like').forEach((button) => {
      const sku = button.dataset.sku;
      const liked = wishlist.has(sku);
      button.classList.toggle('is-liked', liked);
      button.textContent = liked ? '♥ SAVED' : '♡ SAVE';
    });
  }

  function handleHash() {
    const match = location.hash.match(/^#product-(\d+)$/);
    if (!match) return;
    const card = document.querySelector(`.product[data-odo-sku="${match[1]}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function mountProducts() {
    const cards = document.querySelectorAll('.streetwear-products .product');
    cards.forEach((card, index) => {
      const info = PRODUCT_INFO[index];
      if (!info || card.dataset.engagementMounted === '1') return;
      card.dataset.engagementMounted = '1';
      card.dataset.odoSku = info.sku;
      card.id = `product-${info.sku}`;

      const actions = document.createElement('div');
      actions.className = 'odo-product-actions';
      actions.innerHTML = `<button class="odo-product-like" data-sku="${info.sku}">♡ SAVE</button><button class="odo-product-share" data-sku="${info.sku}">SHARE ↗</button>`;
      card.querySelector('.product-controls')?.after(actions);

      actions.querySelector('.odo-product-like').addEventListener('click', () => {
        if (wishlist.has(info.sku)) {
          wishlist.delete(info.sku);
          showToast(`${info.name} removed from wishlist`);
        } else {
          wishlist.add(info.sku);
          showToast(`${info.name} saved`);
        }
        saveWishlist();
        updateLikeButtons();
      });

      actions.querySelector('.odo-product-share').addEventListener('click', () => shareProduct(info.sku, info.name));
    });

    updateLikeButtons();
    handleHash();
  }

  function boot() {
    addStyles();
    mountWishlist();
    mountProducts();
    window.addEventListener('hashchange', handleHash);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 1000);
})();
