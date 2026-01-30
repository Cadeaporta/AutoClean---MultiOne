function setNativeValue(element, value) {
  const setter = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(element),
    "value"
  )?.set;

  setter?.call(element, value);

  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

async function tryLogin() {
  const { user, pass, enabled } =
    await chrome.storage.sync.get(["user", "pass", "enabled"]);

  if (!enabled) return;

  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const button = document.querySelector("button[type='submit']");

  if (!email || !password || !button) return;

  if (email.value || password.value) return;

  setNativeValue(email, user);
  setNativeValue(password, pass);

  setTimeout(() => {
    button.click();
  }, 500);
}

setInterval(tryLogin, 2000);
