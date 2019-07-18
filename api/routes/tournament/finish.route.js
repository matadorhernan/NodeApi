const express = require('express')
const app = express()
const TokenGuard = require('../../guards/token.guard')
const RoleGuard = require('../../guards/role.guard')
app.put('/api/tournament/finish/:id', [TokenGuard, RoleGuard], (req, res)=>{
    let id = req.params.id
    
})