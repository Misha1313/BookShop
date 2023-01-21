const Book = require('../models/book');
const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.getBooks = async (req, res, next) => {
    try {
        const currentPage = 1;
        const perPage = 5;
        const itemsCount = await Book.find().countDocuments();
        const books = await Book.find()
            .populate('creator')
            .sort( {createdAt: -1} )
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res
            .status(200)
            .json({
                message: 'Posts fetched successfully!',
                books: books,
                itemsCount: itemsCount
            })
    } catch (err) {
        next(err);
    }
}


exports.createBook = async (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price =  req.body.price;

    const errors = validationResult(req);

    console.log('gela');
    console.log(req.userId);

    if(!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        throw error;
    }
    

    const newBook = new Book({
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        creator: req.userId
    });

    

    try {

        console.log(newBook);
        await newBook.save();

        console.log('misha');

        const user = await User.findById(req.userId);
        // user.books.push(newBook);
        await user.save();

        res
            .status(201)
            .json({
                message: 'Book created!',
                book: newBook,
                creator: { _id: req.userId , name:  user.name}
            })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}