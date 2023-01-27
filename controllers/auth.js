const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        error.data = validationErrors.array();
        throw error;
    }
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            books: []
        });
        const createdUser = await newUser.save();
        res
            .status(201)
            .json({
                message: 'User created successfully!',
                user: createdUser.username
            });
    } catch (err) {
        next(err);
    }
    

}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('No user found with this email!');
            error.statusCode = 404;
            throw error;
        }
    
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Password is incorrect!');
            error.statusCode = 404;
            throw error;
        }
        const token = jwt.sign(
            {
                email: email,
                userId: user._id.toString()
            },
            'secretKey',
            {
                'expiresIn': '1000h'
            }

        )
        res
            .status(200)
            .json({
                message: 'login success!',
                token: token,
                userId: user._id.toString()
            });
        
    } catch (err) {
        next(err);
    }
    
}

