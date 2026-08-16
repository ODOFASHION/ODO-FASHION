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
  const esc = (value) => String(value ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const money = value => `NPR ${Number(value || 0).toLocaleString('en-NP')}`;
  const saveWishlist = () => localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist]));
  const productUrl = sku => `${location.origin}${location.pathname}#product-${encodeURIComponent(sku)}`;

  function toast(text){
    let el=document.querySelector('.toast');
    if(!el){el=document.createElement('div');el.className='toast';document.body.appendChild(el)}
    el.textContent=text;el.classList.add('show');clearTimeout(window.odoEngagementToast);
    window.odoEngagementToast=setTimeout(()=>el.classList.remove('show'),1800);
  }

  function styles(){
    if(document.getElementById('odoEngagementStyles'))return;
    const s=document.createElement('style');s.id='odoEngagementStyles';s.textContent=`
      .odo-product-actions{display:flex;gap:7px;align-items:center;margin-top:10px;flex-wrap:wrap}
      .odo-product-actions button{background:transparent;border:1px solid rgba(245,241,232,.16);color:#d9d2c4;padding:7px 9px;font:inherit;font-size:.5rem;letter-spacing:.08em;cursor:pointer}
      .odo-product-actions button:hover{border-color:rgba(200,165,96,.55);color:#e5c982}
      .odo-product-like.is-liked{border-color:rgba(200,165,96,.65)!important;color:#e5c982!important}
      .odo-wishlist-panel{position:fixed;right:20px;top:78px;width:min(360px,calc(100vw - 32px));max-height:70vh;overflow:auto;z-index:260;background:#0b0b0a;border:1px solid rgba(200,165,96,.35);padding:18px;display:none;box-shadow:0 20px 60px rgba(0,0,0,.5)}
      .odo-wishlist-panel.open{display:block}.odo-wishlist-panel h3{margin:0 0 12px}.odo-wish-row{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid rgba(245,241,232,.08)}
      .odo-wish-row span{font-size:.62rem;color:#ccc}.odo-wish-row button{background:none;border:0;color:#c8a560;cursor:pointer;font-size:.5rem}
      .odo-wishlist-launcher{position:fixed;right:20px;top:20px;z-index:261;background:#0d0d0c;color:#f5f1e8;border:1px solid rgba(200,165,96,.4);padding:9px 12px;font-size:.55rem;letter-spacing:.08em;cursor:pointer}
      .odo-live-catalog-generated{display:block}
      .odo-catalog-empty{padding:28px 0;color:#77736c;font-size:.65rem}
      @media(max-width:600px){.odo-wishlist-launcher{right:12px;top:12px}.odo-wishlist-panel{right:12px;top:58px}}
    `;document.head.appendChild(s)
  }

  async function shareProduct(product){
    const url=productUrl(product.sku);const data={title:`ODOFASHION — ${product.name}`,text:`Check out ${product.name} from ODOFASHION. See Beyond.`,url};
    try{if(navigator.share){await navigator.share(data);return}}catch(e){if(e?.name==='AbortError')return}
    try{await navigator.clipboard.writeText(url);toast('Product link copied')}catch{window.prompt('Copy this product link:',url)}
  }

  function mountWishlist(){
    if(document.getElementById('odoWishlistLauncher'))return;
    const l=document.createElement('button');l.id='odoWishlistLauncher';l.className='odo-wishlist-launcher';l.textContent='♡ WISHLIST';document.body.appendChild(l);
    const p=document.createElement('aside');p.id='odoWishlistPanel';p.className='odo-wishlist-panel';p.innerHTML='<h3>MY WISHLIST.</h3><div data-wishlist-body></div>';document.body.appendChild(p);
    l.addEventListener('click',()=>{p.classList.toggle('open');renderWishlistBody()});
    p.addEventListener('click',e=>{const b=e.target.closest('[data-remove-wish]');if(!b)return;wishlist.delete(b.dataset.removeWish);saveWishlist();updateLikeButtons()});
    renderWishlistBody()
  }

  function renderWishlistBody(){
    const p=document.getElementById('odoWishlistPanel');if(!p)return;const body=p.querySelector('[data-wishlist-body]');
    const cards=[...document.querySelectorAll('[data-odo-product]')];const saved=cards.filter(c=>wishlist.has(c.dataset.odoSku));
    body.innerHTML=saved.map(c=>`<div class="odo-wish-row"><span>${esc(c.dataset.odoName)}</span><button data-remove-wish="${esc(c.dataset.odoSku)}">REMOVE</button></div>`).join('')||'<p style="color:#777;font-size:.62rem">Your wishlist is empty.</p>'
  }

  function updateLikeButtons(){document.querySelectorAll('.odo-product-like').forEach(b=>{const liked=wishlist.has(b.dataset.sku);b.classList.toggle('is-liked',liked);b.textContent=liked?'♥ SAVED':'♡ SAVE'});renderWishlistBody()}

  function addDynamicCart(product,size){
    const cart=JSON.parse(localStorage.getItem('odoCart')||'[]');const existing=cart.find(i=>i.name===product.name&&i.size===size);
    if(existing)existing.qty+=1;else cart.push({name:product.name,size,qty:1,price:Number(product.price||0),sku:product.sku});
    localStorage.setItem('odoCart',JSON.stringify(cart));document.getElementById('cartOpen')?.click();toast(`${product.name} — ${size} added`)
  }

  function cardHtml(product){
    const sizes=Array.isArray(product.sizes)&&product.sizes.length?product.sizes:['ONE SIZE'];
    return `<article class="product reveal odo-live-catalog-generated" id="product-${esc(product.sku)}" data-odo-product data-odo-sku="${esc(product.sku)}" data-odo-name="${esc(product.name)}"><div class="product-art product-photo-wrap">${product.image_url?`<img class="product-photo" src="${esc(product.image_url)}" alt="${esc(product.name)}" loading="lazy">`:''}</div><div class="product-meta"><div><p class="product-number">${esc(product.sku)} / ${esc(product.category)}</p><h3>${esc(product.name)}</h3><p class="price">${money(product.price)}</p></div><span class="status">LIVE</span></div><p class="product-desc">${esc(product.description||'')}</p><div class="product-controls"><label>Size <select class="size-select">${sizes.map(s=>`<option>${esc(s)}</option>`).join('')}</select></label><button class="add-btn odo-dynamic-add">ADD TO CART</button></div><div class="odo-product-actions"><button class="odo-product-like" data-sku="${esc(product.sku)}">♡ SAVE</button><button class="odo-product-share" data-sku="${esc(product.sku)}">SHARE ↗</button></div></article>`
  }

  function decorateStaticCard(card,info){
    if(!info||card.dataset.engagementMounted==='1')return;card.dataset.engagementMounted='1';card.dataset.odoSku=info.sku;card.dataset.odoProduct='true';card.dataset.odoName=info.name;card.id=`product-${info.sku}`;
    const actions=document.createElement('div');actions.className='odo-product-actions';actions.innerHTML=`<button class="odo-product-like" data-sku="${info.sku}">♡ SAVE</button><button class="odo-product-share" data-sku="${info.sku}">SHARE ↗</button>`;
    card.querySelector('.product-controls')?.after(actions);
    actions.querySelector('.odo-product-like').onclick=()=>{if(wishlist.has(info.sku)){wishlist.delete(info.sku);toast(`${info.name} removed from wishlist`)}else{wishlist.add(info.sku);toast(`${info.name} saved`)}saveWishlist();updateLikeButtons()};
    actions.querySelector('.odo-product-share').onclick=()=>shareProduct(info)
  }

  function decorateStaticProducts(){
    document.querySelectorAll('#streetwear .product').forEach((card,i)=>decorateStaticCard(card,staticProducts[i]));
    updateLikeButtons()
  }

  function bindDynamicCards(products){
    document.querySelectorAll('.odo-live-catalog-generated').forEach(card=>{
      const sku=card.dataset.odoSku, product=products.find(p=>String(p.sku)===String(sku)); if(!product||card.dataset.bound==='1')return; card.dataset.bound='1';
      card.querySelector('.odo-dynamic-add')?.addEventListener('click',()=>addDynamicCart(product,card.querySelector('.size-select')?.value||'ONE SIZE'));
      card.querySelector('.odo-product-like')?.addEventListener('click',()=>{if(wishlist.has(product.sku)){wishlist.delete(product.sku);toast(`${product.name} removed from wishlist`)}else{wishlist.add(product.sku);toast(`${product.name} saved`)}saveWishlist();updateLikeButtons()});
      card.querySelector('.odo-product-share')?.addEventListener('click',()=>shareProduct(product))
    });updateLikeButtons()
  }

  function updateCategoryCard(){
    const cards=[...document.querySelectorAll('.category-card')];const accessory=cards.find(c=>/ACCESSORIES/i.test(c.textContent||''));if(!accessory)return;
    const activeAccessories=window.odoActiveProducts?.filter(p=>p.category==='ACCESSORIES')||[];
    const action=accessory.querySelector('b');if(action){action.textContent=activeAccessories.length?'SHOP NOW →':'COMING SOON';accessory.classList.toggle('active',!!activeAccessories.length);if(activeAccessories.length)accessory.onclick=()=>document.getElementById('odoDynamicCatalog')?.scrollIntoView({behavior:'smooth'})}
    const outer=cards.find(c=>/OUTERWEAR/i.test(c.textContent||''));if(outer){const count=window.odoActiveProducts?.filter(p=>p.category==='OUTERWEAR').length||0;const ob=outer.querySelector('b');if(ob){ob.textContent=count?'SHOP NOW →':'COMING SOON';outer.classList.toggle('active',!!count)}}
  }

  async function renderCatalog(){
    const {data:products,error}=await sb.from('products').select('*').eq('active',true).order('created_at',{ascending:true});
    if(error){console.error('ODO catalog:',error);decorateStaticProducts();return}
    window.odoActiveProducts=products||[];
    const street=products.filter(p=>p.category==='STREETWEAR'||p.category==='OUTERWEAR');
    const grid=document.querySelector('#streetwear .streetwear-products');
    if(grid && street.length){grid.innerHTML=street.map(cardHtml).join('');bindDynamicCards(products)} else {decorateStaticProducts()}

    let live=document.getElementById('odoDynamicCatalog');
    const nonStreet=products.filter(p=>p.category!=='STREETWEAR'&&p.category!=='OUTERWEAR');
    if(!nonStreet.length){live?.remove();updateCategoryCard();return}
    if(!live){live=document.createElement('section');live.id='odoDynamicCatalog';live.className='section';document.getElementById('about')?.parentNode.insertBefore(live,document.getElementById('about'))}
    live.innerHTML=`<div class="section-top"><div><p class="eyebrow">03 / ACCESSORIES + NEW DROPS</p><h2>NEW FROM <em>ODO.</em></h2></div><p class="section-intro">Products added from the ODO admin dashboard appear here automatically.</p></div><div class="products streetwear-products">${nonStreet.map(cardHtml).join('')}</div>`;
    bindDynamicCards(products);updateCategoryCard();
  }

  function jumpToHash(){const raw=location.hash.match(/^#product-(.+)$/)?.[1];if(!raw)return;const sku=decodeURIComponent(raw);document.querySelector(`[data-odo-sku="${CSS.escape(sku)}"]`)?.scrollIntoView({behavior:'smooth',block:'center'})}
  async function boot(){styles();mountWishlist();decorateStaticProducts();await renderCatalog();jumpToHash()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();window.addEventListener('hashchange',jumpToHash);setTimeout(boot,1000);setTimeout(boot,2500);
})();
