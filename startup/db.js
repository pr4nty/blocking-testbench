// Middleware
const mongoose = require('mongoose');
const config = require('config');
require('dotenv').config();

// Connect to DB
module.exports = function(){
    try {
        mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
        .then(console.log('Connected to Db: ' + process.env.DATABASE_URL))
    }
    catch (err) {
        console.log(err.message);
    }
}