function openmenudropdown() {
    let menu = document.getElementById("menudropdown")
    menu.classList.toggle("open")
}

function openestadown() {
    let menu = document.getElementById("estadown")
    menu.classList.toggle("edOpen")
}

function optisdown() {
    let menu = document.getElementById("optidown")
    menu.classList.toggle("edSet")
}

function thememode() {
    let menu = document.getElementById("themeMode-check-container")
    menu.classList.toggle("themeMode-check-container-on")
}

function thememode2() {
    let menu = document.getElementById("themeMode-check-container2")
    menu.classList.toggle("themeMode-check-container-on2")
}

let firstClick = true;
let consigna;
let consecutiveCorrect = 0;
let messageTimeout = null;
let reloadTimeout = null;

// Función para bloquear interacción del juego (botones)
const disableGameInteraction = () => {
    const higher = document.getElementById("higherBtn");
    const lower = document.getElementById("lowerBtn");
    if (higher) {
        higher.style.pointerEvents = "none";
        higher.style.opacity = "0.6";
    }
    if (lower) {
        lower.style.pointerEvents = "none";
        lower.style.opacity = "0.6";
    }
};

// Función para habilitar interacción (por si la querés usar después)
const enableGameInteraction = () => {
    const higher = document.getElementById("higherBtn");
    const lower = document.getElementById("lowerBtn");
    if (higher) {
        higher.style.pointerEvents = "";
        higher.style.opacity = "";
    }
    if (lower) {
        lower.style.pointerEvents = "";
        lower.style.opacity = "";
    }
};

// Mostrar overlay rojo que bloquea la pantalla
const showYouLostOverlay = (displayTime = 8000) => {
    // limpiar overlay antiguo si existe
    const existing = document.getElementById("youLostOverlay");
    if (existing) existing.remove();
    if (messageTimeout) {
        clearTimeout(messageTimeout);
        messageTimeout = null;
    }

    const overlay = document.createElement("div");
    overlay.id = "youLostOverlay";
    // estilos generales
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(255, 0, 0, 0.55)"; // rojo traslúcido
    overlay.style.zIndex = "10000";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.pointerEvents = "auto"; // bloquea clicks debajo
    // texto centrado
    const txt = document.createElement("div");
    txt.innerText = "YOU LOST";
    txt.style.fontFamily = "sans-serif";
    txt.style.fontSize = "56px";
    txt.style.fontWeight = "700";
    txt.style.color = "white";
    txt.style.textAlign = "center";
    txt.style.textShadow = "0 4px 12px rgba(0,0,0,0.5)";
    overlay.appendChild(txt);

    document.body.appendChild(overlay);

    // quitar overlay después de displayTime ms
    messageTimeout = setTimeout(() => {
        const el = document.getElementById("youLostOverlay");
        if (el) el.remove();
        messageTimeout = null;
    }, displayTime);
};

// Declaración de funciones fuera del addEventListener de DOMContentLoaded
const addClickListeners = (pais1, pais2, consigna) => {
    const higher = document.getElementById("higherBtn");
    const lower = document.getElementById("lowerBtn");
    if (higher) higher.onclick = () => verifyAnswerHigherOrLower(pais1, pais2, consigna, "higher");
    if (lower) lower.onclick = () => verifyAnswerHigherOrLower(pais1, pais2, consigna, "lower");
};

document.addEventListener("DOMContentLoaded", () => {
    postData("iniciarRonda", null, (res) => {
        let pais1 = res.country1;
        let pais2 = res.country2;
        consigna = res.consigna;

        document.getElementById("pais1").innerHTML = pais1.country;
        document.getElementById("pais2").innerHTML = pais2.country;

        document.getElementById("der").style.backgroundImage = `url(${pais2.flag_url})`;
        document.getElementById("izq").style.backgroundImage = `url(${pais1.flag_url})`;

        document.getElementById("gameTheme").innerHTML = {
            gdp_millions: "GDP Economy",
            population_millions: "Population in Millions",
            Territory_km2: "Territory km²"
        }[consigna] || "Error";

        document.getElementById("pais1data").innerHTML = pais1[consigna].toLocaleString('es-ES');

        if (firstClick) {
            addClickListeners(pais1, pais2, consigna);
            firstClick = false;
        }
    });
});

