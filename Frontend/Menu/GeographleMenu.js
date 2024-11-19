function openmenudropdown() {
    let menu = document.getElementById("menudropdown")
    if (menu.classList.contains("open")) {
        menu.classList.remove("open")
    } else {
        menu.classList.add("open")
    }
}

function openestadown() {
    let menu = document.getElementById("estadown")
    if (menu.classList.contains("edOpen")) {
        menu.classList.remove("edOpen")
    } else {
        menu.classList.add("edOpen")
    }
}

function optisdown() {
    let menu = document.getElementById("optidown")
    if (menu.classList.contains("edSet")) {
        menu.classList.remove("edSet")
    } else {
        menu.classList.add("edSet")
    }
}

function toggleTheme() {
    let body = document.getElementById("body");
    let checkbox = document.getElementById("themeMode-check");

    if (checkbox.checked) {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
    }
}

function thememode2() {
    let menu = document.getElementById("themeMode-check-container2")
    if (menu.classList.contains("themeMode-check-container-on2")) {
        menu.classList.remove("themeMode-check-container-on2")
    } else {
        menu.classList.add("themeMode-check-container-on2")
    }
}

function infodown() {
    let menu = document.getElementById("infodown")
    if (menu.classList.contains("edinf")) {
        menu.classList.remove("edinf")
    } else {
        menu.classList.add("edinf")
    }
}
const translations = {
    en: {
      settings: "SETTINGS",
      dark: "DARK THEME",
      lang: "SELECT LANGUAGE",
      numdia: "GEOGRAPHLE #1",
      version: "V. 1.00"
    },
    es: {
      settings: "CONFIGURACIÓN",
      dark: "MODO OSCURO",
      lang: "SELECCIONAR IDIOMA",
      numdia: "GEOGRAPHLE #1",
      version: "V. 1.00"
    }
  };
  
  function changeLanguage() {
    const lang = document.getElementById("language-selector").value;
    document.querySelector(".sett").textContent = translations[lang].settings;
    document.querySelector(".dark").textContent = translations[lang].dark;
    document.querySelector(".lang").textContent = translations[lang].lang;
    document.querySelector(".numdia").textContent = translations[lang].numdia;
    document.querySelector(".version").textContent = translations[lang].version;
  }
  