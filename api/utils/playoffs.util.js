const _ = require('underscore');
const RoundRobinUtil = require('./roundrobin.util')
const StatisticsUtil = require('./statistics.util')
const KnockOutUtil = require('./knockout.util')
module.exports = class PlayOffsUtil {

    constructor() {
        this._RoundRobinUtil = new RoundRobinUtil()
        this._KnockOutUtil = new KnockOutUtil()
        this._StatisticsUtil = new StatisticsUtil()
    }

    generatePlayOffs(teams, tournament) {
        teams = _.pluck(teams, '_id')
        teams = _.shuffle(teams)
        let groupInfo = this.calculateGroups(teams.length)

        let group = 'A'
        let playOffs = new Array()

        for (let i = 0; i < groupInfo.groups; i++) {

            let teamsBatch = _.first(teams, groupInfo.size)
            teams.splice(0, groupInfo.size)
            playOffs.push(
                this._RoundRobinUtil.generateRoundRobin(
                    teamsBatch,
                    tournament,
                    { stage: 'groups', group }
                )
            )
            group = this.nextGroup(group)
        }
        playOffs = _.flatten(playOffs)
        return playOffs
    }

    async updateKnockOut(roundrobin, document) {

        let groups = _.groupBy(document.matches, 'groups')
        let nextTeams = new Array()

        for (let group of groups) {
            // best 2 teams from all groups, sorted by points and finally pluck only the teams and points
            best = _.pluck( _.first(_.sortBy(this._StatisticsUtil.getDocumentStats({
                points: document.points,
                matches: group
            }), stat => stat.points), 2), ['team'])
            // Push the best 2 teams to the nextTeams Array 
            for(team of best){
                nextTeams.push(team.team)
            }
        }
        //mix all groups into one list and starts a knockout
        let matches = this._KnockOutUtil.generateKnockOut(_.flatten(nextTeams), document._id)
        
        // filter updated matches to relevant ones only
        matches = _.filter(matches, (match)=>{
            return match.localTeam == roundrobin.localTeam ||
            match.localTeam == roundrobin.visitorTeam ||
            match.visitorTeam == roundrobin.localTeam ||
            match.visitorTeam == roundrobin.visitorTeam
        })

        return matches

    }

    /** $ALGORITHM 
     *  Enter the number of teams to calculate the best possible number of groups and 
     *  and best possible group size
     *  @param {*} number as in the number of teams entering tournament
     *  @returns { groups, size, missing }
     */
    calculateGroups(number) {

        let groupSizes = [3, 4, 5, 6]
        let groupNumbers = [1, 2, 4, 8, 16, 32, 64]
        let data = new Object()

        let missingInitial = number
        let missingFinal = number

        for (let probableGroup of groupNumbers) {
            for (let probableSize of groupSizes) {
                let closest = probableGroup * probableSize // an loop product trying to reach number 
                if (closest == number || closest >= number) { //if closest reaches or goes above number
                    missingInitial = closest - number  // calculate the missing from number to complete closest

                    if (missingInitial < missingFinal) { //the one that needs the least amount of teams to reach closest stays

                        missingFinal = missingInitial

                        data = { //overriding data every time a closest round gets closer
                            groups: probableGroup,
                            size: probableSize,
                            missing: missingFinal
                        }
                    }
                }
            }
        }
        //by the end return the best data result 

        return data

    }

    nextGroup(group) {
        return String.fromCharCode(group.charCodeAt() + 1);
    }

}