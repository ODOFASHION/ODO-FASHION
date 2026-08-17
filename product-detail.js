import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://gqlcxvukyezqpdftjdeo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const esc = (v) => String(v ?? '').replace(/[&<>\"]/g, m => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
}[m]));
const money = (v) => `NPR ${Number(v || 0).toLocaleString('en-NP')}`;

const staticProducts = {
  '001': { sku: '001', name: 'Laija Mero Maya T-Shirt', category: 'STREETWEAR', price: 2500, description: 'Cream oversized tee with distressed black Nepali typography.', image: 'ChatGPT%20Image%20May%2022,%202026,%2004_18_54%20PM%20(1).png', sizes: ['S','M','L','XL','XXL'] },
  '002': { sku: '002', name: 'Sapana Energy T-Shirt', category: 'STREETWEAR', price: 2500, description: 'Black oversized tee built around ambition, energy and dreams.', image: 'ChatGPT%20Image%20May%2022,%202026,%2004_18_57%20PM%20(2).png', sizes: ['S','M','L','XL','XXL'] },
  '003': { sku: '003', name: 'Kathmandu T-Shirt', category: 'STREETWEAR', price: 2500, description: 'A raw Kathmandu statement in heavyweight street typography.', image: 'ChatGPT%20Image%20May%2022,%202026,%2004_18_58%20PM%20(3).png', sizes: ['S','M','L','XL','XXL'] },
  '004': { sku: '004', name: 'Zero to Hero Hoodie', category: 'STREETWEAR', price: 2500, description: 'Cream hoodie with a minimal chest mark and bold back message.', image: 'ChatGPT%20Image%20May%2022,%202026,%2004_18_59%20PM%20(5).png', sizes: ['S','M','L','XL','XXL'] },
  '005': { sku: '005', name: 'Budi Aajhai T-Shirt', category: 'STREETWEAR', price: 2500, description: 'Black graphic tee with a raw, playful Nepali statement.', image: 'ChatGPT%20Image%20May%2022,%202026,%2004_19_00%20PM%20(6).png', sizes: ['S','M','L','XL','XXL'] }
};

function ensureStyles() {
  if (document.getElementById('odoProductDetailStyles')) return;
  const s = document.createElement('style');
  s.id = 'odoProductDetailStyles';
  s.textContent = `
    .odo-product-modal{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.86);display:none;align-items:center;justify-content:center;padding:18px}
    .odo-product-modal.open{display:flex}
    .odo-product-card{width:min(1050px,100%);max-height:92vh;overflow:auto;background:#0b0b0a;border:1px solid rgba(200,165,96,.25);box-shadow:0 30px 100px rgba(0,0,0,.7);position:relative}
    .odo-product-close{position:absolute;right:16px;top:12px;z-index:2;background:#080807;color:#f5f1e8;border:1px solid rgba(245,241,232,.2);width:42px;height:42px;font-size:1.7rem;cursor:pointer}
    .odo-product-detail{display:grid;grid-template-columns:minmax(320px,1fr) minmax(320px,1fr)}
    .odo-product-image{min-height:520px;background:#0f0f0d;display:flex;align-items:center;justify-content:center;padding:24px}
    .odo-product-image img{width:100%;height:100%;max-height:680px;object-fit:contain;display:block}
    .odo-product-info{padding:52px 42px 42px}
    .odo-product-info .eyebrow{margin-bottom:12px}
    .odo-product-info h2{font-size:clamp(2.4rem,5vw,4.7rem);line-height:.92;margin:0 0 12px}
    .odo-product-price{font-size:1.25rem;color:#e5c982;font-weight:700;margin-bottom:18px}
    .odo-product-description{color:#aaa69d;line-height:1.8;font-size:.8rem;max-width:580px}
    .odo-product-stock{margin:18px 0;color:#c8a560;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase}
    .odo-product-size{display:grid;gap:7px;margin:22px 0;color:#aaa;font-size:.56rem;text-transform:uppercase;letter-spacing:.12em}
    .odo-product-size select{background:#080807;color:#f5f1e8;border:1px solid rgba(200,165,96,.35);padding:13px}
    .odo-product-actions{display:flex;flex-wrap:wrap;gap:10px}
    .odo-product-actions button,.odo-product-actions a{border:1px solid rgba(200,165,96,.38);background:transparent;color:#f5f1e8;padding:13px 16px;text-decoration:none;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}
    .odo-product-actions .primary{background:#c8a560;color:#080807;border-color:#c8a560;font-weight:800}
    .odo-product-meta{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:28px 0}
    .odo-product-meta div{border:1px solid rgba(245,241,232,.08);padding:12px}
    .odo-product-meta span{display:block;color:#77736c;font-size:.46rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:5px}
    .odo-product-meta strong{font-size:.65rem;color:#f5f1e8}
    @media(max-width:800px){.odo-product-detail{grid-template-columns:1fr}.odo-product-image{min-height:360px}.odo-product-info{padding:38px 24px 28px}}
  `;
  document.head.appendChild(s);
}

