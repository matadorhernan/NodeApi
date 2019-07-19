// dependencies
const Match = require('../models/match.schema')
const _ = require('underscore')

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
        
        if (match._id != undefined) {
            match = new Match(match)
        } else {
            match.forEach(insert => {
                return  insert = new Match(insert)
            })
        }
        return await Match.create(match)

    }

    async updateOne(id, newMatch) {

        const match = await Match.findById(id).exec()
        
        if (!match._id) {
            throw error = {
                success: false,
                message: 'No Matches Where Found'
            }
        }
        
        newMatch.date = newMatch.date || match.date
        newMatch.updated = Date.now()

        return await Match.findByIdAndUpdate(
            id, 
            newMatch,
            { new: true, runValidators: true }).populate(
                'tournament').populate(
                    'localTeam').populate(
                        'visitorTeam').exec()

    }

    async updateOrCreateOne(options, match){ 
        return await Match.update(options, match, {upsert: true, setDefaultsOnInsert: true, new: true}).populate(
            'tournament').populate(
                'localTeam').populate(
                    'visitorTeam').exec()
    }

    constructor() { }

};