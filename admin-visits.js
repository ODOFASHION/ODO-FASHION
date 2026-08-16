import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  'https://gqlcxvukyezqpdftjdeo.supabase.co',
  'sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8'
);

const esc = (v) => String(v ?? '').replace(/[&<>\"]/g, (m) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[m]));
const fmt = (v) => new Date(v).toLocaleString('en-NP');

const style = document.createElement('style');
style.textContent = `
.odo-traffic-section{margin:35px 0 50px}.odo-traffic-head{display:flex;justify-content:space-between;gap:20px;align-items:end;margin-bottom:16px}.odo-traffic-head h2{font-size:3rem;margin:0}.odo-traffic-head p{color:#77736c;max-width:500px;font-size:.7rem;line-height:1.6}.traffic-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px}.traffic-stat{border:1px solid rgba(200,165,96,.2);padding:18px;background:#0d0d0c}.traffic-stat span{display:block;color:#77736c;font-size:.5rem;letter-spacing:.14em;text-transform:uppercase}.traffic-stat strong{display:block;color:#e5c982;font-size:1.6rem;margin-top:7px}.traffic-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}.traffic-card{border:1px solid rgba(245,241,232,.1);padding:20px;background:#0d0d0c}.traffic-card h3{margin:0 0 14px;font-size:1rem}.traffic-list{display:grid;gap:8px;max-height:310px;overflow:auto}.traffic-row{display:flex;justify-content:space-between;gap:14px;border-top:1px solid rgba(245,241,232,.07);padding-top:9px;color:#aaa;font-size:.61rem}.traffic-row strong{color:#f5f1e8}.traffic-row span{color:#77736c;text-align:right}.traffic-table-wrap{overflow:auto;border:1px solid rgba(245,241,232,.1)}.traffic-table{width:100%;border-collapse:collapse;min-width:1200px}.traffic-table th,.traffic-table td{padding:12px;border-bottom:1px solid rgba(245,241,232,.07);text-align:left;font-size:.6rem}.traffic-table th{color:#c8a560;font-size:.48rem;letter-spacing:.13em}.traffic-table td{color:#aaa;vertical-align:top}.traffic-note{color:#77736c;font-size:.58rem;line-height:1.7;margin-top:10px}@media(max-width:900px){.traffic-stats{grid-template-columns:repeat(2,1fr)}.traffic-grid{grid-template-columns:1fr}}@media(max-width:520px){.traffic-stats{grid-template-columns:1fr}.odo-traffic-head{align-items:flex-start;flex-direction:column}}
`;
document.head.appendChild(style);

async function bootTraffic(){
  const {data:{session}} = await supabase.auth.getSession();
  if(!session) return;
  const {data:me} = await supabase.from('profiles').select('is_admin').eq('id',session.user.id).maybeSingle();
  if(!me?.is_admin) return;

  const main = document.querySelector('.odo-admin-main');
  if(!main || document.getElementById('odoTrafficSection')) return;

  const section = document.createElement('section');
  section.id='odoTrafficSection';
  section.className='odo-traffic-section';
  section.innerHTML=`
    <div class="odo-traffic-head">
      <div><p class="eyebrow">WEBSITE ANALYTICS</p><h2>VISITORS.</h2></div>
      <p>Account-linked orders remain separate. This section shows anonymous and signed-in site traffic: visit count, page views, traffic source/referrer, device, browser, and landing page. Exact physical location is not collected by this browser-only tracker.</p>
    </div>
    <div class="traffic-stats" id="trafficStats"></div>
    <div class="traffic-grid">
      <div class="traffic-card"><p class="eyebrow">TRAFFIC SOURCES</p><h3>WHERE PEOPLE CAME FROM.</h3><div id="trafficSources" class="traffic-list"></div></div>
      <div class="traffic-card"><p class="eyebrow">POPULAR PAGES</p><h3>WHAT PEOPLE VIEWED.</h3><div id="trafficPages" class="traffic-list"></div></div>
      <div class="traffic-card"><p class="eyebrow">DEVICES</p><h3>PHONE / DESKTOP / TABLET.</h3><div id="trafficDevices" class="traffic-list"></div></div>
      <div class="traffic-card"><p class="eyebrow">BROWSERS</p><h3>BROWSER MIX.</h3><div id="trafficBrowsers" class="traffic-list"></div></div>
    </div>
    <div class="traffic-table-wrap"><table class="traffic-table"><thead><tr><th>TIME</th><th>SOURCE</th><th>REFERRER</th><th>PAGE</th><th>LANDING</th><th>DEVICE</th><th>BROWSER</th><th>SESSION</th><th>VISIT #</th></tr></thead><tbody id="trafficRows"></tbody></table></div>
    <p class="traffic-note">Privacy-safe by design: this tracker uses a random browser visitor/session ID and does not collect names, GPS location, or IP address. Exact city/country requires a server-side analytics service and should be added only with an appropriate privacy notice.</p>
  `;
  main.prepend(section);
  await refreshTraffic();
}

async function refreshTraffic(){
  const {data:rows,error} = await supabase.from('site_visits').select('id,user_id,page_path,page_title,referrer,source,medium,campaign,landing_path,device_type,browser,os,language,screen_width,screen_height,visit_number,created_at,session_id').order('created_at',{ascending:false}).limit(1000);
  if(error){
    document.getElementById('trafficRows').innerHTML=`<tr><td colspan="9">Visitor analytics table is not ready yet. Run visit-tracking.sql in Supabase.</td></tr>`;
    return;
  }
  const visits=rows||[];
  const uniqueSessions=new Set(visits.map(v=>v.session_id)).size;
  const uniqueVisitors=new Set(visits.map(v=>v.visitor_id)).size;
  const todayStart=new Date();todayStart.setHours(0,0,0,0);
  const today=visits.filter(v=>new Date(v.created_at)>=todayStart).length;
  document.getElementById('trafficStats').innerHTML=[['TOTAL VISITS',visits.length],['UNIQUE VISITORS',uniqueVisitors],['SESSIONS',uniqueSessions],['TODAY',today],['AVG VIEWS / SESSION',uniqueSessions?(visits.length/uniqueSessions).toFixed(1):'0']].map(([k,v])=>`<div class="traffic-stat"><span>${k}</span><strong>${v}</strong></div>`).join('');
  const aggregate=(field)=>{const m={};visits.forEach(v=>{const k=v[field]||'unknown';m[k]=(m[k]||0)+1});return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,12)};
  const renderList=(id,list)=>document.getElementById(id).innerHTML=list.length?list.map(([k,v])=>`<div class="traffic-row"><strong>${esc(k)}</strong><span>${v}</span></div>`).join(''):`<div class="traffic-row"><span>No data yet.</span></div>`;
  renderList('trafficSources',aggregate('source'));
  renderList('trafficPages',aggregate('page_path'));
  renderList('trafficDevices',aggregate('device_type'));
  renderList('trafficBrowsers',aggregate('browser'));
  document.getElementById('trafficRows').innerHTML=visits.length?visits.map(v=>`<tr><td>${fmt(v.created_at)}</td><td><strong>${esc(v.source||'direct')}</strong><br>${esc(v.medium||'')}</td><td>${esc(v.referrer||'direct / none')}</td><td>${esc(v.page_path)}</td><td>${esc(v.landing_path)}</td><td>${esc(v.device_type)}<br>${esc(v.os||'')}</td><td>${esc(v.browser)}<br>${esc(v.language||'')}</td><td>${esc(String(v.session_id).slice(0,10))}…</td><td>${v.visit_number||1}</td></tr>`).join(''):`<tr><td colspan="9">No visits yet.</td></tr>`;
}

bootTraffic();
