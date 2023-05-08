const db = require("../models")

const getComment = async (req, res) => {
    const targetArticle = await db.Article.findOne({
        where: { id: req.params.id }
    });
    if (targetArticle) {
        const allComments = await db.Comment.findAll({
            where: { article_id: targetArticle.id },
            include: [{
                model: db.User,
                attributes: { exclude: ["firstname", "lastname", "email", "password", "bio"] },
            }]
        })
        if (allComments === null) {
            res.status(404).send({ message: "Comments not found. " })
        }
        res.status(200).send({
            article: targetArticle,
            comment: allComments,
        })
    } else {
        res.status(404).send({ message: "Article not found. " })
    }
}
const addComment = async (req, res) => {
    const { content } = req.body;
    const targetArticle = await db.Article.findOne({
        where: { id: req.params.id }
    });
    if (targetArticle) {
        if (content === "") {
            res.status(400).send({ message: "content much have something" })
        }
        const newComment = await db.Comment.create({
            content: content,
            user_id: req.user.id,
            article_id: targetArticle.id
        })
        res.status(201).send(newComment);
    } else {
        res.status(404).send({ message: "Article not found. " })
    }
}
const deleteComment = async (req, res) => {
    const targetId = Number(req.params.Cid)
    const targetArticle = await db.Article.findOne({
        where: { id: req.params.id }
    });
    const targetComment = await db.Comment.findOne({
        where: { id: targetId, user_id: req.user.id, article_id: targetArticle.id }
    })
    if (targetComment) {
        await targetComment.destroy();
        res.status(204).send();
    } else {
        res.status(404).send({ message: "Comment not found. " })
    }
}

module.exports = {
    getComment,
    addComment,
    deleteComment
}