const _ = require('underscore')
module.exports =  class RoundRobinUtil {

    generateRoundRobin(teams, tournament, metadata = {stage: 'table', group: 'table'}){
        
        if(teams[0].name != undefined){
            teams = _.pluck(teams, '_id') 
        }
        teams = _.shuffle(teams)
        let roundRobin = new Array()

        if(teams.length % 2 == 0){
            let center = _.last(teams)
            teams.pop()

            let teamsIterator = teams.length

            for(let j = 0; j <= teamsIterator; j++){ //even team total
                for (const [i, v] of teams.entries()) {
                    if(i==0){ // the center goes against the current first vertice v
                        roundRobin.push({
                            tournament,
                            stage: metadata.stage,
                            group: metadata.group,
                            localTeam: center,
                            visitorTeam: v
                        })
                    } else if (i <= teams.length / 2){ //mirror matching
                        roundRobin.push({
                            tournament,
                            stage: metadata.stage,
                            group: metadata.group,
                            localTeam: v, //next first v
                            visitorTeam: teams[(teams.length) - i], // next last v
                        })
                    } else {
                        break
                    }
                }
                teams = this.nextRound(teams)
            }
        } else { //not even
            let teamsIterator = teams.length
            for(let j = 0; j <= teamsIterator; j++){
                for (const [i, v] of teams.entries()) {
                    if (i !== 0 && i <= Math.floor(teams.length / 2)) { //all ifs skip over the first vertice i !=0
                        roundRobin.push({
                            tournament,
                            stage: metadata.stage,
                            group: metadata.group,
                            localTeam: v, //next first v
                            visitorTeam: teams[(teams.length) - i], // next last v
                        })
                    } else if (i !== 0) {
                        break
                    }
                }
                teams = this.nextRound(teams)
            }
        }
        
        return roundRobin
    }

    nextRound(teams){
        let last = [_.last(teams)]
        teams.pop()
        let res = last.concat(teams) //Workaround, unshift() causa problemas con mongodb y objectIDs
        return res
    }

}