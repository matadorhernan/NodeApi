const express = require('express')
const app = express()
//Guards
const TokenGuard = require('../../guards/token.guard')
//modules
const MatchService = require('../../services/match.service')
const TournamentService = require('../../services/tournament.service')
const TournamentUtil = require('../../utils/tournament.util')

/** $QUERY
 * Needs an started tournament id on params is a match id
 * @param id match._id
 */

api.get('/api/match/:id', [TokenGuard], (req, res) => {
    let id = req.params.id
    MatchService.findOneById(id)
        .then(document => {
            if (!document) {
                return res.status(404).json({
                    success: false,
                    error: 'No Matches Were Found'
                })
            }
            return res.json({
                success: true,
                documents: document
            })
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error
            })
        })
})

/** $QUERY
 * Needs an started tournament, id on params is a tournamnet id
 * @param id match.tournament
 */
app.get('/api/matches/:id', [TokenGuard], (req, res) => {
    let id = req.params.id
    MatchService.findByTournamentId(id)
        .then(document => {
            if (!document[0]) {
                return res.status(404).json({
                    success: false,
                    error: 'No Matches Were Found'
                })
            }
            return res.json({
                success: true,
                documents: document
            })
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error
            })
        })
})

/** $INITIAL
 *  Starts the whole tournament and its matches based on ist modality
 *  available modalities are roundRobin, knockOut, playOffs, anything else 
 *  is not supported, and to advance please use route scores
 *  
 *  @param id match.tournament
 */

app.post('/api/matches/:id', (req, res) => { // returns a started tournament with populated matches
    let id = req.params.id
    let matches = new Array()
    TournamentService.update(id, { started: true }) //starts the Tournament
        .then(document => {
            if (!document) {
                return res.status(404).json({
                    success: false,
                    error: 'No Tournaments Were Found'
                })
            }
            matches = TournamentUtil.generateMatches(document)
            return MatchService.createOneOrMany(matches)  //generates matches on database and chains its promise
        })
        .then(document => {
            let matchIds = _.pluck(document.ops, '_id')
            return TournamentService.update(id, { matches: matchIds }) //inserts matches on tournament and chains its promise
        }) 
        .then(document => {
            //send mails here
            return res.json({
                success: true,
                documents: document
            })
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error
            })
        })
})

module.exports = app