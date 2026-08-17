/* ODO UI V4 — action cleanup, icons, friendly support, motion */
(() => {
  const svg = {
    cart:`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h2l2 11h9l2-8H7"/><circle cx="10" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>`,
    heart:`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 8.8c0 5-8.8 10-8.8 10S3.2 13.8 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/></svg>`,
    search:`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 5 5"/></svg>`,
    chat:`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.6a7.5 7.5 0 0 1-8 7.4 8.5 8.5 0 0 1-4.2-1.1L4 19l1.3-3.3A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.8 7.8 0 0 1 8 7.6Z"/></svg>`,
    user:`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c.8-3.8 3.1-5.8 7-5.8s6.2 2 7 5.8"/></svg>`,
  };

  const text = el => String(el?.textContent || '').replace(/\s+/g,' ').trim();
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function ensureActionButton(el, kind, label, icon) {
    if (!el || el.dataset.odoV4Action === kind) return el;
    el.dataset.odoV4Action = kind;
    el.classList.add('odo-nav-icon');
    el.setAttribute('aria-label', label);
    el.setAttribute('title', label);
    const count = el.querySelector('#cartCount');
    el.innerHTML = icon + (count ? count.outerHTML : '');
    return el;
  }

  function repairNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let actions = nav.querySelector('.odo-top-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'odo-top-actions';
      nav.appendChild(actions);
    }

    const account = document.querySelector('#odoAccountBtn');
    const cart = document.querySelector('#cartOpen');
    if (account && account.parentElement !== actions) actions.appendChild(account);
    if (cart && cart.parentElement !== actions) actions.appendChild(cart);

    if (account) {
      account.classList.add('odo-account-nav');
      account.setAttribute('aria-label','My Account');
      account.innerHTML = `<span class="odo-account-icon">${svg.user}</span><span class="odo-account-label">MY ACCOUNT</span>`;
    }
    if (cart) {
      const oldCount = cart.querySelector('#cartCount');
      cart.innerHTML = `${svg.cart}<span class="odo-cart-label">CART</span>${oldCount ? oldCount.outerHTML : '<span id="cartCount">0</span>'}`;
      cart.dataset.odoV4Action = 'cart';
      cart.setAttribute('aria-label','Cart');
      cart.setAttribute('title','Open cart');
    }

    // Search: find any existing search control first; otherwise create one.
    let search = actions.querySelector('.odo-search-trigger');
    if (!search) {
      search = document.createElement('button');
      search.className = 'odo-nav-icon odo-search-trigger';
      search.type = 'button';
      search.innerHTML = svg.search;
      search.setAttribute('aria-label','Search ODO');
      search.title = 'Search ODO';
      actions.appendChild(search);
      search.onclick = openSearch;
    }

    // Wishlist: turn any SAVED button into a compact icon button, or create one.
    let saved = actions.querySelector('.odo-save-nav');
    if (!saved) {
      const candidates = [...document.querySelectorAll('button,a')].filter(el => /^(♡\s*)?SAVED$|^(♡\s*)?SAVE$|WISHLIST/i.test(text(el)));
      saved = candidates.find(el => el !== search && el !== cart && el !== account) || null;
      if (saved && saved.parentElement !== actions) actions.appendChild(saved);
    }
    if (saved) {
      saved.classList.add('odo-save-nav','odo-nav-icon');
      saved.setAttribute('aria-label','Saved items');
      saved.setAttribute('title','Saved items');
      saved.innerHTML = svg.heart;
    }
  }

  function ensureSearchModal() {
    if (document.getElementById('odoSearchModal')) return;
    const m = document.createElement('div');
    m.id = 'odoSearchModal';
    m.className = 'odo-search-modal';
    m.innerHTML = `<div class="odo-search-card"><div class="odo-search-row"><input class="odo-search-input" id="odoSearchInput" placeholder="Search ODO products…" autocomplete="off"><button class="odo-nav-icon" id="odoSearchClose" type="button" aria-label="Close search">×</button></div><div class="odo-search-results" id="odoSearchResults"></div></div>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if(e.target===m) m.classList.remove('open'); });
    m.querySelector('#odoSearchClose').onclick = () => m.classList.remove('open');
    m.querySelector('#odoSearchInput').addEventListener('input', renderSearch);
    m.querySelector('#odoSearchInput').addEventListener('keydown', e => { if(e.key==='Escape') m.classList.remove('open'); });
  }

  function openSearch() {
    ensureSearchModal();
    const m = document.getElementById('odoSearchModal');
    m.classList.add('open');
    const input = m.querySelector('#odoSearchInput');
    input.value = '';
    renderSearch();
    setTimeout(() => input.focus(), 40);
  }

  function renderSearch() {
    const q = String(document.getElementById('odoSearchInput')?.value || '').toLowerCase().trim();
    const results = document.getElementById('odoSearchResults');
    if (!results) return;
    const cards = [...document.querySelectorAll('.product')];
    const matches = cards.filter(c => !q || text(c).toLowerCase().includes(q)).slice(0,10);
    if (!matches.length) { results.innerHTML = `<div class="odo-search-item"><span>No products found.</span></div>`; return; }
    results.innerHTML = matches.map(c => {
      const name = c.querySelector('.product-meta h3')?.textContent?.trim() || 'ODO Product';
      const price = c.querySelector('.price')?.textContent?.trim() || '';
      return `<a class="odo-search-item" href="#streetwear"><span>${name}</span><strong style="color:var(--odo-gold)">${price}</strong></a>`;
    }).join('');
  }

  function repairCustomerMessage() {
    const launcher = document.querySelector('#odoChatLauncher,.odo-chat-launcher');
    if (!launcher) return;
    launcher.innerHTML = `<span class="odo-chat-launcher-icon">${svg.chat}</span><span>CHAT WITH ODO</span>`;
    launcher.setAttribute('aria-label','Chat with ODO customer care');
    launcher.setAttribute('title','Chat with ODO customer care');
  }

  function repairAiLauncher() {
    const launcher = document.querySelector('#odoBetterAiLauncher,.odo-ai-launcher');
    if (!launcher) return;
    launcher.innerHTML = `<img src="assets/odo-logo.png" alt="ODO AI"/><span class="odo-ai-label">ODO AI</span>`;
    launcher.setAttribute('aria-label','Open ODO AI Assistant');
    launcher.setAttribute('title','ODO AI Assistant');
  }

  function addSectionAccent() {
    document.querySelectorAll('.section-top h2').forEach(h => {
      if(h.dataset.odoV4Accent) return;
      h.dataset.odoV4Accent='1';
      h.animate([{transform:'translateY(5px)',opacity:.65},{transform:'translateY(0)',opacity:1}],{duration:550,easing:'cubic-bezier(.2,.75,.2,1)' });
    });
  }

  function animateHero() {
    const hero = document.querySelector('.hero-copy');
    if (!hero || hero.dataset.odoHeroAnimated) return;
    hero.dataset.odoHeroAnimated='1';
    hero.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],{duration:850,easing:'cubic-bezier(.2,.75,.2,1)',fill:'both'});
    const lead = hero.querySelector('.hero-lead');
    if (lead) lead.animate([{opacity:0},{opacity:1}],{delay:420,duration:650,fill:'both'});
  }

  function boot() {
    repairNav();
    ensureSearchModal();
    repairCustomerMessage();
    repairAiLauncher();
    addSectionAccent();
    animateHero();
  }

  let timer;
  const rerun = () => {
    clearTimeout(timer);
    timer = setTimeout(boot, 180);
  };
  new MutationObserver(rerun).observe(document.body,{childList:true,subtree:true});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot,300));
  else setTimeout(boot,300);
  setTimeout(boot,1200);
  setTimeout(boot,3000);
})();
