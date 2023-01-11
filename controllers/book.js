const Book = require('../models/book');

exports.getBooks = async (req, res, next) => {
    try {
        const itemsCount = await Book.find().countDocuments();
        const books = await Book.find();
        res
            .status(200)
            .json({
                message: 'Posts fetched successfully!',
                books: books,
                itemsCount: itemsCount
            })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


// exports.createBook = async (req, res, next) => {
//     try {
//         const title = req.body.title;
//         const imageUrl = req.body.imageUrl;
//         const description = req.body.description;
//         const price =  req.body.price;

//         const newBook = new Book({
//             title: title,
//             imageUrl: imageUrl,
//             description: description,
//             price: price,
//             creator: 'creator'
//         });

//         const createdBook = await Book.save();

//         res
//             .status(201)
//             .json({
//                 message: 'Book created!',
//                 book: createdBook
//             })

//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }