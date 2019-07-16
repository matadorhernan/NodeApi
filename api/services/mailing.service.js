const NodeMailerUtil = require('../utils/nodemailer.util')
const _ = require('underscore')
module.exports = class MailingService {

    constructor(){
        this._NodeMailerUtil = new NodeMailerUtil()
    }

    sendInvitesForTournament(document) {
        
        for (let team of document.teams) {
            for (let player of team.players) {
                this._NodeMailerUtil.sendEmailInvitation(player.email, document._id)
            }
        }
    }
    
    sendInvitesForAdmins(documents) {
        if (documents._id != undefined) {
            if (documents.role == 'ADMIN_ROLE') {
                this._NodeMailerUtil.sendEmailInvitationAdmin(documents.email, documents._id)
            }
        } else {
            for (let document of documents) {
                if (document.role == 'ADMIN_ROLE') {
                    this._NodeMailerUtil.sendEmailInvitationAdmin(document.email, document._id)
                }
            }
        }
    }
   
}