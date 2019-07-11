// environmets 
require('./environments/environment')
// dependencies
const bcrypt = require('bcrypt');
//modules
const UserService = require('../services/user.service')

/** $GUARD
 *  User needs to be able to login but to login we recieve a body object and 
 *  save the body object as the user object, I then compare the email and password
 *  for exact match with mongoose. Deleted Users cannot login
 */

let LocalGuard = (req, res, next) => {

    let body = req.body //user data from body
    let email = body.email
    let password = body.password

    if (!email || !password) {

        return res.status(422).json({
            success: false,
            error: 'Incomplete Credentials. Thus, Unprocessable'
        })

    } else {
        password = bcrypt.hashSync(password, process.env.SALT_ROUNDS)
    }

    UserService.findAlike({email, password, deleted:false})
    .then( document => { //promise returns an object of documents with results
        if(document[0]){ //if theres a result sign valid guard
            req.valid = true
            req.user = document
        } else {
            return res.status(400).json({
                success: false,
                error: 'Unauthorized Request From User'
            })
        }
    })
    .catch( error =>  { // error in mongo
        return res.status(500).json({
            success: false,
            error: error
        })
    })
    
    next()

}

module.exports = LocalGuard