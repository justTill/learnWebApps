var express = require('express');
var router = express.Router();
var chapterController = require('../controller/ChapterController')
var sectionController = require('../controller/SectionController')
const asyncMiddleware = require('../utils/asyncMiddleware');
const isLoggedIn = require('../utils/logIn').loggedIn;


router.get('/deleteSection/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(sectionController.deleteSection))
router.get('/section/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(sectionController.editSection))
router.get('/createSection/:chapterId', isLoggedIn, asyncMiddleware(sectionController.createSection))

router.post('/saveEditedSection', isLoggedIn, asyncMiddleware(sectionController.saveEditedSection))
router.post('/saveNewSection', isLoggedIn, asyncMiddleware(sectionController.saveNewSection))
module.exports = router;