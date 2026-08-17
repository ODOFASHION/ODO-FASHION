import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const sb = createClient(
  'https://gqlcxvukyezqpdftjdeo.supabase.co',
  'sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8'
);

const money = value => `NPR ${Number(value || 0).toLocaleString('en-NP')}`;
const norm = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

let priceByName = new Map();
let priceBySku = new Map();

function readCardPrices() {
  const map = new Map(priceByName);
  document.querySelectorAll('.product').forEach(card => {
    const name = card.querySelector('[data-name]')?.dataset?.name || card.querySelector('.product-meta h3')?.textContent || '';
    const raw = card.querySelector('.price')?.textContent || '';
    const match = raw.replace(/,/g, '').match(/(\d+)/);
    if (name && match) map.set(norm(name), Number(match[1]));
  });
  return map;
}

async function loadPrices() {
  try {
    const { data } = await sb.from('products').select('sku,name,price');
    (data || []).forEach(p => {
      const price = Number(p.price);
      if (!Number.isFinite(price)) return;
      if (p.sku) priceBySku.set(norm(p.sku), price);
      if (p.name) priceByName.set(norm(p.name), price);
    });
  } catch {}
  syncCartPrices();
}

function resolvePrice(item) {
  const sku = norm(item.sku);
  const name = norm(item.name);
  if (sku && priceBySku.has(sku)) return priceBySku.get(sku);
  if (name && priceByName.has(name)) return priceByName.get(name);
  const cardPrices = readCardPrices();
  if (name && cardPrices.has(name)) return cardPrices.get(name);
  return Number(item.price) > 0 ? Number(item.price) : 2500;
}

function syncCartPrices() {
  let cart;
  try { cart = JSON.parse(localStorage.getItem('odoCart') || '[]'); } catch { cart = []; }
  if (!Array.isArray(cart)) cart = [];
  let changed = false;
  cart = cart.map(item => {
    const price = resolvePrice(item);
    if (Number(item.price) !== price) { changed = true; return { ...item, price }; }
    return item;
  });
  if (changed) localStorage.setItem('odoCart', JSON.stringify(cart));
  renderPriceCart(cart);
}

function renderPriceCart(cart) {
  const container = document.querySelector('#cartItems');
  const countEl = document.querySelector('#cartCount');
  const totalEl = document.querySelector('#cartTotal');
  const count = cart.reduce((s, i) => s + Number(i.qty || 0), 0);
  const total = cart.reduce((s, i) => s + Number(i.qty || 0) * resolvePrice(i), 0);
  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = money(total);
  if (!container) return;
  if (!cart.length) {
    container.innerHTML = '<p class="empty-cart">Your cart is empty.<br>Choose a piece from the first drop.</p>';
    return;
  }
  container.innerHTML = cart.map((item, index) => {
    const price = resolvePrice(item);
    return `<div class="cart-item"><div><div class="cart-item-name">${item.name}</div><div class="cart-item-meta">SIZE ${item.size} · ${money(price)} each</div><div class="qty-controls"><button data-action="minus" data-index="${index}">−</button><strong>${item.qty}</strong><button data-action="plus" data-index="${index}">+</button><button class="remove-item" data-action="remove" data-index="${index}">REMOVE</button></div></div><div class="cart-item-price">${money(Number(item.qty || 0) * price)}</div></div>`;
  }).join('');
}

window.odoResolveProductPrice = resolvePrice;
window.odoRefreshCartPrices = syncCartPrices;

window.addToCart = function(button) {
  const product = button.closest('.product');
  const size = product?.querySelector('.size-select')?.value || 'ONE SIZE';
  const name = button.dataset.name || product?.querySelector('.product-meta h3')?.textContent?.trim() || 'ODO Product';
  const skuText = product?.querySelector('.product-number')?.textContent?.split('/')?.[0]?.trim() || '';
  const price = resolvePrice({ name, sku: skuText });
  let cart;
  try { cart = JSON.parse(localStorage.getItem('odoCart') || '[]'); } catch { cart = []; }
  if (!Array.isArray(cart)) cart = [];
  const existing = cart.find(i => i.name === name && i.size === size);
  if (existing) existing.qty = Number(existing.qty || 0) + 1;
  else cart.push({ name, sku: skuText, size, qty: 1, price });
  localStorage.setItem('odoCart', JSON.stringify(cart));
  renderPriceCart(cart);
  document.body.classList.add('cart-open');
  document.querySelector('#cartPanel')?.setAttribute('aria-hidden', 'false');
}

window.renderCart = function() {
  let cart;
  try { cart = JSON.parse(localStorage.getItem('odoCart') || '[]'); } catch { cart = []; }
  if (!Array.isArray(cart)) cart = [];
  syncCartPrices();
};

const observer = new MutationObserver(() => {
  clearTimeout(window.__odoPriceTimer);
  window.__odoPriceTimer = setTimeout(syncCartPrices, 100);
});
observer.observe(document.body, { childList: true, subtree: true });

loadPrices();
setTimeout(syncCartPrices, 400);
setTimeout(syncCartPrices, 1500);
