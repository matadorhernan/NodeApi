// dependencies
const Tournament = require('../models/tournament.schema')

module.exports = class TournamentService {

    async findAll() {
        return await Tournament.find().populate('matches').populate({
            path: 'teams',
            populate: {path: 'players'}
        }).exec()
    }

    async findAlike(options) {
        return await Tournament.find(options).populate('matches').populate({
            //no need to populate teams here
            path: 'teams',
            populate: {path: 'players'}
        }).exec()
    }

    async findOneById(id) {
        return await Tournament.findById(id).populate('matches').populate({
            path: 'teams',
            populate: {path: 'players'}
        }).exec()
    }

    async createOneOrMany(tournament) {

        if (tournament.name != undefined) {
            tournament = new Tournament(tournament)
        } else {
            tournament.forEach(insert => {
                return insert = new Tournament(insert)
            })
        }

        return await Tournament.create(tournament)

    }

    async updateOne(id, newTeam) {

        const team = await Tournament.findById(id).exec()

        if (!team._id) {
            throw error = {
                success: false,
                message: 'No Teams Where Found'
            }
        }
        newTeam.updated = Date.now()
        return await Tournament.findByIdAndUpdate(
            id,
            newTeam,
            { new: true, runValidators: true }).populate(
                'matches').populate({
                    path: 'teams',
                    populate: {path: 'players'}
                }).exec()

    }

    constructor() { }

}