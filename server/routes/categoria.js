const express = require('express');

const { verificarToken, verificarAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../model/categoria');

app.get('producto', verificarToken, function(req, res) {


    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    total: conteo,
                    categorias
                });
            });

        });
});

app.get('/categoria/:id', verificarToken, function(req, res) {

    let id = req.params.id;

    Categoria.findById({ _id: id }, (err, categoriaBD) => {


        if (!categoriaBD) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaBD
        });


    });
});

app.post('producto', verificarToken, function(req, res) {

    // crear categoria

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

});

app.put('/categoria/:id', verificarToken, function(req, res) {

    let id = req.params.id;
    let body = req.body;


    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        })
    });


});

app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], function(req, res) {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })
    });
});


module.exports = app;