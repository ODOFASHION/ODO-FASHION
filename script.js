const WHATSAPP_NUMBER = "9779845319200";

function order(product) {
  const message = encodeURIComponent(`Hi ODO Fashion, I'm interested in the ${product}. Please send me details about price, sizes and availability.`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

document.querySelectorAll("[data-order]").forEach((button) => {
  button.addEventListener("click", () => order(button.dataset.order));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
