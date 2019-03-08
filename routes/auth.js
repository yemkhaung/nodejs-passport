var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

const TOKEN_SECRET = require('../secret.token');

router.post('/login', function(req, res, next) {
    console.log("inside auth route /login");
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if(err) {
            return res.status(500).json(err);
        }
        if(!user) {
            return res.status(400).json(info);
        }

        req.login(user, {session: false}, (err) => {
            if(err) {
                return res.status(400).json(err);
            }
            const token = jwt.sign(user, TOKEN_SECRET);
            return res.json({user, token});
        })
    })
});

module.exports = router;