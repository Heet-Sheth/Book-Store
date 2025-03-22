const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../jwt');
const Books = require('../model/book');
const User = require('../model/user');

router.use(jwtMiddleware);

router.get('/', async (req, res) => {
    try {
        const books = await Books.find();
        res.status(200).send(books);
    }
    catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

router.get('/search/:searchString', async (req, res) => {
    try {
        const searchString = req.params.searchString;
        const query = {
            $or: [
                { title: { $regex: searchString, $options: 'i' } }, // Case-insensitive partial match
                { description: { $regex: searchString, $options: 'i' } } // Case-insensitive partial match
            ]
        };

        const books = await Books.find(query);

        if (!books) {
            res.status(201).send("No books found");
        }

        res.status(200).send(books);
    } catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const book = await Books.findById(req.params.id);

        if (!book) {
            return res.status(404).send("Book not found");
        }

        res.status(200).send(book);
    } catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

router.post('/add/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const bookId = req.params.id;

        const book = await Books.findById(bookId);
        if (!book) {
            return res.status(404).send("Book not found");
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Add the book to the user's cart
        user.cart = user.cart || [];
        user.cart.push({ bookId: bookId });

        await user.save();

        res.status(200).send("Book added to cart");
    } catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

module.exports = router;