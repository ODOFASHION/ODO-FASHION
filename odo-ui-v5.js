(() => {
  const SVG = {
    cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 8H7"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>',
    heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 8.7c0 5.3-8.8 10.2-8.8 10.2S3.2 14 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.6"/><path d="m16 16 5 5"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.7 3.1-5.5 7-5.5s6.2 1.8 7 5.5"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-5 4v-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 12h7"/></svg>',
    whatsapp:'<svg viewBox="0 0 24 24"><path fill="#25D366" d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.7 21.5l5-1.2A9.4 9.4 0 1 0 12 2.5Z"/><path fill="#fff" d="M9.2 7.7c.2-.5.4-.6.8-.6h.6c.2 0 .4.1.5.4l.7 1.5c.1.2.1.4 0 .6l-.5.7c.8 1.4 1.8 2.3 3.2 2.9l.7-.5c.2-.1.4-.1.6 0l1.5.7c.3.1.4.3.4.5v.5c0 .5-.2.9-.7 1.1-.6.3-1.5.2-2.3-.1-2.4-.8-4.8-3-5.9-5.1-.4-.8-.6-1.9-.2-2.6Z"/></svg>',
    owl:'<svg viewBox="0 0 64 64" fill="none"><path d="M10 28 18 10l14 8 14-8 8 18-8 20-14 7-14-7-8-20Z" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="31" r="5" stroke="currentColor" stroke-width="3"/><circle cx="40" cy="31" r="5" stroke="currentColor" stroke-width="3"/><path d="m31 39 1 4 1-4M21 47h22" stroke="currentColor" stroke-width="3"/></svg>'
  };

  function css(){
    if(document.getElementById('odo-v5-style')) return;
    const s=document.createElement('style'); s.id='odo-v5-style'; s.textContent=`
      .odo-v5-bar{display:flex;align-items:center;gap:7px;margin-left:auto!important;flex:0 0 auto;position:relative;z-index:1000}
      .odo-v5-btn{height:42px;border:1px solid rgba(200,165,96,.34);background:#0a0a09;color:#f5f1e8;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;transition:transform .2s,border-color .2s,background .2s;box-shadow:0 8px 25px rgba(0,0,0,.2)}
      .odo-v5-btn:hover{transform:translateY(-2px);border-color:#e5c982;background:#11110f}
      .odo-v5-icon{width:42px;border-radius:50%}.odo-v5-icon svg{width:20px;height:20px}
      .odo-v5-cart{padding:0 13px;border-radius:999px;font-size:.55rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.odo-v5-cart svg{width:18px;height:18px}
      .odo-v5-account{padding:0 14px;border-radius:999px;font-size:.55rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.odo-v5-account svg{width:18px;height:18px}
      .odo-v5-saved{padding:0 12px;border-radius:999px;font-size:.55rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.odo-v5-saved svg{width:18px;height:18px}
      .odo-v5-count{min-width:19px;height:19px;border-radius:50%;background:#c8a560;color:#080808;display:grid;place-items:center;font-size:.5rem}
      /* Hide every legacy cart/saved control outside our single v5 bar. */
      body.odo-v5-ready .nav > .cart-link{display:none!important}
      body.odo-v5-ready .nav .saved-link,body.odo-v5-ready .nav #odoSaveNav,body.odo-v5-ready .nav .odo-save-nav{display:none!important}
      body.odo-v5-ready .odo-v4-actions,body.odo-v5-ready .odo-top-actions{display:none!important}
      body.odo-v5-ready .hero > .cart-link,body.odo-v5-ready main > .cart-link{display:none!important}
      body.odo-v5-ready .odo-v4-chat,body.odo-v5-ready .odo-v4-wa,body.odo-v5-ready .odo-v4-ai,body.odo-v5-ready .odo-v4-chat-panel{display:none!important}
      .odo-v5-float{position:fixed;right:18px;z-index:250;display:flex;align-items:center;justify-content:center;border:1px solid rgba(200,165,96,.42);background:rgba(8,8,7,.95);color:#f5f1e8;box-shadow:0 12px 35px rgba(0,0,0,.45);backdrop-filter:blur(14px);cursor:pointer;transition:transform .2s,border-color .2s}
      .odo-v5-float:hover{transform:translateY(-3px);border-color:#e5c982}.odo-v5-float svg{width:20px;height:20px}
      .odo-v5-wa{bottom:156px;width:48px;height:48px;border-radius:50%}.odo-v5-chat{bottom:98px;height:42px;padding:0 13px;border-radius:999px;gap:7px;font-size:.52rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.odo-v5-ai{bottom:20px;width:48px;height:48px;border-radius:50%;animation:odoV5Pulse 2.8s ease-in-out infinite}.odo-v5-ai svg{width:22px;height:22px}
      @keyframes odoV5Pulse{0%,100%{box-shadow:0 12px 35px rgba(0,0,0,.45),0 0 0 0 rgba(200,165,96,.12)}50%{box-shadow:0 14px 40px rgba(0,0,0,.52),0 0 0 7px rgba(200,165,96,.05)}}
      @media(max-width:900px){.odo-v5-bar{gap:5px}.odo-v5-account{padding:0 10px}.odo-v5-account span{display:none}.odo-v5-account{width:42px;border-radius:50%}.odo-v5-cart span.label,.odo-v5-saved span.label{display:none}.odo-v5-cart,.odo-v5-saved{width:42px;padding:0;border-radius:50%}.odo-v5-float{right:12px}.odo-v5-wa{bottom:148px}.odo-v5-chat{bottom:91px}.odo-v5-ai{bottom:12px}}
      @media(max-width:620px){.odo-v5-bar{margin-left:auto}.odo-v5-float{right:10px}.odo-v5-chat{font-size:.47rem;padding:0 10px;height:38px}.odo-v5-wa{width:44px;height:44px;bottom:136px}.odo-v5-chat{bottom:82px}.odo-v5-ai{width:44px;height:44px}}
    `; document.head.appendChild(s);
  }

  function hideLegacy(){
    const selectors=['#cartOpen','.cart-link','.saved-link','#odoSaveNav','.odo-save-nav','.odo-v4-actions','.odo-top-actions','#odoChatLauncher','.odo-chat-launcher','#odoAiLauncher','.odo-ai-launcher','#odoV4Chat','#odoV4WA','#odoV4AI','#odoV4ChatPanel'];
    selectors.forEach(sel=>document.querySelectorAll(sel).forEach(el=>{
      if(!el.closest('#cartPanel')){el.style.display='none';el.setAttribute('aria-hidden','true');}
    }));
    document.querySelectorAll('button,a').forEach(el=>{
      if(el.dataset.odoV5Keep) return;
      if(el.closest('#cartPanel')) return;
      const t=(el.textContent||'').replace(/\s+/g,' ').trim().toUpperCase();
      if(/^SAVED$/.test(t)||/^CART\s*\d*$/.test(t)){
        el.style.display='none'; el.setAttribute('aria-hidden','true');
      }
    });
  }

  function header(){
    const nav=document.querySelector('.nav'); if(!nav) return;
    nav.querySelectorAll('.odo-v5-bar').forEach(x=>x.remove());
    hideLegacy();
    const bar=document.createElement('div');bar.className='odo-v5-bar';
    const mk=(cls,html,label)=>{const b=document.createElement('button');b.className='odo-v5-btn '+cls;b.innerHTML=html;b.setAttribute('aria-label',label);b.dataset.odoV5Keep='1';return b};
    const account=mk('odo-v5-account',SVG.user+'<span>MY ACCOUNT</span>','My account');
    const cart=mk('odo-v5-cart',SVG.cart+'<span class="label">CART</span><span class="odo-v5-count">0</span>','Cart');
    const search=mk('odo-v5-icon',SVG.search,'Search');
    const saved=mk('odo-v5-saved',SVG.heart+'<span class="label">SAVED</span>','Saved items');
    account.onclick=()=>document.querySelector('[data-account-open],#accountOpen,#odoAccountBtn')?.click();
    cart.onclick=()=>document.querySelector('#cartOpen')?.click() || document.body.classList.add('cart-open');
    search.onclick=()=>window.dispatchEvent(new CustomEvent('odo:search'));
    saved.onclick=()=>document.querySelector('[data-save-open],#savedOpen,.saved-link')?.click();
    bar.append(account,cart,search,saved);nav.appendChild(bar);
  }

  function floats(){
    ['.odo-v5-float'].forEach(sel=>document.querySelectorAll(sel).forEach(e=>e.remove()));
    const wa=document.createElement('a');wa.className='odo-v5-float odo-v5-wa';wa.href='https://wa.me/9779845319200?text=Hi%20ODO%20Fashion!%20I%20need%20customer%20support.';wa.target='_blank';wa.rel='noopener';wa.innerHTML=SVG.whatsapp;wa.setAttribute('aria-label','WhatsApp ODO');wa.dataset.odoV5Keep='1';
    const chat=document.createElement('button');chat.className='odo-v5-float odo-v5-chat';chat.innerHTML=SVG.chat+'<span>CUSTOMER MESSAGE</span>';chat.dataset.odoV5Keep='1';chat.onclick=()=>document.querySelector('#odoChatLauncher')?.click() || window.dispatchEvent(new CustomEvent('odo:customer-message'));
    const ai=document.createElement('button');ai.className='odo-v5-float odo-v5-ai';ai.innerHTML=SVG.owl;ai.dataset.odoV5Keep='1';ai.setAttribute('aria-label','ODO AI');ai.onclick=()=>document.querySelector('#odoAiLauncher')?.click() || window.dispatchEvent(new CustomEvent('odo:ai'));
    document.body.append(wa,chat,ai);
  }

  function count(){
    const n=document.querySelector('#cartCount'); const v=document.querySelector('.odo-v5-count'); if(v) v.textContent=(n?.textContent||'0').trim();
  }

  function boot(){css();document.body.classList.add('odo-v5-ready');header();floats();count();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
  setTimeout(boot,700); setTimeout(boot,1800); setInterval(()=>{hideLegacy();count()},1500);
})();