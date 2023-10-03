const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
// const verifyJWTOptional = require('../middleware/verifyJWTOptional');
const controllerArticle = require('../controllers/controllerArticle');


router.get('/article', controllerArticle.allArticles);

router.get('/article/:slug', verifyJWT, controllerArticle.findbySlug);

router.post('/article/', verifyJWT, controllerArticle.createArticle);

router.delete('/article/:slug', verifyJWT, controllerArticle.deleteArticle);

router.post('/article/:slug/favorite', verifyJWT, controllerArticle.favoriteArticle);

router.delete('/article/:slug/favorite', verifyJWT, controllerArticle.unfavoriteArticle);

router.put('/article/:slug', verifyJWT, controllerArticle.updateArticle);



module.exports = router;