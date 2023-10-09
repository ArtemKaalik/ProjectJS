const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const getProfile = asyncHandler(async (req, res) => {
    const loggedin = req.loggedin;
    
    const user = await User.findOne(req.params.username).exec();

    if (!user) {
        return res.status(404).json({
            message: "User Not Found"
        })
    }
    if (!loggedin) {
        return res.status(200).json({
            profile: user.toProfileJSON(false)
        });
    } else {
        const loginUser = await User.findOne({ email: req.userEmail }).exec();
        return res.status(200).json({
            profile: user.toProfileJSON(loginUser)
        })
    }

});

const followUser = asyncHandler(async (req, res) => {
    const loginUser = await User.findOne({ email: req.userEmail }).exec();
    const user = await User.findOne(req.params.username).exec();

    if (!user || !loginUser) {
        return res.status(404).json({
            message: "User Not Found"
        })
    }
    await loginUser.follow(user._id);
    await user.addFollower(loginUser._id);

    return res.status(200).json({
        profile: user.toProfileJSON(loginUser)
    })

});

const unFollowUser = asyncHandler(async (req, res) => {
    const loginUser = await User.findOne({ email: req.userEmail }).exec();
    const user = await User.findOne(req.params).exec();

    if (!user || !loginUser) {
        return res.status(404).json({
            message: "User Not Found"
        })
    }
    await loginUser.unfollow(user._id);
    await user.unfollow(loginUser._id);

    return res.status(200).json({
        profile: user.toProfileJSON(loginUser)
    })

});

module.exports = {
    getProfile,
    followUser,
    unFollowUser
}