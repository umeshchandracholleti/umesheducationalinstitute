const contactEmail = "umeshcholleti2219@gmail.com";
const instituteConfig = window.UmeshInstituteConfig || {};
const googleSheetsUrl = instituteConfig.googleSheetsUrl || "";
const apiBaseUrl = instituteConfig.apiBaseUrl || "http://localhost:3000";

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

  const data = new FormData(contactForm);
  const payload = {
    name: data.get("name")?.toString().trim(),
    email: data.get("email")?.toString().trim(),
    phone: data.get("phone")?.toString().trim() || "",
    message: data.get("message")?.toString().trim(),
  };

  const fallbackToEmail = () => {
    const subject = `Learning inquiry from ${payload.name}`;
    const body = `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || "Not provided"}\n\n${payload.message}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formNote.textContent = "Your email app is opening with your inquiry ready to send.";
    contactForm.querySelector('button[type="submit"]').disabled = false;
  };

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  formNote.textContent = "Sending your inquiry...";

  const submission = googleSheetsUrl
    ? fetch(googleSheetsUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      })
    : fetch(`${apiBaseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

  submission
    .then(async (response) => {
      if (googleSheetsUrl) {
        formNote.textContent = "Your inquiry was sent to our response sheet. We will contact you soon.";
        contactForm.reset();
        submitButton.disabled = false;
        return;
      }

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to save your inquiry.");
      }

      formNote.textContent = "Your inquiry has been saved successfully. We will contact you soon.";
      contactForm.reset();
      submitButton.disabled = false;
    })
    .catch((error) => {
      console.error("Inquiry submission failed, falling back to email:", error);
      fallbackToEmail();
    });
});

document.querySelector("#year").textContent = new Date().getFullYear();
