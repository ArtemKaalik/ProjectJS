const mongoose = require('mongoose');
const User = require("./user");

const comment = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }
},
    {
        timestamps: true
    });


comment.methods.toCommentResponse = async function (user) {
    const authorObj = await User.findById(this.author).exec();
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: authorObj.toProfileJSON(user)
    }
};

module.exports = mongoose.model('Comment', comment);