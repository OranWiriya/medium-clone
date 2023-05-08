module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define("Favorite", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    },{
        tableName: "favorites",
        timestamps: false
    });

    return Favorite;
};