const jwt = require('jsonwebtoken');

//====================================
// verificar token
//====================================
let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });


}

//====================================
// verificar AdminRol
//====================================
let verificarAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.rol !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrodor'
            }
        });
    }

    next();
}


//====================================
// verificar AdminRol para imagen
//====================================
let verificarTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificarToken,
    verificarAdmin_Role,
    verificarTokenImg
}