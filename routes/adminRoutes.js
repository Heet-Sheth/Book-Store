const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../jwt');
const Books = require('../model/book');

router.use(jwtMiddleware);

// Create a new book
router.post('/', async (req, res) => {
    try {
        const book = new Books(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all books
router.get('/', async (req, res) => {
    try {
        const books = await Books.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Books.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a book by ID
router.put('/:id', async (req, res) => {
    try {
        const book = await Books.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json("Book updated successfully");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a book by ID
router.delete('/:id', async (req, res) => {
    try {
        const book = await Books.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;