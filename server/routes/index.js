var express = require('express');
var router = express.Router();
var controller = require('../controller/exampleWorker')
var userController = require('../controller/userController')
var UserRepository = require("../persistence/UserRepository")
const asyncMiddleware = require('../utils/asyncMiddleware');
var passport = require('passport');
var crypto = require('crypto');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/')
    }
}

router.get('/', asyncMiddleware(async (req, res, next) => {
    res.render("index")
}));

router.get('/logout', isLoggedIn, userController.logout);

router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Email:<br><input type="text" name="email">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    //res.render("register")
    res.send(form);

});

router.post('/login', userController.authenticate);
router.post('/register', userController.registerUser);


router.get('/protected-route', isLoggedIn, (req, res, next) => {
    res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
});

module.exports = router;
