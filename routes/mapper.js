const express = require('express')
const pusher = require('../handlers/pusher')
const router = express.Router()


//send data to db and 
router.post('/pusher/auth', (req, res) => {
    let { socket_id, channel_name } = req.body
    random_string = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    let presenceData = {
        user_id: random_string,
        user_info: {
            username: '@' + random_string,
        }
    };
    let auth = pusher.authenticate(socket_id, channel_name, presenceData);
    res.send(auth);
})


router.post('/location-update', (req, res) => {
    pusher.trigger('covid-development', 'location-update', {
        'username': req.body.username,
        'location': req.body.location
    })
    req.json({'status': 200})
})

module.exports = router