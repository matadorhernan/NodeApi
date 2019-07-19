const _ = require('underscore')
module.exports = class KnockOutUtil {

    knockOutNext(knockout, document) {
        let nextTeam = (knockout.localScore > knockout.visitorScore) ? knockout.localTeam : knockout.visitorTeam
        return {
            tournament: document._id,
            stage: this.getStage(this.setStage(knockout.stage) / 2),
            localTeam: (knockout.position % 2 == 0) ? undefined : nextTeam ,
            visitorTeam: (knockout.position % 2 == 0) ? nextTeam : undefined ,
            position: Math.round(knockout.position / 2)
        }
    }

    generateKnockOut(teams, tournament) {

        teams = _.pluck(teams, '_id')
        //teams = _.shuffle(teams)

        let bracketSizes = [2, 4, 8, 16, 32, 64]

        let bracketSize = _.find(bracketSizes, (b) => {
            return b >= teams.length
        })

        let byes = teams.length - (bracketSize / 2) //byes are the number of teams with no opponent
        let stage = this.getStage(bracketSize)

        let knockOut = new Array()

        let j = 0

        for (let i = 0; i < bracketSize / 2; i++) { //runs through create n matches

            console.log(i, j);
            console.log(knockOut);

            if (byes > 0) { //if there are byes they are on the second half

                knockOut.push({
                    tournament,
                    stage,
                    localTeam: teams[i], // next first
                    visitorTeam: teams[i + bracketSize / 2], //next first bye
                    position: i + 1
                })

                j = i
                byes--

            } else { //when all byes are accounted for

                knockOut.push({ //then push free passes all as locals
                    tournament,
                    stage,
                    localTeam: teams[i],
                    visitorTeam: null,
                    position: i + 1
                })

                //to generate next stages for free passes

                let local = (teams[j] != undefined && teams[j + bracketSize / 2] != undefined) ? null : teams[j]//local is next free pass or current j relative to i
                local = local || null
                let visitor = teams[j + 1]

                if (visitor) { // as long as there is a visitor
                    knockOut.push({
                        tournament,
                        stage: this.getStage((bracketSize / 2)),
                        localTeam: local,
                        visitorTeam: visitor,
                        position: (j + 2) / 2
                    })
                }

                j += 2 //skips to the next pair

            }
        }

        return knockOut

    }

    getStage(number) {
        switch (number) {
            case 32:
                return 'Round of 32'
                break
            case 16:
                return 'Round of 16'
                break
            case 8:
                return 'Quarterfinals'
                break
            case 4:
                return 'Semifinals'
                break
            case 2:
                return 'Finals'
                break
        }
    }

    setStage(stage) {
        switch (stage) {
            case 'Round of 32':
                return 32
                break
            case 'Round of 16':
                return 16
                break
            case 'Quarterfinals':
                return 8
                break
            case 'Semifinals':
                return 4
                break
            case 'Finals':
                return 2
                break
        }
    }
}
