import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

(() => {
  const SUPABASE_URL = 'https://gqlcxvukyezqpdftjdeo.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8';
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const WISHLIST_KEY = 'odoWishlist';
  const wishlist = new Set(JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'));
  const staticProducts = [
    { sku:'001', name:'Laija Mero Maya T-Shirt' },
    { sku:'002', name:'Sapana Energy T-Shirt' },
    { sku:'003', name:'Kathmandu T-Shirt' },
    { sku:'004', name:'Zero to Hero Hoodie' },
    { sku:'005', name:'Budi Aajhai T-Shirt' },
    { sku:'006', name:'Dreamer Without Direction T-Shirt' }
  ];

  const esc = v => String(v ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const money = v => `NPR ${Number(v || 0).toLocaleString('en-NP')}`;
  const saveWishlist = () => localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist]));
  const productUrl = sku => `${location.origin}${location.pathname}#product-${encodeURIComponent(sku)}`;

  function styles(){
    if(document.getElementById('odoEngagementStyles')) return;
    const s=document.createElement('style'); s.id='odoEngagementStyles';
    s.textContent=`
      .odo-product-actions{display:flex;gap:7px;align-items:center;margin-top:10px;flex-wrap:wrap}
      .odo-product-actions button,.odo-live-tools button{background:transparent;border:1px solid rgba(245,241,232,.16);color:#d9d2c4;padding:7px 9px;font:inherit;font-size:.5rem;letter-spacing:.08em;cursor:pointer}
      .odo-product-actions button:hover,.odo-live-tools button:hover{border-color:rgba(200,165,96,.55);color:#e5c982}
      .odo-product-like.is-liked,.odo-live-wishlist.liked{border-color:rgba(200,165,96,.65)!important;color:#e5c982!important}
      .odo-wishlist-panel{position:fixed;right:20px;top:78px;width:min(360px,calc(100vw - 32px));max-height:70vh;overflow:auto;z-index:260;background:#0b0b0a;border:1px solid rgba(200,165,96,.35);padding:18px;display:none;box-shadow:0 20px 60px rgba(0,0,0,.5)}
      .odo-wishlist-panel.open{display:block}.odo-wishlist-panel h3{margin:0 0 12px}.odo-wish-row{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid rgba(245,241,232,.08)}
      .odo-wish-row span{font-size:.62rem;color:#ccc}.odo-wish-row button{background:none;border:0;color:#c8a560;cursor:pointer;font-size:.5rem}
      .odo-wishlist-launcher{position:fixed;right:20px;top:20px;z-index:261;background:#0d0d0c;color:#f5f1e8;border:1px solid rgba(200,165,96,.4);padding:9px 12px;font-size:.55rem;letter-spacing:.08em;cursor:pointer}
      .odo-live-products{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;margin-top:28px}
      .odo-live-product-photo{aspect-ratio:4/5;background:#111;overflow:hidden}.odo-live-product-photo img{width:100%;height:100%;object-fit:cover;display:block}
      .odo-live-tools{display:flex;gap:8px;margin-top:10px}.odo-live-tools .share{margin-left:auto}
      @media(max-width:900px){.odo-live-products{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.odo-live-products{grid-template-columns:1fr}}
    `; document.head.appendChild(s);
  }

  function toast(text){
    let el=document.querySelector('.toast'); if(!el){el=document.createElement('div');el.className='toast';document.body.appendChild(el)}
    el.textContent=text; el.classList.add('show'); clearTimeout(window.odoEngagementToast); window.odoEngagementToast=setTimeout(()=>el.classList.remove('show'),1800);
  }

  async function shareProduct(p){
    const url=productUrl(p.sku); const data={title:`ODOFASHION — ${p.name}`,text:`Check out ${p.name} from ODOFASHION. See Beyond.`,url};
    try{if(navigator.share){await navigator.share(data);return}}catch(e){if(e?.name==='AbortError')return}
    try{await navigator.clipboard.writeText(url);toast('Product link copied')}catch{window.prompt('Copy this product link:',url)}
  }

  function toggleWishlist(p){
    if(wishlist.has(p.sku)){wishlist.delete(p.sku);toast(`${p.name} removed from wishlist`)}
    else{wishlist.add(p.sku);toast(`${p.name} saved`)}
    saveWishlist(); updateLikeButtons();
  }

  function renderWishlistBody(){
    const panel=document.getElementById('odoWishlistPanel'); if(!panel)return; const body=panel.querySelector('[data-wishlist-body]');
    const cards=[...document.querySelectorAll('[data-odo-product]')];
    const saved=cards.filter(c=>wishlist.has(c.dataset.odoSku));
    body.innerHTML=saved.map(c=>`<div class="odo-wish-row"><span>${esc(c.dataset.odoName)}</span><button data-remove-wish="${esc(c.dataset.odoSku)}">REMOVE</button></div>`).join('')||'<p style="color:#777;font-size:.62rem">Your wishlist is empty.</p>';
  }

  function mountWishlist(){
    if(document.getElementById('odoWishlistLauncher'))return;
    const l=document.createElement('button'); l.id='odoWishlistLauncher'; l.className='odo-wishlist-launcher'; l.textContent='♡ WISHLIST'; document.body.appendChild(l);
    const p=document.createElement('aside'); p.id='odoWishlistPanel'; p.className='odo-wishlist-panel'; p.innerHTML='<h3>MY WISHLIST.</h3><div data-wishlist-body></div>'; document.body.appendChild(p);
    l.onclick=()=>{p.classList.toggle('open');renderWishlistBody()};
    p.onclick=e=>{const b=e.target.closest('[data-remove-wish]');if(!b)return;wishlist.delete(b.dataset.removeWish);saveWishlist();updateLikeButtons()};
    renderWishlistBody();
  }

  function updateLikeButtons(){
    document.querySelectorAll('.odo-product-like').forEach(b=>{const liked=wishlist.has(b.dataset.sku);b.classList.toggle('is-liked',liked);b.textContent=liked?'♥ SAVED':'♡ SAVE'});
    document.querySelectorAll('.odo-live-wishlist').forEach(b=>{const liked=wishlist.has(b.dataset.sku);b.classList.toggle('liked',liked);b.textContent=liked?'♥ SAVED':'♡ SAVE'});
    renderWishlistBody();
  }

  function decorateStaticProducts(){
    document.querySelectorAll('#streetwear .product').forEach((card,i)=>{
      const info=staticProducts[i]; if(!info || card.dataset.engagementMounted==='1')return;
      card.dataset.engagementMounted='1'; card.dataset.odoSku=info.sku; card.dataset.odoProduct='true'; card.dataset.odoName=info.name; card.id=`product-${info.sku}`;
      const actions=document.createElement('div'); actions.className='odo-product-actions';
      actions.innerHTML=`<button class="odo-product-like" data-sku="${info.sku}">♡ SAVE</button><button class="odo-product-share">SHARE ↗</button>`;
      card.querySelector('.product-controls')?.after(actions);
      actions.querySelector('.odo-product-like').onclick=()=>toggleWishlist(info);
      actions.querySelector('.odo-product-share').onclick=()=>shareProduct(info);
    });
    updateLikeButtons();
  }

  function snapshotStaticCatalog(){
    const grid=document.querySelector('#streetwear .streetwear-products');
    if(!grid || window.__odoStaticCatalogSnapshot) return;
    const cards=[...grid.querySelectorAll('.product')];
    if(cards.length) window.__odoStaticCatalogSnapshot=grid.innerHTML;
  }

  function protectStaticCatalog(){
    const grid=document.querySelector('#streetwear .streetwear-products'); if(!grid)return;
    const restore=()=>{
      if(grid.querySelectorAll('.product').length===0 && window.__odoStaticCatalogSnapshot){
        grid.innerHTML=window.__odoStaticCatalogSnapshot;
        decorateStaticProducts();
      }
    };
    new MutationObserver(restore).observe(grid,{childList:true});
    setTimeout(restore,800); setTimeout(restore,1800); setTimeout(restore,3000);
  }

  function addDynamicCart(p,size){
    const cart=JSON.parse(localStorage.getItem('odoCart')||'[]'); const existing=cart.find(x=>x.name===p.name&&x.size===size);
    if(existing)existing.qty+=1;else cart.push({name:p.name,size,qty:1,price:Number(p.price||0),sku:p.sku});
    localStorage.setItem('odoCart',JSON.stringify(cart)); document.getElementById('cartOpen')?.click(); toast(`${p.name} — ${size} added`);
  }

  function dynamicCard(p){
    const sizes=Array.isArray(p.sizes)&&p.sizes.length?p.sizes:['ONE SIZE'];
    const a=document.createElement('article'); a.className='product odo-live-product'; a.dataset.odoProduct='true'; a.dataset.odoSku=p.sku; a.dataset.odoName=p.name; a.id=`product-${p.sku}`;
    a.innerHTML=`<div class="product-art product-photo-wrap odo-live-product-photo">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">`:''}</div><div class="product-meta"><div><p class="product-number">${esc(p.sku)} / ${esc(p.category||'STREETWEAR')}</p><h3>${esc(p.name)}</h3><p class="price">${money(p.price)}</p></div><span class="status">LIVE</span></div><p class="product-desc">${esc(p.description||'')}</p><div class="product-controls"><label>Size <select class="size-select">${sizes.map(s=>`<option>${esc(s)}</option>`).join('')}</select></label><button class="add-btn odo-live-add">ADD TO CART</button></div><div class="odo-live-tools"><button class="odo-live-wishlist" data-sku="${esc(p.sku)}">♡ SAVE</button><button class="share">SHARE ↗</button></div>`;
    a.querySelector('.odo-live-wishlist').onclick=()=>toggleWishlist(p);
    a.querySelector('.share').onclick=()=>shareProduct(p);
    a.querySelector('.odo-live-add').onclick=()=>addDynamicCart(p,a.querySelector('.size-select')?.value||'ONE SIZE');
    return a;
  }

  async function loadAdminProducts(){
    const {data,error}=await sb.from('products').select('sku,name,price,category,description,image_url,sizes,active,created_at').eq('active',true).order('created_at',{ascending:false});
    if(error){console.warn('ODO products:',error.message);return []}
    return data||[];
  }

  function updateAccessoriesCategory(products){
    const cards=[...document.querySelectorAll('.category-card')]; const acc=cards.find(c=>/ACCESSORIES/i.test(c.textContent||'')); if(!acc)return;
    const live=products.some(p=>p.category==='ACCESSORIES'); const b=acc.querySelector('b'); if(b)b.textContent=live?'SHOP NOW →':'COMING SOON';
    if(live) acc.classList.add('active');
    acc.onclick=live?()=>document.getElementById('odoAdminAccessories')?.scrollIntoView({behavior:'smooth'}):null;
  }

  function renderAdminAddedProducts(products){
    const staticSkus=new Set(staticProducts.map(p=>String(p.sku)));
    const newStreet=products.filter(p=>!staticSkus.has(String(p.sku))&&(p.category==='STREETWEAR'||p.category==='OUTERWEAR'));
    const accessories=products.filter(p=>p.category==='ACCESSORIES'&&!staticSkus.has(String(p.sku)));
    const makeSection=(id,label,title,list)=>{
      let sec=document.getElementById(id);
      if(!list.length){sec?.remove();return}
      if(!sec){sec=document.createElement('section');sec.id=id;sec.className='section';document.getElementById('about')?.parentNode.insertBefore(sec,document.getElementById('about'))}
      sec.innerHTML=`<div class="section-top"><div><p class="eyebrow">${label}</p><h2>${title}</h2></div><p class="section-intro">Available directly from the ODO admin catalog.</p></div><div class="odo-live-products"></div>`;
      const grid=sec.querySelector('.odo-live-products'); list.forEach(p=>grid.appendChild(dynamicCard(p)));
    };
    makeSection('odoAdminStreetwearDrops','03 / NEW STREETWEAR','NEW FROM <em>ODO.</em>',newStreet);
    makeSection('odoAdminAccessories','04 / ACCESSORIES','ACCESSORIES.',accessories);
  }

  async function boot(){
    styles(); snapshotStaticCatalog(); decorateStaticProducts(); protectStaticCatalog(); mountWishlist();
    try{const products=await loadAdminProducts(); renderAdminAddedProducts(products); updateAccessoriesCategory(products);}
    catch(e){console.warn('ODO catalog:',e)}
    updateLikeButtons();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot); else boot();
})();
