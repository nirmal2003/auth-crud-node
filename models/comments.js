const mongoose = require('mongoose')

const Comments = mongoose.Schema({
    comment: String,
    userName: String,
    userImage: String,
    postId: String
}, { timestamp: true })

module.exports = mongoose.model('Comments', Comments)