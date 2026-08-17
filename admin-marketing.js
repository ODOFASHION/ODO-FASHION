import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL='https://gqlcxvukyezqpdftjdeo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8';
const sb=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const money=v=>`NPR ${Number(v||0).toLocaleString('en-NP')}`;
const dateFmt=v=>new Date(v).toLocaleString('en-NP');

function injectStyles(){
  if(document.getElementById('odoMarketingStyles'))return;
  const s=document.createElement('style');
  s.id='odoMarketingStyles';
  s.textContent=`
  #odoMarketingSection{margin:45px 0}
  .odo-marketing-kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin:20px 0}
  .odo-marketing-kpi{background:#0d0d0c;border:1px solid rgba(200,165,96,.2);padding:18px;min-height:90px}
  .odo-marketing-kpi span{display:block;color:#77736c;font-size:.5rem;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px}
  .odo-marketing-kpi strong{display:block;color:#f5f1e8;font-size:1.15rem}
  .odo-marketing-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  .odo-marketing-card{background:#0d0d0c;border:1px solid rgba(245,241,232,.08);padding:20px}
  .odo-marketing-card h3{margin:0 0 15px;font-size:1rem}
  .odo-marketing-list{display:grid;gap:8px}
  .odo-marketing-row{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid rgba(245,241,232,.06);font-size:.64rem}
  .odo-marketing-row:last-child{border-bottom:0}
  .odo-marketing-row strong{color:#f5f1e8}
  .odo-marketing-row span{color:#c8a560}
  .odo-marketing-muted{color:#77736c;font-size:.65rem;line-height:1.7}
  .odo-marketing-refresh{margin:0 0 18px;background:transparent;color:#f5f1e8;border:1px solid rgba(200,165,96,.35);padding:9px 12px;font-size:.56rem;letter-spacing:.1em;cursor:pointer}
  @media(max-width:1100px){.odo-marketing-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}}
  @media(max-width:700px){.odo-marketing-kpis,.odo-marketing-grid{grid-template-columns:1fr}.odo-marketing-kpi{min-height:auto}}
  `;
  document.head.appendChild(s);
}

function cardList(rows, empty='No data yet.'){
  if(!rows?.length)return `<div class="odo-marketing-muted">${empty}</div>`;
  return `<div class="odo-marketing-list">${rows.map(r=>`<div class="odo-marketing-row"><strong>${esc(r[0])}</strong><span>${esc(r[1])}</span></div>`).join('')}</div>`;
}

async function boot(){
  const {data:{session}}=await sb.auth.getSession();
  if(!session)return;
  const {data:me}=await sb.from('profiles').select('is_admin').eq('id',session.user.id).maybeSingle();
  if(!me?.is_admin)return;
  const main=document.querySelector('.odo-admin-main');
  if(!main||document.getElementById('odoMarketingSection'))return;

  injectStyles();
  const sec=document.createElement('section');
  sec.id='odoMarketingSection';
  sec.className='odo-marketing-section';
  sec.innerHTML=`<div class="odo-admin-title"><div><p class="eyebrow">09 / MARKETING & GROWTH</p><h2>MARKETING.</h2></div><p>Traffic, product interest, orders and sales in one place.</p></div>
  <button id="odoMarketingRefresh" class="odo-marketing-refresh">REFRESH DATA ↻</button>
  <div id="odoMarketingKpis" class="odo-marketing-kpis"></div>
  <div class="odo-marketing-grid">
    <div class="odo-marketing-card"><p class="eyebrow">TRAFFIC SOURCES</p><h3>WHERE PEOPLE CAME FROM.</h3><div id="mSources"></div></div>
    <div class="odo-marketing-card"><p class="eyebrow">TOP PRODUCTS</p><h3>WHAT PEOPLE ARE INTERESTED IN.</h3><div id="mProducts"></div></div>
    <div class="odo-marketing-card"><p class="eyebrow">POPULARITY</p><h3>LIKES + STOCK.</h3><div id="mLikes"></div></div>
    <div class="odo-marketing-card"><p class="eyebrow">SALES</p><h3>ORDER PERFORMANCE.</h3><div id="mOrders"></div></div>
    <div class="odo-marketing-card"><p class="eyebrow">DEVICES</p><h3>HOW CUSTOMERS SHOP.</h3><div id="mDevices"></div></div>
    <div class="odo-marketing-card"><p class="eyebrow">RECENT ACTIVITY</p><h3>LATEST ORDERS.</h3><div id="mRecent"></div></div>
  </div>`;
  main.prepend(sec);
  document.getElementById('odoMarketingRefresh').onclick=loadMarketing;
  await loadMarketing();
}

