// Middleware
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { User } = require('../models/user');
const { Test } = require('../models/test');

const authenticateToken = require('../middleware/authToken');
const ApiError = require('../middleware/ApiError');

// Get Player List
router.get("/", authenticateToken, async (req, res, next) => {
    const userCount = await User.countDocuments();
    if (!userCount) {
        next(ApiError.internal('DB Error'));
        return;
    }
    const playerList = await User
        .find({ role: "player" })
        .select('firstName lastName position numberOfTests testId username');
    res.set('Access-Control-Expose-Headers', 'Content-Range')
    res.set('Content-Range', `users : 0-10/${userCount}`);
    res.send(playerList);
    if (!playerList) {
        next(ApiError.internal('DB Error. Player list could no be provided'));
        return;
    }
});

// Player List for Raspberry
router.get("/playerList", async (req, res, next) => {
    const playerList = await User
        .find({ role: "player" })
        .select('firstName lastName');
    res.send(playerList);
    if (!playerList) {
        next(ApiError.internal('DB Error. Player list could no be provided'));
        return;
    }
});

// Get Player Profile
router.get("/:id", authenticateToken, async (req, res, next) => {
    try {
        const playerProfile = await User
            .findById(req.params.id)
            .select('firstName lastName position numberOfTests testId username');
        if (!playerProfile) {
            next(ApiError.notFound('User not found'));
        }

        res.send(playerProfile);
    }
    catch (err) {
        next(ApiError.badRequest('Cast to ObjectId failed. ObjectId invalid format'));
        return;
    }
});

// Register Handle
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        let user = await User.findOne({username : req.body.username});

        if (user) {
            next(ApiError.badRequest('User already registerd'));
            return;
        }

        const newUser =  new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            position: req.body.position,
            role: req.body.role
        });
        if (!newUser) {
            next(ApiError.badRequest('User could not be created. Request is missing a required property or a required property value does not meet the requirements'));
            return;
        }

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        try {
            await newUser
            .save()
            .then( () => {
                res.status(200).send(newUser)
            })
        }
        catch (err) {
            next(ApiError.internal('User could not be saved to DB. DB Error'));
            return;
        }
    }
    catch (err) {
        console.log(err);
        next(ApiError.internal('Something went wrong'));
        return;
    }
});

// Delete User and Tests
router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id)
        if (!user) {
            next(ApiError.notFound('User not found'));
            return;
        }
        tests = user.testId
        for (let id of tests) {
            let testToDelete = await Test.findOneAndRemove({ _id:id })
            if (!testToDelete) {
                next(ApiError.internal('The users test could not be removed. DB Error'));
                return;
            }
        }
        try {
            await User
            .findByIdAndRemove(req.params.id)
            .then( () => {
                res.send(user);
            })
        }
        catch (err) {
            next(ApiError.internal('User could not be deleted. DB Error'));
            return;
        }
    }
    catch (err) {
        next(ApiError.badRequest('Cast to ObjectId failed. ObjectId invalid format'));
        return;
    }
});

// Update User
router.put('/:id', authenticateToken, async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            {_id: req.params.id},
            {
                $set: { 
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    position: req.body.position 
                }
            });
        if (!user) {
            next(ApiError.notFound('User not found'));
            return;
        };
        res.send({ data: user });
    }
    catch (err) {
        next(ApiError.internal('Something went wrong'));
        return;
    }
});

// Creating Test and update User
router.put('/sendData/:id', async (req, res, next) => {
    try {
        const checkuser = await User.findById(req.params.id)
        if (!checkuser) {
            next(ApiError.notFound('User not found'));
            return;
        };
        
        const test =  new Test({
            date: req.body.date,
            testData: req.body.testData,
        });
        await test.save();
        next(ApiError.internal('Test could not be saved. DB Error'));
    
        const user = await User.findByIdAndUpdate(
                {_id: req.params.id},
                {
                    $addToSet: { testId: test._id },
                    $inc: { numberOfTests: 1}
                }, { new: true })
            
        res.send({ data: user })
        next(ApiError.internal('Test could not be added to users testlist. DB Error'));
    }
    catch (err) {
        next(ApiError.internal('Something went wrong'));
        return;
    }
});

// Authentication LOG IN 
router.post('/authenticate', async (req, res, next) => {

    // Match User
    User.findOne({  username : req.body.username })
    .then(user => {
        try {
            if(!user) {
                next(ApiError.notFound('User not found'));
                return;
            }
    
            // Match password
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if(err) {
                    next(ApiError.internal('Password verification failed'));
                    return;
                }
    
                if(isMatch) {
                    // Create JWT with user data for authProvider
                    const token = jwt.sign({ id: user._id, firstName: user.firstName, lastName: user.lastName, position: user.position, role: user.role }, process.env.JWTPrivateKey, {
                        expiresIn: 1080 // expires in 30 min
                    });
                    return res.status(200).json({token});
    
                } else {
                    next(ApiError.unauthorized('Wrong password'));
                    return;
                }
            });
        }
        catch (err) {
            next(ApiError.internal('Something went wrong'));
            return;
        }
    })
});


// Export Module
module.exports = router;
