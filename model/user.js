const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
                required: true
            }
        }
    ],
    history: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
                required: true
            }
        }
    ],
    userType: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;