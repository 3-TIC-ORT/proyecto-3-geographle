const socket = io('http://localhost:3000');

// Enviar eventos
function postData(evento, data, callback) {
  socket.emit(evento, data);
  socket.once(evento, (respuesta) => {
    callback(respuesta);
  });
}

// Recibir datos sin enviar nada
function fetchData(evento, callback) {
  socket.emit(evento);
  socket.once(evento, (respuesta) => {
    callback(respuesta);
  });
}