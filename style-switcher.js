const styles = ["style-1.css", "style-2.css"];
const storageKey = "selected-style";

function normalizeStyleName(hrefValue) {
  if (!hrefValue) {
    return styles[0];
  }

  const fileName = hrefValue.split("/").pop();
  return styles.includes(fileName) ? fileName : styles[0];
}

function setButtonLabel(button, activeStyle) {
  button.textContent = activeStyle === styles[0]
    ? "Zmien na styl 2"
    : "Zmien na styl 1";
}

document.addEventListener("DOMContentLoaded", () => {
  const stylesheet = document.getElementById("theme-stylesheet");
  const toggleButton = document.getElementById("style-toggle");

  if (!stylesheet || !toggleButton) {
    return;
  }

  const savedStyle = localStorage.getItem(storageKey);
  if (savedStyle && styles.includes(savedStyle)) {
    stylesheet.setAttribute("href", savedStyle);
  }

  let activeStyle = normalizeStyleName(stylesheet.getAttribute("href"));
  setButtonLabel(toggleButton, activeStyle);

  toggleButton.addEventListener("click", () => {
    activeStyle = activeStyle === styles[0] ? styles[1] : styles[0];
    stylesheet.setAttribute("href", activeStyle);
    localStorage.setItem(storageKey, activeStyle);
    setButtonLabel(toggleButton, activeStyle);
  });
});
