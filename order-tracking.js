import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL='https://gqlcxvukyezqpdftjdeo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8';
const sb=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

const esc=v=>String(v??'').replace(/[&<>\\\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));

const statusSteps=[
  ['RECEIVED','Order received'],
  ['CONFIRMED','Order confirmed'],
  ['PROCESSING','Being prepared'],
  ['SHIPPED','Shipped'],
  ['OUT FOR DELIVERY','Out for delivery'],
  ['DELIVERED','Delivered']
];

function statusIndex(status){
  const s=String(status||'RECEIVED').toUpperCase();
  if(s==='CANCELLED') return -1;
  const i=statusSteps.findIndex(x=>x[0]===s);
  if(i>=0)return i;
  if(s==='PACKED')return 2;
  return 0;
}

function injectStyles(){
  if(document.getElementById('odoOrderTrackingStyles'))return;
  const style=document.createElement('style');
  style.id='odoOrderTrackingStyles';
  style.textContent=`
    .odo-order-tracking{margin-top:16px;padding:15px 0 4px;border-top:1px solid rgba(245,241,232,.08)}
    .odo-tracking-label{color:#77736c;font-size:.48rem;letter-spacing:.14em;text-transform:uppercase;margin-bottom:13px}
    .odo-tracking{display:grid;gap:11px}
    .odo-track-step{display:grid;grid-template-columns:22px 1fr auto;gap:10px;align-items:center}
    .odo-track-dot{width:10px;height:10px;border-radius:50%;border:1px solid #625d55;background:transparent;position:relative}
    .odo-track-step.done .odo-track-dot,.odo-track-step.current .odo-track-dot{background:#c8a560;border-color:#c8a560}
    .odo-track-step.current .odo-track-dot{box-shadow:0 0 0 4px rgba(200,165,96,.12)}
    .odo-track-name{font-size:.59rem;color:#77736c}
    .odo-track-step.done .odo-track-name,.odo-track-step.current .odo-track-name{color:#f5f1e8}
    .odo-track-status{font-size:.47rem;letter-spacing:.09em;text-transform:uppercase;color:#c8a560}
    .odo-track-line{position:absolute;width:1px;height:15px;background:rgba(200,165,96,.25);left:4px;top:10px}
    .odo-track-step:last-child .odo-track-line{display:none}
    .odo-track-cancelled{border:1px solid rgba(180,70,70,.35);padding:11px;color:#e7b1b1;font-size:.57rem;line-height:1.6}
    .odo-order-updated{color:#77736c;font-size:.5rem;margin-top:10px}
    @media(max-width:520px){.odo-track-step{grid-template-columns:18px 1fr auto}.odo-track-status{font-size:.44rem}}
  `;
  document.head.appendChild(style);
}

function buildTimeline(status,updatedAt){
  const current=statusIndex(status);
  if(String(status).toUpperCase()==='CANCELLED'){
    return `<div class="odo-order-tracking"><div class="odo-tracking-label">ORDER PROGRESS</div><div class="odo-track-cancelled"><strong>ORDER CANCELLED</strong><br>This order has been cancelled. Contact ODO customer care if you need assistance.</div>${updatedAt?`<div class="odo-order-updated">UPDATED · ${esc(new Date(updatedAt).toLocaleString('en-NP'))}</div>`:''}</div>`;
  }
  return `<div class="odo-order-tracking"><div class="odo-tracking-label">ORDER PROGRESS</div><div class="odo-tracking">${statusSteps.map((step,i)=>{const done=i<current;const active=i===current;return `<div class="odo-track-step ${done?'done':''} ${active?'current':''}"><div style="position:relative"><div class="odo-track-dot"></div>${i<statusSteps.length-1?'<div class="odo-track-line"></div>':''}</div><div class="odo-track-name">${esc(step[1])}</div><div class="odo-track-status">${active?'CURRENT':done?'DONE':''}</div></div>`}).join('')}</div>${updatedAt?`<div class="odo-order-updated">LAST UPDATED · ${esc(new Date(updatedAt).toLocaleString('en-NP'))}</div>`:''}</div>`;
}

async function decorateOrderCards(){
  injectStyles();
  const box=document.getElementById('odoOrders');
  if(!box)return;
  const session=(await sb.auth.getSession()).data.session;
  if(!session)return;
  const {data:orders,error}=await sb.from('orders').select('id,order_number,order_status,updated_at').eq('user_id',session.user.id).order('created_at',{ascending:false});
  if(error||!orders?.length)return;
  const byNumber=new Map(orders.map(o=>[String(o.order_number),o]));
  box.querySelectorAll('.odo-order').forEach(card=>{
    if(card.querySelector('.odo-order-tracking'))return;
    const number=card.querySelector('strong')?.textContent?.trim();
    const order=byNumber.get(number);
    if(!order)return;
    card.insertAdjacentHTML('beforeend',buildTimeline(order.order_status,order.updated_at));
  });
}

function boot(){
  decorateOrderCards();
  const observer=new MutationObserver(()=>decorateOrderCards());
  observer.observe(document.body,{childList:true,subtree:true});

  let channel;
  (async()=>{
    const session=(await sb.auth.getSession()).data.session;
    if(!session)return;
    channel=sb.channel(`odo-order-tracking-${session.user.id}`)
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'orders',filter:`user_id=eq.${session.user.id}`},()=>decorateOrderCards())
      .subscribe();
  })();
  window.addEventListener('beforeunload',()=>{if(channel)sb.removeChannel(channel)});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
