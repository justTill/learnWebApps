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

router.get('/notifications', isLoggedIn, (req, res, next) => {
    res.render('users/notifications')
})
router.get('/overview', isLoggedIn, (req, res, next) => {
    res.render('users/overview')
})
router.get('/chapter', isLoggedIn, (req, res, next) => {
    res.render('create/chapter')
})

router.get('/', asyncMiddleware(async (req, res, next) => {
    let isLoggedIn = req.isAuthenticated()
    res.render("index", {"isLoggedIn": isLoggedIn})
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


module.exports = router;
