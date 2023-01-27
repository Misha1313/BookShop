const Book = require('../models/book');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const io = require('../socket');

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

        await newBook.save();


        const user = await User.findById(req.userId);
        user.books.push(newBook);
        await user.save();

        // io.getIo().emit('books', {
        //     action: 'create',
        //     book: { ...newBook._doc, creator: { _id: req.userId, name: user.name}}
        // });
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

exports.updateBook = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        throw error;
    }
    const bookId = req.params.bookId;
    const updatedTitle = req.body.title;
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.Price;
   
    try {
        const book = await Book.findById(bookId);

        if (!book) {
            const error = new Error('Book not found!');
            error.statusCode = 404;
            throw error;
        }

        if(book.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403
            throw error;
        }

        book.title = updatedTitle;
        book.description = updatedDescription;
        book.imageUrl = updatedImageUrl;
        book.Price = updatedPrice;

        const savedBook = await book.save();

        // io.getIo().emit('books', {
        //     action: 'update',
        //     book: book
        // });
        res.status(200)
            .json({
                message: 'Book successfully updated!',
                updatedBook: savedBook
            })
    } catch (err) {
        next(err);
    }

}

exports.deleteBook = async (req, res, next) => {
    const bookId = req.params.bookId;

    try {
        const book = await Book.findById(bookId);
        
        if (!book) {
            const error = new Error('Book not exists!');
            error.statusCode = 404;
            throw error;
        }
        
        if (book.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }

        await Book.findByIdAndRemove(bookId);

        const user = await User.findById(req.userId);
        // user.posts.pull() gasarkvevia rato ar mushaobs
        const updatedBooks = user.books.filter(book => book.toString() !== bookId);
        
        user.books = updatedBooks;

        await user.save();

        // io.getIo().emit('books', {
        //     action: 'delete',
        //     book: bookId
        // });
        res.status(200)
            .json({
                message: 'Deleted book!'
            });

    } catch (err) {
        next(err);
    }
}