module.exports = class StatisticsUtil {

    getDocumentStats(document) {
        //saves the point system
        let points = document.points
        //deletes free passes or not competed matches
        let matches = _.filter(document.matches, (match) => {
            return match.localTeam != null && match.visitorTeam != null
        })

        //groups matches to count as local and as visitor, since no matches repeat 
        let localData = _.groupBy(matches, 'localTeam')
        let visitorDta = _.groupBy(matches, 'visitorTeam')

        for (let group of localData) {
            this.countData(group, points, true)
        }


    }

    countData(matches, points, local = true) {

        for (let match of matches) {

            let w = 0
            let t = 0
            let l = 0
            let g = 0
            let sf = 0
            let sa = 0

            if (match.localTeam > match.visitorTeam) {
                if (local) {
                    w++
                    g++
                    sf += match.localScore
                } else {
                    l++
                    g++
                    sa += match.localScore
                }
            } else if (match.localTeam == match.visitorTeam) {
                if (local) {
                    t++
                    g++
                }
            } else {
                if (local) {
                    l++
                    g++
                    sa += match.visitorScore
                } else {
                    w++
                    g++
                    sf += match.visitorScore
                }
            }

            return {
                team: (local) ? match.localTeam : match.visitorTeam,
                points: w * points.wins + t * points.ties + l * points.loses,
                games: g,
                wins: w,
                ties: t,
                loses: l,
                scoreDifference: sf - sa
            }
        }
    }
}