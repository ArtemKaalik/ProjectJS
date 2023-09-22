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
        default: "https://static.productionready.io/images/smiley-cyrus.jpg"
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"subscriptions"
    },
    subscriptionStartDate: {
        type: Date,
        default: Date.now()
    },
    subscriptionEndDate: {
        type: Date,
        default: function () {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1); // Добавляем один месяц к текущей дате
        return currentDate;
        }
    }
},
    {
        timestamps: false
    });

user.plugin(uniqueValidator);

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
}

user.methods.toUserResponse = function() {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: this.generateAccessToken()
    }
};
module.exports = mongoose.model('user', user);