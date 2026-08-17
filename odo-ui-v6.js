(() => {
  const SVG={
    cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 8H7"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>',
    heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 8.7c0 5.3-8.8 10.2-8.8 10.2S3.2 14 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.7 3.1-5.5 7-5.5s6.2 1.8 7 5.5"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-5 4v-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 12h7"/></svg>',
    whatsapp:'<svg viewBox="0 0 24 24"><path fill="#25D366" d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.7 21.5l5-1.2A9.4 9.4 0 1 0 12 2.5Z"/><path fill="#fff" d="M9.2 7.7c.2-.5.4-.6.8-.6h.6c.2 0 .4.1.5.4l.7 1.5c.1.2.1.4 0 .6l-.5.7c.8 1.4 1.8 2.3 3.2 2.9l.7-.5c.2-.1.4-.1.6 0l1.5.7c.3.1.4.3.4.5v.5c0 .5-.2.9-.7 1.1-.6.3-1.5.2-2.3-.1-2.4-.8-4.8-3-5.9-5.1-.4-.8-.6-1.9-.2-2.6Z"/></svg>',
    owl:'<svg viewBox="0 0 64 64" fill="none"><path d="M10 28 18 10l14 8 14-8 8 18-8 20-14 7-14-7-8-20Z" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="31" r="5" stroke="currentColor" stroke-width="3"/><circle cx="40" cy="31" r="5" stroke="currentColor" stroke-width="3"/><path d="m31 39 1 4 1-4M21 47h22" stroke="currentColor" stroke-width="3"/></svg>'
  };

  const css=()=>{
    if(document.getElementById('odo-v6-inline-style')) return;
    const s=document.createElement('style');s.id='odo-v6-inline-style';s.textContent=`
      body.odo-v6-ready .odo-v5-bar,body.odo-v6-ready .odo-v4-actions,body.odo-v6-ready .odo-top-actions{display:none!important}
      body.odo-v6-ready .nav > .cart-link,body.odo-v6-ready .nav .saved-link,body.odo-v6-ready .nav #odoSaveNav,body.odo-v6-ready .nav .odo-save-nav{display:none!important}
      body.odo-v6-ready .odo-v6-header{margin-left:auto;display:flex;align-items:center;gap:6px;position:relative;z-index:2000}
      .odo-v6-hbtn{height:42px;border:1px solid rgba(200,165,96,.34);background:#090908;color:#f5f1e8;display:flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;box-sizing:border-box;transition:.22s;border-radius:999px}
      .odo-v6-hbtn:hover{transform:translateY(-2px);border-color:#ead49a;box-shadow:0 8px 24px rgba(0,0,0,.28)}
      .odo-v6-hbtn svg{width:18px;height:18px}
      .odo-v6-account{padding:0 14px;font-size:.55rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
      .odo-v6-cart{padding:0 12px;font-size:.55rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
      .odo-v6-search,.odo-v6-saved{width:42px;padding:0}
      .odo-v6-count{min-width:18px;height:18px;border-radius:50%;background:#c8a560;color:#090909;display:grid;place-items:center;font-size:.48rem;font-weight:900}
      .odo-v6-float{position:fixed;right:18px;z-index:260;display:flex;align-items:center;justify-content:center;background:rgba(7,7,6,.95);color:#f5f1e8;border:1px solid rgba(200,165,96,.35);box-shadow:0 14px 40px rgba(0,0,0,.48);backdrop-filter:blur(14px);cursor:pointer;transition:.22s}
      .odo-v6-float:hover{transform:translateY(-2px);border-color:#ead49a}
      .odo-v6-wa{bottom:116px;width:38px;height:38px;border-radius:50%}.odo-v6-wa svg{width:19px;height:19px}
      .odo-v6-chat{bottom:66px;height:36px;padding:0 11px;border-radius:999px;gap:6px;font-size:.46rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.odo-v6-chat svg{width:16px;height:16px}
      .odo-v6-ai{bottom:18px;width:40px;height:40px;border-radius:50%;overflow:visible;animation:odoV6Pulse 2.8s ease-in-out infinite}.odo-v6-ai svg{width:24px;height:24px}
      .odo-v6-ai:before{content:"";position:absolute;inset:-4px;border:1px solid rgba(200,165,96,.22);border-radius:50%;animation:odoV6Ring 3s ease-out infinite}
      @keyframes odoV6Pulse{0%,100%{box-shadow:0 14px 40px rgba(0,0,0,.48),0 0 0 0 rgba(200,165,96,.06)}50%{box-shadow:0 16px 45px rgba(0,0,0,.53),0 0 0 7px rgba(200,165,96,.05)}}
      @keyframes odoV6Ring{0%{transform:scale(.88);opacity:.8}70%,100%{transform:scale(1.42);opacity:0}}
      body.odo-v6-ready .hero-symbol{opacity:1!important;display:flex!important;align-items:center!important;justify-content:center!important;min-height:430px!important;position:relative!important;z-index:4!important}
      body.odo-v6-ready .hero-symbol .hero-logo{width:min(360px,28vw)!important;max-height:none!important;filter:drop-shadow(0 25px 60px rgba(200,165,96,.16))!important;animation:odoV6Owl 5s ease-in-out infinite!important}
      body.odo-v6-ready .hero-symbol .tagline{color:#d6b56f!important;letter-spacing:.42em!important;animation:odoV6Tag 4.5s ease-in-out infinite!important}
      body.odo-v6-ready .hero-symbol:before,body.odo-v6-ready .hero-symbol:after{content:"";position:absolute;width:min(420px,33vw);height:min(420px,33vw);border-radius:50%;border:1px solid rgba(200,165,96,.14);pointer-events:none}
      body.odo-v6-ready .hero-symbol:before{animation:odoV6Orbit 16s linear infinite}
      body.odo-v6-ready .hero-symbol:after{width:min(300px,24vw);height:min(300px,24vw);border-style:dashed;opacity:.4;animation:odoV6OrbitReverse 11s linear infinite}
      @keyframes odoV6Owl{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.025)}}
      @keyframes odoV6Tag{0%,100%{opacity:.6;letter-spacing:.35em}50%{opacity:1;letter-spacing:.46em}}
      @keyframes odoV6Orbit{to{transform:rotate(360deg)}}@keyframes odoV6OrbitReverse{to{transform:rotate(-360deg)}}
      @media(max-width:900px){.odo-v6-account{width:42px;padding:0;font-size:0}.odo-v6-cart{width:42px;padding:0;font-size:0}.odo-v6-search,.odo-v6-saved{width:42px}.odo-v6-float{right:11px}.odo-v6-wa{bottom:105px}.odo-v6-chat{bottom:60px}.odo-v6-ai{bottom:15px}}
      @media(max-width:620px){.odo-v6-header{gap:4px}.odo-v6-hbtn{height:39px}.odo-v6-account,.odo-v6-cart,.odo-v6-search,.odo-v6-saved{width:39px}.odo-v6-float{right:9px}.odo-v6-wa{width:36px;height:36px;bottom:94px}.odo-v6-chat{height:34px;bottom:53px;padding:0 9px}.odo-v6-ai{width:38px;height:38px;bottom:10px}body.odo-v6-ready .hero-symbol{min-height:280px!important}body.odo-v6-ready .hero-symbol .hero-logo{width:230px!important}}
      @media(prefers-reduced-motion:reduce){.odo-v6-ai,.odo-v6-ai:before,body.odo-v6-ready .hero-symbol .hero-logo,body.odo-v6-ready .hero-symbol .tagline,body.odo-v6-ready .hero-symbol:before,body.odo-v6-ready .hero-symbol:after{animation:none!important}}
    `;document.head.appendChild(s);
  };

  const hideDuplicates=()=>{
    document.body.classList.add('odo-v6-ready');
    document.querySelectorAll('.odo-v5-bar,.odo-v4-actions,.odo-top-actions').forEach(e=>e.remove());
    document.querySelectorAll('.nav button,.nav a,.hero button,.hero a').forEach(e=>{
      if(e.closest('.odo-v6-header')||e.classList.contains('brand')||e.closest('nav')) return;
      const t=(e.textContent||'').replace(/\s+/g,' ').trim().toUpperCase();
      if(t==='SAVED'||/^CART\s*\d*$/.test(t)||t==='MY ACCOUNT'){e.style.display='none';e.setAttribute('aria-hidden','true')}
    });
    ['#cartOpen','#odoChatLauncher','.odo-chat-launcher','#odoAiLauncher','.odo-ai-launcher','#odoBetterAiLauncher','.odo-v4-float','.odo-v5-float'].forEach(sel=>document.querySelectorAll(sel).forEach(e=>{if(!e.closest('#cartPanel')){e.style.display='none';e.setAttribute('aria-hidden','true')}}));
  };

  const header=()=>{
    const nav=document.querySelector('.nav');if(!nav)return;
    nav.querySelectorAll('.odo-v6-header').forEach(e=>e.remove());
    hideDuplicates();
    const bar=document.createElement('div');bar.className='odo-v6-header';
    const b=(cls,html,label)=>{const x=document.createElement('button');x.className='odo-v6-hbtn '+cls;x.innerHTML=html;x.setAttribute('aria-label',label);return x};
    const account=b('odo-v6-account',SVG.user+'<span>MY ACCOUNT</span>','My account');
    const cart=b('odo-v6-cart',SVG.cart+'<span>CART</span><span class="odo-v6-count">'+(document.querySelector('#cartCount')?.textContent||'0')+'</span>','Cart');
    const search=b('odo-v6-search',SVG.search,'Search');
    const saved=b('odo-v6-saved',SVG.heart,'Saved');
    account.onclick=()=>document.querySelector('[data-account-open],#accountOpen,#odoAccountBtn')?.click();
    cart.onclick=()=>document.querySelector('#cartOpen')?.click();
    search.onclick=()=>window.dispatchEvent(new CustomEvent('odo:search'));
    saved.onclick=()=>document.querySelector('[data-save-open],#savedOpen,.saved-link')?.click();
    bar.append(account,cart,search,saved);nav.appendChild(bar);
  };

  const floating=()=>{
    document.querySelectorAll('.odo-v6-float').forEach(e=>e.remove());
    const wa=document.createElement('a');wa.className='odo-v6-float odo-v6-wa';wa.href='https://wa.me/9779845319200?text=Hi%20ODO%20Fashion!%20I%20need%20customer%20support.';wa.target='_blank';wa.rel='noopener';wa.innerHTML=SVG.whatsapp;wa.setAttribute('aria-label','WhatsApp ODO');
    const chat=document.createElement('button');chat.className='odo-v6-float odo-v6-chat';chat.innerHTML=SVG.chat+'<span>CUSTOMER MESSAGE</span>';chat.onclick=()=>document.querySelector('#odoChatLauncher')?.click()||window.dispatchEvent(new CustomEvent('odo:customer-message'));
    const ai=document.createElement('button');ai.className='odo-v6-float odo-v6-ai';ai.innerHTML=SVG.owl;ai.setAttribute('aria-label','ODO AI Assistant');ai.onclick=()=>document.querySelector('#odoAiLauncher')?.click()||window.dispatchEvent(new CustomEvent('odo:ai'));
    document.body.append(wa,chat,ai);
  };

  const boot=()=>{css();header();floating();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  setTimeout(boot,500);setTimeout(boot,1400);
  new MutationObserver(()=>{if(!document.querySelector('.odo-v6-header'))boot()}).observe(document.body,{childList:true,subtree:true});
})();
