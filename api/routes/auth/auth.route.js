// environmets 
require('../../environments/environment')
//dependencies
const express = require('express');
const app = express();
//modules
const LocalGuard = require('../../guards/local.guard')
const AuthService =  require('../../services/auth.service')

/** $AUTH
 * The method post /api/auth/login will login in the api
 * and it will use localGuard to verify credentials and then returns
 * a token valid for 48hrs
 * @param email body.email
 * @param password body.password
 */

app.post('/api/auth/login', [LocalGuard], (req, res)=>{
    
    if(!req.valid){ // the app will never get here but just in case
        return res.status(400).json({
            success: false,
            error: 'Unauthorized Request From User'
        })
    }

    let token = AuthService.createToken(req.user)

    return res.json({
        success: true,
        token
    })

})

module.exports = app