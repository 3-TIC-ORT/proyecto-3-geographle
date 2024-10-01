import fs from 'fs';

let datos = JSON.parse(fs.readFileSync('./data/connections.json', 'utf8'));
let vidas;

export function obtenerCaracteristicasAleatorias() {
    const paisesAleatorios = datos.sort(() => 0.5 - Math.random()).slice(0, 4);
    const caracteristicas = paisesAleatorios.flatMap(pais => 
        pais.words_related
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
            .map(word => ({
                word,
                country_id: pais.country_id
            }))
    );
    return caracteristicas;
}

export function verificarSeleccion(seleccion) {
    vidas = seleccion[1];
    return datos.some(dato => 
        seleccion[0].every(palabra => dato.words_related.includes(palabra))
    );
}

export function guardarEstadisticas(estadisticas) {
    console.log("Estadísticas recibidas:", estadisticas);
    fs.appendFileSync('./data/estadisticas.json', JSON.stringify(estadisticas) + '\n', 'utf8');
    return { success: true };
}

export function handleVerificarSeleccion(data) {
    const esCorrecta = verificarSeleccion(data);
    if (!esCorrecta) vidas--;
    return { esCorrecta, vidas };
}

