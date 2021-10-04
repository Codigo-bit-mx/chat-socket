var socket = io();
let params = new URLSearchParams(window.location.search);

if( !params.has('nombre') || !params.has('sala')) {
    window.location = "index.html";
    throw new Error ('El nombre y la sala son necesario');
}
let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    socket.emit('entrarChat', usuario, function(resp) {
        renderizarUsuarios(resp);
    });
});


// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});


// Enviar información
// socket.emit('crearMensaje', {
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });


// Escuchar información con on
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
    renderizarMensaje(mensaje)
});

socket.on('listaPersonas', function(mensaje) {
    renderizarUsuarios(mensaje);
});

socket.on('mensajePrivado', function(mensaje) {
    console.log('privado a:', mensaje);
})