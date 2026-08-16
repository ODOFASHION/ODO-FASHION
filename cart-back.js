// ODO FASHION — back-to-shop control for the cart panel
(() => {
  const setup = () => {
    const panel = document.getElementById('cartPanel');
    if (!panel || document.getElementById('odoBackToShop')) return !!panel;

    const button = document.createElement('button');
    button.id = 'odoBackToShop';
    button.type = 'button';
    button.textContent = '← BACK TO SHOP';
    button.setAttribute('aria-label', 'Back to shop');
    button.style.cssText = [
      'width:100%',
      'margin:16px 0 0',
      'padding:14px 16px',
      'background:transparent',
      'color:#f5f1e8',
      'border:1px solid rgba(200,165,96,.45)',
      'font-weight:700',
      'letter-spacing:.12em',
      'font-size:.58rem',
      'cursor:pointer',
      'text-transform:uppercase'
    ].join(';');

    const close = document.getElementById('cartClose');
    if (close?.parentNode) {
      close.parentNode.insertAdjacentElement('afterend', button);
    } else {
      panel.prepend(button);
    }

    button.addEventListener('click', () => {
      document.getElementById('cartClose')?.click();
      const shop = document.getElementById('streetwear') || document.getElementById('shop');
      if (shop) {
        window.location.hash = shop.id;
        window.scrollTo({ top: shop.offsetTop, behavior: 'smooth' });
      } else {
        window.location.hash = 'shop';
      }
    });
    return true;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else {
    setup();
  }
})();
