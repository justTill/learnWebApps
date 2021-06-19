var express = require('express');
var router = express.Router();
var userController = require('../controller/UserController')
const isLoggedIn = require('../utils/logIn').loggedIn;

//User
router.get('/overview', isLoggedIn, userController.showUserOverview)
router.get('/notifications', isLoggedIn, userController.showUserNotifications)
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
