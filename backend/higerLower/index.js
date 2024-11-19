import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


let countries;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadData() {
    if (!countries) {
        const path = join(__dirname, '../data/higher_or_lower.json');
        let data = fs.readFileSync(path)
        countries = JSON.parse(data).countries;
    }
}

function consignaAleatoria() {
    const consignas = ['gdp_millions', 'population_millions', 'Territory_km2'];
    return consignas[Math.floor(Math.random() * consignas.length)];
}


function obtenerPaisAleatorio() {
    return countries[Math.floor(Math.random() * countries.length)];
}


export function iniciarRonda() {
    loadData();
    const consigna = consignaAleatoria();
    const country1 = obtenerPaisAleatorio();
    let country2 = obtenerPaisAleatorio();
    

    while (country2 === country1) {
        country2 = obtenerPaisAleatorio();
    }


    return { country1, country2, consigna };
}


export function validarRespuesta(data) {

   
    let valorCountry1 = data.country1[data.consigna];
    let valorCountry2 = data.country2[data.consigna];

    
    if (valorCountry1 < valorCountry2 && data.userGuess === "higher" || valorCountry1 > valorCountry2 && data.userGuess === "lower") {
        return true
    } else {
        return false
    }
}



export function continuarJuego(countryActual) {
    let country2 = obtenerPaisAleatorio();
    let country1 = countryActual

  
    while (country2 === country1) {
        country2 = obtenerPaisAleatorio();
    }

    console.log({ country1, country2 })
   
    return { country1, country2};
}


const statisticsFilePath = join(__dirname, '../data/estadisticasHyl.json');

export function saveGameStats(data) {
    const { username, consecutiveCorrect, juego } = data;


    const d = new Date()
    let dd = String(d.getDate()).padStart(2,'0')
    let mm = String(d.getMonth() +1).padStart(2,'0')

    let date = dd+'/' +mm
    const existingStats = JSON.parse(fs.readFileSync(statisticsFilePath, 'utf8') || '[]');

    existingStats.push({ username, consecutiveCorrect, juego, date });

    fs.writeFileSync(statisticsFilePath, JSON.stringify(existingStats, null, 2));


    return { message: 'Estadísticas guardadas' };
}

export async function cargarEstadisticasHyl(user) {
    const dataPath = join(__dirname, '../data/estadisticasHyl.json');
    const data = await fs.readFileSync(dataPath, 'utf-8');
    const stats = JSON.parse(data);
    
    let labels = [];
    let consecutiveCorrectScores = [];
    

    for (const stat of stats) {
        if (stat.username === user) {
            labels.push(stat.date); 
            consecutiveCorrectScores.push(stat.consecutiveCorrect); 
        }
    }

    console.log("Cargar estadísticas Hyl:", { labels, consecutiveCorrectScores });
    return { labels, consecutiveCorrectScores };
}