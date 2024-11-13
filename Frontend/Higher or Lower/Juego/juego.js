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

    function thememode() {
        let menu = document.getElementById("themeMode-check-container")
        if (menu.classList.contains("themeMode-check-container-on")) {
            menu.classList.remove("themeMode-check-container-on")
        } else {
            menu.classList.add("themeMode-check-container-on")
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
    let firstClick = true;
    let consigna;
    let consecutiveCorrect = 0;
    
    // Declaración de funciones fuera del addEventListener de DOMContentLoaded
    const addClickListeners = (pais1, pais2, consigna) => {
        document.getElementById("higherBtn").onclick = () => verifyAnswerHigherOrLower(pais1, pais2, consigna, "higher");
        document.getElementById("lowerBtn").onclick = () => verifyAnswerHigherOrLower(pais1, pais2, consigna, "lower");
    };
    
    document.addEventListener("DOMContentLoaded", () => {
        postData("iniciarRonda", null, (res) => {
            let pais1 = res.country1;
            let pais2 = res.country2;
            consigna = res.consigna;
    
            // Set country names and flags
            document.getElementById("pais1").innerHTML = pais1.country;
            document.getElementById("pais2").innerHTML = pais2.country;
    
            // Set flags as background images
            document.getElementById("der").style.backgroundImage = `url(${pais2.flag_url})`;
            document.getElementById("izq").style.backgroundImage = `url(${pais1.flag_url})`;
    
            // Set game theme based on consigna
            document.getElementById("gameTheme").innerHTML = {
                gdp_millions: "GDP Economy",
                population_millions: "Population in Millions",
                Territory_km2: "Territory km²"
            }[consigna] || "Error";
    
            document.getElementById("pais1data").innerHTML = pais1[consigna];
    
            // Agregar listeners la primera vez
            if (firstClick) {
                addClickListeners(pais1, pais2, consigna);
                firstClick = false;
            }
        });
    });
    
    const verifyAnswerHigherOrLower = (country1, country2, consigna, userGuess) => {
        const data = {
            "country1": country1,
            "country2": country2,
            "consigna": consigna,
            "userGuess": userGuess
        };
    
        postData("validarRespuesta", data, (res) => {
            if (res === true) {
                handleCorrectAnswer(country2, data);
                consecutiveCorrect++; // Incrementar solo si la respuesta es correcta.
            } else {
                handleWrongAnswer(country2);
                 // Enviar solo si la respuesta es incorrecta.
                consecutiveCorrect = 0; // Resetear el puntaje acumulado.
            }
        });
    };
    
    
    const handleCorrectAnswer = (country2, data) => {
        document.getElementById("higherBtn").style.display = "none";
        document.getElementById("lowerBtn").style.display = "none";
        document.getElementById("pais2data").innerHTML = country2[data.consigna];
    
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
        document.getElementById("higherBtn").style.display = "none";
        document.getElementById("lowerBtn").style.display = "none";
        document.getElementById("pais2data").innerHTML = country2[consigna];
        
        // Enviar las estadísticas solo en caso de respuesta incorrecta
    
        sendGameStats();
        consecutiveCorrect = 0; // Resetear el puntaje acumulado.
    
        // Mostrar mensaje de incorrecto y recargar la página automáticamente después de un pequeño retraso
        alert("Incorrect"); 
        setTimeout(() => {
            location.reload();
        }, 1000); 
    };
    
    
    
    const updateGameState = (res) => {
        let pais1 = res.country1;
        let pais2 = res.country2;
    
        // Actualizar nombres de países y banderas
        document.getElementById("pais1").innerHTML = `${pais1.country}`;
        document.getElementById("pais2").innerHTML = `${pais2.country}`;
        document.getElementById("izq").style.backgroundImage = `url(${pais1.flag_url})`;
        document.getElementById("der").style.backgroundImage = `url(${pais2.flag_url})`;
    
        document.getElementById("pais1data").innerHTML = pais1[consigna];
        document.getElementById("pais2data").innerHTML = "";
    
        // Volver a asignar los listeners
        addClickListeners(pais1, pais2, consigna);
    };
    
    const sendGameStats = () => {
        // Obtener el usuario del localStorage
        let username = localStorage.getItem("username");
        let juego = "Hyl";
    
        // Enviar estadísticas al servidor
        postData("enviarEstadisticasHyl", { username, consecutiveCorrect, juego }, (response) => {
            console.log("Estadísticas enviadas al servidor:", response);
        });
    };
    
