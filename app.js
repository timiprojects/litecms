const { json, urlencoded, static } = require('express')
const express = require('express')
const http = require('http')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
require('dotenv/config')
const path = require('path')


require('./handlers/passport')

//const expressLayout = require('express-ejs-layouts')
const flash = require('flash')
const createError = require('http-errors')

//CONNECT TO MONGODB
const mongoose = require('mongoose')
const db = process.env.mongoURI
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, () => {
    console.log("Connected to DB successfully!")
})

const { baseURL } = require('./handlers/config')

//IMPORT ROUTES
const authRoutes = require('./routes/auth/auth')
const postsRoutes = require('./routes/posts/posts')
const categoryRoutes = require('./routes/categories/categories')

let app = express()

//MIDDLEWARE
app.use(json())
app.use(urlencoded({extended: false}))
app.use(cors())
//set view engine to ejs
// app.use(expressLayout)
// app.set('view engine', 'ejs')
// app.use(static(path.join(__dirname, '/public')))

//Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//ROUTES
app.use(`${baseURL}/auth`, authRoutes)
app.use(`${baseURL}/posts`, postsRoutes)
app.use(`${baseURL}/category`, categoryRoutes)

//Server static assets
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}
//error 404 handler
app.use((req, res, next) => {
    next(createError(404))
})

//Error handler
app.use(function (err, req, res, next) {
    res.locals.error = err
    res.locals.message = err.message

    //render error page
    res.status(err.status || 500);
    res.render('error')
    next()
})

//ALLOCATE PORT
const PORT = process.env.PORT || 5000

//START SERVER ON 
http.createServer(app).listen(PORT, () => {
    console.log("server connected to port")
})