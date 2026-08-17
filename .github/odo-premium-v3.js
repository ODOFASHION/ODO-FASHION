import './live-commerce-fix.js?v=1';

(() => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const text = v => String(v || '').replace(/\s+/g, ' ').trim();

  function injectMobileMenu() {
    const header = document.querySelector('.nav');
    if (!header || document.getElementById('odoPremiumMenu')) return;
    const btn = document.createElement('button');
    btn.className = 'odo-menu-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = '☰';
    header.appendChild(btn);
    const menu = document.createElement('div');
    menu.id = 'odoPremiumMenu';
    menu.className = 'odo-mobile-menu';
    menu.innerHTML = `
      <a href="#shop">Shop</a>
      <a href="#about">About</a>
      <a href="#streetwear">Streetwear</a>
      <a href="#manifesto">Manifesto</a>
      <a href="#lookbook">Lookbook</a>
      <a href="#support">Customer Care</a>`;
    document.body.appendChild(menu);
    btn.onclick = () => menu.classList.toggle('open');
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  function addScrollReveal() {
    const targets = [
      '.section-top', '.category-card', '.product', '.support-card',
      '.look-card', '.about-grid > div', '.nita-copy', '.nita-visual',
      '.universe-copy', '.manifesto-title', '.manifesto-copy', '.contact'
    ];
    const els = document.querySelectorAll(targets.join(','));
    els.forEach(el => el.classList.add('odo-reveal'));
    const io = new IntersectionObserver(entries => {
      entries.forEach((entry, idx) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = `${Math.min(idx * 30, 220)}ms`;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, {threshold:.08, rootMargin:'0px 0px -5% 0px'});
    els.forEach(el => io.observe(el));
  }

  function fixCopyAndDuplicateSections() {
    document.querySelectorAll('*').forEach(el => {
      if (!el.children.length) {
        const t = text(el.textContent);
        if (t === 'Every first-drop piece is NPR 2,500. Choose your size and add it to your cart.' ||
            t === 'All first-drop pieces are NPR 2,500. Cash on Delivery all over Nepal.') {
          el.textContent = 'Prices shown are per product. Cash on Delivery is available across Nepal.';
        }
      }
    });

    document.querySelectorAll('.category-card').forEach(card => {
      const t = text(card.textContent).toUpperCase();
      if (t.includes('ACCESSORIES')) {
        const b = card.querySelector('b');
        const small = card.querySelector('small');
        if (b) b.textContent = 'EXPLORE CAPS →';
        if (small) small.textContent = 'CAPS · BAGS · MORE';
        card.classList.add('active');
      }
    });

    document.querySelectorAll('section').forEach(section => {
      const t = text(section.textContent).toUpperCase();
      if (t.includes('03 / LIVE CATALOG') && t.includes('NEW FROM ODO')) {
        section.classList.add('odo-reveal');
      }
    });
  }

  function addTrustPills() {
    if (document.querySelector('.odo-trust-pills')) return;
    const hero = document.querySelector('#home .hero-copy');
    if (!hero) return;
    const box = document.createElement('div');
    box.className = 'odo-trust-pills';
    box.innerHTML = `
      <span>🚚 COD · ALL NEPAL</span>
      <span>● LIVE STOCK</span>
      <span>↺ EASY SUPPORT</span>
    `;
    hero.appendChild(box);
  }

  function addSparkField() {
    if (document.querySelector('.odo-spark-field')) return;
    const field = document.createElement('div');
    field.className = 'odo-spark-field';
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('span');
      s.className = 'odo-spark';
      s.style.left = `${Math.random() * 100}%`;
      s.style.bottom = `${-10 - Math.random() * 20}%`;
      s.style.animationDuration = `${10 + Math.random() * 10}s`;
      s.style.animationDelay = `${Math.random() * -18}s`;
      field.appendChild(s);
    }
    document.body.appendChild(field);
  }

  function makeNavActionsFriendlier() {
    const nav = document.querySelector('.nav');
    if (!nav || document.querySelector('.odo-top-actions')) return;
    const saved = document.querySelector('#odoSaveNav, .odo-save-nav, .saved-link');
    const account = document.querySelector('#odoAccountBtn');
    const cart = document.querySelector('#cartOpen');
    if (!saved && !account && !cart) return;
    const actions = document.createElement('div');
    actions.className = 'odo-top-actions';
    [account, saved, cart].forEach(el => { if (el) actions.appendChild(el); });
    if (actions.children.length) nav.appendChild(actions);
  }

  function addProductMicroInteractions() {
    document.querySelectorAll('.product').forEach(card => {
      if (card.dataset.odoV3) return;
      card.dataset.odoV3 = '1';
      card.addEventListener('pointermove', e => {
        if (window.matchMedia('(max-width: 760px)').matches) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(1000px) rotateX(${(-y*1.8).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  function startLivePolishLoop() {
    let timer;
    const rerun = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fixCopyAndDuplicateSections();
        addScrollReveal();
        addProductMicroInteractions();
      }, 120);
    };
    const mo = new MutationObserver(rerun);
    mo.observe(document.body, {childList:true, subtree:true});
  }

  async function boot() {
    await sleep(100);
    injectMobileMenu();
    makeNavActionsFriendlier();
    fixCopyAndDuplicateSections();
    addTrustPills();
    addSparkField();
    addScrollReveal();
    addProductMicroInteractions();
    startLivePolishLoop();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
