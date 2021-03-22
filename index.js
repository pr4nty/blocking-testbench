const express = require('express');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors')
const apiErrorHandler = require('./middleware/errorHandler');
const path = require("path");
require('dotenv').config();

// Startup DB
require('./startup/db')();

// EJS
require('./startup/ejs')(app);

// Bodyparser
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));

//
app.use(express.static(path.join(__dirname, "client", "build")))

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

// 
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// SERVER STARTUP
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server listening to Port : ${port}`)
});
module.exports = server;