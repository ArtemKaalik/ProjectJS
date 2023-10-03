const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
// const verifyJWTOptional = require('../middleware/verifyJWTOptional');
const controllerComment = require('../controllers/controllerComment');

router.post('/:slug/comments', verifyJWT, controllerComment.addCommentsToArticle);

router.get('/:slug/comments', controllerComment.getCommentsFromArticle);

router.delete('/:slug/comments/:id', verifyJWT, controllerComment.deleteComment)

module.exports = router;