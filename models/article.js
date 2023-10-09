const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slugify = require('slugify');
const User = require('../models/user');

const article = new mongoose.Schema({
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tagList: [{
        type: String,
        required: true
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    favouritesCount: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true,
    versionKey: false
});

article.plugin(uniqueValidator);

article.pre('save', function(next){
    this.slug = slugify(this.title, { lower: true, replacement: '-'});
    next();
});

article.methods.updateFavoriteCount = async function () {
    const favoriteCount = await User.count({
        favouriteArticles: {$in: [this._id]}
    });

    this.favouritesCount = favoriteCount;

    return this.save();
}

// user is the logged-in user
article.methods.toArticleResponse = async function () {
    const authorObj = await User.findById(this.author).exec();
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tagList: this.tagList,
        favorited: this.favorited,
        // author: await authorObj.toProfileJSON(User)
    }
}

article.methods.addComment = function (commentId) {
    if(this.comments.indexOf(commentId) === -1){
        this.comments.push(commentId);
    }
    return this.save();
};

article.methods.removeComment = function (commentId) {
    if(this.comments.indexOf(commentId) !== -1){
        this.comments.remove(commentId);
    }
    return this.save();
};

module.exports = mongoose.model('Article', article);