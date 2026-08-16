import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const sb = createClient(
  'https://gqlcxvukyezqpdftjdeo.supabase.co',
  'sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8'
);

const esc = v => String(v ?? '').replace(/[&<>\"]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[m]));

async function boot() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return;
  const { data: me } = await sb.from('profiles').select('is_admin').eq('id', session.user.id).maybeSingle();
  if (!me?.is_admin) return;

  const main = document.querySelector('.odo-admin-main');
  if (!main || document.getElementById('odoInventorySection')) return;

  const style = document.createElement('style');
  style.textContent = `
    #odoInventorySection{margin:45px 0}
    #odoInventorySection .inventory-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:20px 0}
    #odoInventorySection .inv-card{border:1px solid rgba(245,241,232,.12);padding:14px;background:#0d0d0c}
    #odoInventorySection .inv-card span{display:block;color:#8f887d;font-size:.52rem;letter-spacing:.08em}
    #odoInventorySection .inv-card strong{display:block;font-size:1.2rem;margin-top:7px}
    #odoInventorySection .stock-low{color:#d8b35e}.stock-out{color:#c56b6b}.stock-ok{color:#a9a49b}
    #odoInventorySection .inventory-table{width:100%;border-collapse:collapse}
    #odoInventorySection .inventory-table th,#odoInventorySection .inventory-table td{padding:10px;border-bottom:1px solid rgba(245,241,232,.08);text-align:left;font-size:.58rem}
    #odoInventorySection .inventory-table input{width:80px;background:#111;color:#f5f1e8;border:1px solid rgba(245,241,232,.15);padding:7px}
    @media(max-width:800px){#odoInventorySection .inventory-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.id = 'odoInventorySection';
  section.innerHTML = `
    <div class="odo-admin-title">
      <div><p class="eyebrow">INVENTORY + ENGAGEMENT</p><h2>STORE CONTROL.</h2></div>
      <p>Stock, likes and sold count for every ODO product.</p>
    </div>
    <div class="inventory-grid" id="odoInventoryStats"></div>
    <div class="odo-admin-table-wrap">
      <table class="inventory-table">
        <thead><tr><th>PRODUCT</th><th>STOCK</th><th>LOW AT</th><th>LIKES</th><th>SOLD</th><th>ACTION</th></tr></thead>
        <tbody id="odoInventoryRows"></tbody>
      </table>
    </div>
  `;
  main.prepend(section);

  async function load() {
    const { data: products, error } = await sb.from('products').select('id,sku,name,stock_quantity,low_stock_threshold,sold_count,active').order('created_at', { ascending:false });
    if (error) {
      document.getElementById('odoInventoryRows').innerHTML = `<tr><td colspan="6">${esc(error.message)}</td></tr>`;
      return;
    }

    const skus = (products || []).map(p => p.sku);
    let likes = {};
    if (skus.length) {
      const { data } = await sb.from('product_likes').select('product_sku');
      for (const row of data || []) {
        const sku = String(row.product_sku || '');
        if (sku) likes[sku] = (likes[sku] || 0) + 1;
      }
    }

    const rows = products || [];
    const totalStock = rows.reduce((n,p) => n + Number(p.stock_quantity || 0), 0);
    const totalSold = rows.reduce((n,p) => n + Number(p.sold_count || 0), 0);
    const totalLikes = rows.reduce((n,p) => n + Number(likes[p.sku] || 0), 0);
    const low = rows.filter(p => Number(p.stock_quantity || 0) > 0 && Number(p.stock_quantity || 0) <= Number(p.low_stock_threshold ?? 3)).length;

    document.getElementById('odoInventoryStats').innerHTML = [
      ['TOTAL STOCK', totalStock],
      ['TOTAL SOLD', totalSold],
      ['TOTAL LIKES', totalLikes],
      ['LOW STOCK ITEMS', low]
    ].map(([label,value]) => `<div class="inv-card"><span>${label}</span><strong>${value}</strong></div>`).join('');

    document.getElementById('odoInventoryRows').innerHTML = rows.map(p => {
      const stock = Number(p.stock_quantity || 0);
      const threshold = Number(p.low_stock_threshold ?? 3);
      const cls = stock <= 0 ? 'stock-out' : stock <= threshold ? 'stock-low' : 'stock-ok';
      const label = stock <= 0 ? 'SOLD OUT' : `${stock}`;
      return `<tr>
        <td><strong>${esc(p.name)}</strong><br><span>${esc(p.sku)}</span></td>
        <td><input type="number" min="0" value="${stock}" data-stock="${p.id}"></td>
        <td><input type="number" min="0" value="${threshold}" data-low="${p.id}"></td>
        <td>♥ ${likes[p.sku] || 0}</td>
        <td><input type="number" min="0" value="${Number(p.sold_count || 0)}" data-sold="${p.id}"></td>
        <td><button class="admin-btn" data-save-inventory="${p.id}">SAVE</button> <span class="${cls}">${label}</span></td>
      </tr>`;
    }).join('') || '<tr><td colspan="6">No products yet.</td></tr>';

    document.querySelectorAll('[data-save-inventory]').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.dataset.saveInventory;
        const stock = Number(document.querySelector(`[data-stock="${id}"]`)?.value || 0);
        const lowStockThreshold = Number(document.querySelector(`[data-low="${id}"]`)?.value || 0);
        const soldCount = Number(document.querySelector(`[data-sold="${id}"]`)?.value || 0);
        const { error } = await sb.from('products').update({
          stock_quantity: stock,
          low_stock_threshold: lowStockThreshold,
          sold_count: soldCount,
          updated_at: new Date().toISOString()
        }).eq('id', id);
        if (error) { alert(error.message); return; }
        btn.textContent = 'SAVED';
        setTimeout(() => btn.textContent = 'SAVE', 1200);
        load();
      };
    });
  }

  await load();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

// Intercept order-status changes before admin.js updates the order directly.
// This keeps stock changes atomic inside the Supabase RPC.
document.addEventListener('change', async (event) => {
  const select = event.target?.closest?.('.status-select');
  if (!select || !select.dataset.orderId) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const status = select.value;
  try {
    const { error } = await sb.rpc('admin_update_order_status', {
      p_order_id: select.dataset.orderId,
      p_new_status: status
    });
    if (error) throw error;
    await window.odoAdminRefreshOrders?.();
    if (!window.odoAdminRefreshOrders) location.reload();
  } catch (error) {
    console.error('ODO stock update:', error);
    alert(`Stock update failed: ${error.message || error}`);
    await window.odoAdminRefreshOrders?.();
  }
}, true);
