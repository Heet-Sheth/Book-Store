mongose = require('mongoose');
require('dotenv').config();
const local_db = process.env.local_db;

mongose.connect(local_db.toString());

const db = mongose.connection;

db.on('error', () => { console.log('Connection error') });
db.on('connected', () => { console.log('Connection established') });
db.on('disconnected', () => { console.log('Connection disconnected') });

module.exports = db;