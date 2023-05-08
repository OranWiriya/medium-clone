module.exports = (sequelize, DataTypes) => {
    const ArticleTag = sequelize.define("ArticleTag", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    },{
        selfGranted: DataTypes.BOOLEAN
    },{
        tableName: "articletags",
        timestamps: false
    });

    return ArticleTag;
};