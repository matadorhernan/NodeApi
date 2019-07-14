//dependencies
const express = require('express');
const app = express();
//Guards
const TokenGuard = require('../../guards/token.guard')
const RoleGuard = require('../../guards/role.guard')
//Modules
const UserService = require('../../services/user.service')
const PaginationUtil = require('../../utils/pagination.util')

/** $QUERY /api/user/:id 
 *  Gets a single user by id and id is to be provided in params
 *  all authenticated users have access to this route 
 *  @param id user._id
 */
app.get('/api/user/:id', [TokenGuard], (req, res) => {
    let id = req.params.id
    UserService.findOneById(id)
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
    
    UserService.findAlike(options)
        .then(document => {
            if (!document[0]) {
                return res.status(404).json({
                    success: false,
                    error: 'No Users Were Found'
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
/** $INSERT /api/user
 *  Inserts a new user or a bunch of users depending on the lenght of the payload
 *  using body as the payload and userservice to handle requests you can set ROLES
 *  to create ADMIN_ROLE or ommit them to create PLAYER_ROLES
 *  @param body payload with user arrays, body = [{user},{user}...]
 */
app.post('/api/user', [TokenGuard], (req, res) => {

    let users = req.body
    UserService.createOneOrMany(users)
        .then(document => {
            if (!document) { //never goes through here but just in case
                return res.status(500).json({
                    success: false,
                    error: 'Severe Conflict While Saving Users'
                })
            }

            return res.json({
                success: true,
                message: `${document.length} Users Successfully Saved`
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
 *  at payload to modify user will not let modify roles
 *  @param id user._id
 *  @body user object
 */

app.put('/user/:id', [TokenGuard, RoleGuard], (req, res) => {

    let id = req.params.id
    let user = req.body
    UserService.updateOne(id, user)
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

/** $LOGIC ERRASE
 *  If the admin wishes to ban an user from the platform he may delete that said username
 *  you need to provide an id, Admins can delete other Admins from the platform
 */

app.delete('/api/user/:id', [TokenGuard, RoleGuard], (req, res) => {

    let id = req.params.id
    UserService.deleteOne(id)
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