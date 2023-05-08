module.exports = (sequelize, DataTypes) => {
    const Follower = sequelize.define("Follower", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    },{
        tableName: "followers",
        timestamps: false
    });

    return Follower;
};