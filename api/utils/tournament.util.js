//modules
const KnockOutUtil = require('./knockout.util')
const RoundRobinUtil = require('./roundrobin.util')
const PlayOffsUtil = require('./playoffs.util')

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

    nextMatch(document) {

        let matches = new Array()
        switch (document.modality) {
            case 'playOffs':
                matches = this._PlayOffsUtil.updateKnockOut(document)
                break
            case 'knockOut':
                matches = this._KnockOutUtil.nextMatch(document)
                break
        }
        return matches
    }

    constructor() {
        this._RoundRobinUtil = new RoundRobinUtil()
        this._KnockOutUtil = new KnockOutUtil()
        this._PlayOffsUtil = new PlayOffsUtil()
    }
}