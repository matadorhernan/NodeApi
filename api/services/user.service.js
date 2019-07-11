// environmets 
require('./environments/environment')
// dependencies
const User = require('../models/user.schema')
const bcrypt = require('bcrypt');
//utils
const CompletedUtil = require('../utils/completed.util')

module.exports = class UserService {

    async findAll() {
        return await User.find().populate('tournaments', '-password').exec()
    }

    async findAlike(options) {
        return await User.find(options).populate('tournaments', '-password').exec()
    }
    async findOneById(id) {
        return await User.findById(id).populate('tournaments', '-password').exec()
    }

    async createOneOrMany(user) {
        if (user.length == 1) {
            if(_.has(user, 'password')){
                user.password = bcrypt.hashSync(user.password, process.env.SALT_ROUNDS)
            } 
            user = new User(user)
        } else if (user.length > 1) {
            user.forEach(insert => {
                if(_.has(insert, 'password')){
                    insert.password = bcrypt.hashSync(insert.password, process.env.SALT_ROUNDS)
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

        newUser = new User(CompletedUtil.checkUser(newUser, user))
        
        return await User.findByIdAndUpdate(id, newUser,
            { new: true, runValidators: true }).populate('tournaments', '-password').exec()
    }

    async deleteOne(id){
        return await User.findByIdAndUpdate(id, {deleted: true, updated: Date.now()},
        { new: true, runValidators: true }).exec()
    }

    constructor() { }

};