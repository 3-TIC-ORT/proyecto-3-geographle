const translations = {
    en: {
      settings: "SETTINGS",
      dark: "DARK THEME",
      lang: "SELECT LANGUAGE",
      numdia: "GEOGRAPHLE #1",
      version: "V. 1.00",
      home: "Home",
      game1: "GAME 1",
      game2: "GAME 2",
      game3: "GAME 3",
      game4: "GAME 4",
      stats: "STATISTICS",
      allGames: "ALL GAMES",
      connections: "Connections",
      guessAbout: "Guess About",
      top10: "Top 10",
      higherOrLower: "Higher or Lower",
      play: "PLAY",
      info: "INFO",
      description: "On this website there are 4 mini-games focused on geography. There will be a daily attempt at each one, although previous days can be played through an archive section.",
      geographle: "GEOGRAPH"
    },
    es: {
      settings: "CONFIGURACIÓN",
      dark: "MODO OSCURO",
      lang: "SELECCIONAR IDIOMA",
      numdia: "GEOGRAPHLE #1",
      version: "V. 1.00",
      home: "Inicio",
      game1: "JUEGO 1",
      game2: "JUEGO 2",
      game3: "JUEGO 3",
      game4: "JUEGO 4",
      stats: "ESTADÍSTICAS",
      allGames: "TODOS LOS JUEGOS",
      connections: "Conexiones",
      guessAbout: "Adivina Acerca De",
      top10: "Top 10",
      higherOrLower: "Mayor o Menor",
      play: "JUGAR",
      info: "INFORMACIÓN",
      description: "En este sitio web hay 4 mini-juegos centrados en la geografía. Habrá un intento diario en cada uno, aunque se puede jugar días anteriores a través de una sección de archivo.",
      geographle: "GEOGRAPH"
    }
  };
  
  
  function changeLanguage() {
    const lang = document.getElementById("language-selector").value;
    document.querySelector(".sett").textContent = translations[lang].settings;
    document.querySelector(".dark").textContent = translations[lang].dark;
    document.querySelector(".lang").textContent = translations[lang].lang;
    document.querySelector(".numdia").textContent = translations[lang].numdia;
    document.querySelector(".version").textContent = translations[lang].version;
    document.querySelector(".home").textContent = translations[lang].home;
    document.querySelector(".desc").textContent = translations[lang].desc;
  }
  