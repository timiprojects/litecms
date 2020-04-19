const { Router } = require('express')
const router = Router({caseSensitive: true, strict: true})
//import auth checker
const { ensureAuthenticated } = require('../../handlers/check')
const pagination = require('../../handlers/pagination')

//import models
const CATEGORIES = require('../../models/category.model')
const POSTS = require('../../models/posts.model')
const { Users } = require('../../models/user.model')

//@ROUTE GET /category/all
//@DESC display all posts for authenticated users
router.get('/all', ensureAuthenticated, pagination(CATEGORIES), async (req, res) => {
    const { user } = req
    try {
        if(!user) {
            return res.status(400).json({message: "You do not have access to this resource"})
        } else {
            //const category = await CATEGORIES.find({})
            const category = res.paginatedResults
            if(!category) {
                return res.status(400).json({message: "No categories created"})
            }
            //console.log(category)
            return res.status(200).json({data: category})
            
        }
    } catch {
        return res.status(500).json({message: "Something is wrong!"})
    }
})

// //@ROUTE GET /category/new
// //@DESC Get create category page
// router.get('/new', ensureAuthenticated, (req, res) => {
//     const { user } = req
//     if(!user) {
//         return res.status(400).json({message: "Cannot view this resource. Login first!"})
//     }

//     return res.status(200).json({data: new CATEGORIES()})
// })

//@ROUTE POST /category/new
//@DESC create new post based on logged in user
router.post('/new', ensureAuthenticated, async (req, res) => {
    const { user, body } = req
    const { title, slug } = body
    try {
        if(!user) {
            return res.status(400).json({message: "You do not have access to this resource"})
        } else {
            const category = await CATEGORIES.findOne({title})
            if(category) {
                return res.status(400).json({message: "Choose another title"})
            } else if ((title).toString().toLowerCase() !== (slug).toString().toLowerCase()) {
                return res.status(400).json({message: "Slug does not match title! Use a lower case of your title"})
            }   else {
                const newCat = new CATEGORIES({title, slug, authors: user.usr_id})
                const created = await newCat.save()
                if(created) {
                    res.status(200).json({message: "success", redirect: true })
                }
            }
        }
    } catch {
        return res.status(500).json({message: "Something is wrong!"})
    }
})


//@ROUTE GET /category/new
//@DESC Get single category
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    const { user, params } = req
    const { id } = params
    try {
        if(!user) {
            return res.status(400).json({message: "You do not have access to this resource"})
        } else {
            const category = await CATEGORIES.findOne({_id: id})
            if(!category) {
                return res.status(400).json({message: "Can not edit category!"})
            } 

            return res.status(200).json({message: "success", data: category })
        }
    } catch {
        return res.status(500).json({message: "Something is wrong!"})
    }
})

//@ROUTE PUT /category/edit/
//@DESC Edit category
router.put('/edit/:id', ensureAuthenticated, async (req, res) => {
    const { user, params, body } = req
    const { id } = params
    const { title, slug } = body
    try {
        if(!user) {
            return res.status(400).json({message: "You do not have access to this resource"})
        } else {
            const category = await CATEGORIES.findById(id)
            category.title = title
            category.slug = slug
            const author = category.authors.find(x => x == user.usr_id)
            if(!author) {
                category.authors.push(user.usr_id)
            }
            category.updatedAt = Date.now()
            const saving = await category.save()
            if(!saving) {
                return res.status(400).json({message: "Can not update category!"})
            } 

            return res.status(200).json({message: "Category updated successfully!", redirect: true })
        }
    } catch {
        return res.status(500).json({message: "Something is wrong!"})
    }
})

router.delete('/delete/:id', ensureAuthenticated, async (req, res) => {
    const { user, params } = req
    const { id } = params
    try {
        if(!user) {
            return res.status(400).json({message: "You do not have access to this resource"})
        } else {
            const category = await CATEGORIES.findOne({_id: id}).select({_id:1})
            const posts = await POSTS.find({category: category._id}).select({_id:1,category: 1})

            if(posts.length === 0) {
                const deleted = await CATEGORIES.findOneAndDelete({_id: id})
                if(!deleted) {
                    return res.status(400).json({message: "Cannot delete!"})
                }
                
                return res.status(200).json({message: "Deleted!", redirect: true})
            } 

            return res.status(400).json({message: "Cannot delete category as it associated to one or more posts", redirect: false})
        }
    } catch {
        return res.status(500).json({message: "Something is wrong!"})
    }
})

module.exports = router