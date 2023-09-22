const mongoose = require('mongoose');


const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    bio: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: null
    },
    subscriptions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscriptions'
    }
},
    {
        timestamps: false
    });


module.exports = mongoose.model('user', user);