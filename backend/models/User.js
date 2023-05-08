module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("User", {
        firstname: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        bio: {
            type: DataTypes.TEXT,
        },
        image: {
            type: DataTypes.TEXT,
        }
    }, {
        tableName: "users",
        timestamps: false
    })

    model.associate = models => {
        model.hasMany(models.Article, {
            foreignKey: "user_id"
        }),
        model.hasMany(models.Comment, {
            foreignKey: "user_id"
        }),
        model.belongsToMany(models.Article, {
            through: models.Favorite,
            foreignKey: "user_id",
        }),
        model.belongsToMany(models.User, {
            through: models.Follower,
            as: "followers",
            foreignKey: "user_id",
            timestamps: false
        }),
        model.belongsToMany(models.User, {
            through: models.Follower,
            as: "following",
            foreignKey: "follower_id",
            timestamps: false
        })
    }

    return model;
}