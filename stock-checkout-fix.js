import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const sb = createClient(
  'https://gqlcxvukyezqpdftjdeo.supabase.co',
  'sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8'
);

const esc = v => String(v ?? '').replace(/[&<>\"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const money = v => `NPR ${Number(v || 0).toLocaleString('en-NP')}`;
let products = new Map();

async function refreshProducts(){
  const {data,error}=await sb.from('products').select('sku,name,price,stock_quantity,active').eq('active',true);
  if(error)return;
  products=new Map((data||[]).map(p=>[String(p.sku||p.name).toLowerCase(),p]));
}

function resolve(item){
  const sku=String(item.sku||'').toLowerCase();
  const name=String(item.name||'').toLowerCase();
  return products.get(sku)||products.get(name)||null;
}

function cart(){try{const x=JSON.parse(localStorage.getItem('odoCart')||'[]');return Array.isArray(x)?x:[]}catch{return[]}}

async function checkout(event){
  event.preventDefault();
  event.stopImmediatePropagation();
  await refreshProducts();
  const {data:{session}}=await sb.auth.getSession();
  if(!session){document.querySelector('#odoAccountBtn')?.click();return;}
  const items=cart();
  if(!items.length){alert('Your cart is empty.');return;}

  const normalized=[];
  for(const item of items){
    const p=resolve(item);
    if(!p){alert(`Product not found: ${item.name}`);return;}
    const qty=Math.max(1,Number(item.qty||0));
    const stock=Number(p.stock_quantity||0);
    if(stock<qty){alert(`${p.name}: only ${stock} available.`);return;}
    normalized.push({sku:p.sku,name:p.name,size:item.size||'ONE SIZE',quantity:qty});
  }

  const form=event.target;
  const f=new FormData(form);
  const payload={
    p_customer_name:String(f.get('name')||'').trim(),
    p_customer_phone:String(f.get('phone')||'').trim(),
    p_city:String(f.get('location')||'').trim(),
    p_delivery_address:String(f.get('address')||'').trim(),
    p_customer_note:String(f.get('note')||'').trim()||null,
    p_items:normalized
  };

  const {data:order,error}=await sb.rpc('odo_place_order',payload);
  if(error){alert(error.message);await refreshProducts();return;}

  localStorage.removeItem('odoCart');
  form.innerHTML=`<div class="order-success">
    <p class="eyebrow">ORDER CONFIRMED</p>
    <h3>THANK YOU, ${esc(payload.p_customer_name.split(' ')[0]).toUpperCase()}.</h3>
    <p>Order <strong>${esc(order.order_number)}</strong> is confirmed.</p>
    <p class="cart-note">${normalized.map(i=>`${esc(i.name)} · ${esc(i.size)} × ${i.quantity}`).join('<br>')}</p>
    <p><strong>TOTAL · ${money(order.total)}</strong></p>
    <p class="cart-note">Cash on Delivery · All over Nepal.</p>
    <a class="checkout-submit" href="#streetwear">← BACK TO SHOP</a>
  </div>`;

  await refreshProducts();
  document.querySelectorAll('.product').forEach(card=>{
    const sku=card.querySelector('.product-number')?.textContent?.split('/')?.[0]?.trim()||'';
    const name=card.querySelector('.product-meta h3')?.textContent?.trim()||'';
    const p=resolve({sku,name});
    if(!p)return;
    const note=card.querySelector('.odo-stock-note');
    if(note)note.textContent=Number(p.stock_quantity)<=0?'SOLD OUT':Number(p.stock_quantity)<=3?`ONLY ${p.stock_quantity} LEFT`:`${p.stock_quantity} IN STOCK`;
    const add=card.querySelector('.add-btn');
    if(add)add.disabled=Number(p.stock_quantity)<=0;
  });
}

window.addEventListener('submit',e=>{
  if(e.target?.id==='odoCheckoutForm')checkout(e);
},true);

refreshProducts();
setInterval(refreshProducts,5000);
