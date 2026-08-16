import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const sb = createClient('https://gqlcxvukyezqpdftjdeo.supabase.co','sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8');

(() => {
  const esc = v => String(v ?? '').replace(/[&<>\"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const fmt = v => new Date(v).toLocaleString('en-NP');

  function styles(){
    if(document.getElementById('odoNotifStyles')) return;
    const s=document.createElement('style');
    s.id='odoNotifStyles';
    s.textContent=`
      .odo-notif-wrap{position:relative;display:inline-block;margin-right:8px}
      .odo-notif-btn{background:transparent;border:1px solid rgba(200,165,96,.38);color:#f5f1e8;padding:11px 14px;font-size:.58rem;letter-spacing:.12em;cursor:pointer}
      .odo-notif-btn .count{display:inline-flex;min-width:18px;height:18px;align-items:center;justify-content:center;border-radius:99px;background:#c8a560;color:#080807;font-size:.48rem;margin-left:6px}
      .odo-notif-panel{position:absolute;right:0;top:calc(100% + 10px);width:min(420px,calc(100vw - 32px));max-height:70vh;overflow:auto;background:#0b0b0a;border:1px solid rgba(200,165,96,.35);box-shadow:0 20px 60px rgba(0,0,0,.65);padding:16px;z-index:800;display:none}
      .odo-notif-panel.open{display:block}
      .odo-notif-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}
      .odo-notif-clear{background:none;border:0;color:#c8a560;font-size:.5rem;cursor:pointer;letter-spacing:.1em}
      .odo-notif-item{padding:12px 0;border-bottom:1px solid rgba(245,241,232,.08);cursor:pointer}
      .odo-notif-item.unread{border-left:2px solid #c8a560;padding-left:10px}
      .odo-notif-title{color:#f5f1e8;font-size:.62rem;font-weight:800}
      .odo-notif-message{color:#aaa;font-size:.58rem;line-height:1.6;margin-top:5px}
      .odo-notif-date{color:#77736c;font-size:.48rem;margin-top:6px}
    `;
    document.head.appendChild(s);
  }

  async function boot(){
    styles();
    const {data:{session}}=await sb.auth.getSession();
    if(!session) return;
    const {data:me}=await sb.from('profiles').select('is_admin').eq('id',session.user.id).maybeSingle();
    if(!me?.is_admin) return;

    const head=document.querySelector('.odo-admin-head>div:last-child');
    if(!head || document.getElementById('odoAdminNotifications')) return;

    const wrap=document.createElement('div');
    wrap.className='odo-notif-wrap';
    wrap.id='odoAdminNotifications';
    wrap.innerHTML=`<button class="odo-notif-btn" id="odoNotifBtn">NOTIFICATIONS <span class="count" id="odoNotifCount">0</span></button><div class="odo-notif-panel" id="odoNotifPanel"><div class="odo-notif-head"><strong>ADMIN NOTIFICATIONS.</strong><button class="odo-notif-clear" id="odoNotifReadAll">MARK ALL READ</button></div><div id="odoNotifList"></div></div>`;
    head.prepend(wrap);

    const btn=document.getElementById('odoNotifBtn');
    const panel=document.getElementById('odoNotifPanel');
    btn.onclick=()=>{panel.classList.toggle('open');if(panel.classList.contains('open'))load(true)};
    document.addEventListener('click',e=>{if(!wrap.contains(e.target))panel.classList.remove('open')});
    document.getElementById('odoNotifReadAll').onclick=async()=>{
      await sb.from('notifications').update({read:true}).is('user_id',null).eq('read',false);
      load(true);
    };

    async function load(open=false){
      const {data,error}=await sb.from('notifications').select('id,title,message,read,created_at').is('user_id',null).order('created_at',{ascending:false}).limit(50);
      if(error){console.warn('ODO notifications:',error.message);return}
      const unread=(data||[]).filter(n=>!n.read).length;
      document.getElementById('odoNotifCount').textContent=unread;
      document.getElementById('odoNotifCount').style.display=unread?'inline-flex':'none';
      document.getElementById('odoNotifList').innerHTML=(data||[]).map(n=>`<div class="odo-notif-item ${n.read?'':'unread'}" data-notif="${n.id}"><div class="odo-notif-title">${esc(n.title)}</div><div class="odo-notif-message">${esc(n.message)}</div><div class="odo-notif-date">${fmt(n.created_at)}</div></div>`).join('') || '<div class="odo-notif-message">No notifications yet.</div>';
      document.querySelectorAll('[data-notif]').forEach(item=>item.onclick=async()=>{await sb.from('notifications').update({read:true}).eq('id',item.dataset.notif).is('user_id',null);load(true)});
      if(open) panel.classList.add('open');
    }

    await load();
    sb.channel('odo-admin-notifications')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications'},payload=>{
        if(payload.new?.user_id!==null) return;
        load();
        panel.classList.add('open');
      }).subscribe();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
