const bcrypt = require('bcrypt'),
    LocalStrategy = require('passport-local').Strategy
    User = require('../schemas/userSchema')

const initialize = (passport) => {
    const authenticateUser = async (email, password, done) => {
        const foundUser = await User.findOne({email})
        if (!foundUser) {
            return done(null, false, {message: "No user found with this email."})
        }
        bcrypt.compare(password, foundUser.password, (err, isMatch) => {
            if (err) return done(err)
            if (isMatch) {
                return done(null, foundUser)
            } else {
                return done(null, false, {message: "Incorrect password entered."})
            }
        })
    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    
    passport.serializeUser((user, done) => {
        return done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    })
}

module.exports = initialize