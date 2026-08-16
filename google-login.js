// ODO FASHION — Google OAuth button
(() => {
  const addGoogleButton = () => {
    if (document.getElementById('odoGoogleLogin')) return true;
    const authBox = document.getElementById('odoAuth');
    const tabs = authBox?.querySelector('.odo-tabs');
    const form = document.getElementById('odoAuthForm');
    const message = document.getElementById('odoAuthMessage');
    if (!authBox || !tabs || !form) return false;

    const divider = document.createElement('div');
    divider.style.cssText = 'display:flex;align-items:center;gap:12px;margin:14px 0;color:#666;font-size:.55rem;letter-spacing:.12em;text-transform:uppercase;';
    divider.innerHTML = '<span style="height:1px;background:#2d2b28;flex:1"></span><span>OR</span><span style="height:1px;background:#2d2b28;flex:1"></span>';

    const btn = document.createElement('button');
    btn.id = 'odoGoogleLogin';
    btn.type = 'button';
    btn.textContent = 'CONTINUE WITH GOOGLE';
    btn.style.cssText = 'width:100%;background:#f5f1e8;color:#080808;border:1px solid #f5f1e8;padding:14px;font-weight:900;letter-spacing:.1em;font-size:.58rem;cursor:pointer;';
    btn.addEventListener('click', async () => {
      const supabase = window.odoSupabase;
      if (!supabase) {
        if (message) message.textContent = 'Login service is still loading. Please try again.';
        return;
      }
      btn.disabled = true;
      btn.textContent = 'OPENING GOOGLE…';
      if (message) message.textContent = '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://odofashion.github.io/ODO-FASHION/'
        }
      });
      if (error) {
        btn.disabled = false;
        btn.textContent = 'CONTINUE WITH GOOGLE';
        if (message) message.textContent = error.message;
      }
    });

    form.parentNode.insertBefore(divider, form);
    form.parentNode.insertBefore(btn, form);
    return true;
  };

  const boot = () => {
    if (addGoogleButton()) return;
    const observer = new MutationObserver(() => {
      if (addGoogleButton()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 15000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
