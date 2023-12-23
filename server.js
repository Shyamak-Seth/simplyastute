require('dotenv').config()

const express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session'),
    flash = require('express-flash'),
    passportInit = require('./utils/passport-config')
    app = express(),
    PORT = process.env.PORT || 5000,
    {ensureAuthenticated, forwardAuthenticated} = require('./utils/authenticate')

const indexRouter = require('./routers/indexRouter'),
    loginRouter = require('./routers/loginRouter'),
    regRouter = require('./routers/regRouter'),
    appRouter = require('./routers/appRouter'),
    logoutRouter = require('./routers/logoutRouter')

mongoose.connect(process.env.MONGO_URI, console.log('CONNECTED TO MONGOOSE'))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/', express.static('public'))
app.use(express.static('uplaods'))
app.use('/', express.static('uploads'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(express.urlencoded({extended: false}))
app.use(express.json({limit: '1mb'}))

app.use(passport.initialize())
app.use(passport.session())
passportInit(passport)

app.use('/', indexRouter)
app.use('/login', forwardAuthenticated, loginRouter)
app.use('/register', forwardAuthenticated, regRouter)
app.use('/app', ensureAuthenticated, appRouter)
app.use('/logout', ensureAuthenticated, logoutRouter)

app.listen(PORT, console.log(`APP CONNECTED ON PORT ${PORT}`))