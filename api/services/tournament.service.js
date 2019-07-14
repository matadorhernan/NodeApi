// dependencies
const Tournament = require('../models/tournament.schema')

module.exports = class TournamentService {

    async findAll() {
        return await Tournament.find().populate('matches').populate({
            path: 'teams',
            populate: { path: 'players', select: '-password' }
        }).exec()
    }

    async findAlike(options) {
        return await Tournament.find(Options).populate('matches').populate({
            //no need to populate teams here
            path: 'teams',
            populate: { path: 'players', select: '-password' }
        }).exec()
    }

    async findOneById(id) {
        return await Tournament.findById(id).populate('matches').populate({
            path: 'teams',
            populate: { path: 'players', select: '-password' }
        }).exec()
    }

    async createOneOrMany(tournament) {

        if (tournament.length == 1) {
            tournament = new Tournament(tournament)
        } else if (tournament.length > 1) {
            tournament.forEach(insert => {
                return insert = new Tournament(insert)
            })
        }

        return await Tournament.create(tournament)

    }

    async update(id, newTeam) {

        const team = await Tournament.findById(id).exec()

        if (!team._id) {
            throw error = {
                success: false,
                message: 'No Teams Where Found'
            }
        }

        return await Tournament.findByIdAndUpdate(
            id,
            newTeam,
            { new: true, runValidators: true }).populate(
                'matches').populate({
                    path: 'teams',
                    populate: { path: 'players', select: '-password' }
                }).exec()

    }

    constructor() { }

}