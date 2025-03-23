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
    totalofAllRatings: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalRatingCount: {
        type: Number,
        default: 0
    },
    coverImage: {
        type: String,
        default: 'No image'
    }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;