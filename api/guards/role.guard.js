/** $GUARD
 * RoleGuard needs to go after TokenGuard (always)
 * the reason for that is that TokenGuard decodes the token and inserts it
 * in the request object, and this guard checks for privileges on that object,
 * if Token is not ADMIN_ROLE user will not pass this guard
 */

let RoleGuard = (request, response, next) => {

    let user = request.user //user from payload

    if (user.role !== 'ADMIN_ROLE') {
        return response.status(401).json({
            success: false,
            error: 'Unauthorized User Request'
        })
    }

    next()

}

module.exports = RoleGuard