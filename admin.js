import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const supabase=createClient('https://gqlcxvukyezqpdftjdeo.supabase.co','sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8');
const $=s=>document.querySelector(s);
const style=document.createElement('style');style.textContent=`
.odo-admin-body{min-height:100vh;background:#080807;color:#f5f1e8;font-family:Arial,sans-serif}.odo-admin-app{max-width:1450px;margin:auto;padding:28px}.odo-admin-head{display:flex;justify-content:space-between;gap:24px;align-items:flex-end;border-bottom:1px solid rgba(245,241,232,.1);padding-bottom:28px}.odo-admin-head h1{font-size:clamp(3rem,7vw,6rem);margin:.1em 0 0;line-height:.85}.odo-admin-head h1 em{color:#c8a560;font-style:normal}.odo-admin-main{padding:35px 0}.admin-btn{width:auto!important;margin-left:8px;padding:11px 16px!important}.odo-admin-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:45px}.odo-stat{border:1px solid rgba(200,165,96,.25);padding:22px;background:#0d0d0c}.odo-stat span{display:block;color:#77736c;font-size:.56rem;letter-spacing:.14em;text-transform:uppercase}.odo-stat strong{display:block;color:#e5c982;font-size:2rem;margin-top:8px}.odo-admin-title{display:flex;justify-content:space-between;gap:20px;align-items:end;margin:35px 0 16px}.odo-admin-title h2{font-size:3rem;margin:0}.odo-admin-title>p{color:#77736c;max-width:430px;font-size:.7rem;line-height:1.6}.odo-admin-table-wrap{overflow:auto;border:1px solid rgba(245,241,232,.1)}.odo-admin-table{width:100%;border-collapse:collapse;min-width:1150px}.odo-admin-table th,.odo-admin-table td{padding:14px;border-bottom:1px solid rgba(245,241,232,.08);text-align:left;font-size:.64rem}.odo-admin-table th{color:#c8a560;font-size:.5rem;letter-spacing:.15em}.odo-admin-table td{color:#b5b0a6;vertical-align:top}.odo-admin-table td strong{color:#f5f1e8}.status-pill{display:inline-block;border:1px solid rgba(200,165,96,.25);padding:5px 7px;color:#e5c982;font-size:.49rem;letter-spacing:.08em}.status-select{background:#0a0a09;color:#f5f1e8;border:1px solid rgba(200,165,96,.4);padding:7px 8px;font-size:.54rem}.admin-denied{max-width:620px;padding:34px;border:1px solid rgba(200,165,96,.25);background:#0d0d0c}.admin-denied h2{margin-top:0}.admin-denied p{color:#89857d;line-height:1.7}.activity-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:45px}.activity-card{border:1px solid rgba(200,165,96,.18);padding:22px;background:#0d0d0c}.activity-card h3{margin:0 0 14px;font-size:1.2rem}.activity-list{display:grid;gap:8px;max-height:280px;overflow:auto}.activity-row{display:flex;justify-content:space-between;gap:12px;border-top:1px solid rgba(245,241,232,.07);padding-top:10px;color:#aaa;font-size:.62rem}.activity-row strong{color:#f5f1e8}.activity-row span{color:#77736c}.customer-note{color:#888;font-size:.6rem;line-height:1.6;margin-top:10px}@media(max-width:900px){.odo-admin-stats{grid-template-columns:repeat(2,1fr)}.odo-admin-head{align-items:flex-start;flex-direction:column}.activity-grid{grid-template-columns:1fr}}@media(max-width:520px){.odo-admin-stats{grid-template-columns:1fr}.odo-admin-app{padding:18px}}
`;document.head.appendChild(style);
function money(v){return `NPR ${Number(v||0).toLocaleString('en-NP')}`}
function esc(v){return String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function fmtDate(v){return new Date(v).toLocaleString('en-NP')}
async function boot(){
 const {data:{session}}=await supabase.auth.getSession();
 if(!session){deny('LOGIN REQUIRED','Open the ODO website, log in to your ODO account, then open the admin page again.');return}
 const {data:me,error}=await supabase.from('profiles').select('full_name,email,phone,is_admin').eq('id',session.user.id).maybeSingle();
 if(error||!me?.is_admin){deny('ADMIN ACCESS ONLY','This page is restricted. Your account must have admin access in Supabase.');return}
 $('#adminMessage').textContent=`Signed in as ${me.full_name||me.email}`;
 $('#adminStats').hidden=false;$('#adminOrdersSection').hidden=false;$('#adminCustomersSection').hidden=false;
 await ensureActivityPanels();
 await refresh();
}
function deny(title,text){$('#adminMessage').innerHTML=`<div class="admin-denied"><h2>${title}</h2><p>${text}</p></div>`;$('#adminStats').hidden=true;$('#adminOrdersSection').hidden=true;$('#adminCustomersSection').hidden=true}
async function ensureActivityPanels(){
 const main=$('.odo-admin-main');
 if(document.getElementById('adminActivity'))return;
 const sec=document.createElement('section');sec.id='adminActivity';sec.innerHTML=`<div class="activity-grid"><div class="activity-card"><p class="eyebrow">CUSTOMER ACTIVITY</p><h3>RECENT ACTIVITY.</h3><div id="adminRecentActivity" class="activity-list"></div><p class="customer-note">Only account-linked activity is shown here. Anonymous visitors are not individually identified.</p></div><div class="activity-card"><p class="eyebrow">POPULAR</p><h3>TOP PRODUCTS / ACTIONS.</h3><div id="adminTopActivity" class="activity-list"></div></div></div>`;
 main.insertBefore(sec,$('#adminOrdersSection'));
}
async function refresh(){
 const [{data:orders, error:ordersError},{data:profiles, error:profilesError},{data:activity, error:activityError}]=await Promise.all([
   supabase.from('orders').select('id,user_id,order_number,customer_name,customer_phone,order_status,payment_method,total,created_at,order_items(product_name,size,quantity,line_total)').order('created_at',{ascending:false}).limit(200),
   supabase.from('profiles').select('id,full_name,email,phone,created_at').order('created_at',{ascending:false}).limit(500),
   supabase.from('customer_activity').select('id,user_id,activity_type,product_name,page_path,metadata,created_at').order('created_at',{ascending:false}).limit(100)
 ]);
 const os=orders||[], ps=profiles||[], acts=activity||[];
 const today=new Date();today.setHours(0,0,0,0);const todayOrders=os.filter(o=>new Date(o.created_at)>=today);
 const revenue=os.reduce((s,o)=>s+Number(o.total||0),0);
 $('#adminStats').innerHTML=[['TOTAL ORDERS',os.length],['ORDERS TODAY',todayOrders.length],['CUSTOMERS',ps.length],['ORDER VALUE',money(revenue)],['PENDING',os.filter(o=>o.order_status==='RECEIVED').length]].map(x=>`<div class="odo-stat"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
 const statuses=['RECEIVED','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'];
 $('#adminOrders').innerHTML=os.length?os.map(o=>`<tr><td><strong>${esc(o.order_number)}</strong></td><td>${esc(o.customer_name)}<br><small>${esc(o.customer_phone)}</small></td><td>${(o.order_items||[]).map(i=>`${esc(i.product_name)} · ${esc(i.size)} × ${i.quantity}`).join('<br>')}</td><td><strong>${money(o.total)}</strong></td><td>${esc(o.payment_method)}</td><td><select class="status-select" data-order-id="${o.id}">${statuses.map(s=>`<option value="${s}" ${o.order_status===s?'selected':''}>${s}</option>`).join('')}</select></td><td>${fmtDate(o.created_at)}</td></tr>`).join(''):'<tr><td colspan="7">No orders yet.</td></tr>';
 document.querySelectorAll('.status-select').forEach(sel=>sel.addEventListener('change',async e=>{
   const id=e.target.dataset.orderId;const status=e.target.value;const {error}=await supabase.from('orders').update({order_status:status}).eq('id',id);if(error){alert(error.message);await refresh();return}await refresh();
 }));
 const counts={};os.forEach(o=>counts[o.user_id]=(counts[o.user_id]||0)+1);
 $('#adminCustomers').innerHTML=ps.length?ps.map(p=>`<tr><td><strong>${esc(p.full_name||'ODO customer')}</strong></td><td>${esc(p.email||'')}</td><td>${esc(p.phone||'')}</td><td>${counts[p.id]||0}</td><td>${new Date(p.created_at).toLocaleDateString('en-NP')}</td></tr>`).join(''):'<tr><td colspan="5">No customers yet.</td></tr>';
 const names={};ps.forEach(p=>names[p.id]=p.full_name||p.email||'Customer');
 $('#adminRecentActivity').innerHTML=acts.length?acts.slice(0,30).map(a=>`<div class="activity-row"><strong>${esc(names[a.user_id]||'Customer')} · ${esc(a.activity_type)}</strong><span>${esc(a.product_name||a.page_path||'')} · ${fmtDate(a.created_at)}</span></div>`).join(''):'<div class="activity-row"><span>No activity yet.</span></div>';
 const top={};acts.forEach(a=>{const key=a.product_name||a.activity_type;top[key]=(top[key]||0)+1});const topList=Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,12);
 $('#adminTopActivity').innerHTML=topList.length?topList.map(([k,v])=>`<div class="activity-row"><strong>${esc(k)}</strong><span>${v} activity${v===1?'':'ies'}</span></div>`).join(''):'<div class="activity-row"><span>No activity yet.</span></div>';
}
$('#adminRefresh').onclick=refresh;$('#adminSignout').onclick=async()=>{await supabase.auth.signOut();location.reload()};
boot();