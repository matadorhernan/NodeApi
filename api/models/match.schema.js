const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let matchSchema = new Schema({

    tournament:{ 
        type: Schema.Types.ObjectId,
        ref: 'Tournament',
        required: [true, 'The match needs a specified tournament']
    },

    stage:{ // flag that specifies the stage on all modalities
        type: String,
        default:''
    },

    group:{ // flag to tell groups on playOffs
        type: String,
        default: ''
    },

    localTeam:{
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default: null        
    },

    visitorTeam:{
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default:null
    },

    localScore:{
        type: Number,
        default: 0
    },

    visitorScore:{ 
        type: Number,
        default: 0
    },

    round: {
        type: Number,
        default: 0,
    },

    position: { // flag to organize brackets
        type: Number,
        default: 0
    },

    date: { // Tells the user when is the game being played
        type: Date,
        default: ''
    },

    deleted: {
        type: Boolean,
        default: false
    }
    
})

module.exports=mongoose.model('Match',matchSchema);