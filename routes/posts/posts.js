const { Router } = require('express')
const router = Router({ caseSensitive: true, strict: true })
//import auth checker
const { ensureAuthenticated } = require('../../handlers/check')

const pagination = require('../../handlers/pagination')

//import models
const CATEGORIES = require('../../models/category.model')
const POSTS = require('../../models/posts.model')

const allowedImageTypes = ['image/jpeg', 'image/png', 'images/gif'];

//@ROUTE /posts/all
//@DESC display all posts for authenticated users
router.get('/all', ensureAuthenticated, pagination(POSTS), async (req, res) => {
    const { user } = req
    try {
        if (!user) {
            return res.status(400).json({ message: "You do not have access to this resource" })
        } else {
            const getPosts = res.paginatedResults
            if (!getPosts) {
                return res.status(400).json({ message: "No posts created!" })
            }

            return res.status(200).json({ data: getPosts })
        }
    } catch {
        return res.status(500).json({ message: "Something went wrong! Try again." })
    }
})

//@ROUTE GET /posts/getcat
//@DESC get all categories for post
router.get('/getcat', ensureAuthenticated, async (req, res) => {
    const { user } = req
    try {
        if (!user) {
            return res.status(400).json({ message: "You do not have access to this resource" })
        } else {
            const getCat = await CATEGORIES.find({}).select({ _id: 1, title: 1 })
            return res.status(200).json({ data: getCat })
        }
    } catch {
        return res.status(500).json({ message: "Something went wrong! Try again." })
    }
})

// router.post('/images', ensureAuthenticated, async (req, res) => {
//     console.log("BODY: ", req.body)
//     res.status(200).json(req.body)
// })

//@ROUTE POST /posts/new
//@DESC create new post based on logged in user
router.post('/new', ensureAuthenticated, async (req, res) => {
    const { user, body } = req
    const { title, content, category, files } = body
    try {
        if (!user) {
            return res.status(400).json({ message: "You do not have access to this resource" })
        } else {
            const getPost = await POSTS.findOne({ title })
            if (getPost) {
                return res.status(400).json({ message: "Post already exists!" })
            } else {

                if (category === null) {
                    return res.status(400).json({ message: "Category cannot be empty! Select at least one." })
                } else {
                    const newPost = new POSTS({
                        title, content, category, authors: user.usr_id
                    })
                    saveImage(newPost, files)
                    const postCreated = await newPost.save()
                    if (postCreated) {
                        return res.status(200).json({ message: "Post Created Successfully!", redirect: true })
                    }
                }
            }
        }
    } catch {
        res.status(500).json({ message: "Something is wrong! Try again." })
    }
})

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    const { user, params } = req
    const { id } = params
    try {
        if (!user) {
            return res.status(400).json({ message: "You do not have access to this resource" })
        } else {
            const post = await POSTS.findOne({ _id: id })
            if (!post) {
                return res.status(400).json({ message: "Can not edit post!" })
            }
            return res.status(200).json({ message: "success", data: post })
        }
    } catch {
        return res.status(500).json({ message: "Something is wrong!" })
    }
})

//Edit post
router.put('/edit/:id', ensureAuthenticated, async (req, res) => {
    const { user, params, body } = req
    const { id } = params
    const { title, content, category, files } = body
    try {
        if (!user) {
            return res.status(400).json({ message: "You do not have access to this resource" })
        } else {
            if (category === null || category.length === 0) {
                return res.status(400).json({ message: "Category cannot be empty! Select at least one." })
            } else {
                const post = await POSTS.findById(id)
                post.title = title
                post.content = content
                post.category = category
                if(files !== null) {
                    saveImage(post, files)
                }
                const author = post.authors.find(x => x == user.usr_id)

                if (!author) {
                    post.authors.push(user.usr_id)
                }

                post.updatedAt = Date.now()

                const savePost = await post.save()

                if (!savePost) {
                    return res.status(400).json({ message: "Can not update category!" })
                }

                return res.status(200).json({ message: "Post updated successfully!", redirect: true })
            }
        }
    } catch {
        return res.status(500).json({ message: "Something is wrong!" })
    }
})


router.delete('/delete/:id', ensureAuthenticated, async (req, res) => {
    const { user, params } = req
    const { id } = params
    try {
        if (!user) {
            return res.status(400).json({ message: "You do not have access to this resource" })
        } else {
            const post = await POSTS.findOneAndDelete({ _id: id })
            if (!post) {
                return res.status(400).json({ message: "Cannot delete post!" })
            }

            return res.status(200).json({ message: "Deleted!", redirect: true })
        }
    } catch {
        return res.status(500).json({ message: "Something is wrong!" })
    }
})


function saveImage(item, encodedImage) {
    if (encodedImage === null) return;
    const img = encodedImage
    if (img !== null && allowedImageTypes.includes(img.type)) {
        item.coverImage = new Buffer.from(img.data, 'base64')
        item.coverImageType = img.type
    }
}

module.exports = router