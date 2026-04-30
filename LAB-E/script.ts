const styles = ["style-1.css", "style-2.css", "style-3.css"];
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = styles[0];
document.head.append(link);

function changeStyle(styleHref: string) {
  link.href = styleHref;
}

function addStyleButtons() {
  const buttonsDiv = document.querySelector<HTMLDivElement>("#buttons");
  if (!buttonsDiv) {
    console.error("Nie znaleziono div o id 'buttons'");
    return;
  }

  styles.forEach((style) => {
    const button = document.createElement("button");
    button.textContent = `${style}`;
    button.addEventListener("click", () => changeStyle(style));
    buttonsDiv.appendChild(button);
  });
}

addStyleButtons();

addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const msg: string = "Hello!";
    alert(msg);
  }, 1000);
})