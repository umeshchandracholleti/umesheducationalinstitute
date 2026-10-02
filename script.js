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
const programSelect = document.querySelector("#program");

document.querySelectorAll(".pathway-cta[data-program]").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedProgram = button.dataset.program;
    const matchingOption = Array.from(programSelect?.options || []).find(
      (option) => option.textContent.trim() === selectedProgram,
    );

    if (matchingOption) programSelect.value = matchingOption.value;
  });
});

const filmPlayer = document.querySelector(".film-player");
const filmPlayButton = document.querySelector("#film-play");
const filmRestartButton = document.querySelector("#film-restart");
const filmScrubber = document.querySelector("#film-scrubber");
const filmTime = document.querySelector("#film-time");
const filmSceneCount = document.querySelector("#film-scene-count");
const filmSceneTitle = document.querySelector("#film-scene-title");
const filmSceneCaption = document.querySelector("#film-scene-caption");
const filmSymbol = document.querySelector("#film-symbol");

if (filmPlayer && filmPlayButton && filmRestartButton && filmScrubber) {
  const duration = 120;
  const scenes = [
    { title: "Every journey begins with a question.", caption: "A curious mind is the beginning of every bright future.", symbol: "?" },
    { title: "First, we build strong foundations.", caption: "From Classes 1 to 10, small discoveries become lasting confidence.", symbol: "✎" },
    { title: "Then new doors begin to open.", caption: "Intermediate learning helps students explore interests and prepare for what comes next.", symbol: "↗" },
    { title: "Knowledge grows into possibility.", caption: "Graduation pathways connect learning, skills, and future plans.", symbol: "▤" },
    { title: "Big goals deserve a clear plan.", caption: "Focused practice and guidance help aspirants prepare for competitive examinations.", symbol: "◎" },
    { title: "Practical skills bring confidence.", caption: "Communication, digital, and interview practice support job readiness.", symbol: "✦" },
    { title: "Your next step can be your own.", caption: "Explore choices, recognize your strengths, and make informed career decisions.", symbol: "✳" },
    { title: "One learning journey. Every opportunity.", caption: "Umesh Educational Institute — curious minds, confident futures.", symbol: "UEI" },
  ];
  let elapsed = 0;
  let lastFrame = 0;
  let animationFrame = 0;
  let playing = false;
  let activeScene = -1;

  const formatTime = (seconds) => {
    const wholeSeconds = Math.floor(seconds);
    return `${String(Math.floor(wholeSeconds / 60)).padStart(2, "0")}:${String(wholeSeconds % 60).padStart(2, "0")}`;
  };

  const update = () => {
    const sceneIndex = Math.min(scenes.length - 1, Math.floor(elapsed / (duration / scenes.length)));
    filmScrubber.value = String(Math.floor(elapsed));
    filmScrubber.setAttribute("aria-valuetext", `${Math.floor(elapsed)} seconds of 2 minutes`);
    filmTime.textContent = `${formatTime(elapsed)} / 02:00`;
    filmPlayer.dataset.scene = String(sceneIndex);

    if (sceneIndex !== activeScene) {
      const scene = scenes[sceneIndex];
      activeScene = sceneIndex;
      filmSceneCount.textContent = `SCENE ${String(sceneIndex + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
      filmSceneTitle.textContent = scene.title;
      filmSceneCaption.textContent = scene.caption;
      filmSymbol.textContent = scene.symbol;
      filmSymbol.setAttribute("aria-label", scene.title);
    }
  };

  const stop = () => {
    playing = false;
    cancelAnimationFrame(animationFrame);
    filmPlayButton.innerHTML = "▶ <span>Play story</span>";
    filmPlayButton.setAttribute("aria-label", "Play story");
  };

  const tick = (timestamp) => {
    if (!playing) return;
    if (lastFrame) elapsed += Math.min((timestamp - lastFrame) / 1000, 0.25);
    lastFrame = timestamp;

    if (elapsed >= duration) {
      elapsed = duration;
      update();
      stop();
      return;
    }

    update();
    animationFrame = requestAnimationFrame(tick);
  };

  filmPlayButton.addEventListener("click", () => {
    if (playing) {
      stop();
      return;
    }

    if (elapsed >= duration) elapsed = 0;
    playing = true;
    lastFrame = 0;
    filmPlayButton.innerHTML = "Ⅱ <span>Pause story</span>";
    filmPlayButton.setAttribute("aria-label", "Pause story");

    animationFrame = requestAnimationFrame(tick);
  });

  filmRestartButton.addEventListener("click", () => {
    stop();
    elapsed = 0;
    activeScene = -1;
    update();
  });

  filmScrubber.addEventListener("input", () => {
    elapsed = Number(filmScrubber.value);
    activeScene = -1;
    update();
    if (elapsed >= duration) stop();
  });

  update();
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const data = new FormData(contactForm);
  const payload = {
    name: data.get("name")?.toString().trim(),
    email: data.get("email")?.toString().trim(),
    phone: data.get("phone")?.toString().trim() || "",
    program: data.get("program")?.toString().trim() || "General Inquiry",
    message: data.get("message")?.toString().trim(),
  };

  const fallbackToEmail = () => {
    const subject = `Learning inquiry from ${payload.name}`;
    const body = `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || "Not provided"}\nProgram: ${payload.program}\n\n${payload.message}`;
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
