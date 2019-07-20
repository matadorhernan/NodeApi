const express = require('express')
const app = express()
const _ = require('underscore');
//Guards
const TokenGuard = require('../../guards/token.guard')
const RoleGuard = require('../../guards/role.guard')
//modules
const MatchService = require('../../services/match.service')
const MailingService = require('../../services/mailing.service')
const TournamentService = require('../../services/tournament.service')
const TournamentUtil = require('../../utils/tournament.util')
/** $QUERY
 * Needs an started tournament id on params is a match id
 * @param id match._id
 */

app.get('/api/match/:id', [TokenGuard], (req, res) => {
    let id = req.params.id
    let _MatchService = new MatchService()
    _MatchService.findOneById(id)
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
 * Needs an started tournament, id on params is a tournament id
 * @param id match.tournament
 */
app.get('/api/matches/:id', [TokenGuard], (req, res) => {
    let id = req.params.id
    let _MatchService = new MatchService()
    _MatchService.findByTournamentId(id)
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
 *  Starts the whole tournament and its matches based on its modality,
 *  available modalities are roundRobin, knockOut, playOffs. Anything else 
 *  is not supported, and to advance please use route scores
 *  
 *  @param id match.tournament
 */

app.post('/api/matches/:id', [TokenGuard, RoleGuard], (req, res) => { // returns a started tournament with populated matches
    let id = req.params.id
    let _TournamentService = new TournamentService();
    let _TournamentUtil = new TournamentUtil()
    let _MailingService = new MailingService()
    let _MatchService = new MatchService()

    _TournamentService.findAlike({ _id: id, started: false }) //if needed, you can restart tournaments at put
        .then(document => {
            if (!document[0]) {
                throw error = {
                    success: false,
                    error: 'Tournament Not Found or Already Started'
                }
            }
            return _TournamentService.updateOne(id, { started: true }) //starts the Tournament
        })
        .then(document => {
            let matches = _TournamentUtil.generateMatches(document)
            return _MatchService.createOneOrMany(matches)  //generates matches on database and chains its promise
        })
        .then(document => {
            let matchIds = _.pluck(document, '_id')
            return _TournamentService.updateOne(id, { matches: matchIds }) //inserts matches on tournament and chains its promise
        })
        .then(document=>{ 
            return _TournamentUtil.initMetadata(document) // returns the same doc and sets users and teams with the new tournament
        })
        .then(document => {

            _MailingService.sendInvitesForTournament(document)
            
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

app.put('/api/match/:id', [TokenGuard, RoleGuard], (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['date'])
    let _MatchService = new MatchService()
    _MatchService.updateOne(id, body)
        .then(document => {
            if (!document) {
                throw error = {
                    success: false,
                    error: 'Tournament Not Found'
                }
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

module.exports = app