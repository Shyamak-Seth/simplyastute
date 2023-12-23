const passport = require('passport')

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        return res.redirect('/login')
    }
}

const forwardAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next()
    } else {
        return res.redirect('/')
    }
}

module.exports = {ensureAuthenticated, forwardAuthenticated}