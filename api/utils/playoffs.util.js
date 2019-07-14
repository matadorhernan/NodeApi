const _ = require('underscore');
const RoundRobinUtil = require('./roundrobin.util')
module.exports = class PlayOffsUtil {

    generatePlayOffs(teams, tournament) {
        
        teams = _.shuffle(teams)
        let groupInfo = this.calculateGroups(teams.length)
        let group = 'A'

        let playOffs = new Array()

        for (let i = 0; i < groupInfo.groups; i++) {
            let teamsBatch = _.first(teams, groupInfo.size)
            teams.splice(0, groupInfo.size)
            playOffs.push(
                RoundRobinUtil.generateRoundRobin(
                    teamsBatch,
                    tournament,
                    { stage: 'PlayOffs', group }
                )
            )

            group = nextGroup(group)

        }

        playOffs =  _.flatten(playOffs)
        return playOffs
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
        let missingFinal = new Number()

        for (probableGroup of groupNumbers) {
            for (probableSize of groupSizes) {
                let closest = probableGroup * probableSize // an loop product trying to reach number 
                if (closest == number || closest >= number) { //if closest reaches or goes above number

                    missingInitial = closest - number  // calculate the missing from number to complete closest

                    if (missingInitial < missingFinal) { //the one that needs the least ammount of teams to reach closest stays

                        missingFinal = missingInitial

                        data = { //overriding data everytime a closest round gets closer
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

    nextGroup(group){
        return String.fromCharCode(group.charCodeAt() + 1);
    }


}