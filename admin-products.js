import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const sb=createClient('https://gqlcxvukyezqpdftjdeo.supabase.co','sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8');
const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const $=s=>document.querySelector(s);

async function boot(){
  const {data:{session}}=await sb.auth.getSession();
  if(!session)return;
  const {data:me}=await sb.from('profiles').select('is_admin').eq('id',session.user.id).maybeSingle();
  if(!me?.is_admin)return;
  const main=$('.odo-admin-main');
  if(!main||$('#odoProductsSection'))return;
  const sec=document.createElement('section');
  sec.id='odoProductsSection';sec.style.margin='45px 0';
  sec.innerHTML=`<div class="odo-admin-title"><div><p class="eyebrow">CATALOG MANAGEMENT</p><h2>PRODUCTS.</h2></div><p>Add, edit, hide or remove clothing directly from your ODO admin account.</p></div><div class="product-admin-actions"><button id="odoNewProduct" class="checkout-submit admin-btn">+ NEW PRODUCT</button></div><div id="odoProductList" class="odo-product-list"></div>`;
  main.prepend(sec);
  const st=document.createElement('style');st.textContent=`.product-admin-actions{margin:0 0 18px}.odo-product-list{display:grid;gap:12px}.odo-product-row{display:grid;grid-template-columns:90px 1fr auto;gap:16px;align-items:center;background:#0d0d0c;border:1px solid rgba(200,165,96,.2);padding:14px}.odo-product-thumb{width:90px;height:90px;object-fit:cover;background:#151513}.odo-product-info strong{display:block;color:#f5f1e8;font-size:.9rem}.odo-product-info span{display:block;color:#77736c;font-size:.6rem;margin-top:4px}.odo-product-actions{display:flex;gap:8px;flex-wrap:wrap}.odo-product-actions button{width:auto!important;padding:9px 12px!important}.odo-product-modal{position:fixed;inset:0;z-index:350;background:rgba(0,0,0,.86);display:none;align-items:center;justify-content:center;padding:20px}.odo-product-modal.open{display:flex}.odo-product-card{width:min(720px,100%);max-height:92vh;overflow:auto;background:#0b0b0a;border:1px solid rgba(200,165,96,.3);padding:24px;position:relative}.odo-product-card h3{font-size:2rem;margin-top:0}.odo-product-card form{display:grid;gap:12px}.odo-product-card label{display:grid;gap:6px;color:#aaa;font-size:.62rem}.odo-product-card input,.odo-product-card textarea,.odo-product-card select{background:#111;color:#f5f1e8;border:1px solid rgba(245,241,232,.14);padding:10px;font:inherit}.odo-product-card textarea{min-height:90px}.odo-product-card .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.odo-product-close{position:absolute;right:16px;top:10px;background:none;border:0;color:#f5f1e8;font-size:2rem;cursor:pointer}@media(max-width:700px){.odo-product-row{grid-template-columns:70px 1fr}.odo-product-thumb{width:70px;height:70px}.odo-product-actions{grid-column:1/-1}.odo-product-card .row{grid-template-columns:1fr}}`;
  document.head.appendChild(st);
  $('#odoNewProduct').onclick=()=>openForm();
  await loadProducts();
}

async function loadProducts(){
  const wrap=$('#odoProductList');if(!wrap)return;
  const {data,error}=await sb.from('products').select('*').order('created_at',{ascending:false});
  if(error){wrap.innerHTML='<div class="odo-message"><p>Unable to load products. Run products.sql in Supabase first.</p></div>';return}
  wrap.innerHTML=(data||[]).map(p=>`<div class="odo-product-row"><img class="odo-product-thumb" src="${esc(p.image_url||'assets/odo-logo.png')}" alt=""><div class="odo-product-info"><strong>${esc(p.name)}</strong><span>${esc(p.sku)} · ${esc(p.category)} · NPR ${Number(p.price||0).toLocaleString('en-NP')} · ${p.active?'LIVE':'HIDDEN'}</span><span>${esc(p.description)}</span></div><div class="odo-product-actions"><button class="checkout-submit" data-edit="${p.id}">EDIT</button><button class="checkout-submit" data-toggle="${p.id}">${p.active?'HIDE':'PUBLISH'}</button><button class="checkout-submit" data-delete="${p.id}">DELETE</button></div></div>`).join('')||'<div class="odo-message"><p>No products yet.</p></div>';
  wrap.querySelectorAll('[data-edit]').forEach(b=>b.onclick=async()=>{const p=(data||[]).find(x=>x.id===b.dataset.edit);if(p)openForm(p)});
  wrap.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=async()=>{const p=(data||[]).find(x=>x.id===b.dataset.toggle);if(!p)return;const {error}=await sb.from('products').update({active:!p.active,updated_at:new Date().toISOString()}).eq('id',p.id);if(error)alert(error.message);else await loadProducts()});
  wrap.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{const p=(data||[]).find(x=>x.id===b.dataset.delete);if(!p)return;if(!confirm(`Delete ${p.name}?`))return;const {error}=await sb.from('products').delete().eq('id',p.id);if(error)alert(error.message);else await loadProducts()});
}

