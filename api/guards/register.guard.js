// environmets 
require('../environments/environment')
// dependencies
const bcrypt = require('bcrypt');
//modules
const AuthService = require('../services/auth.service')

/** $GUARD
 *  User needs to be able to register but only if he knows his email and unique id
 *  for exact match with mongoose. Deleted Users or Registered Users will not pass this guard
 */

let RegisterGuard = (req, res, next) => {

    let email = req.body.email
    let password = req.body.password
    let id = req.params.id

    let _AuthService = new AuthService()

    if (!email || !id || !password) {
        return res.status(422).json({
            success: false,
            error: 'Incomplete Credentials. Thus, Unprocessable'
        })
    } 

    _AuthService.findAlike({ email, deleted: false, signed: false})
        .then(document => { //promise returns an object of documents with results
            if (!document[0] || document[0]._id != id){
                throw error = {
                    success: false,
                    error: 'Unauthorized Request From User, Wrong Email or ID. User Already Registered?'
                }
            }
            
            req.valid = true
            req.user = document

            next()

        })
        .catch(error => { // error in mongo
            return res.status(500).json({
                success: false,
                error
            })
        })
}

module.exports = RegisterGuard