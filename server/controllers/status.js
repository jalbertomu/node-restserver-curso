const express = require('express')
const _ = require('underscore')
const bcrypt = require('bcrypt')
const app = express()

app.get('/status', function(req, res) {
    res.json({
        ok: true
    })
})

module.exports = app