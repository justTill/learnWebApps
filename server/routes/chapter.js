var express = require('express');
var router = express.Router();
var chapterController = require('../controller/ChapterController')
const asyncMiddleware = require('../utils/asyncMiddleware');
const isLoggedIn = require('../utils/logIn').loggedIn;
const multer = require("multer");

const upload = multer({
    dest: "/public"
});


router.get('/', asyncMiddleware(async (req, res, next) => {
    let loggedIn = req.isAuthenticated()
    res.render("index", {"isLoggedIn": loggedIn})
}));


//Chapters
router.get('/chapter', isLoggedIn, asyncMiddleware(chapterController.showChapterOverview))
router.get('/chapter/:id', isLoggedIn, asyncMiddleware(chapterController.editChapter))
router.get('/createChapter', isLoggedIn, chapterController.createChapter)

router.get('/deleteChapter/:id', isLoggedIn, asyncMiddleware(chapterController.deleteChapter))

router.post('/saveChapter', isLoggedIn, asyncMiddleware(chapterController.saveChapter))
router.post('/uploadChapterMedia', isLoggedIn, upload.single("file"), asyncMiddleware(chapterController.uploadMedia))


module.exports = router;