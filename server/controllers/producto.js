const express = require('express')
const _ = require('underscore')
const bcrypt = require('bcrypt')
const { verificaToken } = require('../middleware/autenticacion')
let Producto = require('../models/producto')
const app = express()


app.get('/producto', verificaToken, function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite)
        /*Solo los que sean disponibles true */
    Producto.find({ disponible: true })
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate({
            path: 'categoria',
            // Get friends of friends - populate the 'friends' array for every friend
            populate: { path: 'usuario' }
        })
        .skip(desde)
        .limit(limite).exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productoDB
            })
        })
})

app.get('/producto/:id', (req, res) => {
    let identificador = req.params.id;
    Producto.findById(identificador, (err, producto) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto
        })
    });
})

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    /*para realizar busquedas flexibles */
    Producto.find({ nombre: regex }).populate().exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productos
        })
    })
})

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
})

app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, descProducto, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descProducto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, descProducto, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: "El producto no existe"
            })
        }

        res.json({
            ok: true,
            message: 'El producto ha sido eliminado'
        })
    })
})

module.exports = app