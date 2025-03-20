const express = require('express');
const router = express.Router();
const { generateToken } = require('../jwt');
const User = require('../model/user');
const cartRoutes = require('./cartRoutes');

router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();

        const token = generateToken({ id: savedUser._id });

        res.status(200).send({ token: token });
        console.log('User added');
    } catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, mobile, password } = req.body;

        const user = await User.findOne({
            $or: [{ email }, { mobile }]
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid credentials");
        }

        const token = generateToken({ id: user._id });
        res.status(200).send({ token: token });
    } catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

router.use('/cart', cartRoutes);

module.exports = router;