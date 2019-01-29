const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

// default options
app.use(fileUpload());

const Usuario = require('../model/usuario');
const Producto = require('../model/producto');


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }


    // Validar tipo
    let tipoValidos = ['productos', 'usuarios'];

    if (tipoValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tipoValidos.join(', ')
            }
        });
    }


    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // extensines permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }


        //Imagen Cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }


    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });

        }

        if (usuarioBD.img) {
            borraArchivo(usuarioBD.img, 'usuarios');
        }


        usuarioBD.img = nombreArchivo;


        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                producto: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });

};

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });

        }

        if (productoBD.img) {
            borraArchivo(productoBD.img, 'productos');
        }

        productoBD.img = nombreArchivo;

        productoBD.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            });
        });

    });
};

function borraArchivo(nombreArchivo, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
};


module.exports = app;