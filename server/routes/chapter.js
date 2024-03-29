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


router.get('/chapter', isLoggedIn, asyncMiddleware(chapterController.showChapterOverview))
router.get('/chapter/:id', isLoggedIn, asyncMiddleware(chapterController.editChapter))

router.get('/deleteChapter/:id', isLoggedIn, asyncMiddleware(chapterController.deleteChapter))

router.post('/editChapter', isLoggedIn, asyncMiddleware(chapterController.saveEditedChapter))
router.post('/saveNewChapter', isLoggedIn, asyncMiddleware(chapterController.saveNewChapter))
router.post('/uploadChapterMedia', isLoggedIn, upload.single("file"), asyncMiddleware(chapterController.uploadMedia))


module.exports = router;