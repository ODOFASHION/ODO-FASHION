import "https://esm.sh/@supabase/supabase-js@2";

(() => {
  function mount() {
    if (document.getElementById("dipesh-kunwar-profile")) return;
    const nita = document.getElementById("nita");
    const universe = document.getElementById("greatodouniverse");
    if (!nita || !universe) return;

    const style = document.createElement("style");
    style.textContent = `
      #dipesh-kunwar-profile{background:#080807;color:#f5f1e8}
      #dipesh-kunwar-profile .dipesh-grid{display:grid;grid-template-columns:minmax(260px,.85fr) minmax(0,1.15fr);gap:48px;align-items:center}
      #dipesh-kunwar-profile .dipesh-photo{aspect-ratio:4/5;background:#111;overflow:hidden;border:1px solid rgba(200,165,96,.22)}
      #dipesh-kunwar-profile .dipesh-photo img{width:100%;height:100%;display:block;object-fit:cover;object-position:center}
      #dipesh-kunwar-profile .dipesh-role{color:#c8a560;font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;margin:8px 0 20px}
      #dipesh-kunwar-profile .dipesh-copy p{color:#aaa;line-height:1.8;max-width:680px}
      #dipesh-kunwar-profile .dipesh-lead{font-size:1.05rem;color:#f5f1e8!important}
      #dipesh-kunwar-profile .dipesh-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:28px 0}
      #dipesh-kunwar-profile .dipesh-fact{border:1px solid rgba(245,241,232,.1);padding:15px;background:#0d0d0c}
      #dipesh-kunwar-profile .dipesh-fact span{display:block;color:#777;font-size:.48rem;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px}
      #dipesh-kunwar-profile .dipesh-fact strong{font-size:.72rem;color:#f5f1e8}
      #dipesh-kunwar-profile .dipesh-contact{display:inline-flex;align-items:center;gap:9px;text-decoration:none;color:#080807;background:#c8a560;padding:13px 17px;font-size:.56rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
      @media(max-width:760px){#dipesh-kunwar-profile .dipesh-grid{grid-template-columns:1fr;gap:26px}#dipesh-kunwar-profile .dipesh-facts{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(style);

    const section = document.createElement("section");
    section.id = "dipesh-kunwar-profile";
    section.className = "section dipesh-profile";
    section.innerHTML = `
      <div class="section-top">
        <div>
          <p class="eyebrow">05 / THE PEOPLE BEHIND ODO</p>
          <h2>DIPESH<br><em>KUNWAR.</em></h2>
        </div>
        <p class="section-intro">Marketing, communication and brand growth — helping turn the ODO vision into a brand people can see, remember and connect with.</p>
      </div>
      <div class="dipesh-grid">
        <div class="dipesh-photo">
          <img src="WhatsApp%20Image%202026-08-16%20at%2014.45.04%20(1).jpeg" alt="Dipesh Kunwar — ODO Marketing & Brand Development" loading="lazy">
        </div>
        <div class="dipesh-copy">
          <p class="dipesh-role">MARKETING &amp; BRAND DEVELOPMENT</p>
          <p class="dipesh-lead">Born in Baitadi and from Sudurpashchim, Nepal, Dipesh Kunwar brings a strong interest in the vision behind ODO Fashion and GREATODOUNIVERSE.</p>
          <p>His interest goes beyond simply promoting a clothing brand. He is interested in helping ODO grow its identity, reach new audiences, strengthen communication and build a meaningful connection between the brand and its community.</p>
          <p>As ODO continues to develop, Dipesh represents a growing part of the team focused on marketing, brand presence, communication and audience development.</p>
          <div class="dipesh-facts">
            <div class="dipesh-fact"><span>FROM</span><strong>Baitadi, Sudurpashchim</strong></div>
            <div class="dipesh-fact"><span>FOCUS</span><strong>Marketing · Brand Growth</strong></div>
            <div class="dipesh-fact"><span>CONTACT</span><strong>+977 974 6267293</strong></div>
          </div>
          <a class="dipesh-contact" href="tel:+9779746267293">CALL DIPESH →</a>
          <p class="story-note">FROM SUDURPASHCHIM TO A VISION THAT SEEKS TO GO BEYOND.</p>
        </div>
      </div>
    `;

    nita.insertAdjacentElement("afterend", section);

    // Keep section numbering coherent after inserting the team profile.
    const eyebrowMap = [
      ["#greatodouniverse .eyebrow", "06 / THE PARENT UNIVERSE"],
      ["#manifesto .eyebrow", "07 / THE MANIFESTO"],
      ["#lookbook .eyebrow", "08 / LOOKBOOK"],
      ["#support .eyebrow", "09 / CUSTOMER CARE"],
      ["#contact .eyebrow", "10 / ENTER THE UNIVERSE"]
    ];
    eyebrowMap.forEach(([selector, text]) => {
      const el = document.querySelector(selector);
      if (el) el.textContent = text;
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, {once:true});
  else mount();
  setTimeout(mount, 1200);
})();
