const router = require('express').Router()

router.get('/', (req, res, next) => {
    req.logout((error) => {
        if (error) return next(error)
        res.redirect('/login')
    })
})

module.exports = router