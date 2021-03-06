const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let teamSchema = new Schema({
    
    name: {
        type:String,     
        require:[true,'the team needs a name']
    },
    
    tournament: {
        type: Schema.Types.ObjectId,
        ref: 'Tournament',
        default: null
    },

    players:[{
        type: Schema.Types.ObjectId,
        ref: 'User',
        require:[true,'the team needs a player']
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
//teamSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports=mongoose.model('Team',teamSchema);