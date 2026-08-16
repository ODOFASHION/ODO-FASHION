import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const sb=createClient('https://gqlcxvukyezqpdftjdeo.supabase.co','sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8');
const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const money=v=>`NPR ${Number(v||0).toLocaleString('en-NP')}`;
async function loadCatalog(){
 const grid=document.querySelector('.streetwear-products');
 if(!grid)return;
 const {data,error}=await sb.from('products').select('sku,name,price,category,description,image_url,sizes,active').eq('active',true).order('created_at',{ascending:true});
 if(error||!data?.length)return;
 grid.innerHTML=data.map(p=>{const img=p.image_url||'assets/odo-logo.png';const sizes=Array.isArray(p.sizes)&&p.sizes.length?p.sizes:['S','M','L','XL','XXL'];return `<article class="product reveal visible"><div class="product-art product-photo-wrap"><img class="product-photo" src="${esc(img)}" alt="ODO ${esc(p.name)}" loading="lazy"></div><div class="product-meta"><div><p class="product-number">${esc(p.sku)} / ${esc(p.category)}</p><h3>${esc(p.name)}</h3><p class="price">${money(p.price)}</p></div><span class="status">ODO DROP</span></div><p class="product-desc">${esc(p.description)}</p><div class="product-controls"><label>Size <select class="size-select">${sizes.map(s=>`<option>${esc(s)}</option>`).join('')}</select></label><button class="add-btn" data-name="${esc(p.name)}" data-price="${Number(p.price||2500)}">ADD TO CART</button></div></article>`}).join('');
 grid.querySelectorAll('.add-btn').forEach(button=>button.addEventListener('click',()=>addCatalogItem(button)));
}
function addCatalogItem(button){
 const product=button.closest('.product');const size=product.querySelector('.size-select').value;const name=button.dataset.name;const price=Number(button.dataset.price||2500);
 if(typeof cart==='undefined'){localStorage.setItem('odoCart',JSON.stringify([{name,size,qty:1,price}]));location.reload();return;}
 const existing=cart.find(item=>item.name===name&&item.size===size);if(existing)existing.qty+=1;else cart.push({name,size,qty:1,price});
 try{if(typeof saveCart==='function')saveCart();if(typeof openCart==='function')openCart();if(typeof showToast==='function')showToast(`${name} — size ${size} added`);}catch{}
}
loadCatalog();
