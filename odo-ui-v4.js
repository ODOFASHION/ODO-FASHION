(() => {
  const ready = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn();

  const style = () => {
    if (document.getElementById('odo-v4-style')) return;
    const s = document.createElement('style');
    s.id = 'odo-v4-style';
    s.textContent = `
      :root{--odo-gold:#c8a560;--odo-gold2:#ead49a;--odo-cream:#f5f1e8}
      .odo-v4-actions{display:flex;align-items:center;gap:8px;margin-left:auto}
      .odo-v4-icon{width:44px;height:44px;border:1px solid rgba(200,165,96,.35);background:rgba(9,9,8,.88);color:var(--odo-cream);display:grid;place-items:center;cursor:pointer;transition:.25s;box-shadow:0 8px 30px rgba(0,0,0,.24)}
      .odo-v4-icon:hover{transform:translateY(-2px);border-color:var(--odo-gold2);color:var(--odo-gold2)}
      .odo-v4-cart{display:flex;align-items:center;gap:8px;padding:0 15px;border-radius:999px;font-size:.56rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
      .odo-v4-badge{min-width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--odo-gold);color:#080808;font-size:.5rem}
      .odo-v4-saved{border-radius:999px;font-size:.56rem;letter-spacing:.12em;text-transform:uppercase;padding:0 13px}
      .odo-v4-account{border-radius:999px;padding:0 18px;font-size:.56rem;letter-spacing:.12em;text-transform:uppercase}
      .odo-v4-mobile{display:none}
      @media(max-width:900px){
        .nav nav{display:none!important}.odo-v4-mobile{display:grid;place-items:center}.odo-v4-actions{gap:6px}.odo-v4-account{padding:0 12px}.odo-v4-saved{width:44px;padding:0;font-size:0}.odo-v4-saved svg{margin:0}.odo-v4-cart{padding:0 11px}
      }
      @media(max-width:620px){.odo-v4-account{display:none}.odo-v4-actions{margin-left:auto}.odo-v4-icon{width:42px;height:42px}}
      .odo-v4-trust{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}.odo-v4-trust span{display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border:1px solid rgba(200,165,96,.22);background:rgba(17,17,15,.72);font-size:.5rem;letter-spacing:.08em;color:#c9c3b7;border-radius:999px}
      .odo-v4-float{position:fixed;z-index:240;display:flex;align-items:center;gap:8px;border:1px solid rgba(200,165,96,.45);background:rgba(10,10,9,.96);color:var(--odo-cream);box-shadow:0 16px 50px rgba(0,0,0,.5);backdrop-filter:blur(15px);transition:.25s;cursor:pointer}
      .odo-v4-float:hover{transform:translateY(-3px);border-color:var(--odo-gold2)}
      .odo-v4-chat{right:24px;bottom:102px;padding:10px 15px;border-radius:999px;font-size:.56rem;letter-spacing:.09em;text-transform:uppercase}.odo-v4-wa{right:24px;bottom:164px;width:52px;height:52px;border-radius:50%;justify-content:center}.odo-v4-ai{right:24px;bottom:24px;width:60px;height:60px;border-radius:50%;justify-content:center;animation:odoPulse 2.5s ease-in-out infinite}
      .odo-v4-wa svg{width:24px;height:24px}.odo-v4-ai svg{width:27px;height:27px}
      @keyframes odoPulse{0%,100%{box-shadow:0 16px 50px rgba(0,0,0,.5),0 0 0 0 rgba(200,165,96,.18)}50%{box-shadow:0 18px 55px rgba(0,0,0,.56),0 0 0 9px rgba(200,165,96,.08)}}
      .odo-v4-dot-field{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}.odo-v4-dot{position:absolute;width:3px;height:3px;background:var(--odo-gold);opacity:.45;border-radius:50%;animation:odoFloat 12s linear infinite}.odo-v4-dot:nth-child(3n){opacity:.22;transform:scale(.7)}
      @keyframes odoFloat{from{transform:translate3d(0,115vh,0)}to{transform:translate3d(20px,-10vh,0)}}
      .odo-v4-reveal{opacity:0;transform:translateY(22px);transition:opacity .75s ease,transform .75s ease}.odo-v4-reveal.odo-visible{opacity:1;transform:none}
      .odo-v4-chat-panel{position:fixed;right:24px;bottom:225px;width:min(380px,calc(100vw - 28px));height:520px;background:#0b0b0a;border:1px solid rgba(200,165,96,.38);z-index:241;display:none;flex-direction:column;box-shadow:0 25px 90px rgba(0,0,0,.65);border-radius:18px;overflow:hidden}.odo-v4-chat-panel.open{display:flex}.odo-v4-chat-head{padding:16px 18px;border-bottom:1px solid rgba(245,241,232,.09);display:flex;justify-content:space-between;align-items:center}.odo-v4-chat-head strong{font-family:'Space Grotesk',sans-serif}.odo-v4-chat-close{border:0;background:none;color:#aaa;font-size:1.35rem;cursor:pointer}.odo-v4-chat-body{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:10px}.odo-v4-msg{max-width:86%;padding:10px 12px;font-size:.68rem;line-height:1.6}.odo-v4-msg.bot{align-self:flex-start;background:#171715;color:#ddd;border-radius:4px 14px 14px 14px}.odo-v4-msg.user{align-self:flex-end;background:var(--odo-cream);color:#090909;border-radius:14px 4px 14px 14px}.odo-v4-quick{padding:0 14px 9px;display:flex;gap:6px;flex-wrap:wrap}.odo-v4-quick button{border:1px solid rgba(200,165,96,.26);background:#10100f;color:#d9c78f;padding:7px 9px;font-size:.5rem;cursor:pointer;border-radius:999px}.odo-v4-chat-form{display:flex;gap:7px;padding:11px;border-top:1px solid rgba(245,241,232,.09)}.odo-v4-chat-form input{flex:1;background:#080808;color:#fff;border:1px solid rgba(245,241,232,.12);padding:10px;border-radius:10px;font-size:.67rem}.odo-v4-chat-form button{border:0;background:var(--odo-gold);color:#090909;font-weight:900;padding:0 13px;border-radius:10px}
      .odo-v4-order-note{font-size:.62rem;color:#77736c;margin-top:8px}.odo-v4-price-fix{font-weight:800;color:var(--odo-gold2)}
      @media(max-width:620px){.odo-v4-chat{right:12px;bottom:88px}.odo-v4-wa{right:12px;bottom:150px}.odo-v4-ai{right:12px;bottom:12px}.odo-v4-chat-panel{right:12px;bottom:206px;width:calc(100vw - 24px);height:540px}}
      @media(prefers-reduced-motion:reduce){.odo-v4-dot,.odo-v4-ai{animation:none!important}.odo-v4-reveal{transition:none}}
    `;
    document.head.appendChild(s);
  };

  const svg = {
    search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 5 5"></path></svg>`,
    heart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20.8 8.7c0 5.3-8.8 10.2-8.8 10.2S3.2 14 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z"></path></svg>`,
    cart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 8H7"></path><circle cx="10" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle></svg>`,
    user:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c.8-3.7 3.1-5.5 7-5.5s6.2 1.8 7 5.5"></path></svg>`,
    chat:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-5 4v-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"></path><path d="M7 9h10M7 12h7"></path></svg>`,
    whatsapp:`<svg viewBox="0 0 24 24"><path fill="#25D366" d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.7 21.5l5-1.2A9.4 9.4 0 1 0 12 2.5Z"></path><path fill="#fff" d="M9.2 7.7c.2-.5.4-.6.8-.6h.6c.2 0 .4.1.5.4l.7 1.5c.1.2.1.4 0 .6l-.5.7c.8 1.4 1.8 2.3 3.2 2.9l.7-.5c.2-.1.4-.1.6 0l1.5.7c.3.1.4.3.4.5v.5c0 .5-.2.9-.7 1.1-.6.3-1.5.2-2.3-.1-2.4-.8-4.8-3-5.9-5.1-.4-.8-.6-1.9-.2-2.6Z"></path></svg>`,
    owl:`<svg viewBox="0 0 64 64" fill="none"><path d="M10 28 18 10l14 8 14-8 8 18-8 20-14 7-14-7-8-20Z" stroke="currentColor" stroke-width="3"></path><circle cx="24" cy="31" r="5" stroke="currentColor" stroke-width="3"></circle><circle cx="40" cy="31" r="5" stroke="currentColor" stroke-width="3"></circle><path d="m31 39 1 4 1-4M21 47h22" stroke="currentColor" stroke-width="3"></path></svg>`
  };

  function removeLegacyFloats(){
    ['#odoAiLauncher','.odo-ai-launcher','#odoChatLauncher','.odo-chat-launcher'].forEach(sel=>document.querySelectorAll(sel).forEach(el=>{el.style.display='none';el.setAttribute('aria-hidden','true')}));
  }

  function buildHeader(){
    const nav=document.querySelector('.nav'); if(!nav) return;
    nav.querySelectorAll('.odo-v4-actions').forEach(x=>x.remove());
    const account=nav.querySelector('#odoAccountBtn,.account-btn');
    const cart=nav.querySelector('#cartOpen');
    const actions=document.createElement('div'); actions.className='odo-v4-actions';
    const mk=(cls,html,label)=>{const b=document.createElement('button');b.className='odo-v4-icon '+cls;b.innerHTML=html;b.setAttribute('aria-label',label);return b};
    const search=mk('',''+svg.search,'Search');
    search.onclick=()=>document.body.classList.toggle('odo-search-open');
    if(cart){cart.className='odo-v4-icon odo-v4-cart';cart.innerHTML=svg.cart+'<span>CART</span><span class="odo-v4-badge" id="odoV4CartCount">'+(document.querySelector('#cartCount')?.textContent||'0')+'</span>'}
    if(account){account.className='odo-v4-icon odo-v4-account';account.innerHTML=svg.user+'<span>MY ACCOUNT</span>'}
    const saved=mk('odo-v4-saved',svg.heart+'<span>SAVED</span>','Saved items');
    saved.onclick=()=>document.querySelector('[data-save-open],#savedOpen,.saved-link')?.click();
    actions.append(search,saved); if(account) actions.append(account); if(cart) actions.append(cart); nav.appendChild(actions);
  }

  function buildFloating(){
    ['#odoV4Chat','#odoV4WA','#odoV4AI','#odoV4ChatPanel'].forEach(id=>document.querySelector(id)?.remove());
    const chat=document.createElement('button');chat.id='odoV4Chat';chat.className='odo-v4-float odo-v4-chat';chat.innerHTML=svg.chat+'<span>CUSTOMER MESSAGE</span>';
    const wa=document.createElement('a');wa.id='odoV4WA';wa.className='odo-v4-float odo-v4-wa';wa.href='https://wa.me/9779845319200?text=Hi%20ODO%20Fashion!%20I%20need%20customer%20support.';wa.target='_blank';wa.rel='noopener';wa.innerHTML=svg.whatsapp;wa.setAttribute('aria-label','WhatsApp ODO Customer Care');
    const ai=document.createElement('button');ai.id='odoV4AI';ai.className='odo-v4-float odo-v4-ai';ai.innerHTML=svg.owl;ai.setAttribute('aria-label','ODO AI Assistant');
    const panel=document.createElement('div');panel.id='odoV4ChatPanel';panel.className='odo-v4-chat-panel';panel.innerHTML='<div class="odo-v4-chat-head"><div><strong>ODO CUSTOMER CARE</strong><div style="font-size:.55rem;color:#777;margin-top:3px">We reply as soon as possible</div></div><button class="odo-v4-chat-close">×</button></div><div class="odo-v4-chat-body"><div class="odo-v4-msg bot">Namaste 👋 Welcome to ODOFASHION.<br><br>Need help with an order, size, price, delivery or return? Send us a message. You can also use WhatsApp for a faster response.</div><div class="odo-v4-msg bot">WhatsApp: <a href="https://wa.me/9779845319200" target="_blank" rel="noopener">+977 9845 319200</a></div></div><form class="odo-v4-chat-form"><input placeholder="Write your message…" required maxlength="500"><button>SEND</button></form>';
    document.body.append(chat,wa,ai,panel);
    chat.onclick=()=>panel.classList.add('open');panel.querySelector('.odo-v4-chat-close').onclick=()=>panel.classList.remove('open');
    panel.querySelector('form').onsubmit=e=>{e.preventDefault();const input=e.currentTarget.querySelector('input');const q=input.value.trim();if(!q)return;const body=panel.querySelector('.odo-v4-chat-body');const u=document.createElement('div');u.className='odo-v4-msg user';u.textContent=q;body.appendChild(u);input.value='';body.scrollTop=body.scrollHeight;setTimeout(()=>{const b=document.createElement('div');b.className='odo-v4-msg bot';b.innerHTML='Thanks for your message. Our ODO customer-care team will get back to you soon. For a quicker reply, <a href="https://wa.me/9779845319200" target="_blank" rel="noopener">WhatsApp us</a>.';body.appendChild(b);body.scrollTop=body.scrollHeight;},350)};
    ai.onclick=()=>{document.querySelector('#odoBetterAiLauncher')?.click()||document.querySelector('#odoAiLauncher')?.click()};
  }

  function addTrust(){
    const hero=document.querySelector('#home .hero-copy'); if(!hero||hero.querySelector('.odo-v4-trust')) return;
    const t=document.createElement('div');t.className='odo-v4-trust';t.innerHTML='<span>🚚 COD · ALL NEPAL</span><span>● LIVE STOCK</span><span>↺ RETURNS & EXCHANGE</span><span>💬 HUMAN SUPPORT</span>';hero.appendChild(t);
  }

  function animate(){
    const els=[...document.querySelectorAll('.section-top,.category-card,.product,.support-card,.look-card,.about-grid>div,.nita-copy,.nita-visual,.universe-copy,.manifesto-title,.manifesto-copy,.contact')];
    els.forEach(e=>{if(!e.classList.contains('odo-v4-reveal')) e.classList.add('odo-v4-reveal')});
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('odo-visible');io.unobserve(e.target)}}),{threshold:.08});els.forEach(e=>io.observe(e));
    const field=document.createElement('div');field.className='odo-v4-dot-field';for(let i=0;i<18;i++){const d=document.createElement('span');d.className='odo-v4-dot';d.style.left=Math.random()*100+'%';d.style.animationDelay=(Math.random()*-12)+'s';field.appendChild(d)}document.body.appendChild(field);
  }

  function boot(){style();removeLegacyFloats();buildHeader();buildFloating();addTrust();animate();}
  ready(()=>{boot();setTimeout(boot,600);setTimeout(boot,1800)});
})();