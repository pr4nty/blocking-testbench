// Middleware
const express = require('express');
const router = express.Router();

const { Test } = require('../models/test');
const { User } = require('../models/user');

const authenticateToken = require('../middleware/authToken');
const ApiError = require('../middleware/ApiError');


// Methods
router.get('/', authenticateToken , async (req, res, next) => {
    try {
        let testCount = 0
        testCount = await Test.countDocuments();
        if (isNaN(testCount)) {
            next(ApiError.internal('DB Error'));
            return;
        }
        const tests = await Test.find()
        res.set('Access-Control-Expose-Headers', 'Content-Range')
        res.set('Content-Range', `tests : 0-10/${testCount}`);
        res.send(tests);
        if (!tests) {
            next(ApiError.internal('DB Error. Test list could no be provided or list is empty'));
            return;
        }
    }
    catch (err) {
        next(ApiError.internal('Something went wrong'));
        return;
    }

});

router.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const test = await Test.findById(req.params.id)
        if (!test) {
            next(ApiError.notFound('Test not found'));
        }
        res.send(test);
    }
    catch (err) {
        next(ApiError.badRequest('Cast to ObjectId failed. ObjectId invalid format'));
        return;
    }
    
});


router.delete('/:id', authenticateToken,  async (req, res, next) => {
    try {
        const testToDelete = await Test.findById(req.params.id);
        const test = await Test.findByIdAndRemove(req.params.id);
        if (!test) {
            next(ApiError.notFound('Test not found'));
            return;
        }
        if (!testToDelete) {
            next(ApiError.notFound('Test not found'));
            return;
        }
        else if (test ) {
            const user = await User.findOneAndUpdate(
                { testId: test._id },
                { $inc: { numberOfTests: -1}, $pull: { testId: test._id }}
            );
        
            if (!user) {
                next(ApiError.badRequest('Test could no be deleted from user testlist because user not found'));
                return;
            };
            res.status(200).send({ data : testToDelete });
        }
        else {
            next(ApiError.internal('Something went wrong'));
            return;
        }
    }
    catch (err) {
        next(ApiError.internal('Something went wrong'));
        return;
    }
    

});

// Export Module
module.exports = router;
