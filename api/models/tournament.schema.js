const mongoose = require('mongoose')

let Schema = mongoose.Schema

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
        required: [true, 'The tournament needs a modality'],
        enum: ['roundRobin', 'knockOut', 'playOffs']
    },

    points: {
        win: {
            type: Number,
            default: 3
        },
        tie: {
            type: Number,
            default: 1
        },
        lose: {
            type: Number,
            default: 0
        },
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
    }
})
//tournamentSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })
module.exports = mongoose.model('Tournament', tournamentSchema)

