import fs from 'fs';
import { onEvent, startServer } from "soquetic";
import path from 'path';
import { fileURLToPath } from 'url';





// Importaciones desde guess_about/index.js
import { 
    obtenerFlag,
    obtenerOpcionesIdioma,
    obtenerOpcionesCapital,
    obtenerOpcionesForma,
    verificarRespuestaFlag,
    verificarRespuestaIdioma,
    verificarRespuestaCapital,
    verificarRespuestaForma,
    guardarEstadisticasGuessAbout,
    cargarEstadisticasGuessAbout
} from './backend/Guess_about/index.js';  

// Importaciones desde connections/index.js
import { 
    obtenerCaracteristicasAleatorias, 
    verificarSeleccion, 
    guardarEstadisticas, 
    handleVerificarSeleccion,
    cargarEstadisticas
} from './backend/connections/index.js'; 

// Importaciones desde Top10/index.js
import { 
    verifyAnswerTop10,
    consignaAleatoriaTop10,
    guardarEstadisticasTop10,
    cargarEstadisticasTop10
} from './backend/top10/index.js'; 

// Eventos Top10
onEvent("consignaAleatoria", async () => {
    return await consignaAleatoriaTop10();
});

onEvent("verificarSeleccionTop10", async (userAnswer) => {
    return await verifyAnswerTop10(userAnswer);
});
onEvent("guardarEstadisticasTop10", guardarEstadisticasTop10)
onEvent("cargarEstadisticasTop10", cargarEstadisticasTop10)

// Eventos Connections
onEvent("caracteristicasAleatorias", obtenerCaracteristicasAleatorias);
onEvent("verificarSeleccion", handleVerificarSeleccion);
onEvent("guardarEstadisticas", guardarEstadisticas);
onEvent("cargarEstadisticas", cargarEstadisticas)

// Eventos Guess_about
onEvent("obtenerFlag", obtenerFlag);
onEvent("obtenerOpcionesIdioma", obtenerOpcionesIdioma);
onEvent("obtenerOpcionesCapital", obtenerOpcionesCapital);
onEvent("obtenerOpcionesForma", obtenerOpcionesForma);
onEvent("verificarPais", (data) => {
    return verificarRespuestaFlag(data.selectedCountry); 
});
onEvent("verificarRespuestaIdioma", verificarRespuestaIdioma);
onEvent("verificarRespuestaCapital", verificarRespuestaCapital);
onEvent("verificarRespuestaForma", verificarRespuestaForma);
onEvent("estadisticasGuessAbout", guardarEstadisticasGuessAbout);
onEvent("cargarEstadisticasGuessAbout", cargarEstadisticasGuessAbout);

import { 
    registerUser,
    loginUser,
    checkUserSession
} from './backend/users/index.js'; 

onEvent("register", registerUser);
onEvent("login", loginUser);
onEvent("checkSession", checkUserSession);

import { 
    iniciarRonda,
    validarRespuesta,
    continuarJuego,
    saveGameStats,
    cargarEstadisticasHyl
} from './backend/higerLower/index.js'; 

//Eventos Higher or Lower
onEvent("iniciarRonda", iniciarRonda);
onEvent("validarRespuesta", validarRespuesta);
onEvent("continuarJuego", continuarJuego);
onEvent("enviarEstadisticasHyl", saveGameStats)
onEvent("cargarEstadisticasHyl", cargarEstadisticasHyl)


startServer();