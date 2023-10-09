const Comment = require ("../models/comment");
const User = require ("../models/user.js");
const Article = require ("../models/article.js");
const asyncHandler = require("express-async-handler");

const addCommentsToArticle = asyncHandler(async (req, res) => {
    const loginUser = await User.findOne({email:req.userEmail}).exec();
    const article = await Article.findOne(req.params)
    const body=req.body.body

    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }

    const newComment = await Comment.create({
        body: body,
        author: comment._id,
        article: article._id
    });

    await article.addComment(newComment._id);

    return res.status(200).json({
        comment: await newComment.toCommentResponse(comment)
    })

});
    const getCommentsFromArticle=asyncHandler(async(req,res)=>{
    const article = await Article.findOne(req.params)
    const loginUser = await User.findOne({email:req.userEmail}).exec();

    if (!article) {
        return res.status(401).json({
            message: "Article not found!"
        });
    }

    return res.status(200).json({
        comment: await Promise.all(article.comments.map(async commentId=>{
            const commentObj = await Comment.findById(commentId).exec();
            return await commentObj.toCommentResponse(loginUser);
        })),
    })
})

const deleteComment = asyncHandler(async (req, res) => {
    const loginUser = await User.findOne({email:req.userEmail}).exec();
    const article = await Article.findOne(req.params).exec();

    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }

    const comment = await Comment.findById(req.params.id).exec();

    if (comment.author.toString() === comment._id.toString()) {
        await article.removeComment(comment._id);
        await Comment.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "comment has been successfully deleted!!!"
        });
    } else {
        return res.status(403).json({
            error: "only the author of the comment can delete the comment"
        })
    }
});

module.exports = {
    addCommentsToArticle,
    getCommentsFromArticle,
    deleteComment
}