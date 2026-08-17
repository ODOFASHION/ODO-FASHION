import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const sb=createClient('https://gqlcxvukyezqpdftjdeo.supabase.co','sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8');
const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const $=s=>document.querySelector(s);
const money=v=>`NPR ${Number(v||0).toLocaleString('en-NP')}`;

async function adminSession(){
  const {data:{session}}=await sb.auth.getSession();
  if(!session)return null;
  const {data:me}=await sb.from('profiles').select('is_admin').eq('id',session.user.id).maybeSingle();
  return me?.is_admin?session:null;
}

async function boot(){
  const session=await adminSession();
  if(!session)return;
  const main=$('.odo-admin-main');
  if(!main||$('#odoProductsSection'))return;

  const sec=document.createElement('section');
  sec.id='odoProductsSection';
  sec.style.margin='45px 0';
  sec.innerHTML=`
    <div class="odo-admin-title">
      <div>
        <p class="eyebrow">CATALOG MANAGEMENT</p>
        <h2>PRODUCTS.</h2>
      </div>
      <p>Manage price, stock, photos, sizes, visibility and product information directly from your ODO admin account.</p>
    </div>
    <div class="product-admin-actions">
      <button id="odoNewProduct" class="checkout-submit admin-btn">+ NEW PRODUCT</button>
      <button id="odoRefreshProducts" class="admin-secondary-btn">REFRESH</button>
    </div>
    <div id="odoProductStats" class="odo-product-stats"></div>
    <div id="odoProductList" class="odo-product-list"></div>`;
  main.prepend(sec);

  const st=document.createElement('style');
  st.textContent=`
    .product-admin-actions{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 18px}
    .admin-secondary-btn{background:transparent;border:1px solid rgba(200,165,96,.3);color:#f5f1e8;padding:11px 14px;font-size:.56rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}
    .odo-product-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:0 0 18px}
    .odo-product-stat{border:1px solid rgba(245,241,232,.1);background:#0d0d0c;padding:15px}
    .odo-product-stat span{display:block;color:#77736c;font-size:.48rem;letter-spacing:.13em;text-transform:uppercase;margin-bottom:7px}
    .odo-product-stat strong{font-size:1.35rem;color:#e5c982}
    .odo-product-list{display:grid;gap:12px}
    .odo-product-row{display:grid;grid-template-columns:90px 1fr auto;gap:16px;align-items:center;background:#0d0d0c;border:1px solid rgba(200,165,96,.2);padding:14px}
    .odo-product-thumb{width:90px;height:90px;object-fit:cover;background:#151513}
    .odo-product-info strong{display:block;color:#f5f1e8;font-size:.9rem}
    .odo-product-info span{display:block;color:#77736c;font-size:.6rem;margin-top:4px;line-height:1.55}
    .odo-product-live{color:#8fbd77!important}.odo-product-hidden{color:#c97c6e!important}.odo-product-low{color:#e5c982!important}
    .odo-product-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
    .odo-product-actions button{width:auto!important;padding:9px 12px!important}
    .odo-product-modal{position:fixed;inset:0;z-index:350;background:rgba(0,0,0,.86);display:none;align-items:center;justify-content:center;padding:20px}
    .odo-product-modal.open{display:flex}
    .odo-product-card{width:min(760px,100%);max-height:92vh;overflow:auto;background:#0b0b0a;border:1px solid rgba(200,165,96,.3);padding:24px;position:relative}
    .odo-product-card h3{font-size:2rem;margin-top:0}.odo-product-card form{display:grid;gap:12px}
    .odo-product-card label{display:grid;gap:6px;color:#aaa;font-size:.62rem}
    .odo-product-card input,.odo-product-card textarea,.odo-product-card select{background:#111;color:#f5f1e8;border:1px solid rgba(245,241,232,.14);padding:10px;font:inherit;width:100%;box-sizing:border-box}
    .odo-product-card textarea{min-height:105px}.odo-product-card .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .odo-product-card .row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
    .odo-product-close{position:absolute;right:16px;top:10px;background:none;border:0;color:#f5f1e8;font-size:2rem;cursor:pointer}
    .odo-image-preview{width:140px;height:140px;object-fit:cover;border:1px solid rgba(245,241,232,.12);background:#111;display:block}
    .odo-photo-box{display:flex;align-items:center;gap:14px;padding:12px;border:1px solid rgba(245,241,232,.08);background:#0f0f0e}
    .odo-photo-note{color:#77736c;font-size:.56rem;line-height:1.5}
    @media(max-width:900px){.odo-product-stats{grid-template-columns:1fr 1fr}}
    @media(max-width:700px){.odo-product-row{grid-template-columns:70px 1fr}.odo-product-thumb{width:70px;height:70px}.odo-product-actions{grid-column:1/-1;justify-content:flex-start}.odo-product-card .row,.odo-product-card .row3{grid-template-columns:1fr}}
  `;
  document.head.appendChild(st);

  $('#odoNewProduct').onclick=()=>openForm();
  $('#odoRefreshProducts').onclick=loadProducts;
  await loadProducts();
}

