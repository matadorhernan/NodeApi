let nodemailer = require('nodemailer')

module.exports = class NodeMailerUtil {
    
    sendEmailInvitation(email,id){

        mailOptions = {
            from: this.from,
            to: email,
            subject: 'Invitacion para un torneo de Softtek',
            text: `Nuestro administrador te a invitado a un torneo. 
            Has click en el siguiente link para registrarse 
            http://sitiowebnombre.com/invitacion/${id}`
        }

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("ERROR!!!!!!", error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })

    }

    sendEmailInvitationAdmin(email,id){

        mailOptions = {
            from: this.from,
            to: email,
            subject: 'Invitacion para unirse como Administrador de Torneos de Softtek',
            text: `Nuestro administrador te a invitado a formar parte  como 
            un Administrador de Torneos de Softtek. 
            Has click en el siguiente link para registrarse 
            http://sitiowebnombre.com/invitacion/${id}`
        }

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("ERROR!!!!!!", error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })

    }

    sendEmailNotification(email,id){

        mailOptions = {
            from: this.from,
            to: email,
            subject: 'Nueva notificación',
            text: `El administrador publicó una noticia del torneo ${id}`
        }

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("ERROR!!!!!!", error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })
    }

    constructor(){

        this.from = 'testmailercdg@codellege.com',

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.from,
                pass: 'codellege'
            }
        })
        
    }
}