// dependencies
const Team = require('../models/team.schema')

module.exports = class TeamService {

    async findAll(){
        return await Team.find().populate(
            { path: 'players', select: '-password' }).exec()
    }

    async findAlike(options){
        return await Team.find(Options).populate(
            { path: 'players', select: '-password' }).exec()
    }

    async findOneById(id){
        return await Team.findById(id).populate(
            { path: 'players', select: '-password' }).exec()
    }

    async createOneOrMany(team){

        if(team.length == 1){
            team = new Team(team)
        } else if (team.length > 1){
            team.forEach(insert => {
                return insert = new Team(insert)
            })
        }
        
        return await Team.create(team)

    }
    
    async update(id, newTeam) {

        const team = await Team.findById(id).exec()

        if(!team._id){
            return {
                success: false,
                message: 'No Teams Where Found'
            }
        }

        return await Team.findByIdAndUpdate(id, newTeam,
             {new: true, runValidators: true}).populate(
                 { path: 'players', select: '-password' }).exec()

    }

    constructor(){}

};