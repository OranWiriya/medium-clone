module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Tag", {
        name: {
            type: DataTypes.CHAR(25),
            unique: true
        }
    }, {
        tableName: "tags" 
    })

    model.associate = models => {
        model.belongsToMany(models.Article, {
            through: models.ArticleTag,
            foreignKey: "tag_id",
        });
    }

    return model;
}