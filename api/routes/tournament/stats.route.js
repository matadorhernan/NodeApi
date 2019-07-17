const express = require('express')
const app = express()
//Guards
const TokenGuard = require('../../guards/token.guard')
const TournamentService = require('../../services/tournament.service')

app.get('/api/stats/team/:id', [TokenGuard], (req, res )=>{
    let id = req.params.id
    let _TournamentService = new TournamentService()
    _TournamentService.findOneById(id)
        .then(document=>{
            
        })
        .catch(error=>{

        })
    
})
module.exports = app