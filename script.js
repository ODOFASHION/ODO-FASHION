const WHATSAPP_NUMBER = "9779845319200";
const PRICE = 2500;
let cart = JSON.parse(localStorage.getItem("odoCart") || "[]");

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

function openCheckout() {
  if (!cart.length) {
    showToast("Your cart is empty");
    return;
  }
  $("#checkoutModal").classList.add("show");
  $("#checkoutModal").setAttribute("aria-hidden", "false");
  $("#customerName").focus();
}

function closeCheckout() {
  $("#checkoutModal").classList.remove("show");
  $("#checkoutModal").setAttribute("aria-hidden", "true");
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
$("#whatsappOrder").addEventListener("click", openCheckout);
$("#checkoutClose").addEventListener("click", closeCheckout);

$("#checkoutModal").addEventListener("click", (event) => {
  if (event.target.id === "checkoutModal") closeCheckout();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCheckout();
    closeCart();
  }
});

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

$("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!cart.length) {
    closeCheckout();
    showToast("Your cart is empty");
    return;
  }

  const name = $("#customerName").value.trim();
  const phone = $("#customerPhone").value.trim();
  const address = $("#customerAddress").value.trim();
  const location = $("#customerLocation").value;
  const lines = cart.map((item, i) => `${i + 1}. ${item.name} — Size ${item.size} × ${item.qty} = ${money(item.qty * PRICE)}`);
  const total = cart.reduce((sum, item) => sum + item.qty * PRICE, 0);

  const message = [
    "Hi ODO Fashion! 👋",
    "I would like to place an order:",
    "",
    ...lines,
    "",
    `Total: ${money(total)}`,
    "",
    "CUSTOMER DETAILS",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Delivery location: ${location}`,
    `Address: ${address}`,
    "",
    "Please confirm availability, delivery charge and payment details."
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  closeCheckout();
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

renderCart();
