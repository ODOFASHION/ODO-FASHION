import './live-commerce-fix.js?v=1';
(() => {
  const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const icons = {
    search: icon('<circle cx="11" cy="11" r="6.8"/><path d="m16.2 16.2 4.2 4.2"/>'),
    user: icon('<circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.8-3.1 3-4.8 6.5-4.8s5.7 1.7 6.5 4.8"/>'),
    heart: icon('<path d="M20.8 8.7c0 5.2-8.8 10.2-8.8 10.2S3.2 13.9 3.2 8.7A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.6Z"/>'),
    cart: icon('<path d="M4 5h2l1.6 9.2a2 2 0 0 0 2 1.7h7.3a2 2 0 0 0 1.9-1.4L21 8H7"/><circle cx="10" cy="19" r="1"/><circle cx="18" cy="19" r="1"/>'),
    message: icon('<path d="M4 5.5h16v10H9l-5 4v-14Z"/><path d="M8 9h8M8 12h5"/>'),
    whatsapp: icon('<path d="M12 21a9 9 0 1 0-7.7-4.35L3 21l4.5-1.25A8.9 8.9 0 0 0 12 21Z"/><path d="M9.2 8.1c.2-.4.45-.4.7-.4h.5c.2 0 .35.1.45.35l.65 1.55c.1.25.05.45-.1.65l-.45.55c-.15.18-.18.32-.03.57.5.88 1.15 1.55 2.05 2.04.25.14.4.12.56-.03l.55-.5c.18-.16.38-.2.62-.1l1.45.68c.28.13.4.3.36.55-.06.48-.28.9-.67 1.18-.34.25-.8.38-1.3.3-2-.3-4.2-1.65-5.55-3.25-.9-1.08-1.55-2.3-1.75-3.2-.12-.56-.04-1.03.2-1.36Z"/>')
  };
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>\"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

  function cleanOldControls() {
    const nav = $('.nav'); if (!nav) return;
    nav.querySelectorAll('[id*="search" i],[class*="search" i],[id*="save" i],[class*="save" i]').forEach(el => {
      if (!el.closest('.nav')) return;
      if (!el.matches('.odo-final-action') && !el.closest('.odo-final-actions')) el.style.display = 'none';
    });
    document.querySelectorAll('.hero > button,.hero > [id*="search" i],.hero > [id*="save" i]').forEach(el => el.style.display='none');
  }

  function buildHeader() {
    const nav=$('.nav'); if(!nav || $('#odoFinalActions')) return;
    const actions=document.createElement('div'); actions.id='odoFinalActions'; actions.className='odo-final-actions';
    const account=document.createElement('button'); account.className='odo-final-action'; account.innerHTML=icons.user; account.title='My Account'; account.onclick=()=>$('#odoAccountBtn')?.click();
    const cart=document.createElement('button'); cart.className='odo-final-action odo-final-cart'; cart.innerHTML=`${icons.cart}<span>CART</span><b class="odo-final-count" id="odoFinalCartCount">0</b>`; cart.onclick=()=>$('#cartOpen')?.click();
    const search=document.createElement('button'); search.className='odo-final-action'; search.innerHTML=icons.search; search.title='Search ODO'; search.onclick=openSearch;
    const saved=document.createElement('button'); saved.className='odo-final-action odo-final-saved'; saved.innerHTML=`${icons.heart}<span>SAVED</span>`; saved.onclick=()=>{ const t=$('#odoSaveNav')||$('.saved-link')||document.querySelector('[id*="save" i]'); t?.click(); };
    actions.append(account,cart,search,saved); nav.appendChild(actions); syncCount();
  }

  function syncCount(){ const n=$('#cartCount'), c=$('#odoFinalCartCount'); if(n&&c)c.textContent=n.textContent||'0'; }

  function openSearch(){
    let box=$('#odoFinalSearch');
    if(!box){
      box=document.createElement('div'); box.id='odoFinalSearch'; box.className='odo-final-search';
      box.innerHTML=`<div class="odo-final-search-card"><div class="odo-final-search-row"><input id="odoFinalSearchInput" class="odo-final-search-input" placeholder="Search ODO products…" autocomplete="off"><button class="odo-final-search-close" aria-label="Close">×</button></div><div id="odoFinalResults" class="odo-final-results"></div></div>`;
      document.body.appendChild(box);
      box.onclick=e=>{if(e.target===box)box.classList.remove('open')};
      box.querySelector('.odo-final-search-close').onclick=()=>box.classList.remove('open');
      box.querySelector('input').oninput=renderResults;
    }
    box.classList.add('open'); box.querySelector('input').focus(); renderResults();
  }

  function renderResults(){
    const q=String($('#odoFinalSearchInput')?.value||'').toLowerCase().trim(); const out=$('#odoFinalResults'); if(!out)return;
    const products=[...document.querySelectorAll('.product')].map(card=>({card,name:card.querySelector('.product-meta h3')?.textContent?.trim()||'',price:card.querySelector('.price')?.textContent?.trim()||''}));
    const hits=products.filter(p=>!q || p.name.toLowerCase().includes(q));
    out.innerHTML=hits.slice(0,12).map((p,i)=>`<button class="odo-final-result" data-i="${i}"><span>${esc(p.name)}</span><small>${esc(p.price)}</small></button>`).join('') || `<div class="odo-final-result"><span>No products found.</span></div>`;
    [...out.querySelectorAll('button')].forEach((b,i)=>b.onclick=()=>{hits[i]?.card.scrollIntoView({behavior:'smooth',block:'center'});$('#odoFinalSearch').classList.remove('open');});
  }

  function buildHeroFrame(){
    const heroSymbol=$('.hero-symbol'); if(!heroSymbol || $('#odoHeroFrame')) return;
    const logo=heroSymbol.querySelector('.hero-logo');
    const frame=document.createElement('div'); frame.id='odoHeroFrame'; frame.className='odo-hero-frame';
    if(logo){frame.appendChild(logo.cloneNode(true)); logo.remove();}
    frame.insertAdjacentHTML('beforeend','<div class="odo-hero-meta"><span><strong>001</strong> / ODO DROP</span><span>MADE IN NEPAL</span></div>');
    heroSymbol.prepend(frame);
    const tag=heroSymbol.querySelector('.tagline'); if(tag)tag.className='odo-hero-badge';
  }

  function buildDock(){
    if($('#odoFinalDock')) return;
    const dock=document.createElement('div'); dock.id='odoFinalDock'; dock.className='odo-final-dock';
    const wa=document.createElement('a'); wa.className='odo-final-float odo-final-wa'; wa.href='https://wa.me/9779845319200?text=Hi%20ODO%20Fashion!%20I%20need%20customer%20support.'; wa.target='_blank'; wa.rel='noopener'; wa.innerHTML=`<span class="odo-final-icon">${icons.whatsapp}</span><span>WhatsApp</span>`;
    const msg=document.createElement('button'); msg.className='odo-final-float'; msg.innerHTML=`<span class="odo-final-icon">${icons.message}</span><span>Customer Message</span>`; msg.onclick=()=>$('#odoChatLauncher')?.click();
    const ai=document.createElement('button'); ai.className='odo-final-float odo-final-ai'; ai.setAttribute('aria-label','ODO AI'); ai.innerHTML='<span class="odo-final-icon"><img src="assets/odo-logo.png" alt="ODO AI"></span>'; ai.onclick=()=>$('#odoBetterAiLauncher')?.click()||$('#odoAiLauncher')?.click();
    dock.append(wa,msg,ai); document.body.appendChild(dock);
  }

  function boot(){
    cleanOldControls(); buildHeader(); buildHeroFrame(); buildDock();
    setTimeout(syncCount,400); setTimeout(syncCount,1200);
    new MutationObserver(()=>{cleanOldControls();syncCount()}).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
