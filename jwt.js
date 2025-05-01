const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const jwtMiddleware = (req, res, next) => {
    const autohorization = req.headers.authorization;
    if (!autohorization) return res.status(401).send({ error: 'No token found' });

    const token = autohorization.split(' ')[1];
    if (!token) return res.status(401).send('No token found');
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY || 'secret');
        req.user = payload;
        next();
    } catch (err) {
        res.status(500).send("Internal Server Error");
        console.log(err);
    }
};

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.SECRET_KEY || 'secret');
};

module.exports = { jwtMiddleware, generateToken };