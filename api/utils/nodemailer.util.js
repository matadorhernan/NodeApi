let nodemailer = require('nodemailer')

module.exports = class NodeMailerUtil {
    
    sendEmailInvitation(email,id){

        let mailOptions = {
            from: this.from,
            to: email,
            subject: 'Invitacion para un torneo de Softtek',
            text: `Nuestro administrador te a invitado a un torneo. 
            Has click en el siguiente link para registrarse 
            http://sitiowebnombre.com/invitacion/${id}`
        }
        
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('error on nodemailer util');
             } 
        })

    }

    sendEmailInvitationAdmin(email,id){

        let mailOptions = {
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
                console.log('error on nodemailer util');
            } 
        })

    }

    sendEmailNotification(email,id){
        let mailOptions = {
            from: this.from,
            to: email,
            subject: 'Nueva notificación',
            text: `El administrador publicó una noticia del torneo ${id}`
        }
        this.transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log('error on nodemailer util');
            }
        })
    }

    constructor(){

        this.from = 'codellege@gmail.com',

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.from,
                pass: 'Codellege'
            }
        })
        
    }
}