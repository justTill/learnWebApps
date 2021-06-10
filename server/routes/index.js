var express = require('express');
var router = express.Router();
var userController = require('../controller/userController')
var lessonsController = require('../controller/lessonsController')
const asyncMiddleware = require('../utils/asyncMiddleware');
const multer = require("multer");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/')
    }
}

const upload = multer({
    dest: "/public"
});

router.get('/', asyncMiddleware(async (req, res, next) => {
    let isLoggedIn = req.isAuthenticated()
    res.render("index", {"isLoggedIn": isLoggedIn})
}));

//Chapters
router.get('/chapter', isLoggedIn, asyncMiddleware(lessonsController.showChapterOverview))
router.get('/chapter/:id', isLoggedIn, asyncMiddleware(lessonsController.editChapter))
router.get('/createChapter', isLoggedIn, (req, res, next) => {
    res.render('create/createChapter')
})

router.post('/saveChapter', isLoggedIn, asyncMiddleware(lessonsController.saveChapter))
router.post('/uploadChapterMedia', isLoggedIn, upload.single("file"), asyncMiddleware(lessonsController.uploadMedia))

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
