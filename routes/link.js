const express = require('express')
const validUri = require('valid-url')
const shortid = require('shortid')

const router = express.Router({caseSensitive: true, strict: true})
const { handleResponse } = require('../handlers/handler')

//import model
const { Link } = require('../models/Link.model')

//get baseUrl
const baseUrl = process.env.PUBLIC_URL || process.env.baseURL

//POST URL TO STORAGE
router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body

    if(!validUri.isUri(baseUrl))
        return res.status(500).json(handleResponse("error", "The Link provided is invalid"))
    
    const shortId = shortid.generate()
    
    if(validUri.isUri(longUrl)) {
        try {
            const link = await Link.findOne({longLink: longUrl})
            if(link) {
                const { longLink, shortLink } = link
                return res.json(handleResponse("success", "The Link has been shortened already!", { longLink, shortLink }))
            } else {
                const _shortLink = `${baseUrl}${shortId}`

                const _link = new Link({
                    shortId,
                    longLink: longUrl,
                    shortLink: _shortLink,
                })

                const _res = await _link.save()
                const { longLink, shortLink } = _res
                return res.json(handleResponse("success", "Successfully compressed link!", { longLink, shortLink }))
                //return res.redirect('/')
            }
        } catch (error) {
            return res.status(401).json(handleResponse("error", error))
        }
    } else {
        return res.status(500).json(handleResponse("error", "The Link is invalid"))
    }
})

module.exports = router
