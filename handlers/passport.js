const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const bcrypt = require('bcrypt')

const { Users } = require('../models/user.model')

//use normal form data to login
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (username, password, callback) => {
    try {
        const userInfo = await Users.findOne({username})
        const passMatch = await bcrypt.compare(password, userInfo.password)

        if(passMatch) {
            return callback(null, userInfo)
        } else {
            return callback("Incorrect username or password", null)
        }
    } catch (error) {
        return callback(error.message, null)
    }
}));


//jwt token verify
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: process.env.secretKey
},(payload, callback) => {
    //const now = Math.floor((new Date().getTime() + 1) / 1000)
    if(Date.now() >= payload.exp * 1000) {
        callback('no access to resource at this time', null)
    }

    callback(null, payload)
}))

passport.serializeUser(function (data, callback) {
    callback(null, data.id);
});

passport.deserializeUser(function (id, callback) {
    Users.findById(id, function (err, data) {
        callback(err, data);
    });
});