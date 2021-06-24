var express = require('express');
var router = express.Router();
const asyncMiddleware = require('../utils/asyncMiddleware');
const codingController = require('../controller/CodingLessonController');
const codeExtensionController = require('../controller/CodeExtensionController');
const singleMultipleChoiceController = require('../controller/SingleMultipleChoiceController');
const fillTheBlankController = require('../controller/FillTheBlankLessonController');
const lessonController = require('../controller/LessonController');
const isLoggedIn = require('../utils/logIn').loggedIn;


router.get('/deleteLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(codingController.deleteLesson))

router.get('/editCodingLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(codingController.editCodingLesson))
router.get('/createCodingLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(codingController.createCodingLesson))
router.post('/saveCreateCodingLesson/', isLoggedIn, asyncMiddleware(codingController.saveCreateCodingLesson))
router.post('/saveEditCodingLesson/', isLoggedIn, asyncMiddleware(codingController.saveEditCodingLesson))

router.get('/editCodeExtensionLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(codeExtensionController.editCodeExtensionLesson))
router.get('/createCodeExtensionLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(codeExtensionController.createCodeExtensionLesson))
router.post('/saveCreateCodeExtensionLesson/', isLoggedIn, asyncMiddleware(codeExtensionController.saveCreateCodeExtensionLesson))
router.post('/saveEditCodeExtensionLesson/', isLoggedIn, asyncMiddleware(codeExtensionController.saveEditCodeExtensionLesson))

router.get('/editFillTheBlankLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(fillTheBlankController.editFillTheBlankLesson))
router.get('/createFillTheBlankLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(fillTheBlankController.createFillTheBlankLesson))
router.post('/saveCreateFillTheBlankLesson/', isLoggedIn, asyncMiddleware(fillTheBlankController.saveCreateFillTheBlankLesson))
router.post('/saveEditFillTheBlankLesson/', isLoggedIn, asyncMiddleware(fillTheBlankController.saveEditFillTheBlankLesson))

router.get('/editSingleMultipleChoiceLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(singleMultipleChoiceController.editSingleMultipleChoiceLesson))
router.get('/createSingleMultipleChoiceLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(singleMultipleChoiceController.createSingleMultipleChoiceLesson))
router.post('/saveCreateSingleMultipleChoiceLesson/', isLoggedIn, asyncMiddleware(singleMultipleChoiceController.saveCreateSingleMultipleChoiceLesson))
router.post('/saveEditSingleMultipleChoiceLesson/', isLoggedIn, asyncMiddleware(singleMultipleChoiceController.saveEditSingleMultipleChoiceLesson))


router.get('/editInformationLesson/:chapterId/:sectionId/:lessonId', isLoggedIn, asyncMiddleware(lessonController.editInformationLesson))
router.get('/createInformationLesson/:chapterId/:sectionId', isLoggedIn, asyncMiddleware(lessonController.createInformationLesson))
router.post('/saveCreateInformationLesson/', isLoggedIn, asyncMiddleware(lessonController.saveCreateInformationLesson))
router.post('/saveEditInformationLesson/', isLoggedIn, asyncMiddleware(lessonController.saveEditInformationLesson))
module.exports = router;