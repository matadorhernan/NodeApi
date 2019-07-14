const AuthService = require('../services/auth.service')

/** $GUARD
 * DynamicGuard needs to go after TokenGuard (always)
 * the reason for that is that TokenGuard decodes the token and inserts it
 * in the request object, and this guard checks for either admin privileges
 * or local privileges on that object, this is a LocalGuard convined with RoleGuard
 * PLAYER_ROLES trying to modify othe PlayerRoles will not pass this Guard
 */
let UserGuard = (request, response, next) => {

    let id = req.params.id //id being Modified
    let user = request.user //user from payload
    let _AuthService = new AuthService()

    _AuthService.findAlike({ _id: id, deleted: false, signed: true }) // document being modified
        .then(document => {
            if (!document[0] ||
                user._id != document._id || //user trying to modify others
                user.role != 'ADMIN_ROLE' // user trying to modify others as player 
            ) {
                throw error = {
                    success: false,
                    error: 'Unauthorized User Request'
                }
            }
            next()
        })
        .catch(error => {
            return response.status(500).json({
                success: false,
                error
            })
        })
}

module.exports = UserGuard