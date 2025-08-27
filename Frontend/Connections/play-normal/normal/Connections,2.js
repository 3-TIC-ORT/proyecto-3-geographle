// Variables globales
let objeto4Palabras = [];
let postDataVerificarData = [];
let vidas = 5;
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

// Función para mostrar el modal de resultado
function mostrarResultado(win) {
    let modal = document.getElementById("resultadoModal");
    let texto = document.getElementById("resultadoTexto");
    texto.textContent = win ? "You Win!" : "You Lost!";

    // Mostrar modal sin animación de salida
    modal.style.display = "flex";
    modal.style.opacity = 1;

    // Ocultar después de 10 segundos
    setTimeout(() => {
        modal.style.display = "none";
    }, 10000); // ahora dura 10 segundos

    // Permitir cerrar al clic
    modal.addEventListener("click", () => {
        modal.style.display = "none";
    });
}


// Esperar a que el DOM se cargue completamente
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
                                        box.style.opacity = '0.5';
                                        box.style.pointerEvents = 'none';
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

// Función para enviar estadísticas al backend
function enviarEstadisticas(gano) {
    const user = localStorage.getItem("username");
    if(user != undefined){
        const estadisticas = {
            username: user,
            juego: "Connections", 
            gano: gano,
            vidasRestantes: vidas
        };
    
        postData("guardarEstadisticas", estadisticas, (response) => {
            console.log("Estadísticas enviadas:", response);
        });
    }
}

// Función para comprobar si todas las palabras están deshabilitadas
function todasLasPalabrasDeshabilitadas(sixt) {
    return Array.from(sixt).every(six => six.style.pointerEvents === 'none');
}

// Función para actualizar la visualización de las vidas
function updateVidas(vidasCounter = vidas) {
    let redondos = document.querySelectorAll('.puntitos .redondo');

    if (vidasCounter !== null) {
        vidas = vidasCounter;
    }

    let counter = Array.from(redondos).slice(0, vidas);
    counter.forEach(div => div.style.backgroundColor = 'red');
    redondos.forEach(div => {
        if (!counter.includes(div)) div.style.backgroundColor = '#fff';
    });

    if (vidas === 0) {
        mostrarResultado(false);
        enviarEstadisticas(false);
        vidas = 5;
        updateVidas(vidas);
        bloquearJuego();
    }
}

// Función para bloquear el juego
function bloquearJuego() {
    let sixt = document.querySelectorAll(".sixt");
    sixt.forEach(six => {
        six.style.pointerEvents = 'none';
        six.style.opacity = '0.5';
    });
}
