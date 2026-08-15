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
