// environments 
require('../environments/environment')
// dependencies
const User = require('../models/user.schema')
const bcrypt = require('bcrypt');
const _ = require('underscore')
//utils
const CompletedUtil = require('../utils/completed.util')

module.exports = class UserService {

    async findAll() {
        return await User.find({deleted: false}).populate('tournaments').exec()
    }

    async findAlike(options) {
        options.deleted = false
        return await User.find(options).populate('tournaments').exec()
    }
    async findOneById(id) {
        return await User.findById(id).where('deleted').equals(false).populate('tournaments').exec()
    }

    async createOneOrMany(user) {
        if (user.email != undefined) {
            if(_.has(user, 'password')){
                user.password = bcrypt.hashSync(user.password, 10)
            } 
            user = new User(user)
        } else {
            user.forEach(insert => {
                if(_.has(insert, 'password')){
                    insert.password = bcrypt.hashSync(insert.password, 10)
                } 
                return insert = new User(insert)
            })
        }
        return await User.create(user)
    }

    async updateOne(id, newUser) {

        const user = await User.findById(id).exec()

        if (!user._id) {
            throw error = {
                success: false,
                error: 'No Users Where Found'
            }
        }
        
        let _CompletedUtil = new CompletedUtil()
        newUser = _CompletedUtil.checkUser(newUser, user)
        
        return await User.findByIdAndUpdate(id, newUser,
            { new: true, runValidators: true }).populate('tournaments').exec()
    }

    async deleteOne(id){
        return await User.findByIdAndUpdate(id, {deleted: true, updated: Date.now()},
        { new: true, runValidators: true }).exec()
    }

    constructor() { }

};