//dependencies
const express = require('express')
const app = express()
//Guards
const TokenGuard = require('../../guards/token.guard')
const RoleGuard = require('../../guards/role.guard')
//modules
const TournamentService = require('../../services/tournament.service')
const PaginationUtil = require('../../utils/pagination.util')

/** $QUERY /api/tournament/:id 
 *  Gets a single tournament by id and id is to be provided in params
 *  all authenticated users have access to this route 
 *  @param id team._id
 */
app.get('/api/tournament/:id', [TokenGuard], (req, res) => {

    let id = req.params.id;

    TournamentService.findOneById(id)
        .then(document => {
            if (!document) {
                return res.status(404).json({
                    success: false,
                    error: 'Tournament Not Found'
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

/** $QUERY /api/tournaments?name=name?page=page?limit=limit
 *  Gets a every single tournament and search includes name
 *  sport, modality, and all authenticated users have access to 
 *  this route 
 * 
 *  @param name optional  
 *  @param sport optional 
 *  @param modality optional 
 *  @param page optional  
 *  @param limit optional 
 */
app.get('/api/tournaments', [TokenGuard], (req, res) => {
    let query = req.query
    let pagination = {
        page: query.page || 1,
        limit: query.page || 0,
    }
    let options = {
        name: new RegExp(query.name) || new RegExp(),
        sport: new RegExp(query.sport) || new RegExp(),
        modality: new RegExp(query.modality) || new RegExp(),
    }

    TournamentService.findAlike(options)
        .then(document => {
            if (!document[0]) {
                return res.status(404).json({
                    success: false,
                    error: 'No Tournaments Were Found'
                })
            }
            return res.json( //responds with a new object merged with success flag
                ...{
                    success: true
                },
                ...PaginationUtil.paginate(document, pagination)
            )
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error
            })
        })
})

/** $INSERT /api/tournament
 *  Inserts a new tournament or a bunch of tournaments depending on
 *  the lenght of the payload using body as the payload and TournamentService
 *  to handle requests. Only ADMINS have access to this route
 * 
 *  @param body payload with tournament arrays, body = [{tournament},{tournament}...]
 */
app.post('/api/tournament', [TokenGuard, RoleGuard], (req, res) => {

    let tournaments = req.body

    TournamentService.createOneOrMany(tournaments)
        .then(document => {
            if (!document) { //never goes through here but just in case
                return res.status(500).json({
                    success: false,
                    error: 'Severe Conflict While Saving Teams'
                })
            }
            return res.json({
                success: true,
                message: `${document.length} Tournaments Successfully Saved`
            })
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error
            })
        })
})

/** $MODIFY
 *  Can only modify one tournament at a time, give a parameter id and a object 
 *  tournament at payload to modify tournament.
 *  @param id tournament._id
 *  @body tournament object
 */

app.put('/tournament/:id', [TokenGuard, RoleGuard], (req, res) => {

    let id = req.params.id
    let tournament = req.body
        TournamentService.updateOne(id, tournament)
        .then(document => {
            if (!document) { //never goes through here but just in case
                return res.status(500).json({
                    success: false,
                    error: 'Severe Conflict While Updating User'
                })
            }
            return res.json({
                success: true,
                documents: document
            })
        })
        .catch(error => {
            if (error.message) {
                return res.status(404).json(error)
            }
            return res.status(500).json({
                success: false,
                error
            })
        })
})

module.exports = app