const verifyAnswerHigherOrLower = (country1, country2, consigna, userGuess) => {
    // Caso especial: valores iguales, no perder
    if (country1[consigna] === country2[consigna]) {
        const hb = document.getElementById("higherBtn");
        const lb = document.getElementById("lowerBtn");
        if (hb) hb.style.display = "none";
        if (lb) lb.style.display = "none";
        document.getElementById("pais2data").innerHTML = country2[consigna].toLocaleString('es-ES');
        consecutiveCorrect++;

        setTimeout(() => {
            postData("continuarJuego", country2, (res) => {
                updateGameState(res);
            });
            if (hb) hb.style.display = "flex";
            if (lb) lb.style.display = "flex";
            document.getElementById("pais2data").innerHTML = "";
        }, 1500);
        return;
    }

    const data = {
        "country1": country1,
        "country2": country2,
        "consigna": consigna,
        "userGuess": userGuess
    };

    postData("validarRespuesta", data, (res) => {
        if (res === true) {
            handleCorrectAnswer(country2, data);
            consecutiveCorrect++;
        } else {
            handleWrongAnswer(country2);
            consecutiveCorrect = 0;
        }
    });
};

const handleCorrectAnswer = (country2, data) => {
    document.getElementById("higherBtn").style.display = "none";
    document.getElementById("lowerBtn").style.display = "none";
    document.getElementById("pais2data").innerHTML = country2[data.consigna].toLocaleString('es-ES');

    setTimeout(() => {
        postData("continuarJuego", country2, (res) => {
            updateGameState(res);
        });
        document.getElementById("higherBtn").style.display = "flex";
        document.getElementById("lowerBtn").style.display = "flex";
        document.getElementById("pais2data").innerHTML = "";
    }, 1500);
};

const handleWrongAnswer = (country2) => {
    // Ocultar botones y mostrar valor del pais2
    const hb = document.getElementById("higherBtn");
    const lb = document.getElementById("lowerBtn");
    if (hb) hb.style.display = "none";
    if (lb) lb.style.display = "none";
    document.getElementById("pais2data").innerHTML = country2[consigna].toLocaleString('es-ES');

    // enviar estadísticas (no provoca recarga por si solo)
    sendGameStats();
    consecutiveCorrect = 0;

    // Deshabilitar interacción (evita clicks mientras está el overlay)
    disableGameInteraction();

    // Mostrar overlay rojo por más tiempo (8s)
    const displayTime = 8000; // ms
    showYouLostOverlay(displayTime);

    // Limpiar cualquier reload previo y programar recarga después de displayTime
    if (reloadTimeout) {
        clearTimeout(reloadTimeout);
        reloadTimeout = null;
    }
    reloadTimeout = setTimeout(() => {
        location.reload();
    }, displayTime + 1000); // +200ms para dar tiempo a quitar overlay
};

const updateGameState = (res) => {
    let pais1 = res.country1;
    let pais2 = res.country2;

    document.getElementById("pais1").innerHTML = `${pais1.country}`;
    document.getElementById("pais2").innerHTML = `${pais2.country}`;
    document.getElementById("izq").style.backgroundImage = `url(${pais1.flag_url})`;
    document.getElementById("der").style.backgroundImage = `url(${pais2.flag_url})`;

    document.getElementById("pais1data").innerHTML = pais1[consigna].toLocaleString('es-ES');
    document.getElementById("pais2data").innerHTML = "";

    addClickListeners(pais1, pais2, consigna);
};

const sendGameStats = () => {
    let username = localStorage.getItem("username");
    let juego = "Hyl";
    let d = new Date();
    let date = d.getDate;

    postData("enviarEstadisticasHyl", { username, consecutiveCorrect, juego, date }, (response) => {
        console.log("Estadísticas enviadas al servidor:", response);
    });
};
