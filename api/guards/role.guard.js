/** $GUARD
 * authRolling needs to go after authToken (always)
 * the reason for that is that authToken decodes the token and inserts it
 * in the request object, and this guard checks for privileges,
 * privileges are set in the payload of the request token
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