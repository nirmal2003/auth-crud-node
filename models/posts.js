const mongoose = require('mongoose')

const Posts = mongoose.Schema({
    content: String,
    image: String,
    imageName: String,
    userId: String,
    likes: [],
}, { timestamps: true})

module.exports = mongoose.model('Posts', Posts)