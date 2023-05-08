module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Comment", {
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: "comments"
    })

    model.associate = models => {
        model.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        }),
        model.belongsTo(models.Article, {
            foreignKey: "article_id",
            onDelete: "CASCADE"
        })
    }


    return model;
}