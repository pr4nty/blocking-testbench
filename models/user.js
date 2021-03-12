// Get middleware
const mongoose = require('mongoose');

// Create schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: { unique: true },
        minlength: 2,
        maxlength: 50
    },
    id: {
        type: mongoose.Types.ObjectId,
        default: new mongoose.Types.ObjectId 

    },
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    position: {
        type: String,
        required: true
    },
    numberOfTests: {
        type: Number,
        default: 0,
        min: 0
    },
    role: {
        type: String,
        default: "player",
        minlength: 5,
        maxlength: 50
    },
    date: {
        type: Date,
        default: Date.now
    },
    testId: {
        type: Array,
        default: []
    }
});


// Create model
const User = mongoose.model('User', UserSchema);

// Export
exports.User = User;
