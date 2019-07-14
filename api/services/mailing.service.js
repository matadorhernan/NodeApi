const NodeMailerUtil = require('../utils/nodemailer.util')
module.exports = class MailingService {

    constructor(){
        this._NodeMailerUtil = new NodeMailerUtil()
    }

    sendInvitesForTournament(document) {
        
        for (team of document.teams) {
            for (player of team.players) {
                this._NodeMailerUtil.sendEmailInvitation(player.email, document._id)
            }
        }
    }
    
    sendInvitesForAdmins(documents) {
        if (_.isObject(documents)) {
            if (documents.role == 'ADMIN_ROLE') {
                this._NodeMailerUtil.sendEmailInvitationAdmin(documents.email, documents._id)
            }
        } else {
            for (document of documents) {
                if (document.role == 'ADMIN_ROLE') {
                    this._NodeMailerUtil.sendEmailInvitationAdmin(document.email, document._id)
                }
            }
        }
    }
   
}