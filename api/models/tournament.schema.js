const mongoose = require('mongoose')

let Schema = mongoose.Schema

let supportedTournaments = {
    VALUES: ['roundRobin', 'knockOut', 'playOffs'],
    message: '{VALUE} no es una modalidad valida'
}

let tournamentSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'The tournament needs a name']
    },

    sport: {
        type: String,
        required: [true, 'The tournament needs a sport']
    },

    modality: {
        type: String,
        required: [true, 'The trounament needs a modality'],
        enum: supportedTournaments
    },

    started: { // flag for started tournaments
        type: Boolean,
        default: false
    },

    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default: []
    }],

    matches: [{
        type: Schema.Types.ObjectId,
        ref: 'Match'
    }],

    created: {
        type: Date,
        default: Date.now()
    },

    updated: {
        type: Date,
        default: Date.now()
    },

    deleted: {
        type: Boolean,
        default: false
    },
})
//tournamentSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })
module.exports = mongoose.model('Tournament', tournamentSchema)

