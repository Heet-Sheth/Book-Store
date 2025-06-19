const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../jwt');
const Books = require('../model/book');
const User = require('../model/user');

router.use(jwtMiddleware);

router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const books = await Books.find({ _id: { $in: user.cart.map(item => item.bookId) } });
        if (!books) {
            res.status(201).send("No books found");
        }
        // Format coverImage URLs
        const formattedBooks = books.map(book => {
            return {
                ...book.toObject(),
                coverImage: book.coverImage ? `${req.protocol}://${req.get('host')}/${book.coverImage}` : null
            };
        });
        res.status(200).send(formattedBooks);
    }
    catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

router.get('/history', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const books = await Books.find({ _id: { $in: user.history.map(item => item.bookId) } });
        if (books.length === 0) {
            return res.status(404).send("No books in history");
        }
        // Format coverImage URLs
        const formattedBooks = books.map(book => {
            return {
                ...book.toObject(),
                coverImage: book.coverImage ? `${req.protocol}://${req.get('host')}/${book.coverImage}` : null
            };
        });
        res.status(200).send(formattedBooks);
    }
    catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

router.post('/checkout', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const books = user.cart.map(item => ({ bookId: item.bookId }));
        if (books.length === 0) {
            return res.status(404).send("No books in cart");
        }
        user.history.push(...books);
        user.cart = [];
        await user.save();
        res.status(200).send("Checkout successful");
    }
    catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

router.patch('/checkout/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const bookIndex = user.cart.findIndex(item => item.bookId.toString() === req.params.id);

        if (bookIndex === -1) {
            return res.status(404).send("Book not found in cart");
        }

        const [book] = user.cart.splice(bookIndex, 1);
        user.history.push({ bookId: book.bookId });
        await user.save();

        res.status(200).send("Book checked out");
    }
    catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

router.delete('/remove/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const bookIndex = user.cart.findIndex(item => item.bookId.toString() === req.params.id);

        if (bookIndex === -1) {
            return res.status(404).send("Book not found in cart");
        }

        user.cart.splice(bookIndex, 1);
        await user.save();

        res.status(200).send("Book removed from cart");
    }
    catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

module.exports = router;