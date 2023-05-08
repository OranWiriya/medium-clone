const passport = require("passport")
const {Strategy, ExtractJwt} = require('passport-jwt');
const db = require("../models")

const option = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "SeCrEcToRkEyS"
};

const JWTStrategy = new Strategy(option, async (payload, done) => {
    const targetUser = await db.User.findOne({ where: {id: payload.id}})

    if(targetUser) {
        done(null, targetUser);
    } else {
        done(null, false)
    }
})

passport.use("jwt", JWTStrategy)