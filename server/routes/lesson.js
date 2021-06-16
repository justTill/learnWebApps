var express = require('express');
var router = express.Router();
const asyncMiddleware = require('../utils/asyncMiddleware');
const codingController = require('../controller/codingLessonController');
const codeExtensionController = require('../controller/CodeExtensionController');
const singleMultipleChoiceController = require('../controller/SingleMultipleChoiceController');
const fillTheBlankController = require('../controller/FillTheBlankLessonController');
const isLoggedIn = require('../utils/logIn').loggedIn;


router.get('/deleteLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(codingController.deleteLesson))

router.get('/editCodingLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(codingController.editCodingLesson))
router.get('/createCodingLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(codingController.createCodingLesson))
router.post('/saveCreateCodingLesson/', isLoggedIn, asyncMiddleware(codingController.saveCreateCodingLesson))
router.post('/saveEditCodingLesson/', isLoggedIn, asyncMiddleware(codingController.saveEditCodingLesson))

router.get('/editCodeExtensionLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(codeExtensionController.editCodeExtensionLesson))
router.get('/createCodeExtensionLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(codeExtensionController.createCodeExtensionLesson))
router.post('/saveCreateCodeExtensionLesson/', isLoggedIn, asyncMiddleware(codeExtensionController.saveCreateCodingLesson))

router.get('/editFillTheBlankLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(fillTheBlankController.editFillTheBlankLesson))
router.get('/createFillTheBlankLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(fillTheBlankController.createFillTheBlankLesson))

router.get('/editSingleMultipleChoiceLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(singleMultipleChoiceController.editSingleMultipleChoiceLesson))
router.get('/createSingleMultipleChoiceLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(singleMultipleChoiceController.createSingleMultipleChoiceLesson))

module.exports = router;