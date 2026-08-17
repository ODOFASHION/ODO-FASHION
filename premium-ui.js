(function(){
  const style=document.createElement('style');
  style.textContent=`
    .odo-premium-tools{display:flex;align-items:center;gap:8px;margin-left:auto}
    .odo-icon-btn{width:42px;height:42px;border:1px solid rgba(201,164,94,.32);background:transparent;color:#f4f0e8;display:grid;place-items:center;cursor:pointer}
    .odo-icon-btn:hover{background:#f4f0e8;color:#080808}
    .odo-icon-btn svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
    .odo-search-modal{position:fixed;inset:0;z-index:500;background:rgba(5,5,4,.9);backdrop-filter:blur(14px);display:none;align-items:flex-start;justify-content:center;padding:90px 20px}
    .odo-search-modal.open{display:flex}
    .odo-search-card{width:min(760px,100%);background:#0d0d0b;border:1px solid rgba(201,164,94,.32);padding:28px;box-shadow:0 35px 100px rgba(0,0,0,.65)}
    .odo-search-head{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:16px}
    .odo-search-input{width:100%;height:54px;background:#070706;color:#f4f0e8;border:1px solid rgba(244,240,232,.14);padding:0 16px;font-size:15px;outline:none}
    .odo-search-results{display:grid;gap:8px;margin-top:16px;max-height:55vh;overflow:auto}
    .odo-search-result{display:grid;grid-template-columns:70px 1fr auto;gap:14px;align-items:center;padding:10px;border:1px solid rgba(244,240,232,.08);text-decoration:none;color:#f4f0e8}
    .odo-search-result:hover{border-color:rgba(201,164,94,.32);background:rgba(201,164,94,.04)}
    .odo-search-result img{width:70px;height:84px;object-fit:cover;background:#111}
    .odo-search-result small{display:block;color:#77736d;margin-top:5px}
    .odo-search-result strong{color:#c9a45e;white-space:nowrap}
    .odo-category-live{color:#c9a45e!important}
    .odo-trust-strip{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(244,240,232,.1);border-bottom:1px solid rgba(244,240,232,.1);margin:0 clamp(18px,6vw,90px)}
    .odo-trust-item{padding:22px 18px;text-align:center;border-right:1px solid rgba(244,240,232,.08)}
    .odo-trust-item:last-child{border-right:0}
    .odo-trust-item strong{display:block;font-size:10px;letter-spacing:.14em;text-transform:uppercase}
    .odo-trust-item span{display:block;margin-top:7px;color:#77736d;font-size:11px}
    @media(max-width:700px){.odo-premium-tools{gap:5px}.odo-icon-btn{width:38px;height:38px}.odo-trust-strip{grid-template-columns:1fr 1fr;margin:0 18px}.odo-trust-item{border-bottom:1px solid rgba(244,240,232,.08)}}
  `;
  document.head.appendChild(style);

  const ICONS={search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>', heart:'<svg viewBox="0 0 24 24"><path d="M20.8 8.8c0 5.5-8.8 10-8.8 10s-8.8-4.5-8.8-10A4.8 4.8 0 0 1 8 4a4.6 4.6 0 0 1 4 2.1A4.6 4.6 0 0 1 16 4a4.8 4.8 0 0 1 4.8 4.8Z"></path></svg>',user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"></circle><path d="M5.5 20c.9-3.4 3-5.1 6.5-5.1s5.6 1.7 6.5 5.1"></path></svg>'};
  function mountTools(){
    const nav=document.querySelector('.nav'); if(!nav||document.querySelector('.odo-premium-tools')) return;
    const tools=document.createElement('div');tools.className='odo-premium-tools';
    tools.innerHTML=`<button class="odo-icon-btn" id="odoSearchBtn" aria-label="Search">${ICONS.search}</button><button class="odo-icon-btn" id="odoSavedBtn" aria-label="Saved">${ICONS.heart}</button>`;
    nav.appendChild(tools);
    document.getElementById('odoSavedBtn')?.addEventListener('click',()=>document.querySelector('.save-button,.saved-button,#savedItems')?.scrollIntoView({behavior:'smooth'}));
    mountSearch();
  }
  function mountSearch(){
    if(document.getElementById('odoSearchModal')) return;
    const m=document.createElement('div');m.id='odoSearchModal';m.className='odo-search-modal';
    m.innerHTML=`<div class="odo-search-card"><div class="odo-search-head"><div><p class="eyebrow">ODO FASHION / SEARCH</p><h2 style="margin:5px 0 0">FIND YOUR <em style="color:#c9a45e;font-style:normal">PIECE.</em></h2></div><button class="odo-icon-btn" id="odoSearchClose">×</button></div><input id="odoSearchInput" class="odo-search-input" placeholder="Search T-shirts, hoodies, caps…" autocomplete="off"><div id="odoSearchResults" class="odo-search-results"></div></div>`;
    document.body.appendChild(m);
    const close=()=>m.classList.remove('open');document.getElementById('odoSearchBtn')?.addEventListener('click',()=>{m.classList.add('open');document.getElementById('odoSearchInput')?.focus();search('')});m.querySelector('#odoSearchClose').onclick=close;m.onclick=e=>{if(e.target===m)close()};document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});m.querySelector('#odoSearchInput').addEventListener('input',e=>search(e.target.value));
  }
  async function search(q){
    const out=document.getElementById('odoSearchResults'); if(!out)return;
    const cards=[...document.querySelectorAll('.product')];const term=q.trim().toLowerCase();
    const matches=cards.filter(c=>{const text=(c.innerText||'').toLowerCase();return !term||text.includes(term)}).slice(0,12);
    if(!matches.length){out.innerHTML='<div style="padding:28px;color:#77736d">No products found.</div>';return}
    out.innerHTML=matches.map(c=>{const a=c.querySelector('.product-photo');const name=c.querySelector('.product-meta h3')?.textContent?.trim()||'';const price=c.querySelector('.price')?.textContent?.trim()||'';const link=c.id?`#${c.id}`:'#streetwear';return `<a class="odo-search-result" href="${link}"><img src="${a?.src||''}" alt=""><div><strong>${name}</strong><small>Tap to view product</small></div><strong>${price}</strong></a>`}).join('');out.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>document.getElementById('odoSearchModal')?.classList.remove('open')))
  }
  function updateCopy(){
    const intro=document.querySelector('#streetwear .section-intro');if(intro)intro.textContent='First drop pieces, priced per product. Cash on Delivery available across Nepal.';
    const acc=[...document.querySelectorAll('.category-card')].find(x=>/ACCESSORIES/i.test(x.textContent||''));
    if(acc){acc.classList.add('odo-category-live');const b=acc.querySelector('b');if(b)b.textContent='EXPLORE CAPS →';acc.setAttribute('href','#streetwear');acc.style.cursor='pointer';}
  }
  function trust(){
    if(document.querySelector('.odo-trust-strip'))return;const strip=document.createElement('div');strip.className='odo-trust-strip';strip.innerHTML='<div class="odo-trust-item"><strong>COD ALL NEPAL</strong><span>Pay when your order arrives.</span></div><div class="odo-trust-item"><strong>LIVE STOCK</strong><span>Availability updates from ODO.</span></div><div class="odo-trust-item"><strong>CUSTOMER CARE</strong><span>WhatsApp support available.</span></div><div class="odo-trust-item"><strong>EASY SUPPORT</strong><span>Returns & exchanges for eligible orders.</span></div>';document.querySelector('#shop')?.insertAdjacentElement('afterend',strip)
  }
  function boot(){mountTools();updateCopy();trust()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  setTimeout(boot,1200);
})();
