const mongoose = require('mongoose');

// Create Schema
const testSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    testData: { 
        type : Array ,
        default : []
    }
    },{
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

testSchema.virtual('testId').get(function() {
    return this._id;
});

// Create Model
const Test = mongoose.model('Test', testSchema);

// Export
exports.Test = Test;
exports.testSchema = testSchema;