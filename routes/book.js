const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const bookController = require('../controllers/book');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, bookController.getBooks);

router.post(
        '/book',
        isAuth,
        [
            body('title')
                .trim()
                .not()
                .isEmpty()
                .withMessage('Title can not be empty'),
            body('imageUrl')
                .trim()
                .not()
                .isEmpty()
                .withMessage('imageUrl can not be empty'),
            body('description')
                .trim()
                .not()
                .isEmpty()
                .withMessage('description can not be empty'),
            body('price')
                .trim()
                .not()
                .isEmpty()
                .withMessage('description can not be empty')
                .isNumeric()
                .withMessage('price should be numeric type')
        ],
        bookController.createBook
    );
router.put(
    '/book/:bookId',
    isAuth,
    [
        body('title')
                .trim()
                .not()
                .isEmpty()
                .withMessage('Title can not be empty'),
        body('imageUrl')
            .trim()
            .not()
            .isEmpty()
            .withMessage('imageUrl can not be empty'),
        body('description')
            .trim()
            .not()
            .isEmpty()
            .withMessage('description can not be empty'),
        body('price')
            .trim()
            .not()
            .isEmpty()
            .withMessage('description can not be empty')
            .isNumeric()
            .withMessage('price should be numeric type')
    ],
    bookController.updateBook
)

router.delete('/book/:bookId', isAuth, bookController.deleteBook);

module.exports = router;