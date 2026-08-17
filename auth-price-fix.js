import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const sb = createClient(
  'https://gqlcxvukyezqpdftjdeo.supabase.co',
  'sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8'
);

const esc = v => String(v ?? '').replace(/[&<>\"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const money = v => `NPR ${Number(v || 0).toLocaleString('en-NP')}`;
const norm = v => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

async function resolvePriceMap(items) {
  const names = [...new Set(items.map(i => norm(i.name)).filter(Boolean))];
  const { data } = await sb.from('products').select('sku,name,price');
  const byName = new Map();
  const bySku = new Map();
  (data || []).forEach(p => {
    const price = Number(p.price);
    if (!Number.isFinite(price)) return;
    if (p.sku) bySku.set(norm(p.sku), price);
    if (p.name) byName.set(norm(p.name), price);
  });
  return items.map(item => {
    const p = bySku.get(norm(item.sku)) ?? byName.get(norm(item.name)) ?? Number(item.price) || 2500;
    return { ...item, price: p };
  });
}

window.addEventListener('submit', async event => {
  if (event.target?.id !== 'odoCheckoutForm') return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const form = event.target;
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    document.querySelector('#odoAccountBtn')?.click();
    return;
  }

  let items;
  try { items = JSON.parse(localStorage.getItem('odoCart') || '[]'); } catch { items = []; }
  if (!Array.isArray(items) || !items.length) return;

  items = await resolvePriceMap(items);
  localStorage.setItem('odoCart', JSON.stringify(items));

  const data = Object.fromEntries(new FormData(form).entries());
  const total = items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0);
  const orderNumber = `ODO-${Date.now().toString().slice(-8)}`;

  const { data: order, error } = await sb.from('orders').insert({
    user_id: session.user.id,
    order_number: orderNumber,
    customer_name: String(data.name).trim(),
    customer_phone: String(data.phone).trim(),
    city: String(data.location).trim(),
    delivery_address: String(data.address).trim(),
    payment_method: 'COD',
    payment_status: 'PENDING',
    order_status: 'RECEIVED',
    subtotal: total,
    delivery_fee: 0,
    total,
    customer_note: String(data.note || '').trim()
  }).select('id').single();

  if (error) {
    alert(error.message);
    return;
  }

  const { error: itemError } = await sb.from('order_items').insert(
    items.map(item => ({
      order_id: order.id,
      product_name: item.name,
      product_sku: item.sku || null,
      size: item.size,
      quantity: Number(item.qty),
      unit_price: Number(item.price),
      line_total: Number(item.qty) * Number(item.price)
    }))
  );

  if (itemError) {
    alert(itemError.message);
    return;
  }

  await sb.from('customer_activity').insert({
    user_id: session.user.id,
    activity_type: 'order_placed',
    page_path: location.pathname,
    metadata: { order_number: orderNumber, total, items }
  });

  localStorage.removeItem('odoCart');

  form.innerHTML = `<div class="order-success">
    <p class="eyebrow">ORDER CONFIRMED</p>
    <h3>THANK YOU, ${esc(String(data.name).split(' ')[0]).toUpperCase()}.</h3>
    <p>Order <strong>${orderNumber}</strong> is saved to your ODO account.</p>
    <div style="margin:14px 0;color:#aaa;font-size:.7rem;line-height:1.8">
      ${items.map(i => `${esc(i.name)} · ${esc(i.size)} × ${i.qty} — ${money(Number(i.qty) * Number(i.price))}`).join('<br>')}
    </div>
    <p><strong>TOTAL · ${money(total)}</strong></p>
    <p class="cart-note">Cash on Delivery · All over Nepal.</p>
    <a class="checkout-submit" href="#streetwear">← BACK TO SHOP</a>
  </div>`;
}, true);
