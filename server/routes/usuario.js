const express = require('express');
const Usuario = require('../model/usuario');

const app = express();

app.get('/usuario', function(req, res) {
    res.json('get Usuarios')
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        rol: body.rol
    });

    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    res.json({
        id
    })
});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuarios')
});

module.exports = app;