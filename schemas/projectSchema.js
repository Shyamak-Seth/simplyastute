const mongoose = require('mongoose')
const {Schema} = mongoose
const reqString = {required: true, type: String}

const projectSchema = new Schema({
    email: reqString,
    projectName: reqString,
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model("project", projectSchema)