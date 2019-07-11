//dependencies
const express = require('express')
const app = express()
//Guards
const TokenGuard = require('../../guards/token.guard')
const RoleGuard = require('../../guards/role.guard')
//modules
const TeamService = require('../../services/team.service')

app.get('/api/team/:id', [TokenGuard], (req, res) => {
    
    let id = request.params.id;
    
})

module.exports = app