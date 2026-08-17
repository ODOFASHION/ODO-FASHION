(function(){
  if(!document.querySelector('link[data-odo-premium-ui]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='premium-ui.css?v=1';
    link.dataset.odoPremiumUi='1';
    document.head.appendChild(link);
  }
  import('./premium-ui.js?v=1').catch(()=>{});
})();
