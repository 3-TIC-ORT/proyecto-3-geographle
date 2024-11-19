
let objeto4Palabras = [];
let postDataVerificarData = [];
let vidas = 5;
let responseReceived = false; 


let palabrasCorrectas = [];


function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
}


document.addEventListener("DOMContentLoaded", function() {

    fetchData("caracteristicasAleatorias", callback => {
        let data = callback;

      
        data = mezclarArray(data);

        
        data.forEach((palabra, index) => {
            let box = document.getElementById("sixt_" + index);
            box.innerHTML = palabra.word;
            palabrasCorrectas.push(palabra.word); 

            
            box.addEventListener("click", function() {
                if (objeto4Palabras.includes(box.innerHTML)) {
                   
                    box.style.backgroundColor = ''; 
                    box.style.pointerEvents = 'auto'; 
                    objeto4Palabras = objeto4Palabras.filter(palabra => palabra !== box.innerHTML); // Remover la palabra del array

                } else if (objeto4Palabras.length < 4) {
                  
                    box.style.backgroundColor = 'darkgray';
                    box.style.pointerEvents = 'none';
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
                                        box.style.pointerEvents = 'none';
                                        box.style.border = '2px solid blue';
                                        box.style.Opacity = '0.5';
                                        
                                    }
                                });

                                
                                if (todasLasPalabrasDeshabilitadas(document.querySelectorAll(".sixt"))) {
                                    alert("¡Ganaste! Has seleccionado todas las palabras correctamente.");
                                    
                                    enviarEstadisticas(true);                                 }
                            } else {
                                
                                objeto4Palabras.forEach(palabra => {
                                    let box = Array.from(document.querySelectorAll(".sixt")).find(el => el.innerHTML === palabra);
                                    if (box) {
                                        box.style.backgroundColor = ''; 
                                        box.style.pointerEvents = 'auto'; 
                                    }
                                });
                                updateVidas(res.vidas);
                            }

                          
                            objeto4Palabras = [];
                            responseReceived = false;
                        });
                    }
                } else {
                    alert("Ya se han seleccionado 4 palabras.");
                }
            });
        });

        
        updateVidas();
    });
});


function enviarEstadisticas(gano) {
    const user = localStorage.getItem("username")
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


function todasLasPalabrasDeshabilitadas(sixt) {
    return Array.from(sixt).every(six => {
        return six.style.pointerEvents === 'none'; 
    });
}


function updateVidas(vidasCounter = vidas) {
    let redondos = document.querySelectorAll('.puntitos .redondo');

    if (vidasCounter !== null) {
        vidas = vidasCounter;
    }

    let counter = Array.from(redondos).slice(0, vidas);


    counter.forEach(div => {
        div.style.backgroundColor = 'red';
    });


    redondos.forEach(div => {
        if (!counter.includes(div)) {
            div.style.backgroundColor = '#fff';
        }
    });


    if (vidas === 0) {
        enviarEstadisticas(false); 
        vidas = 5;
        updateVidas(vidas);
    }
}

function bloquearJuego() {
    let sixt = document.querySelectorAll(".sixt");
    sixt.forEach(six => {
        six.style.pointerEvents = 'none'; 
        six.style.opacity = '0.5';
    });
    alert("El juego está bloqueado por 24 horas.");
}