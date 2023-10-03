const Subscription = require('../models/subscriptions');
const asyncHandler = require('express-async-handler');


const addSubscription = asyncHandler(async (req, res) => {
    const title = req.body.title;
    const status = req.body.status;
    const price = req.body.price;
    const articleCount = req.body.articleCount;

    // confirm data
    if (!title || !status || !price || !articleCount) {
        return res.status(400).json({message: "All fields are required"});
    }

    const subsObject={
        "title":title,
        "status":status,
        "price":price,
        "articleCount":articleCount
    }


    const createSubscription = await Subscription.create(subsObject);

    if (createSubscription) { // subscription object created successfully
        res.status(201).json({
            subscription: createSubscription.toSubscriptionResponse()
        })
    } else {
        res.status(422).json({
            errors: {
                body: "Unable to create a subscription"
            }
        });
    }
});

const updateSubscription=asyncHandler(async(req,res)=>{
    const title = req.body.title;
    const status = req.body.status;
    const price = req.body.price;
    const articleCount = req.body.articleCount;

    const update=await Subscription.findOne(req.params.title).exec();

    if (title){
        update.title=title;
    }
    if (status){
        update.status=status;
    }
    if (price){
        update.price=price;
    }
    if (articleCount){
        update.articleCount=articleCount;
    }

    await update.save();

    return res.status(200).json({
        subscription:update.toSubscriptionResponse()
    });
});

const deleteSubscription=asyncHandler(async(req,res)=>{
    const subscription = await Subscription.findByOne(req.params.title);
    const deleted = await Subscription.findByIdAndRemove(subscription._id);
    res.send(`Subscription "${deleted.title}" has been deleted..`)
});

const showSubscriptions=asyncHandler(async(req,res)=>{
    const data = await Subscription.find();
    return res.status(200).json({
        subscription:data
    });
});

const showById=asyncHandler(async(req,res)=>{
    const data = await Subscription.findOne(req.params.title);
    return res.status(200).json({
        subscription:data
    });
});

const giveSubscription=asyncHandler(async(req,res)=>{
    const loginUser = await User.findOne({email:req.userEmail}).exec();
    const subscription = await Subscription.findOne(req.params.title)
    const authHeader = req.headers.authorization || req.headers.Authorization
    const token = authHeader.split(' ')[1];
    if (subscription.status === "Month") {
        loginUser.subscriptionStartDate = Date.now();
        loginUser.subscriptionEndDate = new Date();
        loginUser.subscriptionEndDate.setMonth(loginUser.subscriptionEndDate.getMonth() + 1);
    }

    if (subscription.status === "Year") {
        loginUser.subscriptionStartDate = Date.now();
        loginUser.subscriptionEndDate = new Date();
        loginUser.subscriptionEndDate.setFullYear(loginUser.subscriptionEndDate.getFullYear() + 1);
    }
    loginUser.subscription=subscription._id
    await loginUser.save();
    return res.status(200).json({
        user:await loginUser.toUserResponseAuthSub(token)
    });
})

module.exports = {
    addSubscription,
    updateSubscription,
    deleteSubscription,
    showSubscriptions,
    showById,
    giveSubscription
}