function ensureModal(){
  if(document.getElementById('odoProductModal')) return document.getElementById('odoProductModal');
  const m=document.createElement('div');
  m.id='odoProductModal'; m.className='odo-product-modal';
  m.innerHTML='<div class="odo-product-card"><button class="odo-product-close" aria-label="Close">×</button><div id="odoProductDetailMount"></div></div>';
  document.body.appendChild(m);
  m.querySelector('.odo-product-close').onclick=()=>{m.classList.remove('open');if(location.hash.startsWith('#product-'))history.replaceState(null,'',location.pathname+location.search)};
  m.addEventListener('click',e=>{if(e.target===m)m.querySelector('.odo-product-close').click()});
  return m;
}

async function getProduct(sku){
  const local=staticProducts[sku];
  if(local) return local;
  const {data}=await supabase.from('products').select('*').eq('sku',sku).maybeSingle();
  if(!data) return null;
  return {...data,image:data.image_url||data.image||'',sizes:Array.isArray(data.sizes)&&data.sizes.length?data.sizes:['ONE SIZE']};
}

async function likeState(sku){
  const {count}=await supabase.from('product_likes').select('id',{count:'exact',head:true}).eq('product_sku',sku);
  const {data:{user}}=await supabase.auth.getUser();
  let liked=false;
  if(user){const {data}=await supabase.from('product_likes').select('id').eq('product_sku',sku).eq('user_id',user.id).maybeSingle();liked=!!data}
  return {count:count||0,liked};
}

function addToCart(p,size){
  const cart=JSON.parse(localStorage.getItem('odoCart')||'[]');
  const existing=cart.find(i=>i.name===p.name&&i.size===size);
  if(existing) existing.qty+=1; else cart.push({name:p.name,size,qty:1});
  localStorage.setItem('odoCart',JSON.stringify(cart));
  const cc=document.querySelector('#cartCount'); if(cc)cc.textContent=cart.reduce((s,i)=>s+Number(i.qty||0),0);
  document.body.classList.add('cart-open');
  document.querySelector('#cartPanel')?.setAttribute('aria-hidden','false');
}

