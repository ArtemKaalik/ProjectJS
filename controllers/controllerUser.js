const User = require('../models/user');
const Subscription = require('../models/subscriptions');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const registerUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const username=req.body.username;
    const password=req.body.password;

    // confirm data
    if (!email || !username || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    // hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    const userObject = {
        "username": username,
        "password": hashedPwd,
        "email": email
    };

    const createdUser = await User.create(userObject);

    if (createdUser) { // user object created successfully  
        res.status(201).json({
            user:await createdUser.toUserResponse()
        })
    } else {
        res.status(422).json({
            errors: {
                body: "Unable to register a user"
            }
        });
    }
});

const thisUser=asyncHandler(async(req,res)=>{
    const email = req.userEmail;
    const user = await User.findOne({ email }).exec();
    if(!user){
        return res.status(400).json({
            message:"Unknown user!"
        });
    }
    return res.status(200).json({
        user:await user.toUserResponseAuth()
    });
});


const showUserById = asyncHandler(async (req, res) => {
    const email = req.userEmail;
    const user = await User.findOne({ email }).exec();
    if(!user){
        return res.status(400).json({
            message:"User not found!"
        });
    }
    return res.status(200).json({
        user:await user.toUserResponseAuth()
    });
});



const showUsers = asyncHandler(async (req, res) => {
    const query={}
    const data = await User.find();
    const UserCount = await User.count(query);
    return res.status(200).json({
            user:await Promise.all(data.map(async user=>{
                return await user.toUserResponse();
            })),
            userCount:UserCount
    });
});


const userLogin = asyncHandler(async (req, res) => {
    const email=req.body.email
    const password=req.body.password

    // confirm data
    if (!email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    const loginUser = await User.findOne({ email }).exec();

    // console.log(loginUser);

    if (!loginUser) {
        return res.status(404).json({message: "User Not Found"});
    }

    const match = await bcrypt.compare(password, loginUser.password);

    if (!match) return res.status(401).json({ message: 'Unauthorized: Wrong password' })

    res.status(200).json({
        user: await loginUser.toUserResponse()
    });

});


const updateUser = asyncHandler(async (req, res) => {
    const loginUser = await User.findOne({email:req.userEmail}).exec();
    const username = req.body.username;
    const email = req.body.email;
    const bio = req.body.bio;
    const image = req.body.image;

    const update = await User.findById(loginUser._id).exec();

    if (email) {
        target.email = user.email;
    }
    if (username) {
        target.username = user.username;
    }
    if (password) {
        const hashedPwd = await bcrypt.hash(user.password, 10);
        target.password = hashedPwd;
    }
    if (bio){
        change.bio=bio;
    }
    if (image){
        change.image=image;
    }

    await update.save();

    return res.status(200).json({
        user:await change.toUserResponseAuth()
    });

});

module.exports = {
    registerUser,
    thisUser,
    showUserById,
    showUsers,
    userLogin,
    updateUser
}