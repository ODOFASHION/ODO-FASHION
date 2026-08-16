import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL='https://gqlcxvukyezqpdftjdeo.supabase.co';
const SUPABASE_KEY='sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8';
const WA1='9779845319200';
const WA2='9779768479483';
const sb=createClient(SUPABASE_URL,SUPABASE_KEY);
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

function addStyle(){
 if($('#odoCustomerUxStyle')) return;
 const s=document.createElement('style'); s.id='odoCustomerUxStyle';
 s.textContent=`
 .odo-chat-launcher{right:20px!important;bottom:82px!important;border-radius:999px!important;padding:11px 16px!important;background:#0d0d0c!important}
 .odo-ai-launcher{right:20px!important;bottom:20px!important;z-index:255!important;border-radius:999px!important}
 .odo-hello-card{margin:0 0 10px;padding:13px 14px;background:#171715;border:1px solid rgba(200,165,96,.25);font-size:.68rem;line-height:1.6;color:#d8d2c6}
 .odo-hello-card strong{color:#f5f1e8}
 .odo-hello-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}
 .odo-hello-actions a{display:inline-block;text-decoration:none;padding:7px 9px;border:1px solid rgba(200,165,96,.45);color:#e5c982;font-size:.5rem;letter-spacing:.06em}
 .odo-bot-panel{position:fixed;right:20px;bottom:76px;width:min(390px,calc(100vw - 32px));height:540px;z-index:254;background:#0b0b0a;border:1px solid rgba(200,165,96,.35);display:none;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.45)}
 .odo-bot-panel.open{display:flex}.odo-bot-head{padding:16px 18px;border-bottom:1px solid rgba(245,241,232,.1);display:flex;justify-content:space-between;align-items:center}.odo-bot-head h3{margin:0;font-size:1rem}.odo-bot-close{background:none;border:0;color:#f5f1e8;font-size:1.5rem;cursor:pointer}.odo-bot-messages{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:10px}.odo-bot-msg{max-width:88%;padding:10px 12px;font-size:.69rem;line-height:1.6}.odo-bot-msg.user{align-self:flex-end;background:#c8a560;color:#0b0b0a}.odo-bot-msg.bot{align-self:flex-start;background:#171715;color:#ddd}.odo-bot-msg a{color:#e5c982}.odo-bot-compose{border-top:1px solid rgba(245,241,232,.1);padding:12px;display:flex;gap:8px}.odo-bot-compose textarea{flex:1;resize:none;background:#111;color:#f5f1e8;border:1px solid rgba(245,241,232,.15);padding:9px;font:inherit;min-height:44px}.odo-bot-compose button{background:#c8a560;color:#0b0b0a;border:0;padding:0 13px;font-size:.56rem;letter-spacing:.1em}.odo-bot-quick{display:flex;gap:6px;flex-wrap:wrap;padding:0 12px 10px}.odo-bot-quick button{background:none;color:#c8a560;border:1px solid rgba(200,165,96,.25);padding:6px 8px;font-size:.48rem}
 @media(max-width:600px){.odo-chat-launcher{right:12px!important;bottom:76px!important}.odo-ai-launcher{right:12px!important;bottom:14px!important}.odo-bot-panel{right:12px;bottom:68px}.odo-chat-panel{right:12px;bottom:126px}}
 `;
 document.head.appendChild(s);
}

function greetingHtml(){
 return `<div class="odo-hello-card"><strong>Namaste from ODOFASHION 👋</strong><br>Thanks for messaging us. We’ve received your message and our customer-care team will get back to you as soon as possible.<div class="odo-hello-actions"><a href="https://wa.me/${WA1}" target="_blank" rel="noopener">WHATSAPP 01</a><a href="https://wa.me/${WA2}" target="_blank" rel="noopener">WHATSAPP 02</a><a href="tel:+9779845319200">CALL ODO</a></div></div>`;
}

async function enhanceCustomerChat(){
 addStyle();
 const launcher=$('#odoChatLauncher'); const panel=$('#odoChatPanel');
 if(!launcher||!panel) return;
 if(panel.dataset.odoEnhanced==='1') return;
 panel.dataset.odoEnhanced='1';
 const originalOpen=launcher.onclick;
 launcher.onclick=()=>{ if(originalOpen) originalOpen(); setTimeout(addGreeting,50); };
 addGreeting();
 async function addGreeting(){
   const body=$('#odoChatBody'); if(!body) return;
   if(body.querySelector('.odo-hello-card')) return;
   const {data:{session}}=await sb.auth.getSession(); if(!session) return;
   const {data}=await sb.from('customer_messages').select('id').eq('user_id',session.user.id).limit(1);
   if(!data?.length) body.insertAdjacentHTML('afterbegin',greetingHtml());
 }
}

