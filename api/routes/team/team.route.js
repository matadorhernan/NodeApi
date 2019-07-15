//dependencies
const express = require('express')
const app = express()
//Guards
const TokenGuard = require('../../guards/token.guard')
const RoleGuard = require('../../guards/role.guard')
//modules
const TeamService = require('../../services/team.service')
const PaginationUtil = require('../../utils/pagination.util')

/** $QUERY /api/team/:id 
 *  Gets a single team by id and id is to be provided in params
 *  all authenticated users have access to this route 
 *  @param id team._id
 */
app.get('/api/team/:id', [TokenGuard], (req, res) => {

    let id = req.params.id;
    console.log(id);
    
    let _TeamService = new TeamService()
    _TeamService.findOneById(id)
        .then(document => {
            if (!document) {
                return res.status(404).json({
                    success: false,
                    error: 'Team Not Found'
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

/** $QUERY /api/teams?name=name?page=page?limit=limit
 *  Gets a every single team and search includes name
 *  all authenticated users have access to this route 
 * 
 *  @param name optional  
 *  @param page optional  
 *  @param limit optional 
 */
app.get('/api/teams', [TokenGuard], (req, res) => {
    
    let query = req.query
    let pagination = {
        page: query.page || 1,
        limit: query.page || 0,
    }
    let options = {
        name: new RegExp(query.name) || new RegExp()
    }
    let _PaginationUtil = new PaginationUtil()
    let _TeamService = new TeamService()
    _TeamService.findAlike(options)
        .then(document => {
            if (!document[0]) {
                return res.status(404).json({
                    success: false,
                    error: 'No Teams Were Found'
                })
            }
            return res.json( //responds with a new object merged with success flag
                Object.assign(
                    { success: true },
                    _PaginationUtil.paginate(document, pagination)
                )
            )
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                error
            })
        })
})

/** $INSERT /api/team
 *  Inserts a new team or a bunch of teams depending on the length of the payload
 *  using body as the payload and TeamService to handle requests
 *  Only ADMINS have access to this route
 *  @param body payload with teams arrays, body = [{team},{team}...]
 */
app.post('/api/team', [TokenGuard, RoleGuard], (req, res) => {

    let teams = req.body
    let _TeamService = new TeamService()
    _TeamService.createOneOrMany(teams)
        .then(document => {
            if (!document) { //never goes through here but just in case
                return res.status(500).json({
                    success: false,
                    error: 'Severe Conflict While Saving Teams'
                })
            }

            console.log(document);

            return res.json({
                success: true,
                message: 'Teams Successfully Saved'
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
 *  Can only modify one team at a time, give a parameter id and a object team
 *  at payload to modify team.
 *  @param id team._id
 *  @body team object
 */

app.put('/api/team/:id', [TokenGuard, RoleGuard], (req, res) => {

    let id = req.params.id
    let team = req.body
    let _TeamService = new TeamService()
    _TeamService.updateOne(id, team)
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