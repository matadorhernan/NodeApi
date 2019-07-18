//dependencies
const express = require('express');
const app = express();
//Guards
const TokenGuard = require('../../guards/token.guard')
const RoleGuard = require('../../guards/role.guard')
const UserGuard = require('../../guards/user.guard')
//Modules
const UserService = require('../../services/user.service')
const PaginationUtil = require('../../utils/pagination.util')
const MailingService = require('../../services/mailing.service')

/** $QUERY /api/user/:id 
 *  Gets a single user by id and id is to be provided in params
 *  all authenticated users have access to this route 
 *  @param id user._id
 */
app.get('/api/user/:id', [TokenGuard], (req, res) => {
    let id = req.params.id
    let _UserService = new UserService()
    _UserService.findOneById(id)
        .then(document => {
            if (!document) {
                return res.status(404).json({
                    success: false,
                    error: 'User Not Found'
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

/** $QUERY /api/users?email=email?name=name?page=page?limit=limit
 *  Gets a every single user and search includes email and name
 *  all authenticated users have access to this route 
 * 
 *  @param email optional 
 *  @param name optional  
 *  @param page optional  
 *  @param limit optional 
 */

app.get('/api/users', [TokenGuard], (req, res) => {

    let query = req.query

    let pagination = {
        page: query.page || 1,
        limit: query.page || 0,
    }

    let options = {
        name: new RegExp(query.name) || new RegExp(),
        email: new RegExp(query.email) || new RegExp()
    }

    let _UserService = new UserService()
    let _PaginationUtil = new PaginationUtil()
    _UserService.findAlike(options)
        .then(document => {
            if (!document[0]) {
                throw error = {
                    success: false,
                    error: 'No Users Were Found'
                }
            }
            return res.json(
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
/** $INSERT /api/user
 *  Inserts a new user or a bunch of users depending on the length of the payload
 *  using body as the payload and _UserService to handle requests you can set ROLES
 *  to create ADMIN_ROLE or omit them to create PLAYER_ROLES
 *  @param body payload with user arrays, body = [{user},{user}...]
 */
app.post('/api/user', [TokenGuard, RoleGuard], (req, res) => {

    let users = req.body
    let _UserService = new UserService()
    _UserService.createOneOrMany(users)
        .then(document => {
            
            if (!document) { //never goes through here but just in case
                throw error = {
                    success: false,
                    error: 'Severe Conflict While Saving Users'
                }
            }
            
            let _MailingService = new MailingService()
            _MailingService.sendInvitesForAdmins(document)

            return res.json({
                success: true,
                message: 'Users Successfully Saved'
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
 *  Can only modify one user at a time, give a parameter id and a object user
 *  at payload to modify user. will not let modify roles 
 *  Admins are to be created with post
 *  @param id user._id
 *  @body user object
 */

app.put('/api/user/:id', [TokenGuard, UserGuard], (req, res) => {

    let id = req.params.id
    let user = {
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        tournaments: req.body.tournaments
    }
    let _UserService = new UserService()
    _UserService.updateOne(id, user)
        .then(document => {

            if (!document) { //never goes through here but just in case
                throw error = {
                    success: false,
                    error: 'Severe Conflict While Updating User'
                }
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

/** $LOGIC ERASE 
 *  If the admin wishes to ban an user from the platform he may delete that said username
 *  you need to provide an id, Admins can delete anyone from the platform including other admins
 *  or themselves, while Users can only delete themselves 
 */

app.delete('/api/user/:id', [TokenGuard, UserGuard], (req, res) => {

    let id = req.params.id
    let _UserService = new UserService()
    _UserService.deleteOne(id)
        .then(document => {

            if (!document) { //never goes through here but just in case
                return res.status(500).json({
                    success: false,
                    error: 'Severe Conflict While Deleting User'
                })
            }

            return res.json({
                success: true,
                message: 'User Deleted, Once Token Expires Also Banned From Platform'
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