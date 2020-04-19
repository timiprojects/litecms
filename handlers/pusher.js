const Pusher = require('pusher')

let pusher = new Pusher({
    appId: process.env.pusherAppId,
    key: process.env.pusherKey,
    secret: process.env.pusherSecret,
    cluster: process.env.pusherCluster,
    //encrypted: true
});

module.exports = pusher