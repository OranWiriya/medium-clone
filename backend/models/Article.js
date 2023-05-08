module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Article", {
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        tableName: "articles"
    })

    model.associate = models => {
        model.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: 'CASCADE'
        }),
        model.belongsToMany(models.Tag, {
            through: models.ArticleTag,
            foreignKey: "article_id",
        }),
        model.belongsToMany(models.User, {
            through: models.Favorite,
            foreignKey: "article_id",
        })
    }


    return model;
}