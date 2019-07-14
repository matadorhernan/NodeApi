const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let roles = {
    values: ['ADMIN_ROLE', 'PLAYER_ROLE'],
    message: '{VALUE} is not a role'
}

let userSchema = new Schema({
    
    name: {
        type: String,
        default: ''
    },

    email: {
        type: String,
        required: [true, 'User needs a email to be registered']
    },

    password: {
        type: String,
        default: '',
        select: false
    },

    tournaments: [{
        type: Schema.Types.ObjectId,
        ref:'Tournament',
        default: []
    }],

    role: {
        type: String,
        default: 'PLAYER_ROLE',
        enum: roles
    },

    completed :{ // flag for finished sign ups of users
        type: Boolean,
        default:false
    },

    signed: {
        type: Boolean,
        default:false
    },

    created: {
        type: Date,
        default: Date.now() //Date now is twice as fast
    },

    updated: {
        type: Date,
        default: Date.now() //Date now is twice as fast
    },

    deleted: {
        type: Boolean,
        default: false
    },

})

//userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('User', userSchema);
