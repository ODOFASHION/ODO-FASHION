// ODO Order Success UI — adds clear confirmation + navigation after a successful COD order.
(function(){
  const css=document.createElement('style');
  css.textContent=`
    .odo-order-success-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}
    .odo-order-success-actions a,.odo-order-success-actions button{min-height:48px;display:flex;align-items:center;justify-content:center;padding:12px 14px;border:1px solid #c8a560;background:#c8a560;color:#090909;font-weight:900;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;cursor:pointer}
    .odo-order-success-actions .secondary{background:transparent;color:#f5f1e8;border-color:rgba(245,241,232,.2)}
    .odo-order-success-actions .secondary:hover{border-color:#c8a560;color:#e5c982}
    .odo-order-confirmed-note{margin-top:14px;padding:13px 14px;border:1px solid rgba(200,165,96,.2);background:#11110f;color:#aaa;font-size:.64rem;line-height:1.6}
    @media(max-width:560px){.odo-order-success-actions{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  function enhanceSuccess(root){
    if(!root || root.dataset.odoEnhanced==='1') return;
    const success=root.querySelector('.order-success');
    if(!success) return;
    root.dataset.odoEnhanced='1';

    // Existing WhatsApp CTA is preserved; add clear next steps underneath.
    const wa=success.querySelector('a[href*="wa.me"]');
    const actions=document.createElement('div');
    actions.className='odo-order-success-actions';

    const history=document.createElement('button');
    history.type='button';
    history.textContent='MY ORDER HISTORY →';
    history.addEventListener('click',()=>{
      const checkout=root.closest('.checkout-modal');
      if(checkout) checkout.classList.remove('show');
      const account=document.getElementById('odoAccountBtn');
      if(account) account.click();
      else window.scrollTo({top:0,behavior:'smooth'});
    });

    const back=document.createElement('button');
    back.type='button';
    back.className='secondary';
    back.textContent='← BACK TO SHOP';
    back.addEventListener('click',()=>{
      const checkout=root.closest('.checkout-modal');
      if(checkout) checkout.classList.remove('show');
      document.body.classList.remove('cart-open');
      document.querySelector('#streetwear')?.scrollIntoView({behavior:'smooth',block:'start'});
    });

    actions.append(history,back);
    if(wa) wa.insertAdjacentElement('afterend',actions);

    const note=document.createElement('div');
    note.className='odo-order-confirmed-note';
    note.innerHTML='<strong>ORDER SAVED ✓</strong><br>Your order is stored in your ODO account. Open <strong>MY ACCOUNT → MY ORDERS</strong> anytime to check its status.';
    actions.insertAdjacentElement('afterend',note);
  }

  const observer=new MutationObserver(()=>{
    document.querySelectorAll('.checkout-modal').forEach(enhanceSuccess);
  });
  observer.observe(document.body,{childList:true,subtree:true});
  document.querySelectorAll('.checkout-modal').forEach(enhanceSuccess);
})();
