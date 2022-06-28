'use strict';

const {users} = require('../models/index');

function bearer(req, res, next) {
    if (req.headers.authorization) {
        const auth = req.headers.authorization.split(' ')[1];
        users.authenticateToken(auth)
            .then((userData) => {
                req.user = userData;
                next();
            }).catch(() => {
                next('Invalid Token');
            });
    }
}

module.exports = bearer;