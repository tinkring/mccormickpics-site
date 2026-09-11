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
