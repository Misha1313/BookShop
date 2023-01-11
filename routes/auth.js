const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');

const router = express.Router();
const authController = require('../controllers/auth');

router.put(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email format is incorrect')
            .custom(async (value, { req }) => {
                const user = await User.findOne( { email: value });
                
                if (user) {
                    return Promise.reject('User with this email already exists!');
                    
                }
                return user;
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 2 }),
        body('username')
            .trim()
            .not()
            .isEmpty()
            .withMessage('username can not be empty')



    ],
    authController.signUp);

router.post('/login', authController.login);

module.exports = router;