async function loadProducts(){
  const wrap=$('#odoProductList');
  if(!wrap)return;
  wrap.innerHTML='<div class="odo-message"><p>Loading products…</p></div>';

  const {data,error}=await sb.from('products').select('*').order('created_at',{ascending:false});
  if(error){wrap.innerHTML=`<div class="odo-message"><p>Unable to load products: ${esc(error.message)}</p></div>`;return}

  const products=data||[];
  const live=products.filter(p=>p.active).length;
  const stock=products.reduce((s,p)=>s+Number(p.stock_quantity||0),0);
  const sold=products.reduce((s,p)=>s+Number(p.sold_count||0),0);
  const low=products.filter(p=>Number(p.stock_quantity||0)>0&&Number(p.stock_quantity||0)<=Number(p.low_stock_threshold||3)).length;

  const stats=$('#odoProductStats');
  if(stats)stats.innerHTML=[
    ['TOTAL PRODUCTS',products.length],
    ['LIVE',live],
    ['TOTAL STOCK',stock],
    ['LOW STOCK',low]
  ].map(([k,v])=>`<div class="odo-product-stat"><span>${k}</span><strong>${v}</strong></div>`).join('');

  wrap.innerHTML=products.map(p=>{
    const qty=Number(p.stock_quantity||0);
    const threshold=Number(p.low_stock_threshold||3);
    const stockLabel=qty<=0?'SOLD OUT':qty<=threshold?`ONLY ${qty} LEFT`:`${qty} IN STOCK`;
    const stockClass=qty<=0?'odo-product-hidden':qty<=threshold?'odo-product-low':'odo-product-live';
    return `<div class="odo-product-row">
      <img class="odo-product-thumb" src="${esc(p.image_url||'assets/odo-logo.png')}" alt="${esc(p.name)}">
      <div class="odo-product-info">
        <strong>${esc(p.name)}</strong>
        <span>${esc(p.sku)} · ${esc(p.category||'ODO')} · ${money(p.price)} · <span class="${p.active?'odo-product-live':'odo-product-hidden'}">${p.active?'LIVE':'HIDDEN'}</span></span>
        <span class="${stockClass}">${stockLabel} · SOLD ${Number(p.sold_count||0)} · LIKES ${Number(p.like_count||0)}</span>
        <span>${esc(p.description||'')}</span>
      </div>
      <div class="odo-product-actions">
        <button class="checkout-submit" data-edit="${p.id}">EDIT</button>
        <button class="checkout-submit" data-toggle="${p.id}">${p.active?'HIDE':'PUBLISH'}</button>
        <button class="checkout-submit" data-delete="${p.id}">DELETE</button>
      </div>
    </div>`;
  }).join('')||'<div class="odo-message"><p>No products yet.</p></div>';

  wrap.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const p=products.find(x=>x.id===b.dataset.edit);if(p)openForm(p)});
  wrap.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=async()=>{
    const p=products.find(x=>x.id===b.dataset.toggle);if(!p)return;
    const {error}=await sb.from('products').update({active:!p.active,updated_at:new Date().toISOString()}).eq('id',p.id);
    if(error)alert(error.message);else await loadProducts();
  });
  wrap.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{
    const p=products.find(x=>x.id===b.dataset.delete);if(!p)return;
    if(Number(p.sold_count||0)>0){alert('This product has order history and should be HIDDEN instead of deleted.');return}
    if(!confirm(`Delete ${p.name}?`))return;
    const {error}=await sb.from('products').delete().eq('id',p.id);
    if(error)alert(error.message);else await loadProducts();
  });
}

