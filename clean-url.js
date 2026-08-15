(function(){
  try {
    var u = new URL(window.location.href);
    var changed = false;
    Array.from(u.searchParams.keys()).forEach(function(k){
      if (/^utm_/i.test(k)) { u.searchParams.delete(k); changed = true; }
    });
    if (changed) {
      var clean = u.pathname + (u.search ? u.search : '') + (u.hash || '');
      window.history.replaceState(null, document.title, clean);
    }
  } catch (e) {}
})();