async function loadMarketing(){
  const {count:visitCount}=await sb.from('site_visits').select('*',{count:'exact',head:true});
  const {data:visits}=await sb.from('site_visits').select('source,device_type').order('created_at',{ascending:false}).limit(3000);
  const {data:products}=await sb.from('products').select('id,sku,name,price,stock_quantity,sold_count,active').order('created_at',{ascending:false});
  const {data:likes}=await sb.from('product_likes').select('product_sku');
  const {data:orders}=await sb.from('orders').select('id,order_number,customer_name,order_status,total,created_at').order('created_at',{ascending:false}).limit(1000);
  const {data:items}=await sb.from('order_items').select('order_id,product_name,quantity');

  const v=visits||[], p=products||[], l=likes||[], o=orders||[], oi=items||[];
  const completed=o.filter(x=>['CONFIRMED','PROCESSING','SHIPPED','OUT FOR DELIVERY','DELIVERED'].includes(String(x.order_status||'').toUpperCase()));
  const revenue=completed.reduce((s,x)=>s+Number(x.total||0),0);
  const avg=completed.length?revenue/completed.length:0;
  const uniqueVisitors=new Set(v.map(x=>x.visitor_id).filter(Boolean)).size;
  const likeMap={};l.forEach(x=>{likeMap[x.product_sku]=(likeMap[x.product_sku]||0)+1});
  const nameMap={};p.forEach(x=>nameMap[x.sku]=x.name);
  const sourceMap={},deviceMap={};v.forEach(x=>{const s=x.source||'direct';sourceMap[s]=(sourceMap[s]||0)+1;const d=x.device_type||'unknown';deviceMap[d]=(deviceMap[d]||0)+1});
  const itemMap={};oi.forEach(x=>{itemMap[x.product_name]=(itemMap[x.product_name]||0)+Number(x.quantity||0)});
  const topProducts=Object.entries(itemMap).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const topLikes=p.map(x=>[x.name,`♥ ${likeMap[x.sku]||0} · ${Number(x.stock_quantity||0)} in stock`]).sort((a,b)=>Number((b[1].match(/♥ (\d+)/)||[])[1]||0)-Number((a[1].match(/♥ (\d+)/)||[])[1]||0)).slice(0,8);
  const recent=o.slice(0,8).map(x=>[x.order_number,`${money(x.total)} · ${x.order_status}`]);
  const sourceRows=Object.entries(sourceMap).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const deviceRows=Object.entries(deviceMap).sort((a,b)=>b[1]-a[1]).slice(0,6);

  document.getElementById('odoMarketingKpis').innerHTML=[
    ['TOTAL VISITS',visitCount||0],
    ['UNIQUE VISITORS',uniqueVisitors||0],
    ['ORDERS',o.length],
    ['SALES',money(revenue)],
    ['AVG ORDER',money(avg)]
  ].map(([k,val])=>`<div class="odo-marketing-kpi"><span>${k}</span><strong>${esc(val)}</strong></div>`).join('');

  document.getElementById('mSources').innerHTML=cardList(sourceRows);
  document.getElementById('mProducts').innerHTML=cardList(topProducts.map(([n,q])=>[n,`${q} items`]));
  document.getElementById('mLikes').innerHTML=cardList(topLikes);
  document.getElementById('mOrders').innerHTML=cardList([
    ['RECEIVED',o.filter(x=>String(x.order_status).toUpperCase()==='RECEIVED').length],
    ['CONFIRMED / ACTIVE',o.filter(x=>['CONFIRMED','PROCESSING','SHIPPED','OUT FOR DELIVERY'].includes(String(x.order_status).toUpperCase())).length],
    ['DELIVERED',o.filter(x=>String(x.order_status).toUpperCase()==='DELIVERED').length],
    ['CANCELLED',o.filter(x=>String(x.order_status).toUpperCase()==='CANCELLED').length]
  ]);
  document.getElementById('mDevices').innerHTML=cardList(deviceRows);
  document.getElementById('mRecent').innerHTML=cardList(recent);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
