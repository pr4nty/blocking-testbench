const express = require('express');
require('dotenv').config();

const users = require('../routes/users');
const tests = require('../routes/tests');

// Export
module.exports = function(app) {
    app.use(express.json());
    
    app.use('/users', users);
    app.use('/tests', tests);
}