const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../jwt');
const Books = require('../model/book');
const User = require('../model/user');

router.use(jwtMiddleware);

router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log(user.cart);
        const books = await Books.find({ _id: { $in: user.cart.map(item => item.bookId) } });
        res.status(200).send(books);
    }
    catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

router.get('/history', async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('history.BookId');
        const books = user.history.map(item => item.bookId);
        res.status(200).send(books);
    }
    catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

router.post('/checkout', async (req, res) => {
    try {
        const user = await User.findById(req.user.id
        ).populate('cart.BookId');
        const books = user.cart.map(item => item.bookId);
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
        user.history.push(book.bookId);
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