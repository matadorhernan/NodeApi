//modues
const KnockOutUtil = require('./knockout.util')
const RoundRobinUtil = require('./roundrobin.util')
const PlayOffsUtil = require('./playoffs.util')

module.exports = class TournamentUtil {

    generateMatches(document) {

        let matches = new Array()

        switch (document.modality) {
            case 'roundRobin':
                matches = RoundRobinUtil.generateRoundRobin(document.teams, document._id)
                break
            case 'knockOut':
                matches = KnockOutUtil.generateKnockOut(document.teams, document._id)
                break
            case 'playOffs':
                matches = PlayOffsUtil.generatePlayOffs(document.teams, document._id)
                break
        }

        return matches

    }

}