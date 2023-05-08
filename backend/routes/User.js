const express = require('express');
const router = express.Router()
const userController = require("../controller/User.js")
const passport = require("passport")

const authentication = passport.authenticate("jwt", {session: false})

router.post("/register",userController.registerUser)
router.post("/login",userController.loginUser)
router.put("/update/:id",authentication,userController.updateUser)
router.get("/getinfo/:id",authentication,userController.getUser)
//follower/following
router.post("/follow/:id", authentication, userController.followUser)
router.get("/follower", authentication, userController.getFollower)
router.get("/following", authentication, userController.getFollowing)

module.exports = router