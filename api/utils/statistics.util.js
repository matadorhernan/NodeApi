module.exports = class StatisticsUtil {

    getDocumentStats(document) {
        //saves the point system
        let points = document.points
        //deletes free passes or not competed matches
        let matches = _.filter(document.matches, (match) => {
            return match.localTeam != null && match.visitorTeam != null
        })
        //groups matches to count as local and as visitor, since no matches repeat 
        let localGroups = _.groupBy(matches, 'localTeam')
        let visitorGroups = _.groupBy(matches, 'visitorTeam')
        let local = new Array()
        let visitor = new Array()
        //counts statistics as local and as visitor for all teams
        for (let group of localGroups) {
            local.push(this.countData(group, points, true))
        }
        for (let group of visitorGroups) {
            visitor.push(this.countData(group, points, false))
        }
        // finds out which teams to account for
        let teams = _.union(
            [_.pluck(local, 'team')],
            [_.pluck(visitor, 'team')]
        )
        // sets stats for all teams
        let statistics = new Array()
        for (team of teams) {
            statistics.push(
                this.sumData(
                    _.findWhere(local, { team }),
                    _.findWhere(visitor, { team })
                )
            )
        }
        return statistics
    }

    sumData(local, vsisitor) {
        return {
            team: local.team || visitor.team,
            points: (local.points || 0) + (vsisitor.points || 0),
            games: (local.games || 0) + (vsisitor.games || 0),
            wins: (local.wins || 0) + (vsisitor.wins || 0),
            ties: (local.ties || 0) + (vsisitor.ties || 0),
            loses: (local.loses || 0) + (vsisitor.loses || 0),
            scoreDifference: (local.scoreDifference || 0) + (vsisitor.scoreDifference || 0),
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