const router = require('express').Router()
const User = require('../schemas/userSchema')
const bcrypt = require('bcrypt')
const defaultValues = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    cnfpassword: ""
}

router.get('/', (req, res) => {
    res.render('register', {error: false, values: defaultValues})
})

router.post('/', async (req, res) => {
    const {fname, lname, email, password, cnfpassword} = req.body
    const foundUser = await User.findOne({email})
    if (!fname || !lname || !email || !password || !cnfpassword) {
        return res.render('register', {
            error: "Please enter all the credentials.", 
            values: {
                email, fname, lname, password, cnfpassword
            }
        })
    }
    if (foundUser) {
        return res.render('register', {
            error: "A user already exists with this email. You might want to login instead.",
            values: {
                email, fname, lname, password, cnfpassword
            }
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        fname: fname,
        lname: lname,
        email: email,
        password: hashedPassword
    })
    await newUser.save()
    res.redirect('/login')
})

module.exports = router