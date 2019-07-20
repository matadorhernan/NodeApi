//modules
const KnockOutUtil = require('./knockout.util')
const RoundRobinUtil = require('./roundrobin.util')
const PlayOffsUtil = require('./playoffs.util')
const MatchService = require('../services/match.service')
const TeamService = require('../services/team.service')
const UserService = require('../services/user.service')

module.exports = class TournamentUtil {

    generateMatches(document) {
        let matches = new Array()
        switch (document.modality) {
            case 'roundRobin':
                matches = this._RoundRobinUtil.generateRoundRobin(document.teams, document._id)
                break
            case 'knockOut':
                matches = this._KnockOutUtil.generateKnockOut(document.teams, document._id)
                break
            case 'playOffs':
                matches = this._PlayOffsUtil.generatePlayOffs(document.teams, document._id)
                break
        }
        return matches
    }

    nextMatch(document, id) {

        let matches = new Array()
        const match = this._MatchService.findOneById(id)

        switch (document.modality) {
            case 'playOffs':
                if (document.matches[0].stage == 'groups') {
                    matches = this._PlayOffsUtil.updateKnockOut(match, document)
                } else if (document.matches[0].stage != undefined) {
                    matches = this._KnockOutUtil.knockOutNext(match, document)
                } else {
                    throw error = 'PlayOff Next Failed'
                }
                break
            case 'knockOut':
                matches = this._KnockOutUtil.knockOutNext(match, document)
                break
        }

        return matches
    }

    initMetadata(tournament) {

        let teams = tournament.teams

        for (let team of teams) {
            this._TeamService.updateOne(team._id, { tournament: tournament._id })
                .then(document => {
                    for (let player of document.players) {
                        let tournaments = player.tournaments
                        tournaments.push(tournament._id)
                        this._UserService.updateOne(player._id, { tournaments })
                    }
                }) //sets the tournament on all teams and pushes them to user
                .catch(error => {
                    throw error 
                })
        }

        return tournament
    }

    usersTournament(oldTeam, newTeam) {
        let tournament = newTeam.tournament
        let oldPlayers = oldTeam.players
        let newPlayers = newTeam.players

        let delPlayers = new Array()
        let addPlayers = new Array()

        for (let newPlayer of newPlayers) {
            if (oldPlayers.indexOf(newPlayer) == -1) {
                addPlayers.push(newPlayer)
            }
        }

        for (let oldPlayer of oldPlayers) {
            if (newPlayers.indexOf(oldPlayer) == -1) {
                delPlayers.push(oldPlayer)
            }
        }

        if (delPlayers.length > 0) {
            let users = this._UserService.findAlike({
                '_id': {
                    $in: delPlayers
                }
            })
            if (!users) {
                throw error = 'Failed to Delete Tournament Id from Removed Users'
            }
            for (user of users) {
                let tournaments = new Array()
                for (let oldTournament of user.tournaments) {
                    if (tournament != oldTournament) {
                        tournaments.push(oldTournament)
                    }
                }
                this._UserService.updateOne(user._id, { tournaments }).catch(error => {
                    throw error  
                })
            }
        }

        if (addPlayers.length > 0) {
            this._UserService.manyPushTournaments(_.pluck(addPlayers, '_id'), tournament).catch(error => {
                throw error
            })
        }

        return newTeam
    }

    constructor() {
        this._MatchService = new MatchService()
        this._RoundRobinUtil = new RoundRobinUtil()
        this._KnockOutUtil = new KnockOutUtil()
        this._PlayOffsUtil = new PlayOffsUtil()
        this._TeamService = new TeamService()
        this._UserService = new UserService()
    }
}