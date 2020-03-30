const mongoose = require('mongoose')

const LinkSchema = new mongoose.Schema({
    shortId: String,
    longLink: String,
    shortLink: String,
    date: {
        type: String,
        default: Date.now()
    }
})

module.exports.Link = mongoose.model('Link', LinkSchema) 