const Posts = require('../models/posts')
const Comments = require('../models/comments')
const Users = require('../models/users')


const posts = async (req, res) => {
    const allposts = await Posts.find().sort( { createdAt: -1 } )
    const postarr = []
    for(let i = 0; i <= (allposts.length - 1); i++) {
        const post = allposts[i]
        const user = await Users.findById(post.userId)
        const comments = await Comments.find({ postId: post._id }).sort({ createdAt: -1 })
        postarr.push({ id: post._id, content: post.content, image: post.image, userId: post.userId, userName: user.userName, userRealName: user.name, userImage: user.image, comments: comments, likes: post.likes, createdAt: post.createdAt, updatedAt: post.updatedAt })
    }
    return res.send({ success: true, posts: postarr })
}

const create = async (req, res) => {
    const { content, image, imageName } = req.body
    if(!(content && image)) return res.send({ success: false, message: 'Image and content is required!' })
    else {
        const save = await new Posts({
            content: content,
            image: image,
            imageName: imageName,
            userId: req.user.id
        }).save()
        if(save) return res.send({ success: true, message: "Post is created!" })
        else return res.send({ success: false, message: 'something went wrong!' })
    }
}

const deletePost = async (req, res) => {
    const checkPost = await Posts.findById(req.params.id)
    if(!checkPost) return res.status(404).send({ success: false, message: 'Post not found' })
    else {
        if(checkPost.userId !== req.user.id) return res.send({ success: false, message: 'You are not this post author' })
        else {
            const postdelete = await Posts.findByIdAndDelete(req.params.id)
            if(postdelete) return res.send({ success: false, message: 'Post is deleted!' })
            else return res.send({ success: false, message: 'something went wrong!' })
        }
    }
}

const Comment = async (req, res) => {
    const { comment } = req.body
    if(!comment) return res.send({ success: false, message: 'Please provide comment' })
    else {
        const checkPost = await Posts.findById(req.params.id)
        if(!checkPost) return res.send({ success: false, message: 'post not found!' })
        else {
            const user = await Users.findById(req.user.id)
            const save = await new Comments({
                comment: comment,
                userName: user.name,
                userImage: user.image,
                postId: req.params.id
            }).save()
            if(!save) return res.send({ success: false, message: 'something went wrong!' })
            else return res.send({ success: true, message: 'comment is added' })
        }
    }
}

const like = async (req, res) => {
    const post = await Posts.findById(req.params.id)
    if(!post) return res.send({ success: false, message: 'Post not found' })
    else {
        let liked = false
        await post.likes.map(li => {
            if(li == req.user.id) liked = true
        })
        // res.send(liked)
        if(!liked) {
            const add = await Posts.findByIdAndUpdate(req.params.id, {
                $addToSet: {
                    likes: [req.user.id]
                }
            })
            if(add) {
                const userlike = await Users.findByIdAndUpdate(req.user.id, {
                    $addToSet: {
                        likes: [req.user.id]
                    }
                })
                if(userlike) {
                    return res.send({ success: true, message: 'like is added!' })
                }
                else return res.send({ success: false, message: 'something went wrong!' })
            }
        } else {
            const remove = await Posts.findByIdAndUpdate(req.params.id, {
                $pull: {
                    likes: [req.user.id]
                }
            })
            if(remove) {
                const userremove = await Users.findByIdAndUpdate(req.user.id, {
                    $pull: {
                        likes: [req.user.id]
                    }
                })
                if(userremove) {
                    if(remove) return res.send({ success: true, message: 'like is removed!' })
                }
                else return res.send({ success: false, message: 'something went wrong!' })
            }
        }
    }
}

const singalPost = async (req, res) => {
    const post = await Posts.findById(req.params.id)
    if(!post) return res.send({ success: false, message: 'post not found' })
    else {
        const comments = await Comments.find({ postId: req.params.id }).sort({ createdAt: -1 })
        const user = await Users.findById(post.userId)
        return res.send({ success: true, post: { id: post._id, content: post.content, image: post.image, comments: comments, createdAt: post.createdAt, updatedAt: post.updatedAt } })
    }
}

module.exports = { create, deletePost, like, Comment, singalPost, posts }