const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../jwt');
const Books = require('../model/book');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("file", file);
        console.log("req", req);
        cb(null, 'uploads/images');
    },
    filename: function (req, file, cb) {
        console.log("req", req);
        const prefix = Date.now();
        cb(null, prefix + "-" + file.originalname);
    }
});

router.use(jwtMiddleware);

// Create a new book
router.post('/', multer({ storage: storage }).single('coverImage'), async (req, res) => {
    try {
        const book = new Books(req.body);
        const filePath = req.file.path;
        book.coverImage = filePath;
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
router.put('/:id', multer({ storage: storage }).single('coverImage'), async (req, res) => {
    try {
        const book = await Books.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        if (req.file) {
            const filePath = req.file.path;
            req.body.coverImage = filePath;
        }
        await Books.findByIdAndUpdate(req.params.id, req.body);
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
        if (book.coverImage) {
            const imagePath = path.resolve(book.coverImage);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(`Failed to delete image at ${imagePath}:`, err);
                }
            });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;