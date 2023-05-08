const express = require('express');
const router = express.Router();
const articleContollers = require('../controller/Article.js');
const passport = require('passport');

const authentication = passport.authenticate("jwt", { session: false })

router.get("/getAll", articleContollers.getArticleAll);
router.get('/:id', authentication, articleContollers.getArticle);
router.post('/', authentication, articleContollers.addArticle);
router.put('/:id', authentication, articleContollers.updateArticle);
router.delete('/:id', authentication, articleContollers.deleteArticle);
//favoritearticle
router.post("/:id", authentication, articleContollers.favoriteArticle);

module.exports = router;