const Article = require('../models/article');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const findbySlug = asyncHandler(async (req, res) => {
    const article = await Article.findOne(req.params).exec();
    const loginUser = await User.findOne({email:req.userEmail}).exec();

    if (!article){
        return res.status(401).json({
            message: "Article not found!"
        });
    };

    return res.status(200).json({
        article: await article.toArticleResponse()   
    });
});

const createArticle = asyncHandler(async (req, res) => {
    const title=req.body.title;
    const description=req.body.description;
    const body=req.body.body;
    const tagList=req.query.tagList;

    const loginUser = await User.findOne({email:req.userEmail}).exec();
    console.log(loginUser);

    // confirm data
    if (!title || !description || !body || !tagList) {
        res.status(400).json({message: "All fields are required"});
    }

    const articleObject = {
        "title": title,
        "description": description,
        "body": body,
        "tagList": tagList,
        "author": loginUser.id
    } 
    
    const createdArticle = await Article.create(articleObject);

    if (createdArticle) {
        res.status(201).json({
            article:await createdArticle.toArticleResponse(loginUser)
        })
    } else {
        res.status(422).json({
            errors: {
                body: "Unable to create article"
            }
        });
    }
});

const deleteArticle = asyncHandler(async (req, res) => {
    const loginUser = await User.findOne({email:req.userEmail}).exec();
    if (article.loginUser.toString() === loginUser._id.toString()) {
        await Article.findByIdAndDelete(article._id);
        res.status(200).json({
            message: "Article successfully deleted!!!"
        })
    } else {
        res.status(403).json({
            message: "Only the author can delete his article"
        })
    }

});

const favoriteArticle = asyncHandler(async (req, res) => {
    const loginUser = await User.findOne({email:req.userEmail}).exec();
    const article = await Article.findOne(req.params)
    if(!article){
        return res.status(404).json({
            message:"Article not found!"
        })
    }
    if (loginUser.favoriteArticle.includes(article._id)) {
        article.favorite=article.favorite
    }else{
        article.favorite=article.favorite+1
       }
    await loginUser.favorite(article._id)
    await article.save();
    return res.status(200).json({
        article: await article.toArticleResponse(loginUser)
    })
})

const unfavoriteArticle = asyncHandler(async (req, res) => {
    const loginUser = await User.findOne({email:req.userEmail}).exec();
    const article = await Article.findOne(req.params)
    if(!article){
        return res.status(404).json({
            message:"Article not found!"
        })
    }
    if (loginUser.favoriteArticles.includes(article._id)) {
        article.favorite=article.favorite-1
    }else{
        article.favorite=article.favorite
       }
    await loginUser.unFavorite(article._id)
    await article.save();
    return res.status(200).json({
        article: await article.toArticleResponse(loginUser)
    })
})

const updateArticle = asyncHandler(async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const body = req.body.body;
    const tagList = req.body.taglist;

    const loginUser = await User.findOne({username:req.username}).exec();

    const update = await Article.findOne(req.params).exec();

    if (title) {
        update.title = title;
    }
    if (description) {
        update.description = description;
    }
    if (body) {
        update.body = body;
    }
    if (tagList) {
        update.tagList = tagList;
    }

    await update.save();
    return res.status(200).json({
        article: await target.toArticleResponse(loginUser)
    })
});

const allArticles = asyncHandler(async (req, res) => {
    const data = await Article.find();
    return res.status(200).json({
            article:await Promise.all(data.map(async article=>{
                return await article.toArticleResponse();
            })),
    });
});

module.exports = {
    findbySlug,
    createArticle,
    deleteArticle,
    favoriteArticle,
    unfavoriteArticle,
    updateArticle,
    allArticles
}