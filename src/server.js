'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const errorHandler = require('./middleware/500');
const notFound = require('./middleware/404');
const basic = require('./auth/middleware/basic.js');
const bearer = require('./auth/middleware/bearer.js');
const {users} = require('./auth/models/index');

app.get("/", handleHomepage);

function handleHomepage(req,res) {
    res.status(200).send("welcome to home page");
}

app.post('/signup', async (req, res) => {
    try {
        let username = req.body.username;
        let password = await bcrypt.hash(req.body.password, 10);

        const record = await users.create({
            username: username,
            password: password,
        });
        res.status(201).json(record);
    } catch (e) {
        console.log(e.message);
    }
});

app.post('/signin', basic, async (req, res) => {
    res.status(200).json(req.user);
});

app.get('/users', bearer, async (req, res) => {
    try {
        const records = await users.findAll();
        res.status(200).json(records);
    } catch (e) {
        console.log(e);
    }
});

app.get('/secretstuff', bearer, async (req, res) => {
    res.json({
        message: 'You have access to the secret stuff',
        user: req.user
    })
});

app.use(notFound);
app.use(errorHandler);

module.exports = {
    app: app,
    startup: (port) => {
        app.listen(port, () => {
            console.log(`Server Up on ${port}`);
        });
    },
};