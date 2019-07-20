//modules
const KnockOutUtil = require('./knockout.util')
const RoundRobinUtil = require('./roundrobin.util')
const PlayOffsUtil = require('./playoffs.util')
const MatchService = require('../services/match.service')

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
                if(document.matches[0].stage == 'groups'){
                    matches = this._PlayOffsUtil.updateKnockOut(match, document)
                } else if (document.matches[0].stage != undefined){
                    matches = this._KnockOutUtil.knockOutNext(match, document)
                } else {
                    throw error ={
                        success: false,
                        error: 'PlayOff Next Failed'
                    }
                }
                break
            case 'knockOut':
                matches = this._KnockOutUtil.knockOutNext(match, document)
                break
        }

        return matches
    }

    

    constructor() {
        this._MatchService = new MatchService()
        this._RoundRobinUtil = new RoundRobinUtil()
        this._KnockOutUtil = new KnockOutUtil()
        this._PlayOffsUtil = new PlayOffsUtil()
    }
}