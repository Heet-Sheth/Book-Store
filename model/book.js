const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authorName: {
        type: [String],
        required: true
    },
    publishedDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    ISBN: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    copyType: {
        type: String,
        default: 'E-book',
        enum: ['Hardcover', 'Paperback', 'E-book']
    },
    rating: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            rate: {
                type: Number,
                required: true,
                enum: [1, 2, 3, 4, 5]
            }
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;