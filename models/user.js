const {Schema, model} = require('mongoose');

const userShcema = Schema({
    name: {
        type: String,
        required: true
    },
    surname:{
        type: String,
    },
    nickname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    role:{
        type: String,
        default: 'role_user',
        select: false
    },
    image:{
        type: String,
        default: 'image.png'
    },
    created_at:{
        type: Date,
        default: Date.now 
    }
})

module.exports = model("User",userShcema,'users')