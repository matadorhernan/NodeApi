// environmets 
require('../environments/environment')
// dependencies
const jwt = require('jsonwebtoken')
const User = require('../models/user.schema')

module.exports = class AuthService {

    createToken(user) {

        let expiresIn = process.env.TOKEN_EXPIRATION
        return jwt.sign({ user },
            process.env.SEED, { expiresIn }
        )

    }
    async findAlike(Option) {
        return await User.find(Option).select(
            'name tournaments role completed created updated deleted _id email password'
        ).exec()
    }
    constructor() { }

};