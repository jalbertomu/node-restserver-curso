const express = require('express')
const _ = require('underscore')
const bcrypt = require('bcrypt')
const app = express()

app.get('/product', function(req, res) {
    res.json({
        ok: true,
        _id: 123899912,
        reference: "Av7vehayu8",
        name: "Limpia Hogar Don Limpio",
        texts: {
            title: "Don Limpio",
            shortDescription: "Mr. Propper era muy listo y ahora se llama Don limpio",
            largeDescription: "Se usa con algodón y si lo pasas por una superficie, el lo hace todo, no deja ni una mota de polvo"
        }
    })

})

module.exports = app