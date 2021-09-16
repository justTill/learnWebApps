var express = require('express');
var router = express.Router();
var sectionController = require('../controller/SectionController')
const asyncMiddleware = require('../utils/asyncMiddleware');
const isLoggedIn = require('../utils/logIn').loggedIn;


router.get('/deleteSection/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(sectionController.deleteSection))
router.get('/section/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(sectionController.editSection))

router.post('/saveEditedSection', isLoggedIn, asyncMiddleware(sectionController.saveEditedSection))
router.post('/saveNewSection', isLoggedIn, asyncMiddleware(sectionController.saveNewSection))
module.exports = router;