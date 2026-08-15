/* ODO_SUPPORT_2NUM_V1 — second WhatsApp customer-care contact */
(function addODOSecondWhatsApp(){
  const PRIMARY = '9779845319200';
  const SECONDARY = '9779768479483';
  const makeLink = (number, label) => `<a class="support-button" href="https://wa.me/${number}?text=Hi%20ODO%20Fashion!%20I%20need%20customer%20support." target="_blank" rel="noopener">${label} →</a>`;

  const supportCard = document.querySelector('#support .support-card');
  if (supportCard && !document.querySelector('.odo-second-whatsapp')) {
    const box = document.createElement('div');
    box.className = 'odo-second-whatsapp';
    box.innerHTML = `<div class="odo-support-divider"></div><p><strong>WHATSAPP CUSTOMER CARE</strong></p><div class="odo-whatsapp-numbers"><div><small>SUPPORT 01</small><span>+977 9845319200</span>${makeLink(PRIMARY, 'WHATSAPP 01')}</div><div><small>SUPPORT 02</small><span>+977 9768479483</span>${makeLink(SECONDARY, 'WHATSAPP 02')}</div></div>`;
    supportCard.appendChild(box);
  }

  // Keep the AI assistant aware of both customer-care contacts.
  const oldAssistant = window.odoCustomerCareNumbers;
  window.odoCustomerCareNumbers = ['+977 9845319200', '+977 9768479483'];
})();
