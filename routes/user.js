const express = require('express')
const verify = require('../controllers/verify')
const { Register, Login, getUser, updateProfile, updateImage } = require('../controllers/user')

const user = express.Router()

user.post('/register', Register)
user.post('/login', Login)
user.put('/about', verify, updateProfile)
user.put('/image', verify, updateImage)
user.get('/', verify, getUser)

module.exports = user