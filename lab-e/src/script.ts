// Słownik stylów

const styles: Record<string, string> = {
    "Styl 1": "/style-1.css",
    "Styl 2": "/style-2.css",
    "Styl 3": "/style-3.css"
};

// Bieżący styl

let currentStyle: string = "";
let currentStyleFile: string = "";

// wyświetlanie statusu (nazwa bieżącego stylu i jego plik)

const status = document.createElement("div");
status.className = "ui-status";

document.body.appendChild(status);

// Funkcja do zmiany stylu

function changeStyle(styleName: string): void {

    const oldLink = document.getElementById("theme-style");
    if(oldLink) {
        oldLink.remove();
    }

    const link = document.createElement("link");
    link.id = "theme-style";
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = styles[styleName];

    document.head.appendChild(link);

    currentStyle = styleName;
    currentStyleFile = styles[styleName]

    status.textContent = `${currentStyle}, plik: ${currentStyleFile}`;
}

function createStyleButtons(): void {
    const container = document.createElement("div");
    container.className = "ui-panel";

    for (const styleName in styles) {
        const btn = document.createElement("button");
        btn.textContent = styleName;
        btn.className = "ui-button";
        btn.onclick = () => changeStyle(styleName);
        container.appendChild(btn);
    }

    document.body.appendChild(container)
}

window.addEventListener("DOMContentLoaded", () => {
   createStyleButtons();
   changeStyle("Styl 1");
});

