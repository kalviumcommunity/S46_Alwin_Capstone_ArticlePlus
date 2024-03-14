require("dotenv").config()
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/user")

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.API_URL}/auth/google/redirect`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile._json.email
                const existingUser = await User.findOne({ email })

                if (existingUser) {
                    return done(null, existingUser)
                }

                const newUser = new User({
                    name: profile._json.name,
                    email,
                    verified: profile._json.email_verified,
                    provider: "google",
                })

                const savedUser = await newUser.save()
                done(null, savedUser)
            } catch (err) {
                done(err, null)
            }
        },
    ),
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (err) {
        done(err, null)
    }
})
