var express = require('express');
var router = express.Router();
var apiController = require('../controller/ApiController')
const asyncMiddleware = require('../utils/asyncMiddleware');

router.get('/chapters/', asyncMiddleware(apiController.getChapterDataWithSectionsAndLessons));
router.get('/chapters/:moodleId/:moodleName', asyncMiddleware(apiController.getChapterDataWithSectionsAndLessonsForUser));
router.post('/lessons/lesson/coding/check', asyncMiddleware(apiController.testCodingLesson));
router.post('/lessons/lesson/solved', asyncMiddleware(apiController.saveSolvedLesson))

router.delete('/lessons/lesson/solved/:moodleId/:moodleName', asyncMiddleware(apiController.deleteSolvedLessons))
router.delete('/lessons/lesson/solved/:chapterId/:moodleId/:moodleName', asyncMiddleware(apiController.deleteSolvedLessons))

router.get('/users/problems/:moodleId/:moodleName', asyncMiddleware(apiController.getProblemsWithAnswers));
router.post('/users/problems/', asyncMiddleware(apiController.saveProblem));
router.post('/users/user/', apiController.createUserIfNotExist)
router.post('/users/notes/:moodleId/:moodleName', asyncMiddleware(apiController.saveNotes));
router.get('/users/notes/:moodleId/:moodleName', asyncMiddleware(apiController.getNotes));

router.post('/users/notes/note', asyncMiddleware(apiController.insertOrUpdateNote));
router.delete('/users/notes/:moodleId/:moodleName/:noteId', asyncMiddleware(apiController.deleteNote))
router.delete('/users/problems/:moodleId/:moodleName/:problemId', asyncMiddleware(apiController.deleteProblem))

module.exports = router;
