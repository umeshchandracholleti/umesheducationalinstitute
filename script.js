// Set this to the admissions email address before publishing the site.
const contactEmail = "YOUR_EMAIL_ADDRESS";

const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav?.classList.toggle("is-open", !isOpen);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  });
});

const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  if (contactEmail === "YOUR_EMAIL_ADDRESS") {
    formNote.textContent = "Please set the admissions email in script.js before publishing this contact form.";
    return;
  }

  const data = new FormData(contactForm);
  const subject = `Learning inquiry from ${data.get("name")}`;
  const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
  window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formNote.textContent = "Your email app is opening with your inquiry ready to send.";
});

document.querySelector("#year").textContent = new Date().getFullYear();