function openForm(product=null){
  let m=$('#odoProductModal');
  if(!m){m=document.createElement('div');m.id='odoProductModal';m.className='odo-product-modal';document.body.appendChild(m)}
  m.innerHTML=`<div class="odo-product-card"><button class="odo-product-close">×</button><h3>${product?'EDIT PRODUCT':'NEW PRODUCT'}</h3><form id="odoProductForm"><div class="row"><label>SKU<input name="sku" required maxlength="30" value="${esc(product?.sku||'')}"></label><label>PRICE<input name="price" type="number" min="0" step="1" required value="${product?.price??2500}"></label></div><label>PRODUCT NAME<input name="name" required value="${esc(product?.name||'')}"></label><div class="row"><label>CATEGORY<select name="category"><option ${product?.category==='STREETWEAR'?'selected':''}>STREETWEAR</option><option ${product?.category==='OUTERWEAR'?'selected':''}>OUTERWEAR</option><option ${product?.category==='ACCESSORIES'?'selected':''}>ACCESSORIES</option></select></label><label>SIZES<input name="sizes" value="${esc((product?.sizes||['S','M','L','XL','XXL']).join(', '))}"></label></div><label>DESCRIPTION<textarea name="description">${esc(product?.description||'')}</textarea></label><label>PRODUCT PHOTO<input name="image" type="file" accept="image/*"><span style="color:#77736c">Upload a new photo or keep the current image.</span></label><label><input name="active" type="checkbox" ${product?.active!==false?'checked':''}> Publish on website</label><button class="checkout-submit" type="submit">${product?'SAVE CHANGES':'PUBLISH PRODUCT'} →</button></form></div>`;
  m.classList.add('open');m.querySelector('.odo-product-close').onclick=()=>m.classList.remove('open');m.onclick=e=>{if(e.target===m)m.classList.remove('open')};m.querySelector('#odoProductForm').onsubmit=async e=>{e.preventDefault();await saveProduct(e.currentTarget,product);m.classList.remove('open')};
}

async function saveProduct(form,product){
  const d=Object.fromEntries(new FormData(form).entries());
  let imageUrl=product?.image_url||null;
  const file=form.querySelector('input[name="image"]').files?.[0];
  if(file){const ext=(file.name.split('.').pop()||'jpg').toLowerCase();const path=`${crypto.randomUUID()}.${ext}`;const up=await sb.storage.from('product-images').upload(path,file,{upsert:false,contentType:file.type});if(up.error){alert(up.error.message);return}imageUrl=sb.storage.from('product-images').getPublicUrl(path).data.publicUrl}
  const payload={sku:String(d.sku).trim(),name:String(d.name).trim(),price:Number(d.price)||2500,category:d.category,description:String(d.description||'').trim(),image_url:imageUrl,sizes:String(d.sizes||'S, M, L, XL, XXL').split(',').map(x=>x.trim()).filter(Boolean),active:form.querySelector('[name="active"]').checked,updated_at:new Date().toISOString()};
  let res;
  if(product)res=await sb.from('products').update(payload).eq('id',product.id);else{const {data:{user}}=await sb.auth.getUser();res=await sb.from('products').insert({...payload,created_by:user?.id||null})}
  if(res.error){alert(res.error.message);return}
  await loadProducts();
}

boot();
