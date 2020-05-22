const jwt = require('jsonwebtoken')
    ////
    //Verificar token
    //
    //El next continua con el programa
    // de hecho, si en esta funcion no se llama al next, hara que en la funcion en la cual
    //se comprueba el middleware, solo se ejecute el middleware y no el resto de la funcion
let verificaToken = (req, res, next) => {
    //recoge del header el token o Authorization si vienera asi en este caso esta como token
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
};


let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario debe ser administrador para realizar esta operación'
            }
        })
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}