async function openProduct(sku, updateHash=true){
  const p=await getProduct(sku); if(!p) return;
  const modal=ensureModal(); ensureStyles();
  const img=esc(p.image||'');
  const sizes=Array.isArray(p.sizes)&&p.sizes.length?p.sizes:['ONE SIZE'];
  const stock=Number(p.stock_quantity ?? -1);
  const stockText=stock<0?'AVAILABLE':stock<=0?'SOLD OUT':stock<=Number(p.low_stock_threshold||3)?`ONLY ${stock} LEFT`:`${stock} IN STOCK`;
  const disabled=stock===0?'disabled':'';
  const like=await likeState(p.sku);
  document.getElementById('odoProductDetailMount').innerHTML=`
    <div class="odo-product-detail">
      <div class="odo-product-image">${img?`<img src="${img}" alt="${esc(p.name)}">`:'<div style="color:#777">ODO</div>'}</div>
      <div class="odo-product-info">
        <p class="eyebrow">${esc(p.sku)} / ${esc(p.category||'ODO')}</p>
        <h2>${esc(p.name)}</h2>
        <div class="odo-product-price">${money(p.price)}</div>
        <p class="odo-product-description">${esc(p.description||'ODO Fashion product.')}</p>
        <div class="odo-product-stock">${stockText} · <span id="odoDetailLikeCount">♥ ${like.count}</span></div>
        <label class="odo-product-size">Size <select id="odoDetailSize">${sizes.map(s=>`<option>${esc(s)}</option>`).join('')}</select></label>
        <div class="odo-product-actions">
          <button class="primary" id="odoDetailAdd" ${disabled}>${stock===0?'SOLD OUT':'ADD TO CART →'}</button>
          <button id="odoDetailLike">${like.liked?'♥ LIKED':'♡ LIKE'}</button>
          <button id="odoDetailShare">SHARE ↗</button>
        </div>
        <div class="odo-product-meta">
          <div><span>SKU</span><strong>${esc(p.sku)}</strong></div>
          <div><span>CATEGORY</span><strong>${esc(p.category||'ODO')}</strong></div>
          <div><span>AVAILABILITY</span><strong>${esc(stockText)}</strong></div>
          <div><span>DELIVERY</span><strong>CASH ON DELIVERY — NEPAL</strong></div>
        </div>
      </div>
    </div>`;
  modal.classList.add('open');
  if(updateHash) history.replaceState(null,'',`${location.pathname}${location.search}#product-${encodeURIComponent(p.sku)}`);
  document.getElementById('odoDetailAdd')?.addEventListener('click',()=>addToCart(p,document.getElementById('odoDetailSize').value));
  document.getElementById('odoDetailShare')?.addEventListener('click',async()=>{
    const url=`${location.origin}${location.pathname}#product-${encodeURIComponent(p.sku)}`;
    if(navigator.share){try{await navigator.share({title:p.name,text:`${p.name} — ${money(p.price)}`,url})}catch{}}
    else{try{await navigator.clipboard.writeText(url);alert('Product link copied.')}catch{alert(url)}}
  });
  document.getElementById('odoDetailLike')?.addEventListener('click',async e=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){alert('Please sign in to like this product.');return}
    const {data:existing}=await supabase.from('product_likes').select('id').eq('product_sku',p.sku).eq('user_id',user.id).maybeSingle();
    if(existing) await supabase.from('product_likes').delete().eq('id',existing.id);
    else await supabase.from('product_likes').insert({product_sku:p.sku,user_id:user.id});
    const {count}=await supabase.from('product_likes').select('id',{count:'exact',head:true}).eq('product_sku',p.sku);
    document.getElementById('odoDetailLikeCount').textContent=`♥ ${count||0}`;
    e.currentTarget.textContent=existing?'♡ LIKE':'♥ LIKED';
  });
}

function bindCards(){
  document.querySelectorAll('.product').forEach(card=>{
    if(card.dataset.odoDetailBound==='1') return;
    const num=card.querySelector('.product-number')?.textContent||'';
    const match=num.match(/(?:^|\s)([A-Z]*-?\d{3}|CAP-\d+)/i);
    if(!match) return;
    const sku=match[1].toUpperCase();
    card.dataset.odoDetailBound='1';
    card.style.cursor='pointer';
    card.addEventListener('click',e=>{
      if(e.target.closest('button,select,a,label')) return;
      openProduct(sku);
    });
  });
}

function openFromHash(){const m=location.hash.match(/^#product-(.+)$/);if(m)openProduct(decodeURIComponent(m[1]),false)}

ensureStyles();
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{setTimeout(bindCards,500);openFromHash()});
else{setTimeout(bindCards,500);openFromHash()}
new MutationObserver(()=>bindCards()).observe(document.body,{childList:true,subtree:true});
window.addEventListener('hashchange',openFromHash);
