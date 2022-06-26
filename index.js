'use strict';
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const server = require('./src/server.js');

const {db} = require('./src/auth/models/index.js');

db.sync().then(() => {
    server.startup(PORT);
}).catch((err) => {
    console.log(err);
});