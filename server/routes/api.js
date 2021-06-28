var express = require('express');
var router = express.Router();
var apiController = require('../controller/ApiController')
const asyncMiddleware = require('../utils/asyncMiddleware');

router.get('/chapters/', apiController.createUserIfNotExist, asyncMiddleware(apiController.getChapterDataWithSectionsAndLessons));
router.get('/users/problems/:moodleId/:moodleName', asyncMiddleware(apiController.getProblemsWithAnswers));


router.post('/codingLessons/check/', asyncMiddleware(apiController.testCodingLesson));

router.post('/users/notes/:moodleId/:moodleName', asyncMiddleware(apiController.saveNotes));
router.get('/users/notes/:moodleId/:moodleName', asyncMiddleware(apiController.getNotes));

module.exports = router;
