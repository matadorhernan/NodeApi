//modues
const KnockOutUtil = require('./knockOut.util')

module.exports = class TournamentUtil {

    generateMatches(document) {

        let matches = new Array()

        switch (document.modality) {
            case 'roundRobin':

                break
            case 'knockOut':
                matches = KnockOutUtil.generateKnockOut(document.teams, document._id)
                break
            case 'playOffs':
                break
        }

        return matches
    }

}