const express = require('express')
const app = express()
//Guards
const TokenGuard = require('../../guards/token.guard')
//Modules
const TournamentService = require('../../services/tournament.service')
const StatisticsUtil = require('../../utils/statistics.util')

app.get('/api/tournament/stats/:id', [TokenGuard], (req, res )=>{
    let id = req.params.id
    let _TournamentService = new TournamentService()
    let _StatisticsUtil = new StatisticsUtil()
    _TournamentService.findOneById(id)
        .then(document=>{
            return _StatisticsUtil.getDocumentStats(document)  
        })
        .then(document=>{
            return res.json({
                success: true,
                document
            })
        })
        .catch(error=>{
            return res.status(500).json({
                success: false,
                error
            }) 
        })
})

module.exports = app