var express = require('express');
var router = express.Router();
const asyncMiddleware = require('../utils/asyncMiddleware');
const lessonController = require('../controller/LessonController');
const isLoggedIn = require('../utils/logIn').loggedIn;


router.get('/editCodingLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(lessonController.editCodingLesson))
router.get('/createCodingLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.createCodingLesson))
router.post('/saveCreateCodingLesson/', isLoggedIn, asyncMiddleware(lessonController.saveCreateCodingLesson))
router.post('/saveEditCodingLesson/', isLoggedIn, asyncMiddleware(lessonController.saveEditCodingLesson))

router.get('/editCodeExtensionLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(lessonController.editCodeExtensionLesson))
router.get('/createCodeExtensionLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.createCodeExtensionLesson))

router.get('/editFillTheBlankLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(lessonController.editFillTheBlankLesson))
router.get('/createFillTheBlankLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.createFillTheBlankLesson))

router.get('/editSingleMultipleChoiceLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(lessonController.editSingleMultipleChoiceLesson))
router.get('/createSingleMultipleChoiceLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.createSingleMultipleChoiceLesson))

module.exports = router;