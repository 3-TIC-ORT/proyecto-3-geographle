// Menu handling functions
function toggleMenuClass(elementId, className) {
    const menu = document.getElementById(elementId);
    if (menu) {
        menu.classList.toggle(className);
    }
}

function openmenudropdown() {
    toggleMenuClass("menudropdown", "open");
}

function openestadown() {
    toggleMenuClass("estadown", "edOpen");
}

function optisdown() {
    toggleMenuClass("optidown", "edSet");
}

function thememode() {
    toggleMenuClass("themeMode-check-container", "themeMode-check-container-on");
}

function thememode2() {
    toggleMenuClass("themeMode-check-container2", "themeMode-check-container-on2");
}

// Game result display function
function showResult(isCorrect) {
    const overlay = document.createElement('div');
    overlay.className = 'result-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
}

// Create a message display function
function displayMessage(message, color) {
    let messageElement = document.getElementById('game-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'game-message';
        document.querySelector('section').appendChild(messageElement);
    }
    messageElement.textContent = message;
    messageElement.style.color = color;
}

// Shape selection game functions
function mostrarImagenes() {
    fetchData("obtenerOpcionesForma", function(respuesta) {
        if (!respuesta || !Array.isArray(respuesta.shape_options)) {
            console.error("La respuesta no es un array:", respuesta);
            return;
        }

        const imagenes = respuesta.shape_options;
        const imagenesAleatorias = imagenes.sort(() => Math.random() - 0.5);
        const divsCual = document.querySelectorAll('.cual');

        divsCual.forEach((div, index) => {
            if (index < imagenesAleatorias.length) {
                const img = document.createElement('img');
                img.src = imagenesAleatorias[index];
                img.style.width = '100%';
                img.style.height = '100%';
                img.alt = 'Silueta de país';

                img.addEventListener('click', function() {
                    handleShapeSelection(imagenesAleatorias[index]);
                });

                div.appendChild(img);
            }   
        });
    });
}

function handleShapeSelection(selectedShape) {
    document.querySelectorAll('.cual img').forEach(img => {
        img.parentElement.classList.remove('selected');
    });

    const selectedImg = Array.from(document.querySelectorAll('.cual img')).find(img => img.src === selectedShape);
    if (selectedImg) {
        selectedImg.parentElement.classList.add('selected');
    }

    postData("verificarRespuestaForma", selectedShape, function(response) {
        if (response.esCorrecta) {
            displayMessage("¡Correcto! Has acertado la forma.", 'green');
            showResult(true);
            setTimeout(() => {
                window.location.href = '/Frontend/GuessAbout/bandera/silueta/lengua/index.html';
            }, 1500);
        } else {
            handleLives(response);
        }
    });
}

// Country verification game functions
function verifySelection() {
    const selectedCountry = document.querySelector('select').value;

    postData("verificarPais", { selectedCountry: selectedCountry }, (response) => {
        displayMessage('', '');
        if (response.esCorrecta) {
            displayMessage("¡Correcto! Has acertado el país.", 'green');
            setTimeout(() => {
                window.location.href = '/Frontend/GuessAbout/bandera/silueta/index.html';
            }, 1500);
        } else {
            handleLives(response);
        }
    });
}

// Flag loading function
function loadFlag() {
    fetchData("obtenerFlag", (data) => {
        if (data && data.flag) {
            const flagImg = document.createElement('img');
            flagImg.src = data.flag;
            flagImg.alt = "Bandera del país";
            flagImg.style.width = "99%";
            flagImg.style.height = "99%";
            flagImg.style.objectFit = "contain";

            const flagContainer = document.querySelector('.banderabd');
            if (flagContainer) {
                flagContainer.innerHTML = '';
                flagContainer.appendChild(flagImg);
                flagContainer.style.display = "flex";
                flagContainer.style.justifyContent = "center";
                flagContainer.style.alignItems = "center";
            } else {
                console.error("Elemento con clase 'banderabd' no encontrado en el HTML");
            }
        } else {
            console.error("No se recibió una URL de bandera válida del servidor");
        }
    });
}

