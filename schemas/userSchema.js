const mongoose = require('mongoose')
const {Schema} = mongoose
const reqString = {required: true, type: String}

const userSchema = new Schema({
    email: reqString,
    fname: reqString,
    lname: reqString,
    password: reqString,
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model("user", userSchema)