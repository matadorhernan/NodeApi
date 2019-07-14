// environmets 
require('../environments/environment')
// dependencies
const bcrypt = require('bcrypt');
//modules
const AuthService = require('../services/auth.service')

/** $GUARD
 *  User needs to be able to login but to login we recieve a body object and 
 *  save the body object as the user object, I then compare the email and password
 *  for exact match with mongoose. Deleted or unregistered Users will not login
 */

let LocalGuard = (req, res, next) => {

    let body = req.body //user data from body
    let email = body.email
    let password = body.password
    let _AuthService = new AuthService()

    if (!email || !password) {
        return res.status(422).json({
            success: false,
            error: 'Incomplete Credentials. Thus, Unprocessable'
        })
    } 

    _AuthService.findAlike({ email, deleted: false, signed: true})
        .then(document => { //promise returns an object of documents with results

            if (!document[0]) { //if theres a result sign valid guard
                throw error = {
                    success: false,
                    error: 'Unauthorized Request From User, Wrong Email or Password'
                }
            }
            
            if(!bcrypt.compareSync(password, document[0].password)){
                throw error = {
                    success: false,
                    error: 'Unauthorized Request From User, Wrong Email or Password'
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

module.exports = LocalGuard