//dependencies
const express = require('express')
const app = express()
//Guards
const TokenGuard = require('../../guards/token.guard')
const RoleGuard = require('../../guards/role.guard')
//modules
const NewsService = require('../../services/news.service')
const PaginationUtil = require('../../utils/pagination.util')

/** $QUERY /api/news/:id 
 *  Gets a single new by id and id is to be provided in params
 *  all authenticated users have access to this route 
 *  @param id news._id
 */
app.get('/api/news/:id', [TokenGuard], (req, res) => {

    let id = req.params.id;

    NewsService.findOneById(id)
        .then(document => {
            if (!document) {
                return res.status(404).json({
                    success: false,
                    error: 'News Not Found'
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

/** $QUERY /api/news?tournament=tournament?page=page?limit=limit
 *  Gets all news, you can filter your search with a tournament. 
 *  All authenticated users have access to this route 
 * 
 *  @param tournament optional id
 *  @param page optional  
 *  @param limit optional 
 */
app.get('/api/news', [TokenGuard], (req, res) => {
    
    let query = req.query
    let pagination = {
        page: query.page || 1,
        limit: query.page || 0,
    }
    let options = {
        tournament: new RegExp(query.tournament) || new RegExp(),
    }
    let _PaginationUtil = new PaginationUtil()
    let _TournamentService = new TournamentService()
    _TournamentService.findAlike(options)
        .then(document => {
            if (!document[0]) {
                return res.status(404).json({
                    success: false,
                    error: 'No News Were Found'
                })
            }
            return res.json( //responds with a new object merged with success flag
                    Object.assign(
                        {success: true},
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

/** $INSERT /api/news
 *  Inserts a new new or a bunch of news depending on
 *  the length of the payload using body as the payload and NewsService
 *  to handle requests.All Authenticated users have access to this route
 *  uses the TokenGuard to read who is posting an announcement
 * 
 *  @param body payload with tournament arrays, body = [{tournament},{tournament}...]
 */

app.post('/api/news', [TokenGuard], (req, res) => {

    let news = req.body
    news.poster = req.user.email //user email from token guard

    NewsService.createOneOrMany(news)
        .then(document => {
            if (!document) { //never goes through here but just in case
                return res.status(500).json({
                    success: false,
                    error: 'Severe Conflict While Saving News'
                })
            }
            return res.json({
                success: true,
                message: 'News Successfully Saved'
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
 *  Can only modify one announcement at a time, give a parameter id and a object 
 *  news at payload to modify news.
 *  @param id news._id
 *  @body news object
 */

app.put('/api/news/:id', [TokenGuard, RoleGuard], (req, res) => {

    let id = req.params.id
    let news = req.body
        NewsService.updateOne(id, news)
        .then(document => {
            if (!document) { //never goes through here but just in case
                return res.status(500).json({
                    success: false,
                    error: 'Severe Conflict While Updating News'
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