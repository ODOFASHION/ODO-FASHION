const WHATSAPP_NUMBER = "9779845319200";
const PRICE = 2500;
let cart = JSON.parse(localStorage.getItem("odoCart") || "[]");

// ODO owl logo — shared across the header and hero.
const owlLogo = '<img src="owl-logo.svg" alt="ODO owl logo" class="owl-logo-img">';
document.querySelectorAll(".brand-icon, .owl-mark").forEach((el) => {
  el.innerHTML = owlLogo;
  el.classList.add("logo-holder");
});

const $ = (selector) => document.querySelector(selector);

function saveCart() {
  localStorage.setItem("odoCart", JSON.stringify(cart));
  renderCart();
}

function money(value) {
  return `NPR ${value.toLocaleString("en-NP")}`;
}

function showToast(text) {
  let toast = $(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(window.odoToastTimer);
  window.odoToastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderCart() {
  const container = $("#cartItems");
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * PRICE, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);

  if (!cart.length) {
    container.innerHTML = '<p class="empty-cart">Your cart is empty.<br>Choose a piece from the first drop.</p>';
    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">SIZE ${item.size} · ${money(PRICE)} each</div>
        <div class="qty-controls">
          <button data-action="minus" data-index="${index}">−</button>
          <strong>${item.qty}</strong>
          <button data-action="plus" data-index="${index}">+</button>
          <button class="remove-item" data-action="remove" data-index="${index}">REMOVE</button>
        </div>
      </div>
      <div class="cart-item-price">${money(item.qty * PRICE)}</div>
    </div>
  `).join("");
}

function openCart() {
  document.body.classList.add("cart-open");
  $("#cartPanel").setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.body.classList.remove("cart-open");
  $("#cartPanel").setAttribute("aria-hidden", "true");
}

function addToCart(button) {
  const product = button.closest(".product");
  const size = product.querySelector(".size-select").value;
  const name = button.dataset.name;
  const existing = cart.find(item => item.name === name && item.size === size);
  if (existing) existing.qty += 1;
  else cart.push({ name, size, qty: 1 });
  saveCart();
  openCart();
  showToast(`${name} — size ${size} added`);
}

$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#cartOverlay").addEventListener("click", closeCart);

document.querySelectorAll(".add-btn").forEach(button => {
  button.addEventListener("click", () => addToCart(button));
});

$("#cartItems").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const index = Number(button.dataset.index);
  const action = button.dataset.action;
  if (action === "plus") cart[index].qty += 1;
  if (action === "minus") cart[index].qty -= 1;
  if (action === "remove" || cart[index]?.qty <= 0) cart.splice(index, 1);
  saveCart();
});

$("#whatsappOrder").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Your cart is empty");
    return;
  }
  const lines = cart.map((item, i) => `${i + 1}. ${item.name} — Size ${item.size} × ${item.qty} = ${money(item.qty * PRICE)}`);
  const total = cart.reduce((sum, item) => sum + item.qty * PRICE, 0);
  const message = ["Hi ODO Fashion! 👋", "I would like to place an order:", "", ...lines, "", `Total: ${money(total)}`, "", "Please confirm availability and delivery/payment details.", "", "Customer name:", "Phone:", "Delivery address:", "Location:"] .join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
});

// Future leadership / brand story section.
// Nita's real portrait can be added later without changing the layout.
function addBrandLeadership() {
  const contact = document.querySelector("#contact");
  if (!contact || document.querySelector("#odo-story")) return;
  const section = document.createElement("section");
  section.id = "odo-story";
  section.className = "section odo-story reveal visible";
  section.innerHTML = `
    <div class="section-top">
      <div>
        <p class="eyebrow">05 / THE NEXT CHAPTER</p>
        <h2>BEHIND<br><em>ODO.</em></h2>
      </div>
      <p class="section-intro">ODO Fashion is the first fashion expression of GREATODOUNIVERSE — built today with a vision for tomorrow.</p>
    </div>
    <div class="odo-story-grid">
      <div class="nita-frame">
        <div class="nita-placeholder">NK</div>
        <span>PORTRAIT / COMING SOON</span>
      </div>
      <div class="nita-copy">
        <p class="eyebrow">NITA KUNWAR</p>
        <h3>A NEW PERSPECTIVE<br>BEHIND THE NEXT CHAPTER.</h3>
        <p>ODO is being shaped with curiosity, energy and a belief that fashion can carry an idea — not just a logo.</p>
        <p>Nita Kunwar is part of the future story of ODO Fashion. As the brand grows, this space will evolve with her journey and the role she takes within ODO.</p>
        <p class="story-note">THE STORY IS ONLY BEGINNING.</p>
      </div>
    </div>
    <div class="universe-links">
      <div><p class="eyebrow">GREATODOUNIVERSE</p><h3>EXPLORE THE<br>UNIVERSE.</h3></div>
      <div class="social-buttons">
        <a href="https://www.instagram.com/greatodouniverse/" target="_blank" rel="noopener">INSTAGRAM ↗</a>
        <a href="https://www.youtube.com/@GreatODOUniverse" target="_blank" rel="noopener">YOUTUBE ↗</a>
        <a href="https://www.youtube.com/@omsondeoson" target="_blank" rel="noopener">YOUTUBE / ODO ↗</a>
      </div>
    </div>`;
  contact.parentNode.insertBefore(section, contact);
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

addBrandLeadership();
renderCart();
// ODO_AI_ASSISTANT_V1 — private, keyless customer assistant for GitHub Pages.
(function initODOAssistant(){
  const existing=document.querySelector('.odo-ai-launcher');
  if(existing) return;
  const root=document.createElement('div');
  root.innerHTML=`
    <button class="odo-ai-launcher" id="odoAiLauncher" aria-label="Open ODO AI Customer Assistant"><img src="owl-logo.svg" alt="ODO owl"></button>
    <section class="odo-ai-window" id="odoAiWindow" aria-label="ODO AI Customer Assistant">
      <div class="odo-ai-head"><div class="odo-ai-brand"><img src="owl-logo.svg" alt="ODO"><div><strong>ODO AI ASSISTANT</strong><small>Customer care · See Beyond</small></div></div><button class="odo-ai-close" id="odoAiClose" aria-label="Close">×</button></div>
      <div class="odo-ai-messages" id="odoAiMessages"></div>
      <div class="odo-ai-quick"><button data-q="What products do you have?">PRODUCTS</button><button data-q="How much are the clothes?">PRICE</button><button data-q="Do you deliver all over Nepal?">DELIVERY</button><button data-q="What sizes are available?">SIZES</button></div>
      <div class="odo-ai-form"><input class="odo-ai-input" id="odoAiInput" placeholder="Ask ODO anything…" autocomplete="off"><button class="odo-ai-send" id="odoAiSend">→</button></div>
      <div class="odo-ai-note">For orders or personal help, you can also chat with ODO on WhatsApp.</div>
    </section>`;
  document.body.appendChild(root);
  const win=document.getElementById('odoAiWindow'), launcher=document.getElementById('odoAiLauncher'), close=document.getElementById('odoAiClose'), messages=document.getElementById('odoAiMessages'), input=document.getElementById('odoAiInput'), send=document.getElementById('odoAiSend');
  const wa=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi ODO Fashion! I need customer support.')}`;
  function addMessage(text,who='bot',html=false){const el=document.createElement('div');el.className=`odo-ai-msg ${who}`;if(html)el.innerHTML=text;else el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;}
  function answer(q){
    const s=q.toLowerCase().trim();
    if(!s) return 'Please type a question and I will help you.';
    if(/hello|hi|hey|namaste|namaskar|hola/.test(s)) return 'Namaste 👋 Welcome to ODO Fashion. I can help with products, prices, sizes, delivery, COD, orders and the ODO story.';
    if(/price|cost|how much|कति|पैसा/.test(s)) return 'Every first-drop Streetwear piece is NPR 2,500. Cash on Delivery is available across Nepal.';
    if(/product|shirt|t.?shirt|tee|hoodie|kapada|clothes|collection|drop/.test(s)) return 'The first ODO Streetwear drop currently includes Laija Mero Maya, Sapana Energy, Kathmandu, Zero to Hero Hoodie and Budi Aajhai. Each is NPR 2,500.';
    if(/size|sizing|fit|xl|xxl|large|medium/.test(s)) return 'Available sizes are S, M, L, XL and XXL. If you want help choosing a size, tell me your usual T-shirt size and I can guide you.';
    if(/deliver|delivery|shipping|nepal|kathmandu|location/.test(s)) return 'Yes — ODO Fashion offers Cash on Delivery all over Nepal.';
    if(/cash|cod|payment|esewa|khalti|fonepay|bank|online/.test(s)) return 'Cash on Delivery is available all over Nepal. Online payment is coming soon.';
    if(/order|buy|purchase|cart/.test(s)) return `You can add a product to the cart and place the order through WhatsApp. For direct help: <a href="${wa}" target="_blank" rel="noopener" style="color:#e5c982">CHAT ON WHATSAPP →</a>`;
    if(/whatsapp|support|help|contact|customer/.test(s)) return `For personal customer support, chat with ODO on WhatsApp: <a href="${wa}" target="_blank" rel="noopener" style="color:#e5c982">OPEN WHATSAPP →</a>`;
    if(/nita|kunwar|ceo|owner|sister/.test(s)) return 'Nita Kunwar is closely connected to the future of ODO Fashion and represents the next chapter of the brand. The website intentionally describes her future role without calling her CEO yet.';
    if(/greatodo|universe|parent|company/.test(s)) return 'ODO Fashion is a fashion expression under GREATODOUNIVERSE — the larger universe behind the brand, with a long-term vision for multiple ideas and companies.';
    if(/about|what is odo|brand|meaning|owl|logo|see beyond/.test(s)) return 'ODO Fashion is premium + streetwear from Nepal. The owl represents wisdom, awareness and seeing what others may overlook. The idea is simple: SEE BEYOND.';
    if(/lookbook/.test(s)) return 'The ODO Lookbook presents the first drop with full product photography, Nepali typography and a premium black-and-cream visual direction.';
    return 'I can help with ODO products, NPR 2,500 pricing, sizes, Cash on Delivery, delivery across Nepal, orders, WhatsApp support, Nita Kunwar, GREATODOUNIVERSE and the ODO story. What would you like to know?';
  }
  function ask(q){if(!q.trim())return;addMessage(q,'user');setTimeout(()=>addMessage(answer(q),'bot',true),260);input.value='';}
  launcher.addEventListener('click',()=>{win.classList.add('open');input.focus();if(!messages.children.length)addMessage('Welcome to ODO Fashion 👁️\nI am the ODO customer assistant. Ask me about products, prices, sizes, delivery or orders.');});
  close.addEventListener('click',()=>win.classList.remove('open'));
  send.addEventListener('click',()=>ask(input.value));
  input.addEventListener('keydown',e=>{if(e.key==='Enter')ask(input.value)});
  document.querySelectorAll('.odo-ai-quick button').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.q)));
})();
