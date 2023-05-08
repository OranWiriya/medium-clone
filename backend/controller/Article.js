const db = require("../models")

const getArticleAll = async (req, res) => {
    const articleAll = await db.Article.findAll({
        include: [{
            model: db.Tag,
            through: {
                attributes: []
            }
        }, {
            model: db.User,
            attributes: { exclude: ["firstname", "lastname", "email", "password", "bio"] },
        },]
    })

    const favoriteAll = await db.Favorite.findAll()

    res.status(200).send({
        article: [articleAll,favoriteAll],
    })
}

const getArticle = async (req, res) => {
    const targetArticle =  Number(req.params.id);
    const article = await db.Article.findOne({
        where: { id: targetArticle },
        include: [{
            model: db.Tag,
            through: {
                attributes: []
            }
        },{
            model: db.User,
            attributes: { exclude: ["firstname", "lastname", "email", "password", "bio"] },
        }]
    })

    const favoriteAll = await db.Favorite.findAll({
        where: { article_id: targetArticle}
    })

    const follower = await db.Follower.findAll({
        where: {user_id: article.user_id }
    })

    if (article) {
        res.status(200).send({
            article: [article, favoriteAll],
            follower: follower
        })
    } else {
        res.status(404).send({ message: "Article is not found." })
    }
}

const addArticle = async (req, res) => {
    const { title, content, tags } = req.body;

    // // ตรวจสอบว่า tags แบ่งแต่ละ tag โดยแยกกันโดย ,
    const hashtag = tags.split(",");
    if (title.includes(" ")) {
        res.status(400).send({ message: "title should don't have space. " })
    } else {
        const newArticle = await db.Article.create({
            title: title,
            content: content,
            user_id: req.user.id
        });

        // สร้าง record ใน table Tag และ record ใน table ArticleTag
        const newTag = await Promise.all(
            hashtag.map(async (tagName) => {
                const [tag, created] = await db.Tag.findOrCreate({
                    where: { name: tagName },
                });

                if (created) {
                    // สร้าง record ใน table ArticleTag หาก tag ใหม่ถูกสร้างขึ้นมา
                    await db.ArticleTag.create({
                        article_id: newArticle.id,
                        tag_id: tag.id,
                    });
                } else {
                    // อัพเดต record ใน table ArticleTag หาก tag มีอยู่แล้ว
                    const foundTag = await db.ArticleTag.findOne({
                        where: { article_id: newArticle.id, tag_id: tag.id },
                    });

                    if (!foundTag) {
                        await db.ArticleTag.create({
                            article_id: newArticle.id,
                            tag_id: tag.id,
                        });
                    }
                }

                return tag
            })
        );
        newArticle.setDataValue('tags', newTag);
        res.status(201).send(newArticle);
    }
}

const deleteArticle = async (req, res) => {
    const targetId = Number(req.params.id);
    const targetArticle = await db.Article.findOne({ where: { id: targetId, user_id: req.user.id } });
    if (targetArticle) {
        await targetArticle.destroy();
        res.status(204).send()
    } else {
        res.status(404).send({ message: "Article is not found." })
    }
};

const updateArticle = async (req, res) => {
    const targetId = Number(req.params.id);
    let newTitle = req.body.title;
    let newContent = req.body.content;
    const newTag = req.body.tags.split(",");
    const targetArticle = await db.Article.findOne({ where: { id: targetId, user_id: req.user.id } });
    if (!targetArticle) {
        return res.status(404).send({ message: "Article is not found. " });
    }
    const juctionArticleTag = await db.ArticleTag.findAll({ where: { article_id: targetArticle.id } });
    const targetTag = await db.Tag.findAll({ where: { id: juctionArticleTag.map(jat => jat.tag_id) } });
    const tagToDelete = targetTag.filter(tag => !newTag.includes(tag.name));
    if (newTag.length === 0) {
        await db.ArticleTag.destroy({ where: { article_id: targetArticle.id } });
    } else if (tagToDelete.length > 0) {
        await Promise.all(tagToDelete.map(async tag => {
            await db.ArticleTag.destroy({ where: { article_id: targetArticle.id, tag_id: tag.id } });
        }));
    }
    const tagAll = await Promise.all(newTag.map(async (tagName) => {
        const [tag, created] = await db.Tag.findOrCreate({ where: { name: tagName } });
        if (!created) {
            const isExist = await db.ArticleTag.findOne({ where: { article_id: targetArticle.id, tag_id: tag.id } });
            if (isExist) {
                return null;
            }
        }
        return tag;
    }));
    const newArticleTag = tagAll.filter(tag => tag !== null).map(tag => ({ article_id: targetArticle.id, tag_id: tag.id }));
    await db.ArticleTag.bulkCreate(newArticleTag);
    if (newTitle === "") {
        newTitle = targetArticle.title;
    }
    if (newContent === "") {
        newContent = targetArticle.content;
    }
    await targetArticle.update({
        title: newTitle,
        content: newContent,
    })
    res.status(200).send({ message: "updating is success " });
}


const favoriteArticle = async (req, res, next) => {
    try {
        const articleId = Number(req.params.id);
        const userId = req.user.id;

        const favorite = await db.Favorite.findOne({
            where: {
                article_id: articleId,
                user_id: userId,
            },
        });

        if (favorite) {
            await favorite.destroy();
            res.status(200).json({ message: "Article removed from favorites" });
        } else {
            await db.Favorite.create({
                article_id: articleId,
                user_id: userId,
            });
            res.status(200).json({ message: "Article added to favorites" });
        }
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getArticleAll,
    getArticle,
    addArticle,
    deleteArticle,
    updateArticle,
    favoriteArticle
}