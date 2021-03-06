const { io } = require('../server');
const  Usuarios  = require('../classes/usuarios');
const {crearUsuario} = require('../utilidades/utilidad');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala son necesarios'
            });
        };
        client.join(data.sala);
        usuarios.agregarPersona( client.id, data.nombre, data.sala );
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearUsuario('Administrador', `el usuario ${data.nombre} se unio`));
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on('crearMensaje', ( data, callback ) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearUsuario(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    
        callback(mensaje); 
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        //broadcast emite a todos los usuarios
         client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearUsuario('Administrador', `el usuario ${personaBorrada.nombre} salio`));
         client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
        });

    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearUsuario(persona.nombre, data.mensaje);
        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);
    });
    

});