const faq={
 'price':`All current first-drop streetwear pieces are <strong>NPR 2,500</strong>.`,
 'shipping':`Cash on Delivery is available <strong>all over Nepal</strong>. Delivery timing depends on your location and confirmation from ODO customer care.`,
 'payment':`Right now ODO supports <strong>Cash on Delivery</strong>. Online payment is coming soon.`,
 'size':`Current sizes are <strong>S, M, L, XL and XXL</strong>. If you’re unsure, message customer care with your usual T-shirt size and they can help.`,
 'order':`You can place an order directly from the website. Add a product to cart, choose your size, then use <strong>CHECKOUT — CASH ON DELIVERY</strong>.`,
 'whatsapp':`You can reach ODO customer care on <a href="https://wa.me/${WA1}" target="_blank" rel="noopener">+977 9845-319200</a> or <a href="https://wa.me/${WA2}" target="_blank" rel="noopener">+977 9768-479483</a>.`,
 'call':`Yes — you can call ODO customer care directly: <a href="tel:+9779845319200">+977 9845-319200</a>.`,
 'return':`For returns or exchanges, please message ODO customer care with your order number and the reason. The team will guide you.`,
 'about':`ODO Fashion is a premium + streetwear expression of <strong>GREATODOUNIVERSE</strong>, built in Nepal with a global ambition.`,
 'journal':`The ODO Journal shares launches, behind-the-scenes stories and updates from ODOFASHION and GREATODOUNIVERSE.`,
 'nita':`Nita Kunwar is connected to the future story and next chapter of ODO Fashion.`,
 'support':`For a human response about an order, sizing, delivery or anything else, use <strong>CUSTOMER MESSAGE</strong> or WhatsApp.`,
};
function botReply(q){
 const s=q.toLowerCase();
 if(/price|cost|how much|npr|रु|पैसा/.test(s)) return faq.price;
 if(/ship|delivery|कहिले|कहाँसम्म|नेपाल/.test(s)) return faq.shipping;
 if(/pay|payment|cod|cash/.test(s)) return faq.payment;
 if(/size|fit|sizing|xl|xxl|small|medium|large/.test(s)) return faq.size;
 if(/order|buy|purchase|किन्ने|किन्न/.test(s)) return faq.order;
 if(/whatsapp|wa.me/.test(s)) return faq.whatsapp;
 if(/call|phone|number|contact|फोन|नम्बर/.test(s)) return faq.call;
 if(/return|exchange|refund/.test(s)) return faq.return;
 if(/about|brand|odo|greatodo/.test(s)) return faq.about;
 if(/journal|news|update/.test(s)) return faq.journal;
 if(/nita/.test(s)) return faq.nita;
 if(/help|support|human|admin|message/.test(s)) return faq.support;
 return `I’m ODO AI Assistant. I can help with <strong>products, prices, sizes, ordering, Cash on Delivery, delivery, returns, WhatsApp and customer support</strong>. Tell me what you need, or tap <strong>CUSTOMER MESSAGE</strong> to talk to the ODO team.`;
}

function mountBetterBot(){
 addStyle();
 const old=$('#odoAiLauncher');
 if(old){old.style.display='none';}
 if($('#odoBetterAiLauncher')) return;
 const l=document.createElement('button'); l.id='odoBetterAiLauncher'; l.className='odo-ai-launcher'; l.setAttribute('aria-label','Open ODO AI Assistant'); l.innerHTML='<img src="owl-logo.svg" alt="ODO AI" style="width:19px;height:19px;margin-right:6px;vertical-align:middle"> ODO AI'; document.body.appendChild(l);
 const p=document.createElement('div'); p.id='odoBetterAiPanel'; p.className='odo-bot-panel'; p.innerHTML='<div class="odo-bot-head"><div><p class="eyebrow" style="margin:0 0 4px">ODOFASHION</p><h3>ODO AI ASSISTANT</h3></div><button class="odo-bot-close">×</button></div><div id="odoBetterAiMessages" class="odo-bot-messages"></div><div class="odo-bot-quick"><button data-q="What are the prices?">PRICE</button><button data-q="What sizes are available?">SIZES</button><button data-q="How do I order?">ORDER</button><button data-q="What is the delivery policy?">DELIVERY</button><button data-q="Give me WhatsApp and call details">CONTACT</button></div><form id="odoBetterAiForm" class="odo-bot-compose"><textarea required maxlength="800" placeholder="Ask ODO anything…"></textarea><button>SEND</button></form>'; document.body.appendChild(p);
 const body=$('#odoBetterAiMessages');
 function say(html,who){const d=document.createElement('div');d.className='odo-bot-msg '+who;d.innerHTML=html;body.appendChild(d);body.scrollTop=body.scrollHeight;}
 function initial(){if(!body.children.length)say(`Namaste 👋 I’m the ODO AI Assistant. I can help you with ODO products, pricing, sizes, orders, COD, delivery, returns and customer care.<br><br>Need a human? Use <a href="#" id="odoAiToHuman">CUSTOMER MESSAGE</a>, WhatsApp or call ODO directly.`, 'bot')}
 l.onclick=()=>{p.classList.toggle('open');initial()}; p.querySelector('.odo-bot-close').onclick=()=>p.classList.remove('open');
 p.querySelectorAll('.odo-bot-quick button').forEach(b=>b.onclick=()=>{const q=b.dataset.q;say(esc(q),'user');setTimeout(()=>say(botReply(q),'bot'),180)});
 p.querySelector('#odoBetterAiForm').onsubmit=e=>{e.preventDefault();const t=e.currentTarget.querySelector('textarea');const q=t.value.trim();if(!q)return;say(esc(q),'user');t.value='';setTimeout(()=>say(botReply(q),'bot'),180)};
 document.addEventListener('click',e=>{if(e.target.id==='odoAiToHuman'){e.preventDefault();$('#odoChatLauncher')?.click();}});
}

function start(){enhanceCustomerChat();mountBetterBot();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
setTimeout(start,1200);setTimeout(start,3000);
import './product-catalog.js';
