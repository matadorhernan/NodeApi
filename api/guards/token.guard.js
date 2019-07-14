// npm dependencies
const jwt = require('jsonwebtoken')
// environments 
require('../environments/environment')


/** $GUARD
 * This will only verify the token and not anything else from token
 * it verifies the token and sets the decoded payload as a user object in 
 * the request object
 */

let TokenGuard = (request, response, next) => {

    let token = request.get('Token')
    jwt.verify(token, process.env.SEED, (error, decoded) => {

        //verify payload
        
        if (error) {
            return response.status(401).json({
                success: false,
                error
            })
        }

        if (!decoded) {
            return response.status(401).json({
                success: false,
                error: 'Unauthorized User Request'
            })
        }

        request.user = decoded.user

        next()

    })

}

module.exports = TokenGuard