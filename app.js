const express = require('express')
const http = require('http')
const cors = require('cors')
require('dotenv/config')
const path = require('path')
const session = require('express-session')

const expressLayout = require('express-ejs-layouts')
const flash = require('flash')
const createError = require('http-errors')

//CONNECT TO MONGODB
const mongoose = require('mongoose')
const db = process.env.mongoURI
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Connected to DB successfully!")
})

//IMPORT ROUTES
const indexRoutes = require('./routes/index')
const linkRoutes = require('./routes/link')

const app = express()

//ALLOCATE PORT
const PORT = process.env.PORT || 80

//MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
//set view engine to ejs
app.use(expressLayout)
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')))

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);

app.use(flash())

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//ROUTES
app.use('/', indexRoutes)
app.use('/link', linkRoutes)

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
    //next()
})

//START SERVER ON 
http.createServer(app).listen(PORT, () => {
    console.log("server connected to port")
})