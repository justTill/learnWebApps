var express = require('express');
var router = express.Router();
var controller = require('../controller/exampleWorker')
var UserRepository = require("../persistence/UserRepository")
const asyncMiddleware = require('../utils/asyncMiddleware');
var passport = require('passport');
var crypto = require('crypto');

router.get('/', asyncMiddleware(async (req, res, next) => {
    res.render("index")
}));

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: 'login-success'
}), (err, req, res, next) => {
    if (err) next(err);
});

router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Email:<br><input type="text" name="email">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

router.post('/register', (req, res, next) => {

    const saltHash = genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    UserRepository.saveAdmin(req.body.email, hash, salt).then(res => console.log(res))

    res.redirect('/');

});

router.get('/protected-route', (req, res, next) => {

    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
    } else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
});

router.get('/login-success', (req, res, next) => {
    res.send('You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}

module.exports = router;
