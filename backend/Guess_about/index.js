import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../data/Guess_about.json');
let datos = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let vidasBandera = 3; 
let vidasGenerales = 5;
let paisActual = null;

export function obtenerPaisAleatorio() {
  const pais = datos.countries[Math.floor(Math.random() * datos.countries.length)];
  console.log("País seleccionado:", pais);
  return pais;
}

export function generarOpciones(prop) {
  if (paisActual === null) {
    console.error("Error: paisActual es null. Asegúrate de llamar a obtenerFlag() primero.");
    return [];
  }

  let opciones = new Set();
  opciones.add(paisActual[prop]);  

  while (opciones.size < 4) {
    const paisAleatorio = datos.countries[Math.floor(Math.random() * datos.countries.length)];
    if (paisAleatorio[prop] !== paisActual[prop]) {
      opciones.add(paisAleatorio[prop]);
    }
  }

  console.log(`Opciones generadas para ${prop}:`, Array.from(opciones));
  return Array.from(opciones).sort(() => 0.5 - Math.random());
}

export function verificarRespuesta(prop, respuesta) {
  if (typeof respuesta !== 'string') {
    console.error(`Error: respuesta no es una cadena. Recibido:`, respuesta);
    return false;
  }

  const esCorrecta = paisActual[prop].toLowerCase() === respuesta.toLowerCase();
  console.log(`Respuesta recibida para ${prop}:`, respuesta);
  console.log(`¿Es correcta?`, esCorrecta);
  return esCorrecta;
}


export function obtenerFlag() {
  paisActual = obtenerPaisAleatorio();
  console.log("País actual:", paisActual);
  return {
    flag: paisActual.flag
  };
}

export function obtenerOpcionesIdioma() {
  return {
    language_options: generarOpciones('language')
  };
}

export function obtenerOpcionesCapital() {
  return {
    capital_options: generarOpciones('capital')
  };
}

export function obtenerOpcionesForma() {
  return {
    shape_options: generarOpciones('country_shape')
  };
}

export function verificarRespuestaFlag(respuesta) {
  return verificarRespuestaGeneral('name', respuesta, 'bandera');
}

export function verificarRespuestaIdioma(respuesta) {
  const language = typeof respuesta === 'object' && respuesta.selectedLanguage ? respuesta.selectedLanguage : respuesta;
  return verificarRespuestaGeneral('language', language, 'general');
}


export function verificarRespuestaCapital(respuesta) {
  const selectedCapital = typeof respuesta === 'object' && respuesta.selectedCapital ? respuesta.selectedCapital : respuesta;
  return verificarRespuestaGeneral('capital', selectedCapital, 'general');
}

export function verificarRespuestaForma(respuesta) {
  return verificarRespuestaGeneral('country_shape', respuesta, 'general'); 
}

export function verificarRespuestaGeneral(prop, respuesta, tipoRonda) {
  const esCorrecta = verificarRespuesta(prop, respuesta);

  if (!esCorrecta) {
    if (tipoRonda === 'bandera') {
      vidasBandera--; 
      console.log("Vidas restantes en la ronda de bandera:", vidasBandera);
    } else {
      vidasGenerales--; 
      console.log("Vidas restantes en las rondas generales:", vidasGenerales);
    }
  }

  if (tipoRonda === 'bandera' && vidasBandera === 0) {
    console.log("Game Over en la ronda de la bandera.");
    return {
      esCorrecta,
      vidas: vidasBandera,
      gameOver: true,
      mensaje: "Te has quedado sin vidas en la ronda de la bandera."
    };
  } else if (tipoRonda === 'general' && vidasGenerales === 0) {
    console.log("Game Over en las rondas generales.");
    return {
      esCorrecta,
      vidas: vidasGenerales,
      gameOver: true,
      mensaje: "Te has quedado sin vidas en las rondas generales."
    };
  }

  return {
    esCorrecta,
    vidas: tipoRonda === 'bandera' ? vidasBandera : vidasGenerales,
  };
}

export function guardarEstadisticasGuessAbout(estadisticas) {
  const filePathEstadisticas = path.join(__dirname, '../data/estadisticasGuessAbout.json');

  let contenidoActual = [];
  if (fs.existsSync(filePathEstadisticas)) {
      const contenidoJSON = fs.readFileSync(filePathEstadisticas, 'utf8');
      contenidoActual = JSON.parse(contenidoJSON);
  }


  contenidoActual.push(estadisticas);


  fs.writeFileSync(filePathEstadisticas, JSON.stringify(contenidoActual, null, 2), 'utf8');
  console.log("Estadísticas guardadas correctamente:", estadisticas);
}
export function cargarEstadisticasGuessAbout(user) {
  let data = fs.readFileSync('backend/data/estadisticasGuessAbout.json', 'utf8');
  let stats = JSON.parse(data);
  let loses = 0;
  let wins = 0;

  for (let i = 0; i < stats.length; i++) {
      if (stats[i].username === user) {
          if (stats[i].gano === true) {
              wins += 1;
          } else {
              loses += 1;
          }
      }
  }

  let res = {
      wins,
      loses
  };
  console.log(res);
  return res;
}