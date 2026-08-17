(() => {
  function mountDipeshProfile(){
    if(document.getElementById('dipesh-profile')) return;
    const anchor=document.querySelector('#greatodouniverse');
    if(!anchor || !anchor.parentNode) return;

    const style=document.createElement('style');
    style.id='dipesh-profile-style';
    style.textContent=`
      #dipesh-profile{position:relative;overflow:hidden}
      #dipesh-profile .dipesh-wrap{display:grid;grid-template-columns:minmax(280px,.9fr) minmax(320px,1.1fr);gap:clamp(30px,6vw,90px);align-items:center}
      #dipesh-profile .dipesh-visual{aspect-ratio:4/5;background:#0b0b0a;border:1px solid rgba(200,165,96,.22);overflow:hidden}
      #dipesh-profile .dipesh-visual img{width:100%;height:100%;object-fit:cover;display:block;filter:contrast(1.03) saturate(.92)}
      #dipesh-profile .dipesh-copy h2{margin:.15em 0 .4em;font-size:clamp(2.7rem,6vw,5.5rem);line-height:.9}
      #dipesh-profile .dipesh-role{color:#c8a560;text-transform:uppercase;letter-spacing:.14em;font-size:.62rem;font-weight:700;margin-bottom:20px}
      #dipesh-profile .dipesh-lead{font-size:1.12rem;line-height:1.65;color:#f0ece3;max-width:700px}
      #dipesh-profile .dipesh-copy p{color:#aba69d;line-height:1.8;max-width:700px}
      #dipesh-profile .dipesh-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:26px 0}
      #dipesh-profile .dipesh-fact{border:1px solid rgba(245,241,232,.09);padding:14px;background:#0d0d0c}
      #dipesh-profile .dipesh-fact span{display:block;color:#77736c;font-size:.48rem;letter-spacing:.13em;text-transform:uppercase;margin-bottom:6px}
      #dipesh-profile .dipesh-fact strong{color:#f5f1e8;font-size:.68rem;line-height:1.5}
      #dipesh-profile .dipesh-contact{display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(200,165,96,.38);padding:12px 15px;color:#e5c982;text-decoration:none;font-size:.58rem;letter-spacing:.11em;text-transform:uppercase}
      @media(max-width:800px){#dipesh-profile .dipesh-wrap{grid-template-columns:1fr}#dipesh-profile .dipesh-facts{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);

    const section=document.createElement('section');
    section.id='dipesh-profile';
    section.className='section odo-story';
    section.innerHTML=`
      <div class="section-top">
        <div><p class="eyebrow">05 / THE PEOPLE BEHIND ODO</p><h2>GROWING<br><em>THE VISION.</em></h2></div>
        <p class="section-intro">People, ideas and energy behind the next chapter of ODO Fashion.</p>
      </div>
      <div class="dipesh-wrap">
        <div class="dipesh-visual"><img src="WhatsApp%20Image%202026-08-16%20at%2014.45.04%20(1).jpeg" alt="Dipesh Kunwar — ODO Fashion Marketing & Brand Development"></div>
        <div class="dipesh-copy">
          <p class="eyebrow">DIPESH KUNWAR</p>
          <h2>DIPESH<br><em>KUNWAR.</em></h2>
          <div class="dipesh-role">Marketing & Brand Development</div>
          <p class="dipesh-lead">From Baitadi, Sudurpashchim, Nepal, Dipesh brings a strong interest in the vision behind ODO Fashion and GREATODOUNIVERSE.</p>
          <p>His interest in ODO goes beyond promoting clothing. He is interested in helping the brand grow its identity, communication, audience and presence — turning the larger ODO idea into something people can recognize and connect with.</p>
          <div class="dipesh-facts">
            <div class="dipesh-fact"><span>FROM</span><strong>Baitadi, Sudurpashchim, Nepal</strong></div>
            <div class="dipesh-fact"><span>FOCUS</span><strong>Marketing · Brand Growth · Communication</strong></div>
            <div class="dipesh-fact"><span>CONTACT</span><strong>+977 974 6267293</strong></div>
          </div>
          <a class="dipesh-contact" href="tel:+9779746267293">CALL DIPESH →</a>
          <p style="margin-top:22px;color:#e5c982;letter-spacing:.08em;text-transform:uppercase;font-size:.56rem">FROM SUDURPASHCHIM TO A VISION THAT SEEKS TO GO BEYOND.</p>
        </div>
      </div>`;
    anchor.parentNode.insertBefore(section,anchor);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mountDipeshProfile); else mountDipeshProfile();
})();
