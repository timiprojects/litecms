const passport = require('passport')

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err || !user) {
                res.status(403).send({
                    message: 'You dont have an access'
                })
            } else {
                req.user = user
                next();
            }
        })(req, res, next)
    }
}
