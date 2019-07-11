// dependencies
const Match = require('../models/match.schema')

module.exports = class MatchService {

    async findAll() {
        return await Match.find().populate(
            'tournament').populate(
                'localTeam').populate(
                    'visitorTeam').exec()
    }

    async findAlike(options) {
        return await Match.find(Options).populate(
            'tournament').populate(
                'localTeam').populate(
                    'visitorTeam').exec()
    }

    async findOneById(id) {
        return await Match.findById(id).populate(
            'tournament').populate(
                'localTeam').populate(
                    'visitorTeam').exec()
    }

    async findByTournamentId(id) {
        return await Match.find().where('tournament').equals(id).populate(
            'tournament').populate(
                'localTeam').populate(
                    'visitorTeam').exec()
    }

    async createOneOrMany(match) {

        if (match.length == 1) {
            match = new Match(match)
        } else if (match.length > 1) {
            match.forEach(insert => {
                return insert = new Match(insert)
            })
        }

        return await Match.create(match)

    }

    async update(id, newMatch) {

        const match = await Match.findById(id).exec()

        if (!match._id) {
            return {
                success: false,
                message: 'No Matches Where Found'
            }
        }

        return await Match.findByIdAndUpdate(id, newMatch,
            { new: true, runValidators: true }).populate(
                'tournament').populate(
                    'localTeam').populate(
                        'visitorTeam').exec()

    }

    constructor() { }

};