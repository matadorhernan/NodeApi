const _ = require('underscore')

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

    sumData(local, visitor) {
        return {
            team: local.team || visitor.team,
            points: (local.points || 0) + (visitor.points || 0),
            games: (local.games || 0) + (visitor.games || 0),
            wins: (local.wins || 0) + (visitor.wins || 0),
            ties: (local.ties || 0) + (visitor.ties || 0),
            loses: (local.loses || 0) + (visitor.loses || 0),
            scoreDifference: (local.scoreDifference || 0) + (visitor.scoreDifference || 0),
        }
    }

    countData(matches, points, local = true) {

        let w = 0
        let t = 0
        let l = 0
        let g = 0
        let sf = 0
        let sa = 0

        for (let match of matches) {
            g++
            local ? sf += match.localScore : sf += match.visitorScore
            local ? sa += match.visitorScore :  sa += match.localScore
            if (match.localTeam > match.visitorTeam) {
                local ? w++ : l++

            } else if (match.localTeam == match.visitorTeam) {
                t++
            } else {
                local ? l++ : w++
            }
        }

        return {
            team: (local) ? match.localTeam : match.visitorTeam,
            points: w * points.win + t * points.tie + l * points.lose,
            games: g,
            wins: w,
            ties: t,
            loses: l,
            scoreDifference: sf - sa
        }
    }
}