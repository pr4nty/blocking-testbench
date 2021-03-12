// Middleware
const mongoose = require('mongoose');
const config = require('config');
require('dotenv').config();

// Connect to DB
module.exports = function(){
    try {
        const databaseURL = config.get('db');
        mongoose.connect(databaseURL, { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
        .then(console.log('Connected to Db: ' + databaseURL))
    }
    catch (err) {
        console.log(err.message);
    }
}