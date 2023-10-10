const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slugify = require('slugify');
const User = require('../models/user');

const article = new mongoose.Schema({
    slug: {
        type: String,
        lowercase: true,
        unique: true,
        index: true
    },
    title: {
        required: true,
        type: String,
        unique: true
    },
    description: {
        required: true,
        type: String
    },
    body: {
        required: true,
        type: String
    },
    tagList: [{
        type: String,
        required: true
    }],
    favorite: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
},
{
    timestamps:true,
    versionKey:false
})

article.pre('save', function(next){
    this.slug = slugify(this.title, { lower: true, replacement: '-'});
    next();
});

article.methods.toArticleResponse = async function(){
    const authorObj = await User.findById(this.author).exec();
    return{
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tagList,
        favorite: this.favorite,
        author: await authorObj.toUserJSON(),
        createdAt:this.createdAt,
        updatedAt:this.updatedAt
    }
}

article.methods.addComment = function (commentId) {
    if(this.comments.indexOf(commentId) === -1){
        this.comments.push(commentId);
    }
    return this.save();
};

article.methods.deleteComment = function (commentId) {
    if(this.comments.indexOf(commentId) !== -1){
        this.comments.remove(commentId);
    }
    return this.save();
};

module.exports = mongoose.model('Article', article);