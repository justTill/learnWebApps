var express = require('express');
var router = express.Router();
const asyncMiddleware = require('../utils/asyncMiddleware');
const lessonController = require('../controller/LessonController');
const isLoggedIn = require('../utils/logIn').loggedIn;


router.get('/editCodingLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.editCodingLesson))
router.get('/editCodeExtensionLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.editCodeExtensionLesson))
router.get('/editFillTheBlankLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.editFillTheBlankLesson))
router.get('/editSingleMultipleChoiceLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.editSingleMultipleChoiceLesson))

router.get('/createCodingLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.createCodingLesson))
router.get('/createCodeExtensionLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.createCodeExtensionLesson))
router.get('/createFillTheBlankLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.createFillTheBlankLesson))
router.get('/createSingleMultipleChoiceLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.createSingleMultipleChoiceLesson))

module.exports = router;