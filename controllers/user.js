const Users = require('../models/users')
const bcrypt = require('bcryptjs')
const CreateToken = require('./token')
const Posts = require('../models/posts')

const userPosts = async (userId) => {
    const posts = await Posts.find({ userId })
    return posts
}

const Register = async (req, res) => {
    const { name, email, password } = req.body
    if(!(name && email && password)) return res.send({ success: false, message: 'All fields are required!' })
    else {
        const checkEmail = await Users.findOne({ email: email })
        if(checkEmail) return res.send({ success: false, message: 'Email is already used' })
        else {
            const hashPass = await bcrypt.hash(password, 8)
            if(hashPass) {
                const user = await new Users({
                    name: name,
                    userName: `user${name.length <= 10 ? name.split(' ').join('').toLowerCase().substr(0, 3) : name.split(' ').join('').toLowerCase().substr(0, name.length / 2)}`,
                    email: email,
                    password: hashPass
                }).save()
                if(user) {
                    const token = await CreateToken(user._id)
                    const posts = await userPosts(user._id)
                    if(token) return res.cookie('token', token).send({ success: true, message: 'Account is created', token: token, user: { id: user._id, name: user.name, userName: user.userName, email: user.email, about: user.about, image: user.image, likes: user.likes, posts: posts } })
                    else return res.send({ success: false, message: 'something went wrong' })
                }
                else return res.send({ success: false, message: 'something went wrong' })
            } else return res.send({ success: false, message: 'something went wrong' })
        }
    }
}

const Login = async (req, res) => {
    const { email, password } = req.body
    if(!(email, password)) return res.send({ success: false, message: 'All fields are required!' })
    else {
        const user = await Users.findOne({ email })
        if(!user) return res.send({ success: false, message: 'Email not found!'})
        else {
            const comPass = await bcrypt.compare(password, user.password)
            if(!comPass) return res.send({ success: false, message: 'Invalid password' })
            else {
                const token = await CreateToken(user._id)
                const posts = await userPosts(user._id)
                if(token) return res.cookie('token', token).send({ success: true, message: 'Sign up success!', token: token, user: { id: user._id, name: user.name, userName: user.userName, email: user.email, about: user.about, image: user.image, likes: user.likes, posts: posts } })
                else return res.send({ success: false, message: 'something went wrong' })
            }
        }
    }
}

const getUser = async (req, res) => {
    const user = await Users.findById(req.user.id)
    const posts = await userPosts(req.user.id)
    if(!user) return res.send({ success: false, message: 'user not found!' })
    else return  res.send({ success: true, user: { id: user._id, name: user.name, userName: user.userName, email: user.email, about: user.about, image: user.image, likes: user.likes, posts: posts } })
}

const updateProfile = async (req, res) => {
    const { about } = req.body
    if(!about) return res.send({ success: false, message: 'Describe about youself' })
    else {
        const update = await Users.findByIdAndUpdate(req.user.id, {
            $set: {
                about: about
            }
        })
        if(update) return res.send({ success: true, message: 'Profile is updated!' })
        else return res.send({ success: false, message: 'something went wrong!' })
    }
}

const updateImage = async (req, res) => {
    const { image } = req.body
    if(!image) return res.send({ success: false, message: 'Please provide image' })
    else {
        const update = await Users.findByIdAndUpdate(req.user.id, {
            $set: {
                image: image
            }
        })
        if(update) return res.send({ success: true, message: 'Profile updated!' })
        else return res.send({ success: false, message: 'something went wrong!' })
    }
}

module.exports = { Register, Login, getUser, updateProfile, updateImage }