// Stable ODO UI bridge — keeps the existing workflow hook but delegates to the final cleanup layer.
(() => {
  const boot = () => {
    if (!document.getElementById('odo-final-ui-css')) {
      const css = document.createElement('link');
      css.id = 'odo-final-ui-css';
      css.rel = 'stylesheet';
      css.href = 'odo-final-ui.css?v=2';
      document.head.appendChild(css);
    }
    if (!window.__odoFinalUILoaded) {
      window.__odoFinalUILoaded = true;
      import('./odo-final-ui.js?v=2').catch(() => { window.__odoFinalUILoaded = false; });
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
