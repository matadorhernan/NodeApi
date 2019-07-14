const NodeMailerUtil = require('../utils/nodemailer.util')
module.exports = class MailingService {
    sendInvitesForTournament (document) {
        for(team of document.teams){
            for(player of team.players){
                NodeMailerUtil.sendEmailInvitation(player.email, document._id)
            }
        }
    }
}