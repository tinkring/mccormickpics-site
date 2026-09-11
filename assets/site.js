// Email delivery belongs to the existing McPics appliance. The website only
// opens an email draft or copies its established recipient address.
const copyButton = document.querySelector("[data-copy-email]");
const emailLink = document.querySelector("#upload-address");
const copyStatus = document.querySelector("#copy-status");
const copyFallback = document.querySelector("#copy-fallback");
const emailInput = document.querySelector("#email-to-copy");

if (copyButton && emailLink && copyStatus && copyFallback && emailInput) {
  const email = emailLink.textContent.trim();
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    copyStatus.textContent = "";
    try {
      await navigator.clipboard.writeText(email);
      copyFallback.hidden = true;
      copyStatus.textContent = "Email address copied. Paste it into your email app and attach your photos.";
    } catch {
      emailInput.value = email;
      copyFallback.hidden = false;
      emailInput.focus();
      emailInput.select();
      copyStatus.textContent = "Select and copy the address below.";
    }
  });
}

// The page stays fully visible before these enhancements run. Animations never
// leave opacity/transform styles behind, so disabled JS or an unsupported API
// cannot hide the story or the photo-sharing controls.
(() => {
  if (typeof window.matchMedia !== "function") return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(min-width: 761px) and (hover: hover) and (pointer: fine)");
  const animations = new Set();
  const revealed = new WeakSet();
  let revealObserver;

  function reveal(element, delay = 0) {
    if (reducedMotion.matches || revealed.has(element)) return;
    revealed.add(element);
    if (typeof element.animate !== "function") return;

    const animation = element.animate(
      [{ opacity: .45, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }],
      { duration: 700, delay, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" }
    );
    animations.add(animation);
    animation.finished.then(
      () => animations.delete(animation),
      () => animations.delete(animation)
    );
  }

  function watchReveals() {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .1, rootMargin: "0px 0px -24px 0px" });
    document.querySelectorAll(".steps li, .section-intro, .tip, [data-reveal]").forEach((element) => {
      if (!revealed.has(element)) revealObserver.observe(element);
    });
  }

  // In-page links should land directly at their destination without an entrance
  // animation playing elsewhere on the page.
  if (!window.location.hash) {
    document.querySelectorAll(".hero-copy > .eyebrow, .hero-copy > h1, .hero-description, .portrait-stage").forEach((element, index) => {
      reveal(element, index * 70);
    });
  }
  watchReveals();

  const stage = document.querySelector("[data-portrait-tilt]");
  const stack = stage?.querySelector(".portrait-stack");
  let tiltFrame = 0;
  let tiltX = 0;
  let tiltY = 0;

  function resetTilt() {
    window.cancelAnimationFrame(tiltFrame);
    tiltFrame = 0;
    if (!stack) return;
    stack.classList.remove("is-tilting");
    stack.style.removeProperty("--tilt-x");
    stack.style.removeProperty("--tilt-y");
  }

  if (stage && stack) {
    stage.addEventListener("pointermove", (event) => {
      if (reducedMotion.matches || !finePointer.matches || event.pointerType !== "mouse") return;
      const bounds = stage.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const clamp = (value) => Math.max(-1, Math.min(1, value));
      tiltX = -clamp((event.clientY - bounds.top) / bounds.height * 2 - 1) * 3;
      tiltY = clamp((event.clientX - bounds.left) / bounds.width * 2 - 1) * 3;
      if (tiltFrame) return;
      tiltFrame = window.requestAnimationFrame(() => {
        tiltFrame = 0;
        stack.classList.add("is-tilting");
        stack.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        stack.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      });
    });
    stage.addEventListener("pointerleave", resetTilt);
    stage.addEventListener("pointercancel", resetTilt);
    window.addEventListener("blur", resetTilt);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) resetTilt();
    });
  }

  reducedMotion.addEventListener("change", () => {
    resetTilt();
    revealObserver?.disconnect();
    if (reducedMotion.matches) {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    } else {
      watchReveals();
    }
  });
  finePointer.addEventListener("change", resetTilt);
})();
