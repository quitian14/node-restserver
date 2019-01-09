const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');

const app = express();

const Producto = require('../model/producto');

app.get('/producto', verificarToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    total: conteo,
                    productos
                });
            });

        });
});

app.get('/producto/:id', verificarToken, function(req, res) {

    let id = req.params.id;

    Producto.findById({ _id: id })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {


            if (!productoBD) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            return res.json({
                ok: true,
                producto: productoBD
            });


        });
});

// buscar productos
app.get('/producto/buscar/:termino', verificarToken, function(req, res) {

    let termino = req.params.termino;

    let regEx = new RegExp(termino, 'i');

    Producto.findById({ nombre: regEx })
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            if (!productoBD) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No existen datos por este termino'
                    }
                });
            }

            return res.json({
                ok: true,
                producto: productoBD
            });


        });
});


app.post('/producto', verificarToken, function(req, res) {

    // crear categoria

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });

});

app.put('/producto/:id', verificarToken, function(req, res) {

    let id = req.params.id;
    let body = req.body;


    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    };

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        })
    });


});

app.delete('/producto/:id', [verificarToken], function(req, res) {

    let id = req.params.id;
    let producto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, producto, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto borrado'
        })
    });
});


module.exports = app;