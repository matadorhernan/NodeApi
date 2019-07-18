// environmets 
require('../../environments/environment')
//dependencies
const express = require('express');
const app = express();
const _ = require('lodash')
//guards
const LocalGuard = require('../../guards/local.guard')
const RegisterGuard = require('../../guards/register.guard')
//modules
const AuthService = require('../../services/auth.service')
const UserService = require('../../services/user.service')

/** $AUTH
 * The method post /api/auth/login will login in the api
 * and it will use localGuard to verify credentials and then returns
 * a token valid for 48hrs
 * @param email body.email
 * @param password body.password
 */

app.post('/api/auth/login', [LocalGuard], (req, res) => {

    if (!req.valid) { // the app will never get here but just in case
        return res.status(400).json({
            success: false,
            error: 'Unauthorized Request From User'
        })
    }

    let _AuthService = new AuthService()

    let token = _AuthService.createToken(req.user)
    let user = req.user

    return res.json({
        success: true,
        user,
        token
    })
})

app.put('/api/auth/sign/:id', [RegisterGuard], (req, res) => {

    let body = req.body
    let id = req.params.id

    delete body.role
    body.signed = true;

    let _UserService = new UserService()

    _UserService.updateOne(id, body)
        .then(document => {
            if(!document){
                throw error = {
                    success: false,
                    error: 'Unauthorized Request From User, Already Registered'
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