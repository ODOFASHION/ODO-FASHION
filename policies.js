(() => {
  const links = [
    ['PRIVACY POLICY', 'privacy-policy.html'],
    ['TERMS & CONDITIONS', 'terms.html'],
    ['SHIPPING & DELIVERY', 'shipping.html'],
    ['RETURNS & EXCHANGE', 'returns.html'],
    ['REFUND POLICY', 'refunds.html']
  ];
  const add = () => {
    if (document.getElementById('odoPolicyLinks')) return;
    const footer = document.createElement('footer');
    footer.id = 'odoPolicyLinks';
    footer.innerHTML = `<div style="max-width:1200px;margin:0 auto;padding:28px 24px;border-top:1px solid rgba(245,241,232,.10);display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;justify-content:center;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;"><span style="color:#77736c">ODOFASHION</span>${links.map(([label,href]) => `<a href="${href}" style="color:#c8a560;text-decoration:none">${label}</a>`).join('')}</div>`;
    document.body.appendChild(footer);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add, {once:true}); else add();
})();
