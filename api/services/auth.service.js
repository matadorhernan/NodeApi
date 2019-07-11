// environmets 
require('../environments/environment')
// dependencies
const jwt = require('jsonwebtoken')

module.exports = class AuthService {

    createToken(user) {

        let expiresIn = process.env.TOKEN_EXPIRATION

        return jwt.sign({user},
            process.env.SEED, { expiresIn }
        )
        
    }

    constructor(){}

};