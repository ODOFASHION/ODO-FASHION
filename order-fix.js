// ODO WEBSITE-ONLY ORDER CONFIRMATION
// Orders stay fully on-site. WhatsApp remains customer support only.
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .odo-confirm-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px}
    .odo-confirm-actions a{display:flex;align-items:center;justify-content:center;text-align:center;text-decoration:none;min-height:48px}
    .odo-back-shop{background:transparent!important;color:#f5f1e8!important;border:1px solid rgba(245,241,232,.18)!important}
    @media(max-width:560px){.odo-confirm-actions{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
  document.addEventListener('submit',function(e){
    if(e.target?.id!=='odoCheckoutForm') return;
    setTimeout(function(){
      const success=e.target.querySelector('.order-success');
      if(!success) return;
      const old=success.querySelector('a[href*="wa.me"]');
      if(old) old.remove();
      let actions=success.querySelector('.odo-confirm-actions');
      if(!actions){
        actions=document.createElement('div');
        actions.className='odo-confirm-actions';
        actions.innerHTML=`
          <a class="checkout-submit" href="#account-after-order">MY ORDER HISTORY →</a>
          <a class="checkout-submit odo-back-shop" href="#streetwear">← BACK TO SHOP</a>`;
        success.appendChild(actions);
        actions.querySelector('a[href="#account-after-order"]').addEventListener('click',function(ev){
          ev.preventDefault();
          document.querySelector('#odoAccountBtn')?.click();
        });
        actions.querySelector('a[href="#streetwear"]').addEventListener('click',function(){
          document.getElementById('odoCheckoutModal')?.classList.remove('show');
        });
      }
      const note=success.querySelector('.cart-note');
      if(note) note.textContent='Your order is complete on the ODO website. We will contact you if anything needs confirmation.';
      success.querySelector('.eyebrow')?.replaceChildren(document.createTextNode('ORDER CONFIRMED'));
    },80);
  },true);
})();
