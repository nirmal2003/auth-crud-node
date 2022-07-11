const mongoose = require('mongoose')

const Users = mongoose.Schema({
    name: String,
    userName: String,
    email: String,
    password: String,
    image: {
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/social-db-5a2eb.appspot.com/o/profile%2Fprofile.png?alt=media&token=b9f6ca51-842a-4ede-b254-4dde8008dbc7'
    },
    about: {
        type: String,
        default: 'I am new to this platform'
    },
    likes: [Object]
})

module.exports = mongoose.model('Users', Users)