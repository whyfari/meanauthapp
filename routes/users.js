const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config/database');
const User = require('../models/user');

// localhost:3000/users/*
// localhost:3000/users/register
// Register
router.post('/register',(req,res,next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser,(err) => {
        if (err) {
            res.json({success: false, msg: 'FA Failed to register user', message : err})
        } else {
            res.json({success: true, msg: 'FA User registed'})
        }
    });
})

// Authenticate 
router.post('/authenticate',(req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err,user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: 'FA User not found'})
        }

        User.comparePassword(password, user.password, (err,isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({data:user}, config.secret, {
                    expiresIn: 604800 // 1 week worth of seconds
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                       id: user._id,
                       name: user.name,
                       username: user.username,
                       email: user.email
                    }
                })
            } else {
                return res.json({success: false, msg: 'FA Wrong password'});
            }
        })
    });
});

// Profile 
router.get('/profile',passport.authenticate('jwt', {session: false}), (req,res,next) => {
    res.json({user: req.user});
});

module.exports = router;