const express = require('express');
const app = express();

const router = express.Router();

const db = require('./db');

require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
})

const books = require('./routes/bookActions');
app.use('/books', books);
const users = require('./routes/profileRoutes');
app.use('/users', users);
const Admin = require('./routes/adminRoutes');
app.use('/admin', Admin);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});