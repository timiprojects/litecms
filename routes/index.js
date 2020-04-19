const { Router } = require('express')
const router = Router({caseSensitive: true, strict: true})

//import model

router.get('/', (req, res) => {
    res.render('home', {title: 'home', text: 'welcome!'})
})



module.exports = router
