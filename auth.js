import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const SUPABASE_URL='https://gqlcxvukyezqpdftjdeo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8';
const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
window.odoSupabase=supabase;

const style=document.createElement('style');style.textContent=`
.odo-account-btn{background:transparent;border:1px solid rgba(200,165,96,.38);color:#f5f1e8;padding:10px 14px;font-size:.58rem;text-transform:uppercase;letter-spacing:.14em;cursor:pointer;margin-right:8px}.odo-account-btn:hover{background:#f5f1e8;color:#080808}.odo-account-modal{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.84);display:none;align-items:center;justify-content:center;padding:20px}.odo-account-modal.open{display:flex}.odo-account-card{width:min(600px,100%);max-height:90vh;overflow:auto;background:#0c0c0b;border:1px solid rgba(200,165,96,.38);padding:34px;box-shadow:0 30px 100px rgba(0,0,0,.65);position:relative}.odo-account-card h2{margin:12px 0 24px}.odo-close{position:absolute;right:20px;top:14px;background:none;border:0;color:#f5f1e8;font-size:2rem;cursor:pointer}.odo-tabs{display:flex;gap:8px;margin-bottom:20px}.odo-tabs button{background:#111;color:#aaa;border:1px solid #35322c;padding:10px 13px;font-size:.56rem;letter-spacing:.1em;cursor:pointer}.odo-tabs button.active{background:#f5f1e8;color:#080808}.odo-form label{display:grid;gap:7px;color:#aaa;font-size:.56rem;text-transform:uppercase;letter-spacing:.13em;margin-bottom:13px}.odo-form input{background:#080808;color:#fff;border:1px solid #37342f;padding:13px;outline:none;width:100%}.odo-submit,.odo-signout{width:100%;background:#c8a560;color:#080808;border:1px solid #c8a560;padding:14px;font-weight:900;letter-spacing:.12em;font-size:.58rem;cursor:pointer}.odo-message{min-height:20px;color:#e5c982;font-size:.68rem;line-height:1.5;margin:10px 0}.odo-profile-head{display:flex;justify-content:space-between;gap:16px;align-items:start}.odo-profile-meta{color:#85817a;font-size:.72rem;line-height:1.7}.odo-orders-title{margin:28px 0 10px;color:#c8a560;font-size:.6rem;letter-spacing:.18em}.odo-order{border:1px solid rgba(245,241,232,.12);padding:15px;margin-bottom:10px}.odo-order-top{display:flex;justify-content:space-between;gap:12px}.odo-order-status{color:#c8a560;font-size:.5rem;letter-spacing:.1em}.odo-order-date{color:#777;font-size:.6rem;margin-top:4px}.odo-order-lines{border-top:1px solid rgba(245,241,232,.08);margin-top:10px;padding-top:9px;color:#aaa;font-size:.64rem;line-height:1.7}.odo-order-total{color:#e5c982;font-weight:800;margin-top:8px}.odo-empty{color:#777;font-size:.72rem;padding:18px 0}.odo-nita-img{width:100%;height:100%;display:block;object-fit:cover;object-position:center;filter:contrast(1.04) saturate(.92)}
`;
document.head.appendChild(style);

// Remove legacy device-only account UI and duplicate story injected by the old script.
localStorage.removeItem('odoCustomer');
function cleanupLegacyODO(){
  document.getElementById('odoAccountLauncher')?.remove();
  document.querySelectorAll('.account-modal').forEach(el=>el.remove());
  document.getElementById('odo-story')?.remove();
  const previewNodes=[...document.querySelectorAll('*')].filter(el=>el.textContent?.includes('ACCOUNT PREVIEW')&&el.children.length<5);
  previewNodes.forEach(el=>{const box=el.closest('.account-card,.account-modal');if(box)box.remove();});
}
cleanupLegacyODO();

// Use the uploaded ODO portrait asset in the main Nita section.
const nitaVisual=document.querySelector('#nita .nita-visual');
if(nitaVisual){nitaVisual.innerHTML='<img class="odo-nita-img" src="assets/nita-kunwar.svg" alt="Nita Kunwar">';}