function openForm(product=null){
  let m=$('#odoProductModal');
  if(!m){m=document.createElement('div');m.id='odoProductModal';m.className='odo-product-modal';document.body.appendChild(m)}

  const currentSizes=Array.isArray(product?.sizes)&&product.sizes.length?product.sizes:['S','M','L','XL','XXL'];
  const currentImage=product?.image_url||'assets/odo-logo.png';

  m.innerHTML=`<div class="odo-product-card">
    <button class="odo-product-close" type="button">×</button>
    <p class="eyebrow">ODO FASHION / CATALOG</p>
    <h3>${product?'EDIT PRODUCT':'NEW PRODUCT'}</h3>
    <form id="odoProductForm">
      <div class="row">
        <label>SKU<input name="sku" required maxlength="40" value="${esc(product?.sku||'')}"></label>
        <label>PRICE<input name="price" type="number" min="0" step="1" required value="${product?.price??2500}"></label>
      </div>
      <label>PRODUCT NAME<input name="name" required value="${esc(product?.name||'')}"></label>
      <div class="row">
        <label>CATEGORY<select name="category">
          ${['STREETWEAR','OUTERWEAR','ACCESSORIES'].map(c=>`<option ${product?.category===c?'selected':''}>${c}</option>`).join('')}
        </select></label>
        <label>SIZES<input name="sizes" value="${esc(currentSizes.join(', '))}" placeholder="S, M, L, XL, XXL"></label>
      </div>
      <div class="row3">
        <label>STOCK QUANTITY<input name="stock_quantity" type="number" min="0" step="1" value="${product?.stock_quantity??0}"></label>
        <label>LOW STOCK ALERT<input name="low_stock_threshold" type="number" min="0" step="1" value="${product?.low_stock_threshold??3}"></label>
        <label>SOLD COUNT<input name="sold_count" type="number" min="0" step="1" value="${product?.sold_count??0}"></label>
      </div>
      <label>DESCRIPTION<textarea name="description" placeholder="Describe the product, material, fit, message or design.">${esc(product?.description||'')}</textarea></label>
      <div class="odo-photo-box">
        <img class="odo-image-preview" id="odoProductPreview" src="${esc(currentImage)}" alt="Current product photo">
        <div><label>PRODUCT PHOTO<input name="image" type="file" accept="image/*"></label><p class="odo-photo-note">Upload a new product photo or keep the current one. Images are stored in the ODO product-images bucket.</p></div>
      </div>
      <label><span><input name="active" type="checkbox" ${product?.active!==false?'checked':''}> Publish on website</span></label>
      <button class="checkout-submit" type="submit">${product?'SAVE CHANGES':'PUBLISH PRODUCT'} →</button>
    </form>
  </div>`;

  m.classList.add('open');
  const fileInput=m.querySelector('input[name="image"]');
  const preview=m.querySelector('#odoProductPreview');
  fileInput.addEventListener('change',()=>{const file=fileInput.files?.[0];if(file)preview.src=URL.createObjectURL(file)});
  m.querySelector('.odo-product-close').onclick=()=>m.classList.remove('open');
  m.onclick=e=>{if(e.target===m)m.classList.remove('open')};
  m.querySelector('#odoProductForm').onsubmit=async e=>{e.preventDefault();const ok=await saveProduct(e.currentTarget,product);if(ok)m.classList.remove('open')};
}

async function saveProduct(form,product){
  const d=Object.fromEntries(new FormData(form).entries());
  const file=form.querySelector('input[name="image"]').files?.[0];
  let imageUrl=product?.image_url||null;

  if(file){
    const ext=(file.name.split('.').pop()||'jpg').toLowerCase();
    const safeSku=String(d.sku||'product').trim().toLowerCase().replace(/[^a-z0-9-]+/g,'-');
    const path=`${safeSku}-${crypto.randomUUID()}.${ext}`;
    const up=await sb.storage.from('product-images').upload(path,file,{upsert:false,contentType:file.type});
    if(up.error){alert(`Photo upload failed: ${up.error.message}`);return false}
    imageUrl=sb.storage.from('product-images').getPublicUrl(path).data.publicUrl;
  }

  const stock=Math.max(0,Number(d.stock_quantity||0));
  const threshold=Math.max(0,Number(d.low_stock_threshold||0));
  const sold=Math.max(0,Number(d.sold_count||0));
  const payload={
    sku:String(d.sku).trim(),
    name:String(d.name).trim(),
    price:Number(d.price)||0,
    category:d.category,
    description:String(d.description||'').trim(),
    image_url:imageUrl,
    sizes:String(d.sizes||'ONE SIZE').split(',').map(x=>x.trim()).filter(Boolean),
    stock_quantity:stock,
    low_stock_threshold:threshold,
    sold_count:sold,
    active:form.querySelector('[name="active"]').checked,
    updated_at:new Date().toISOString()
  };

  let res;
  if(product){
    res=await sb.from('products').update(payload).eq('id',product.id);
  }else{
    const {data:{user}}=await sb.auth.getUser();
    res=await sb.from('products').insert({...payload,created_by:user?.id||null});
  }
  if(res.error){alert(res.error.message);return false}
  await loadProducts();
  return true;
}

boot();
