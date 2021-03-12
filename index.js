const express = require('express');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors')
const apiErrorHandler = require('./middleware/errorHandler');
require('dotenv').config();

// Startup DB
require('./startup/db')();

// EJS
require('./startup/ejs')(app);

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Header for CORS
var corsOptions = {
    allowedHeaders: ['Content-Type', 'authorization']
}

app.use(cors(corsOptions))

// Express Session
app.use(session({
    secret: process.env.SESSON_SECRET,
    resave: true,
    saveUninitialized: true
}));


// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});  

// Routes
require('./startup/routes')(app);

// Error Handler Middlerware
app.use(apiErrorHandler);

// SERVER STARTUP
const port = process.env.PORT;
const host = process.env.HOST;
const server = app.listen(port, host, () => {
    console.log(`Server listening to ${host} : ${port}`)
});
module.exports = server;