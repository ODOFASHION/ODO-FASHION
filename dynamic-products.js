import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL='https://gqlcxvukyezqpdftjdeo.supabase.co';
const SUPABASE_KEY='sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8';
const PRICE_FALLBACK=2500;
const sb=createClient(SUPABASE_URL,SUPABASE_KEY);

const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const money=v=>`NPR ${Number(v||0).toLocaleString('en-NP')}`;
const getWishlist=()=>JSON.parse(localStorage.getItem('odoWishlist')||'[]');
const setWishlist=v=>localStorage.setItem('odoWishlist',JSON.stringify(v));

function addStyle(){
  if(document.getElementById('odoDynamicProductsStyle')) return;
  const s=document.createElement('style');
  s.id='odoDynamicProductsStyle';
  s.textContent=`
    #odoDynamicCatalog{margin-top:48px;padding-top:42px;border-top:1px solid rgba(245,241,232,.08)}
    #odoDynamicCatalog .dynamic-products-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;margin-top:28px}
    #odoDynamicCatalog .dynamic-product{position:relative}
    #odoDynamicCatalog .dynamic-product-photo{aspect-ratio:4/5;background:#111;overflow:hidden}
    #odoDynamicCatalog .dynamic-product-photo img{width:100%;height:100%;object-fit:cover;display:block}
    #odoDynamicCatalog .dynamic-product-tools{display:flex;gap:8px;margin-top:10px}
    #odoDynamicCatalog .dynamic-product-tools button{border:1px solid rgba(200,165,96,.35);background:transparent;color:#e7dfd0;padding:8px 10px;font-size:.52rem;letter-spacing:.08em;cursor:pointer}
    #odoDynamicCatalog .dynamic-product-tools button.liked{color:#e5c982;border-color:#c8a560}
    #odoDynamicCatalog .dynamic-product-tools .share-button{margin-left:auto}
    @media(max-width:900px){#odoDynamicCatalog .dynamic-products-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:620px){#odoDynamicCatalog .dynamic-products-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(s);
}

function addToCartDirect(product,size){
  const cart=JSON.parse(localStorage.getItem('odoCart')||'[]');
  const existing=cart.find(i=>i.name===product.name&&i.size===size);
  if(existing) existing.qty+=1;
  else cart.push({name:product.name,size,qty:1});
  localStorage.setItem('odoCart',JSON.stringify(cart));
  document.getElementById('cartCount')?.replaceChildren(document.createTextNode(String(cart.reduce((n,i)=>n+i.qty,0))));
  document.getElementById('cartOpen')?.click();
}

async function shareProduct(product){
  const url=new URL(location.href); url.hash=`product-${product.sku}`;
  const shareData={title:`${product.name} — ODO Fashion`,text:`${product.name} · ${money(product.price)} · ODO Fashion`,url:url.toString()};
  try{
    if(navigator.share) await navigator.share(shareData);
    else {await navigator.clipboard.writeText(url.toString());alert('Product link copied.');}
  }catch{}
}

function toggleWishlist(product){
  const list=getWishlist();
  const idx=list.findIndex(x=>x.sku===product.sku);
  if(idx>=0) list.splice(idx,1); else list.push({sku:product.sku,name:product.name,image_url:product.image_url,price:product.price});
  setWishlist(list);
}

function render(products){
  addStyle();
  const host=document.querySelector('.streetwear-products');
  if(!host) return;
  document.getElementById('odoDynamicCatalog')?.remove();
  const sec=document.createElement('div');
  sec.id='odoDynamicCatalog';
  sec.innerHTML=`<div class="section-top"><div><p class="eyebrow">03 / LIVE CATALOG</p><h2>NEW FROM<br><em>ODO.</em></h2></div><p class="section-intro">Products added from the ODO admin dashboard appear here automatically.</p></div><div class="dynamic-products-grid"></div>`;
  const grid=sec.querySelector('.dynamic-products-grid');

  products.forEach((p,index)=>{
    const card=document.createElement('article');
    card.className='product reveal dynamic-product';
    card.id=`product-${p.sku}`;
    const sizes=(p.sizes?.length?p.sizes:['S','M','L','XL','XXL']);
    const wished=getWishlist().some(x=>x.sku===p.sku);
    card.innerHTML=`<div class="product-art product-photo-wrap dynamic-product-photo">${p.image_url?`<img class="product-photo" src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">`:''}</div><div class="product-meta"><div><p class="product-number">${String(p.sku).padStart(3,'0')} / ${esc(p.category||'STREETWEAR')}</p><h3>${esc(p.name)}</h3><p class="price">${money(p.price||PRICE_FALLBACK)}</p></div><span class="status">${p.active?'LIVE':'HIDDEN'}</span></div><p class="product-desc">${esc(p.description||'')}</p><div class="product-controls"><label>Size <select class="size-select">${sizes.map(s=>`<option>${esc(s)}</option>`).join('')}</select></label><button class="add-btn dynamic-add">ADD TO CART</button></div><div class="dynamic-product-tools"><button class="wishlist-button ${wished?'liked':''}">${wished?'♥ SAVED':'♡ SAVE'}</button><button class="share-button">SHARE ↗</button></div>`;
    card.querySelector('.dynamic-add').onclick=()=>addToCartDirect(p,card.querySelector('.size-select').value);
    card.querySelector('.wishlist-button').onclick=e=>{toggleWishlist(p);const b=e.currentTarget;b.classList.toggle('liked');b.textContent=b.classList.contains('liked')?'♥ SAVED':'♡ SAVE';};
    card.querySelector('.share-button').onclick=()=>shareProduct(p);
    grid.appendChild(card);
  });
  host.parentNode.insertBefore(sec,host.nextSibling);

  const hash=location.hash;
  if(hash.startsWith('#product-')) setTimeout(()=>document.getElementById(hash.slice(1))?.scrollIntoView({behavior:'smooth',block:'center'}),400);
}

async function boot(){
  const {data,error}=await sb.from('products').select('sku,name,price,category,description,image_url,sizes,active,created_at').eq('active',true).order('created_at',{ascending:false});
  if(error){console.warn('ODO dynamic products:',error.message);return;}
  if(data?.length) render(data);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
