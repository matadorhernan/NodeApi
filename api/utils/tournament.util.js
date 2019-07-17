//modules
const KnockOutUtil = require('./knockout.util')
const RoundRobinUtil = require('./roundrobin.util')
const PlayOffsUtil = require('./playoffs.util')

module.exports = class TournamentUtil {

    generateMatches(document) {
        let matches = new Array()
        let _RoundRobinUtil = new RoundRobinUtil()
        let _KnockOutUtil = new KnockOutUtil()
        let _PlayOffsUtil = new PlayOffsUtil()

        switch (document.modality) {
            case 'roundRobin':
                matches = _RoundRobinUtil.generateRoundRobin(document.teams, document._id)
                break
            case 'knockOut':
                matches = _KnockOutUtil.generateKnockOut(document.teams, document._id)
                break
            case 'playOffs':
                matches = _PlayOffsUtil.generatePlayOffs(document.teams, document._id)
                break
        }
        return matches
    } 
    
    nextMatch(document) {
        switch (document.stage) {
            case 'table':
                break
            case 'groups':
                _PlayOffsUtil.nextMatch(document)
                break
            default:
                _KnockOutUtil.nextMatch(document)
                break
        }
    }
}