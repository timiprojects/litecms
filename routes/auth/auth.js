const { Router } = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { Users } = require('../../models/user.model')
const CATEGORIES = require('../../models/category.model')
const POSTS = require('../../models/posts.model')

const { ensureAuthenticated } = require('../../handlers/check')

const router = Router({ caseSensitive: true, strict: true })

const pagination = require('../../handlers/pagination')

//@ROUTE: /auth/register
//register new user
router.post('/register', async (req, res) => {
    const { username, password, user_role, fullname, email } = req.body
    try {
        const userInfo = await Users.findOne({ username })
        if (userInfo) {
            return res.status(400).json({ message: 'Check again!', data: null })
        } else {
            //hash password
            const passwordsalt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, passwordsalt)
            const newUser = new Users({ username, password: passwordHash, user_role, fullname, email })

            const user = await newUser.save()

            if(user)
                return res.status(200).json({ message: 'success', redirect: true })
        }
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

//@ROUTE /auth/login
//login user
router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user) => {
        if (error || !user) {
            return res.status(400).json({ message: "Try again!" })
        }
        
        const payload = {
            usr_id: user._id,
            username: user.username,
            role: user.user_role
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.status(400).json({ message: "Cannot Log user in!" })
            }
            const token = jwt.sign(payload, process.env.secretKey, {expiresIn: '1h'})

            return res.status(200).json({ message: 'success', data: token })
        })
    })(req, res)
})

router.get('/protected', ensureAuthenticated, pagination(Users, true), (req, res) => {
    const { user } = req
    try {
        if (!user) {
            return res.status(400).json({ message: "You do not have access to this resource" })
        } else {
            const getUsers = res.paginatedResults
            if (!getUsers) {
                return res.status(400).json({ message: "No Users!" })
            }

            return res.status(200).json({ data: getUsers })
        }
    } catch {
        return res.status(500).json({ message: "Something went wrong! Try again." })
    }
})

router.get('/all', ensureAuthenticated, async (req, res) => {
    const { user } = req
    try {
        if (!user) {
            return res.status(400).json({ message: "You do not have access to this resource" })
        } else {
            const getUsers = await Users.find({}).select({_id:1, username:1})
            if (!getUsers) {
                return res.status(400).json({ message: "No Users!" })
            }

            return res.status(200).json({ data: getUsers })
        }
    } catch {
        return res.status(500).json({ message: "Something went wrong! Try again." })
    }
})

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    const { user, params } = req
    const { id } = params
    try {
        if(!user) {
            return res.status(400).json({message: "You do not have access to this resource"})
        } else {
            const user = await Users.findOne({_id: id})
            if(!user) {
                return res.status(400).json({message: "Can not edit user!"})
            } 

            return res.status(200).json({message: "success", data: user })
        }
    } catch {
        return res.status(500).json({message: "Something is wrong!"})
    }
})


router.put('/edit/:id', ensureAuthenticated, async (req, res) => {
    const { user, params, body } = req
    const { id } = params
    const { username, fullname, email, user_role } = body
    try {
        if(!user) {
            return res.status(400).json({message: "You do not have access to this resource"})
        } else {
            const user = await Users.findById(id)
            user.username = username
            user.fullname = fullname
            user.email = email
            user.user_role = user_role
            user.updatedAt = Date.now()
            const saving = await user.save()
            if(!saving) {
                return res.status(400).json({message: "Can not update user!"})
            } 

            return res.status(200).json({message: "User updated successfully!", redirect: true })
        }
    } catch {
        return res.status(500).json({message: "Something is wrong!"})
    }
})


router.get('/counts', ensureAuthenticated, async (req, res) => {
    const { user } = req
    try {
        if(!user) {
            return res.status(400).json({message: "You do not have access to this resource"})
        } else {
            const categories = await CATEGORIES.countDocuments()
            const posts = await POSTS.countDocuments()
            if(!posts && !categories) {
                return res.status(400).json({message: "Can not get data!"})
            } 

            return res.status(200).json({message: "success", data: {posts, categories} })
        }
    } catch {
        return res.status(500).json({message: "Something is wrong!"})
    }
})

router.delete('/delete/:id', ensureAuthenticated, async (req, res) => {
    const { user, params } = req
    const { id } = params
    try {
        if (!user) {
            return res.status(400).json({ message: "You do not have access to this resource" })
        } else {
            const users = await Users.findOneAndDelete({ _id: id })
            if (!users) {
                return res.status(400).json({ message: "Cannot delete user!" })
            }

            return res.status(200).json({ message: "Deleted!", redirect: true })
        }
    } catch {
        return res.status(500).json({ message: "Something is wrong!" })
    }
})

module.exports = router