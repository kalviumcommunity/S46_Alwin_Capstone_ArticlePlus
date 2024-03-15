require("dotenv").config()
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/user")

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.API_URL}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleAuthUser = profile._json

                const existingUser = await User.findOne({
                    email: googleAuthUser.email,
                })

                if (existingUser) {
                    return done(null, existingUser._id.toString())
                }

                const newUser = new User({
                    name: googleAuthUser.name,
                    email: googleAuthUser.email,
                    verified: googleAuthUser.email_verified,
                    provider: "google",
                    picture: googleAuthUser.picture,
                })

                const savedUser = await newUser.save()

                done(null, savedUser._id.toString())
            } catch (err) {
                done(err, null)
            }
        },
    ),
)

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (err) {
        done(err, null)
    }
})
