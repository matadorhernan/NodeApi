require('../environments/environment')
// dependencies
const _ = require('underscore')
const bcrypt = require('bcrypt');

/** $UTIL CLASS
 *  A class for checking whether or not an incomming user is completed,
 *  the update route PUT cannot modify roles because it is open to users
 */

module.exports = class CompletedUtil {

    /** $UTILITY
     *  Check User consists on finding which properties are missing from array and 
     *  filtering extra ones, adding database updates and finally if all properties are
     *  met the users receives a boolean flag completed 
     * @param {*} newUser the incoming user
     * @param {*} user the old user from find
     */
    
    checkUser(newUser, user){
        newUser = newUser
        let filter = ['name', 'email', 'tournaments','signed']

        if(_.has(newUser, 'password')){
            filter.push('password')
            newUser.password = bcrypt.hashSync(newUser.password, 10)
        }
        
        newUser = _.pick(newUser, filter) // filters whatever admin enters
        newUser = _.pick(newUser, _.identity) //deletes undefined
        
        if (
            (_.has(newUser, 'name') || user.name != '') &&
            (_.has(newUser, 'password') || user.password != '') &&
            (_.has(newUser, 'email') || user.email != '') &&
            (_.has(newUser, 'signed') || user.signed != false)
        ) {
            newUser.completed = true //adds completed
        }
        
        newUser.updated = Date.now()
        return newUser

    }
}