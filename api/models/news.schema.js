const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let supportedRelevance = {
    values: ['HIGH', 'MEDIUM', 'LOW'],
    message: '{VALUE} the message need a relevance value'

}

let newsSchema = new Schema({

    tournament: {
        required: [true, 'You need to specify a tournament'],
        type: Schema.Types.ObjectId,
        ref: 'Tournaments'
    },

    message: {
        type: String,
        require: [true, 'You need to redact a message']
    },

    created: {
        type: Date,
        default: Date.now()
    },

    updated: {
        type: Date,
        default: Date.now()
    },

    relevance: {
        type: String,
        default: 'LOW',
        enum: supportedRelevance
    }

})
module.exports = mongoose.model('News', newsSchema);