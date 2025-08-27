function openmenudropdown() {
    let menu = document.getElementById("menudropdown");
    menu.classList.toggle("open");
}

function openestadown() {
    let menu = document.getElementById("estadown");
    menu.classList.toggle("edOpen");
}

function optisdown() {
    let menu = document.getElementById("optidown");
    menu.classList.toggle("edSet");
}

function thememode() {
    let menu = document.getElementById("themeMode-check-container");
    menu.classList.toggle("themeMode-check-container-on");
}

function thememode2() {
    let menu = document.getElementById("themeMode-check-container2");
    menu.classList.toggle("themeMode-check-container-on2");
}

function infodown() {
    let menu = document.getElementById("infodown");
    menu.classList.toggle("edinf");
}

// Variables globales
let objeto4Palabras = [];
let postDataVerificarData = [];
let vidas = 3;
let responseReceived = false;
let palabrasCorrectas = [];

// Función para mezclar un array de forma aleatoria
function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para mostrar modal de resultado
function mostrarResultado(win) {
    let modal = document.getElementById("resultadoModal");
    let texto = document.getElementById("resultadoTexto");
    texto.textContent = win ? "You Win!" : "You Lost!";

    modal.style.display = "flex";
    modal.style.opacity = 1;

    // Ocultar después de 10 segundos
    setTimeout(() => {
        modal.style.display = "none";
    }, 10000);

    modal.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

document.addEventListener("DOMContentLoaded", function() {
    fetchData("caracteristicasAleatorias", callback => {
        let data = mezclarArray(callback);

        data.forEach((palabra, index) => {
            let box = document.getElementById("sixt_" + index);
            box.innerHTML = palabra.word;
            palabrasCorrectas.push(palabra.word);

            box.addEventListener("click", function() {
                if (objeto4Palabras.includes(box.innerHTML)) {
                    // Deseleccionar
                    box.style.backgroundColor = '';
                    box.style.border = '';
                    objeto4Palabras = objeto4Palabras.filter(p => p !== box.innerHTML);

                } else if (objeto4Palabras.length < 4) {
                    // Seleccionar
                    box.style.backgroundColor = 'darkgray';
                    box.style.border = '2px solid gray';
                    objeto4Palabras.push(box.innerHTML);

                    if (objeto4Palabras.length === 4 && !responseReceived) {
                        postDataVerificarData = [objeto4Palabras, vidas];
                        postData("verificarSeleccion", postDataVerificarData, (res) => {
                            responseReceived = true;

                            if (res.esCorrecta) {
                                objeto4Palabras.forEach(palabra => {
                                    let box = Array.from(document.querySelectorAll(".sixt")).find(el => el.innerHTML === palabra);
                                    if (box) {
                                        box.style.backgroundColor = 'rgba(96, 132, 243, 0.5)';
                                        box.style.border = '2px solid blue';
                                        box.style.pointerEvents = 'none';
                                        box.style.opacity = '0.5';
                                    }
                                });

                                if (todasLasPalabrasDeshabilitadas(document.querySelectorAll(".sixt"))) {
                                    mostrarResultado(true);
                                    enviarEstadisticas(true);
                                }

                                objeto4Palabras = [];
                                responseReceived = false;

                            } else {
                                let seleccionActual = [...objeto4Palabras];

                                seleccionActual.forEach(palabra => {
                                    let box = Array.from(document.querySelectorAll(".sixt")).find(el => el.innerHTML === palabra);
                                    if (box) {
                                        box.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
                                        box.style.border = '2px solid red';
                                    }
                                });

                                setTimeout(() => {
                                    seleccionActual.forEach(palabra => {
                                        let box = Array.from(document.querySelectorAll(".sixt")).find(el => el.innerHTML === palabra);
                                        if (box) {
                                            box.style.backgroundColor = '';
                                            box.style.border = '';
                                        }
                                    });
                                    updateVidas(res.vidas);
                                    objeto4Palabras = [];
                                    responseReceived = false;
                                }, 500);
                            }
                        });
                    }
                } else {
                    console.log("Ya se han seleccionado 4 palabras.");
                }
            });
        });

        updateVidas();
    });
});

function enviarEstadisticas(gano) {
    const estadisticas = {
        juego: "Connections",
        gano: gano,
        vidasRestantes: vidas
    };

    postData("guardarEstadisticas", estadisticas, (response) => {
        console.log("Estadísticas enviadas:", response);
    });
}

function todasLasPalabrasDeshabilitadas(sixt) {
    return Array.from(sixt).every(six => six.style.pointerEvents === 'none');
}

function updateVidas(vidasCounter = vidas) {
    let redondos = document.querySelectorAll('.puntitos .redondo');

    if (vidasCounter !== null) vidas = vidasCounter;

    let counter = Array.from(redondos).slice(0, vidas);
    counter.forEach(div => div.style.backgroundColor = 'red');
    redondos.forEach(div => {
        if (!counter.includes(div)) div.style.backgroundColor = '#fff';
    });

    if (vidas === 0) {
        mostrarResultado(false);
        enviarEstadisticas(false);
        vidas = 3;
        updateVidas(vidas);
        bloquearJuego();
    }
}

function bloquearJuego() {
    let sixt = document.querySelectorAll(".sixt");
    sixt.forEach(six => {
        six.style.pointerEvents = 'none';
        six.style.opacity = '0.5';
    });
}
