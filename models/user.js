const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require("jsonwebtoken");
const Subs=require('../models/subscriptions')

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
        default: "https://static.productionready.io/images/smiley-cyrus.jpg"
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"subscriptions"
    },
    followingUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    subscriptionStartDate: {
        type: Date,
        default: Date.now()
    },
    subscriptionEndDate: {
        type: Date,
        default: function () {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1); // Один месяц к текущей дате
        return currentDate;
        }
    }
},
    {
        timestamps: false,
        versionKey: false
    });

// @desc generate access token for a user
// @required valid email and password
user.methods.generateAccessToken = function() {
    const accessToken = jwt.sign({
            "user": {
                "id": this._id,
                "email": this.email,
                "password": this.password
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d"}
    );
    return accessToken;
};

user.methods.toUserResponse =async function() {
    const subsObject=await Subs.findById(this.subscription).exec();
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        subscription: subsObject.toSubscriptionJSON(),
        subscriptionStartDate: this.subscriptionStartDate,
        subscriptionEndDate: this.subscriptionEndDate,
        token: this.generateAccessToken()
    }
}
    user.methods.toProfileJSON = function (user) {
        return {
            username: this.username,
            bio: this.bio,
            image: this.image,
            following: user ? user.isFollowing(this._id) : false
        }
    };
    user.methods.isFollowing = function (id) {
        const idStr = id.toString();
        for (const followingUser of this.followingUsers) {
            if (followingUser.toString() === idStr) {
                return true;
            }
        }
        return false;
    };
    
    user.methods.follow = function (id) {
        if(this.followingUsers.indexOf(id) === -1){
            this.followingUsers.push(id);
        }
        return this.save();
    };
    
    user.methods.unfollow = function (id) {
        if(this.followingUsers.indexOf(id) !== -1){
            this.followingUsers.remove(id);
        }
        return this.save();
    };
    // users.methods.like = function (id) {
    //     if(this.likedArticles.indexOf(id) === -1){
    //         this.likedArticles.push(id);
    //     }
    //     return this.save();
    // }
    // users.methods.unLike = function (id) {
    //     if(this.likedArticles.indexOf(id) !== -1){
    //         this.likedArticles.remove(id);
    //     }
    //     return this.save();
    // }
    // users.methods.isLiked = function (id) {
    //     const idStr = id.toString();
    //     for (const article of this.likedArticles) {
    //         if (article.toString() === idStr) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    
module.exports = mongoose.model('user', user);