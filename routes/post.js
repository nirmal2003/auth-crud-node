const express = require('express')
const { create, deletePost, posts, Comment, singalPost, like } = require('../controllers/post')
const verify = require('../controllers/verify')

const route = express.Router()

route.get('/', verify, posts)
route.post('/', verify, create)
route.delete('/:id', verify, deletePost)
route.post('/comment/:id', verify, Comment)
route.get('/:id', verify, singalPost)
route.put('/like/:id', verify, like)

module.exports = route