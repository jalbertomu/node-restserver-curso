const express = require('express')
const _ = require('underscore')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
const { verificaToken, verificaAdmin_Role } = require('../middleware/autenticacion')
const app = express()

/*En el segundo parametro iran los middleware, en ese caso lo utilizaremos para la verificacion del token */
app.get('/usuario', verificaToken, (req, res) => {
    /*Los parametros opcionales estan en req.query*/
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite)

    /* de segundo parametro le estamos enviando los campos que aparezcan en la response*/
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })


        })

})

app.post('/usuario', [verificaToken, verificaAdmin_Role],
    function(req, res) {
        let body = req.body;
        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        })

        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            //usuarioDB.password = null;
            res.json({
                ok: true,
                usuario: usuarioDB
            })
        })

    })

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    /*La libreria underscore solo recogera los parametros que nosotro deseemos:
    primer parametro: sera el objecto completo (en este caso el body de la request)
    segundo parametro: (array), solo los atributos del objeto que queramos que tenga el objeto final
    */
    let body = _.pick(req.body, ['nombre', 'email', 'estado', 'img', 'estado'])

    // En el tercer parámetro van las opciones:
    /* new(Booleano) hará que devuelva el objeto tal y como se ha actualizado en la bbdd */
    /* runValidators: hará que las validaciones definidas en el esquema se hagan efectivas, por ejemplo el rol
     y que no le le pueda pasar cualquier cosa desde la request */
    /*context: será necesario para disparar las validaciones de mongoose-unique-validator */

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
            estado: false
        }
        /* en el segundo parametro se le pasan las propiedades a modificar */
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {
        estado = false;
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

module.exports = app