function esc(v){return String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function cart(){try{return JSON.parse(localStorage.getItem('odoCart')||'[]')}catch{return[]}}

const nav=document.querySelector('.nav');
if(nav&&!document.getElementById('odoAccountBtn')){
 const b=document.createElement('button');b.id='odoAccountBtn';b.className='odo-account-btn';b.textContent='MY ACCOUNT';b.onclick=openAccount;
 const cartBtn=nav.querySelector('#cartOpen');nav.insertBefore(b,cartBtn);
}

const modal=document.createElement('div');modal.className='odo-account-modal';modal.innerHTML=`<div class="odo-account-card"><button class="odo-close" id="odoClose">×</button><div id="odoAuth"><p class="eyebrow">ODO FASHION / MY ACCOUNT</p><h2>WELCOME<br><em>BACK.</em></h2><div class="odo-tabs"><button id="odoLoginTab" class="active">LOGIN</button><button id="odoSignupTab">CREATE ACCOUNT</button></div><form id="odoAuthForm" class="odo-form"><label>Email<input name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label><label>Password<input name="password" type="password" required minlength="6" autocomplete="current-password" placeholder="Minimum 6 characters"></label><label id="odoNameField" style="display:none">Full name<input name="full_name" autocomplete="name" placeholder="Your full name"></label><button class="odo-submit" type="submit">LOGIN →</button></form><div class="odo-message" id="odoAuthMessage"></div><p class="cart-note">Your account keeps your ODO order history available across devices.</p></div><div id="odoProfile" style="display:none"><p class="eyebrow">ODO FASHION / MY ACCOUNT</p><div class="odo-profile-head"><div><h2>MY ORDERS.</h2><div class="odo-profile-meta" id="odoProfileMeta"></div></div><button class="odo-signout" id="odoSignout" style="width:auto;padding:10px 13px">SIGN OUT</button></div><div class="odo-orders-title">ORDER HISTORY</div><div id="odoOrders"></div></div></div>`;document.body.appendChild(modal);
modal.querySelector('#odoClose').onclick=()=>modal.classList.remove('open');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
let mode='login';
function setMode(m){mode=m;modal.querySelector('#odoLoginTab').classList.toggle('active',m==='login');modal.querySelector('#odoSignupTab').classList.toggle('active',m==='signup');modal.querySelector('#odoNameField').style.display=m==='signup'?'grid':'none';modal.querySelector('.odo-submit').textContent=m==='login'?'LOGIN →':'CREATE ACCOUNT →';modal.querySelector('#odoAuthForm input[name="password"]').autocomplete=m==='login'?'current-password':'new-password';modal.querySelector('#odoAuthMessage').textContent=''}
modal.querySelector('#odoLoginTab').onclick=()=>setMode('login');modal.querySelector('#odoSignupTab').onclick=()=>setMode('signup');
function showAuth(){modal.querySelector('#odoAuth').style.display='block';modal.querySelector('#odoProfile').style.display='none'}
async function profile(user){
 modal.querySelector('#odoAuth').style.display='none';modal.querySelector('#odoProfile').style.display='block';
 const {data:p}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle();
 modal.querySelector('#odoProfileMeta').innerHTML=`${esc(p?.full_name||user.user_metadata?.full_name||'ODO customer')}<br>${esc(user.email||'')}`;
 const {data:o,error}=await supabase.from('orders').select('order_number,order_status,payment_method,total,created_at,order_items(product_name,size,quantity,line_total)').eq('user_id',user.id).order('created_at',{ascending:false});
 const box=modal.querySelector('#odoOrders');if(error){box.innerHTML='<div class="odo-empty">Could not load your orders.</div>';return}if(!o?.length){box.innerHTML='<div class="odo-empty">No ODO orders yet.</div>';return}
 box.innerHTML=o.map(x=>`<div class="odo-order"><div class="odo-order-top"><div><strong>${esc(x.order_number)}</strong><div class="odo-order-date">${new Date(x.created_at).toLocaleString('en-NP')}</div></div><div class="odo-order-status">${esc(x.order_status)} · ${esc(x.payment_method)}</div></div><div class="odo-order-lines">${(x.order_items||[]).map(i=>`${esc(i.product_name)} · Size ${esc(i.size)} × ${i.quantity} — NPR ${Number(i.line_total).toLocaleString('en-NP')}`).join('<br>')}</div><div class="odo-order-total">TOTAL · NPR ${Number(x.total).toLocaleString('en-NP')}</div></div>`).join('')
}
async function openAccount(){modal.classList.add('open');const {data:{session}}=await supabase.auth.getSession();if(session)await profile(session.user);else showAuth()}
modal.querySelector('#odoAuthForm').addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.currentTarget),email=String(f.get('email')).trim(),password=String(f.get('password')),name=String(f.get('full_name')||'').trim();modal.querySelector('#odoAuthMessage').textContent=mode==='login'?'Signing in…':'Creating account…';const r=mode==='login'?await supabase.auth.signInWithPassword({email,password}):await supabase.auth.signUp({email,password,options:{data:{full_name:name}}});if(r.error){modal.querySelector('#odoAuthMessage').textContent=r.error.message;return}if(mode==='signup'&&!r.data.session){modal.querySelector('#odoAuthMessage').textContent='Account created. Check your email, then login.';return}if(r.data.user){await supabase.from('profiles').upsert({id:r.data.user.id,full_name:name||r.data.user.user_metadata?.full_name||'',email:r.data.user.email||''});await profile(r.data.user)}});
modal.querySelector('#odoSignout').onclick=async()=>{await supabase.auth.signOut();showAuth();setMode('login')};
supabase.auth.onAuthStateChange((event,session)=>{if(session&&modal.classList.contains('open'))profile(session.user)});

