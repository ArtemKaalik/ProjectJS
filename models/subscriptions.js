const mongoose = require('mongoose');

const subscriptions = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    articleCount: {
        type: Number,
        required: true
    }
},
    {
        timestamps: false
})

module.exports = mongoose.model('Subscriptions', subscriptions)