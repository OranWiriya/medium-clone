const db = require("../models")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    const targetUser = await db.User.findOne({ where: { username: username } });
    if (targetUser) {
        res.status(400).send({ message: "Username already token." })
    } else {
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password, salt);

        await db.User.create({
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: hashedPassword,
            image: "https://api.realworld.io/images/smiley-cyrus.jpeg"
        });

        res.status(201).send({ message: "Register completed" })
    }
}

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const targetUser = await db.User.findOne({ where: { username: username } });
    if (!targetUser) {
        res.status(400).send({ message: "Username or Password is wrong." });
    } else {
        const isCorrectPassword = bcryptjs.compareSync(password, targetUser.password)
        if (!!isCorrectPassword) {
            const payload = {
                username: targetUser.username,
                firstname: targetUser.firstname,
                lastname: targetUser.lastname,
                id: targetUser.id,
                image: targetUser.image,
                bio: targetUser.bio
            };
            const token = jwt.sign(payload, "SeCrEcToRkEyS", { expiresIn: 3600 })

            res.status(200).send({
                token: token,
                message: "Login Successful"
            })
        } else {
            res.status(400).send({ message: "Username or Password is wrong." });
        }
    }
}

const updateUser = async (req, res) => {
    const targetId = Number(req.params.id)
    const { firstname, lastname, email, password, bio, image } = req.body;
    const targetUser = await db.User.findOne({ where: { id: targetId } });
    const isCorrectPassword = bcryptjs.compareSync(password, targetUser.password)
    if (!isCorrectPassword) {
        res.status(400).send({ message: "Password is wrong." });
    } else {
        if (firstname == "") {
            firstname = targetUser.firstname;
        }
        if (lastname == "") {
            lastname = targetUser.lastname;
        }
        if (email == "") {
            email = targetUser.email;
        }
        if (bio == "") {
            bio = targetUser.bio;
        }
        if (image == "") {
            image = targetUser.image;
        }
        if (targetUser) {
            await targetUser.update({
                firstname: firstname,
                lastname: lastname,
                email: email,
                bio: bio,
                image: image
            })
            res.status(201).send({
                message: "updateing is success",
                targetUser: targetUser
            })
        } else {
            res.status(404).send({
                message: "password is wrong ",
                targetId: targetId,
                targetUser: targetUser
            })
        }
    }
}

const getUser = async (req, res) => {
    const targetId = Number(req.params.id)
    const targetUser = await db.User.findOne({ where: { id: targetId } });
    if (!targetUser) {
        res.status(400).send({ message: "Id is wrong" });
    } else {
        res.status(200).send({
            message: "Get data completed",
            targetId: targetId,
            targetUsername: targetUser.username,
            targetFirstname: targetUser.firstname,
            targetLastname: targetUser.lastname,
            targetEmail: targetUser.email,
            targetPassword: targetUser.password,
            targetBio: targetUser.bio,
            targetImage: targetUser.image
        })
    }
}

const followUser = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const followerId = req.user.id;

        const follower = await db.Follower.findOne({
            where: {
                user_id: userId,
                follower_id: followerId,
            }
        });

        if (follower) {
            await follower.destroy();
            res.status(200).json({ message: "Unfollowed user" });
        } else {
            await db.Follower.create({
                user_id: userId,
                follower_id: followerId,
            });
            res.status(200).json({ message: "Followed user" });
        }
    } catch (err) {
        next(err);
    }
}

const getFollower = async (req, res) => {
    const userId = req.user.id;

    const isFollow = await db.Follower.findAll({
        where: { user_id: userId }
    })
    if (isFollow.length === 0) {
        res.status(404).send({ message: "no one followed." })
    } else {
        const followerIds = isFollow.map(follow => follow.follower_id)
        const follower = await db.User.findAll({
            attributes: { exclude: ["firstname", "lastname", "email", "password"] },
            where: { id: followerIds }
        })
        res.status(200).json({ follower })
    }
}

const getFollowing = async (req, res) => {
    const userId = req.user.id;

    const isFollowing = await db.Follower.findAll({
        where: { follower_id: userId }
    });
    if (isFollowing.length === 0) {
        res.status(200).send({ message: "didn't follow anyone " })
    } else {
        const followingIds = isFollowing.map(follower => follower.user_id)
        const following = await db.User.findAll({
            attributes: { exclude: ["firstname", "lastname", "email", "password"] },
            where: { id: followingIds }
        })
        res.status(200).json({ following })
    }

}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    getUser,
    followUser,
    getFollower,
    getFollowing
}