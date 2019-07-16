// dependencies
const Team = require('../models/team.schema')
const _ = require('underscore')

module.exports = class TeamService {

    async findAll(){
        return await Team.find().populate(
            'players').exec()
    }

    async findAlike(options){
        return await Team.find(options).populate(
            'players').exec()
    }

    async findOneById(id){
        return await Team.findById(id).populate(
            'players').exec()
    }

    async createOneOrMany(team){
       
        if (team.name != undefined) {
            team = new Team(team)
        } else{
            team.forEach(insert => {
                return insert = new Team(insert)
            })
        }
        return await Team.create(team)

    }
    
    async updateOne(id, newTeam) {

        const team = await Team.findById(id).exec()

        if(!team._id){
            throw error = {
                success: false,
                message: 'No Teams Where Found'
            }
        }
        newTeam.updated = Date.now()
        return await Team.findByIdAndUpdate(id, newTeam,
             {new: true, runValidators: true}).populate(
                 'players').exec()

    }

    constructor(){}

};