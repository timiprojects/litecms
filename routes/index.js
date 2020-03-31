const express = require('express')
const router = express.Router({caseSensitive: true, strict: true})

//import model
const { Link } = require('../models/Link.model')

router.get('/', (req, res) => {
    res.render('home', {title: 'home', text: 'welcome!'})
})

//GET DATA FROM STORAGE
router.get('/:code', async (req, res) => {
    const shortId = req.params.code
    try {
        const link = await Link.findOne({shortId})
        if(link){
            res.status(200).redirect(link.longLink)
        }else {
            res.status(404).render('error', {error: {status: 404}, message: "NOT FOUND"})
        }
        
    } catch (error) {
        res.status(404).render('error', {error, message: ""})
    }
})

module.exports = router