// Handle lives based on game state
function handleLives(response) {
    displayMessage(`Incorrecto. Te quedan ${response.vidas} vidas.`, 'red');
    if (response.vidas > 0) {
        // Continue the game
    } else {
        displayMessage(`Game Over. ${response.mensaje}`, 'red');
        setTimeout(() => {
            window.location.href = '/Frontend/Menu/';
        }, 1500);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.cual')) {
        mostrarImagenes();
    }
    if (document.querySelector('.banderabd')) {
        loadFlag();
    }
});

// Language selection functions
function mostrarOpcionesIdioma() {
    fetchData("obtenerOpcionesIdioma", function(respuesta) {
        if (!respuesta || !Array.isArray(respuesta.language_options)) {
            console.error("La respuesta no es un array:", respuesta);
            return;
        }

        const opciones = respuesta.language_options;
        const opcionesAleatorias = opciones.sort(() => Math.random() - 0.5);
        const divsCual = document.querySelectorAll('#cualid');

        divsCual.forEach((div, index) => {
            if (index < opcionesAleatorias.length) {
                div.textContent = opcionesAleatorias[index];

                div.addEventListener('click', function() {
                    handleLanguageSelection(opcionesAleatorias[index]);
                });
            } else {
                div.textContent = '';
            }
        });
    });
}

function handleLanguageSelection(selectedLanguage) {
    document.querySelectorAll('#cualid').forEach(div => {
        div.classList.remove('selected');
    });

    const selectedDiv = Array.from(document.querySelectorAll('#cualid')).find(div => div.textContent === selectedLanguage);
    if (selectedDiv) {
        selectedDiv.classList.add('selected');
    }

    postData("verificarRespuestaIdioma", { selectedLanguage }, (response) => {
        displayMessage('', '');
        if (response.esCorrecta) {
            displayMessage("¡Correcto! Has acertado el idioma.", 'green');
            setTimeout(() => {
                window.location.href = '/Frontend/GuessAbout/bandera/silueta/lengua/capital/index.html';
            }, 1500);
        } else {
            handleLives(response);
        }
    });
}

// Load capital options function
const cuales = document.querySelectorAll('.cuale');
function loadCapitalOptions() {
    fetchData("obtenerOpcionesCapital", (data) => {
        if (data && data.capital_options) {
            cuales.forEach(cuale => {
                cuale.innerHTML = '';
            });

            data.capital_options.forEach((opcion, index) => {
                const div = cuales[index];
                if (div) {
                    div.textContent = opcion;
                    div.addEventListener('click', function() {
                        handleCapitalSelection(opcion);
                    });
                }
            });
        }
    });
}

// Función para enviar las estadísticas al backend
function enviarEstadisticas(gano) {
    const user = localStorage.getItem("username");

    if (user !== undefined) {
        // Asegúrate de que la variable esté definida aquí
        const estadisticas = {
            username: user,
            juego: "Guess_about",
            gano: gano
        };

        // Aquí puedes usar 'estadisticas' sin problemas
        console.log("Estadísticas a enviar:", estadisticas);
        
        postData("estadisticasGuessAbout", estadisticas, (response) => {
            console.log("Respuesta del servidor:", response);
            if (response.success) {
                displayMessage("Estadísticas guardadas correctamente.", "green");
            } else {
                displayMessage("Hubo un error al guardar las estadísticas.", "red");
            }
        });
    }
}

// Lógica de verificación si el usuario gana la última ronda de capital
function handleCapitalSelection(selectedCapital) {
    cuales.forEach(cuale => {
        cuale.classList.remove('selected');
    });

    const selectedDiv = Array.from(cuales).find(div => div.textContent === selectedCapital);
    if (selectedDiv) {
        selectedDiv.classList.add('selected');
    }

    postData("verificarRespuestaCapital", { selectedCapital: selectedCapital }, (response) => {
        displayMessage('', '');
        if (response.esCorrecta) {
            displayMessage("¡Correcto! Has acertado la capital.", 'green');
            setTimeout(() => {
                enviarEstadisticas(true); // Envía estadística con `gano` en true si acierta
                window.location.href = '/Frontend/Menu/';
            }, 1500);
        } else {
            handleLives(response);
            if (response.vidas === 0) {
                enviarEstadisticas(false); // Envía estadística con `gano` en false si pierde todas las vidas
            }
        }
    });
}

// Event listeners for loading options on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    mostrarOpcionesIdioma();
    loadCapitalOptions();
});
console.log("Enviando estadísticas:", estadisticas);
