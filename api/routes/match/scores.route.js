const express = require('express')
const app = express()
//Guards
const TokenGuard = require('../../guards/token.guard')
const RoleGuard = require('../../guards/role.guard')
//Modules
const MatchService = require('../../services/match.service')
const TournamentService = require('../../services/tournament.service')
const TournamentUtil = require('../../utils/tournament.util')

app.put('/api/match/scores/:id', [TokenGuard, RoleGuard], (req, res) => {
    id = req.params.id
    let scores = {
        localScore: req.body.local,
        visitorScore: req.body.visitor
    }

    let _MatchService = new MatchService()
    let _TournamentService = new TournamentService()
    let _TournamentUtil = new TournamentUtil()

    _MatchService.updateOne(id, scores)
        .then(document => {
            if (!document) {
                throw error = {
                    success: false,
                    error: 'No Match Was Found'
                }
            }
            return _TournamentService.findOneById(document.tournament)
        })
        .then(document => {
            if(document.modality == 'roundRobin'){
                return res.json({
                    success: true,
                    document
                })
            }
            return _TournamentUtil.nextMatch(document)
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error
            })
        })

})

module.exports = app