document.addEventListener('submit',async e=>{
 if(e.target?.id!=='odoCheckoutForm')return;e.preventDefault();e.stopImmediatePropagation();
 const {data:{session}}=await supabase.auth.getSession();if(!session){modal.classList.add('open');showAuth();modal.querySelector('#odoAuthMessage').textContent='Please login before placing an order so we can save your order history.';return}
 const items=cart();if(!items.length)return;const f=new FormData(e.target);const name=String(f.get('name')).trim(),phone=String(f.get('phone')).trim(),location=String(f.get('location')).trim(),address=String(f.get('address')).trim(),note=String(f.get('note')||'').trim(),total=items.reduce((s,i)=>s+Number(i.qty||0)*2500,0),orderNumber=`ODO-${Date.now().toString().slice(-8)}`;
 const {data:order,error}=await supabase.from('orders').insert({user_id:session.user.id,order_number:orderNumber,customer_name:name,customer_phone:phone,city:location,delivery_address:address,payment_method:'COD',payment_status:'PENDING',order_status:'RECEIVED',subtotal:total,delivery_fee:0,total,customer_note:note}).select('id').single();if(error){alert(error.message);return}
 const {error:itemError}=await supabase.from('order_items').insert(items.map(i=>({order_id:order.id,product_name:i.name,size:i.size,quantity:Number(i.qty),unit_price:2500,line_total:Number(i.qty)*2500})));if(itemError){alert(itemError.message);return}
 await supabase.from('customer_activity').insert({user_id:session.user.id,activity_type:'order_placed',page_path:location.pathname,metadata:{order_number:orderNumber,total}});
 const msg=[`Hi ODO Fashion! 👋`,`NEW WEBSITE COD ORDER #${orderNumber}`,'',...items.map((i,n)=>`${n+1}. ${i.name} — Size ${i.size} × ${i.qty} = NPR ${(Number(i.qty)*2500).toLocaleString('en-NP')}`),'',`TOTAL: NPR ${total.toLocaleString('en-NP')}`,'PAYMENT: Cash on Delivery',`CUSTOMER: ${name}`,`PHONE: ${phone}`,`LOCATION: ${location}`,`ADDRESS: ${address}`,note?`NOTE: ${note}`:''].filter(Boolean).join('\n');
 localStorage.removeItem('odoCart');e.target.innerHTML=`<div class="order-success"><p class="eyebrow">ORDER CONFIRMED</p><h3>THANK YOU, ${esc(name.split(' ')[0]).toUpperCase()}.</h3><p>Order <strong>${orderNumber}</strong> is saved to your ODO account.</p><a class="checkout-submit" href="https://wa.me/9779845319200?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">SEND ORDER TO ODO →</a><p class="cart-note">You can find this order anytime in MY ACCOUNT → ORDER HISTORY.</p></div>`;
 setTimeout(()=>profile(session.user),150);
},true);

// Final cleanup after legacy script initialization.
cleanupLegacyODO();
