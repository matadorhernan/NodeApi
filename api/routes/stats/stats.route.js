const express = require('express')
const app = express()
//Guards
const TokenGuard = require('../../guards/token.guard')

app.get('/api/stats/team/:id', [TokenGuard], (req, res )=>{
    let id = req.params.id
    
})
module.exports = app